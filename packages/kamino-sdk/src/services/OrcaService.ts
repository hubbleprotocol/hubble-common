import { Connection, PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import {
  estimateAprsForPriceRange,
  OrcaNetwork,
  OrcaWhirlpoolClient,
  getNearestValidTickIndexFromTickIndex,
  priceToTickIndex,
  PoolData,
} from '@orca-so/whirlpool-sdk';
import axios from 'axios';
import { OrcaWhirlpoolsResponse, Whirlpool } from './OrcaWhirlpoolsResponse';
import { HubbleConfig, SolanaCluster } from '@hubbleprotocol/hubble-config';
import { WhirlpoolStrategy } from '../kamino-client/accounts';
import { Scope, ScopeToken } from '@hubbleprotocol/scope-sdk';
import { Position } from '../whirpools-client';
import { getKaminoTokenName, getScopeTokenFromKaminoMints } from '../constants';
import { WhirlpoolAprApy } from './WhirlpoolAprApy';
import {
  aprToApy,
  GenericPoolInfo,
  getStrategyPriceRangeOrca,
  LiquidityDistribution,
  LiquidityForPrice,
  ZERO,
} from '../utils';
import { getTickArrayPda, WhirlpoolData } from '@orca-so/whirlpool-client-sdk';
import { WHIRLPOOL_PROGRAM_ID } from '../whirpools-client/programId';

export class OrcaService {
  private readonly _connection: Connection;
  private readonly _cluster: SolanaCluster;
  private readonly _config: HubbleConfig;
  private readonly _orcaNetwork: OrcaNetwork;
  private readonly _orcaApiUrl: string;

  constructor(connection: Connection, cluster: SolanaCluster, config: HubbleConfig) {
    this._connection = connection;
    this._cluster = cluster;
    this._config = config;
    this._orcaNetwork = cluster === 'mainnet-beta' ? OrcaNetwork.MAINNET : OrcaNetwork.DEVNET;
    this._orcaApiUrl = `https://api.${cluster === 'mainnet-beta' ? 'mainnet' : 'devnet'}.orca.so`;
  }

  async getOrcaWhirlpools() {
    return (await axios.get<OrcaWhirlpoolsResponse>(`${this._orcaApiUrl}/v1/whirlpool/list`)).data;
  }

  private getTokenPrices(strategy: WhirlpoolStrategy, prices: ScopeToken[]) {
    const tokensPrices: Record<string, Decimal> = {};
    const tokenA = getScopeTokenFromKaminoMints(strategy.tokenAMint, this._config);
    const tokenB = getScopeTokenFromKaminoMints(strategy.tokenBMint, this._config);
    const reward0 = getKaminoTokenName(Number(strategy.reward0CollateralId));
    const reward1 = getKaminoTokenName(Number(strategy.reward1CollateralId));
    const reward2 = getKaminoTokenName(Number(strategy.reward2CollateralId));
    const tokens = [tokenA, tokenB, reward0, reward1, reward2];
    for (const token of tokens) {
      const mint = this._config.kamino.mints.find((x) => x.scopeToken === token);
      const scopeToken = prices.find((x) => x.name === token);
      if (!mint || !scopeToken) {
        throw new Error(`Could not get token ${token} prices`);
      }
      tokensPrices[mint.address.toString()] = scopeToken.price;
    }
    return tokensPrices;
  }

  private getPoolTokensPrices(pool: PoolData, prices: ScopeToken[]) {
    const tokensPrices: Record<string, Decimal> = {};
    const tokenA = getScopeTokenFromKaminoMints(pool.tokenMintA, this._config);
    const tokenB = getScopeTokenFromKaminoMints(pool.tokenMintB, this._config);
    const reward0 = getScopeTokenFromKaminoMints(pool.rewards[0].mint, this._config);
    const reward1 = getScopeTokenFromKaminoMints(pool.rewards[1].mint, this._config);
    const reward2 = getScopeTokenFromKaminoMints(pool.rewards[2].mint, this._config);

    const tokens = [tokenA, tokenB, reward0, reward1, reward2];
    for (const token of tokens) {
      if (token) {
        const mint = this._config.kamino.mints.find((x) => x.scopeToken === token);
        const scopeToken = prices.find((x) => x.name === token);
        if (!mint || !scopeToken) {
          throw new Error(`Could not get token ${token} prices`);
        }
        tokensPrices[mint.address.toString()] = scopeToken.price;
      }
    }
    return tokensPrices;
  }

  async getStrategyWhirlpoolPoolAprApy(
    strategy: WhirlpoolStrategy,
    whirlpools?: Whirlpool[],
    prices?: ScopeToken[]
  ): Promise<WhirlpoolAprApy> {
    const orca = new OrcaWhirlpoolClient({
      connection: this._connection,
      network: this._orcaNetwork,
    });
    const scope = new Scope(this._cluster, this._connection);
    if (!prices) {
      prices = await scope.getAllPrices();
    }

    const position = await Position.fetch(this._connection, strategy.position);
    if (!position) {
      throw new Error(`Position ${strategy.position} does not exist`);
    }

    const pool = await orca.getPool(strategy.pool);
    if (!whirlpools) {
      ({ whirlpools } = await this.getOrcaWhirlpools());
    }

    const whirlpool = whirlpools?.find((x) => x.address === strategy.pool.toString());

    if (!pool || !whirlpool) {
      throw Error(`Could not get orca pool data for ${strategy.pool}`);
    }
    const priceRange = getStrategyPriceRangeOrca(
      position.tickLowerIndex,
      position.tickUpperIndex,
      strategy,
      new Decimal(pool.price.toString())
    );
    if (priceRange.strategyOutOfRange) {
      return {
        ...priceRange,
        rewardsApy: [],
        rewardsApr: [],
        feeApy: ZERO,
        feeApr: ZERO,
        totalApy: ZERO,
        totalApr: ZERO,
      };
    }

    const lpFeeRate = pool.feePercentage;
    const volume24hUsd = whirlpool?.volume?.day ?? new Decimal(0);
    const fee24Usd = new Decimal(volume24hUsd).mul(lpFeeRate).toNumber();
    const tokensPrices = this.getTokenPrices(strategy, prices);

    const apr = estimateAprsForPriceRange(
      pool,
      tokensPrices,
      fee24Usd,
      position.tickLowerIndex,
      position.tickUpperIndex
    );

    const totalApr = new Decimal(apr.fee).add(apr.rewards[0]).add(apr.rewards[1]).add(apr.rewards[2]);
    const feeApr = new Decimal(apr.fee);
    const rewardsApr = apr.rewards.map((r) => new Decimal(r));
    return {
      totalApr,
      totalApy: aprToApy(totalApr, 365),
      feeApr,
      feeApy: aprToApy(feeApr, 365),
      rewardsApr,
      rewardsApy: rewardsApr.map((x) => aprToApy(x, 365)),
      ...priceRange,
    };
  }

  async getWhirlpoolLiquidityDistribution(pool: PublicKey): Promise<LiquidityDistribution> {
    const orca = new OrcaWhirlpoolClient({
      connection: this._connection,
      network: this._orcaNetwork,
    });
    const poolData = await orca.getPool(pool);
    if (!poolData) {
      throw new Error(`Could not get pool data for Whirlpool ${pool}`);
    }

    let lowestInitializedTick = await orca.pool.getLowestInitializedTickArrayTickIndex(pool, poolData.tickSpacing);
    let highestInitializedTick = await orca.pool.getHighestInitializedTickArrayTickIndex(pool, poolData.tickSpacing);
    const orcaLiqDistribution = await orca.pool.getLiquidityDistribution(
      pool,
      lowestInitializedTick,
      highestInitializedTick
    );

    let liqDistribution: LiquidityDistribution = {
      distribution: [],
    };

    orcaLiqDistribution.datapoints.forEach((entry) => {
      const liq: LiquidityForPrice = {
        price: entry.price,
        liquidity: entry.liquidity,
      };

      liqDistribution.distribution.push(liq);
    });

    return liqDistribution;
  }

  async getWhirlpoolPositionAprApy(
    poolPubkey: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    whirlpools?: Whirlpool[],
    prices?: ScopeToken[]
  ): Promise<WhirlpoolAprApy> {
    const orca = new OrcaWhirlpoolClient({
      connection: this._connection,
      network: this._orcaNetwork,
    });
    const scope = new Scope(this._cluster, this._connection);
    if (!prices) {
      prices = await scope.getAllPrices();
    }

    const pool = await orca.getPool(poolPubkey);
    if (!whirlpools) {
      ({ whirlpools } = await this.getOrcaWhirlpools());
    }

    const whirlpool = whirlpools?.find((x) => x.address === poolPubkey.toString());

    if (!pool || !whirlpool) {
      throw Error(`Could not get orca pool data for ${poolPubkey}`);
    }

    let strategyOutOfRange = false;
    if (priceLower.gt(pool.price) || priceUpper.lt(pool.price)) {
      strategyOutOfRange = true;
    }
    if (strategyOutOfRange) {
      return {
        priceLower,
        priceUpper,
        strategyOutOfRange,
        poolPrice: pool.price,
        rewardsApy: [],
        rewardsApr: [],
        feeApy: ZERO,
        feeApr: ZERO,
        totalApy: ZERO,
        totalApr: ZERO,
      };
    }

    const lpFeeRate = pool.feePercentage;
    const volume24hUsd = whirlpool?.volume?.day ?? new Decimal(0);
    const fee24Usd = new Decimal(volume24hUsd).mul(lpFeeRate).toNumber();
    let tokensPrices = this.getPoolTokensPrices(pool, prices);

    const tickLowerIndex = getNearestValidTickIndexFromTickIndex(
      priceToTickIndex(priceLower, pool.tokenDecimalsA, pool.tokenDecimalsB),
      whirlpool.tickSpacing
    );
    const tickUpperIndex = getNearestValidTickIndexFromTickIndex(
      priceToTickIndex(priceUpper, pool.tokenDecimalsA, pool.tokenDecimalsB),
      whirlpool.tickSpacing
    );

    const apr = estimateAprsForPriceRange(pool, tokensPrices, fee24Usd, tickLowerIndex, tickUpperIndex);

    const totalApr = new Decimal(apr.fee).add(apr.rewards[0]).add(apr.rewards[1]).add(apr.rewards[2]);
    const feeApr = new Decimal(apr.fee);
    const rewardsApr = apr.rewards.map((r) => new Decimal(r));
    return {
      totalApr,
      totalApy: aprToApy(totalApr, 365),
      feeApr,
      feeApy: aprToApy(feeApr, 365),
      rewardsApr,
      rewardsApy: rewardsApr.map((x) => aprToApy(x, 365)),
      priceLower,
      priceUpper,
      poolPrice: pool.price,
      strategyOutOfRange,
    };
  }

  async getGenericPoolInfo(poolPubkey: PublicKey, whirlpools?: Whirlpool[]) {
    const orca = new OrcaWhirlpoolClient({
      connection: this._connection,
      network: this._orcaNetwork,
    });

    const pool = await orca.getPool(poolPubkey);
    if (!whirlpools) {
      ({ whirlpools } = await this.getOrcaWhirlpools());
    }

    const whirlpool = whirlpools?.find((x) => x.address === poolPubkey.toString());

    if (!pool || !whirlpool) {
      throw Error(`Could not get orca pool data for ${poolPubkey}`);
    }

    let poolInfo: GenericPoolInfo = {
      dex: 'ORCA',
      address: new PublicKey(poolPubkey),
      tokenMintA: pool.tokenMintA,
      tokenMintB: pool.tokenMintB,
      price: pool.price,
      feeRate: pool.feePercentage,
      volumeOnLast7d: whirlpool.volume ? new Decimal(whirlpool.volume?.week) : undefined,
      tvl: whirlpool.tvl ? new Decimal(whirlpool.tvl) : undefined,
      tickSpacing: new Decimal(pool.tickSpacing),
      // todo(Silviu): get real amount of positions
      positions: new Decimal(0),
    };
    return poolInfo;
  }
}
