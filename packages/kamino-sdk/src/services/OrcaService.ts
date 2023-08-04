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
import { SolanaCluster } from '@hubbleprotocol/hubble-config';
import { CollateralInfos, GlobalConfig, WhirlpoolStrategy } from '../kamino-client/accounts';
import { Scope, ScopeToken } from '@hubbleprotocol/scope-sdk';
import { Position } from '../whirpools-client';
import { WhirlpoolAprApy } from './WhirlpoolAprApy';
import {
  aprToApy,
  GenericPoolInfo,
  getStrategyPriceRangeOrca,
  LiquidityDistribution,
  LiquidityForPrice,
  ZERO,
} from '../utils';
import { WHIRLPOOL_PROGRAM_ID } from '../whirpools-client/programId';
import { CollateralInfo } from '../kamino-client/types';
import { reverseLiquidityDistribution } from '../utils/reverseLiquidityDistribution';

export class OrcaService {
  private readonly _connection: Connection;
  private readonly _cluster: SolanaCluster;
  private readonly _orcaNetwork: OrcaNetwork;
  private readonly _orcaApiUrl: string;
  private readonly _globalConfig: PublicKey;

  constructor(connection: Connection, cluster: SolanaCluster, globalConfig: PublicKey) {
    this._connection = connection;
    this._cluster = cluster;
    this._globalConfig = globalConfig;
    this._orcaNetwork = cluster === 'mainnet-beta' ? OrcaNetwork.MAINNET : OrcaNetwork.DEVNET;
    this._orcaApiUrl = `https://api.${cluster === 'mainnet-beta' ? 'mainnet' : 'devnet'}.orca.so`;
  }

  async getOrcaWhirlpools() {
    return (await axios.get<OrcaWhirlpoolsResponse>(`${this._orcaApiUrl}/v1/whirlpool/list`)).data;
  }

  private getTokenPrices(strategy: WhirlpoolStrategy, prices: ScopeToken[], collateralInfos: CollateralInfo[]) {
    const tokensPrices: Record<string, Decimal> = {};

    const reward0 = collateralInfos[strategy.reward0CollateralId.toNumber()]?.mint?.toString();
    const reward1 = collateralInfos[strategy.reward1CollateralId.toNumber()]?.mint?.toString();
    const reward2 = collateralInfos[strategy.reward2CollateralId.toNumber()]?.mint?.toString();
    const tokens = [strategy.tokenAMint.toString(), strategy.tokenBMint.toString(), reward0, reward1, reward2];
    for (const mint of tokens) {
      if (mint) {
        const price = prices.find((x) => x.mint?.toString() === mint)?.price;
        if (!price) {
          throw new Error(`Could not get token ${mint} price`);
        }
        tokensPrices[mint] = price;
      }
    }

    return tokensPrices;
  }

  private getPoolTokensPrices(pool: PoolData, prices: ScopeToken[]) {
    const tokensPrices: Record<string, Decimal> = {};
    const tokens = [
      pool.tokenMintA.toString(),
      pool.tokenMintB.toString(),
      pool.rewards[0].mint.toString(),
      pool.rewards[1].mint.toString(),
      pool.rewards[2].mint.toString(),
    ];
    for (const mint of tokens) {
      if (mint) {
        const price = prices.find((x) => x.mint?.toString() === mint)?.price;
        if (!price) {
          throw new Error(`Could not get token ${mint} price`);
        }
        tokensPrices[mint] = price;
      }
    }

    return tokensPrices;
  }

  async getPool(poolAddress: PublicKey) {
    const orca = new OrcaWhirlpoolClient({
      connection: this._connection,
      network: this._orcaNetwork,
    });
    return await orca.getPool(poolAddress);
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
    const config = await GlobalConfig.fetch(this._connection, this._globalConfig);
    if (!config) {
      throw Error(`Could not fetch globalConfig with pubkey ${this._globalConfig}`);
    }
    const collateralInfos = await CollateralInfos.fetch(this._connection, config.tokenInfos);
    if (!collateralInfos) {
      throw Error('Could not fetch collateral infos');
    }
    const tokensPrices = this.getTokenPrices(strategy, prices, collateralInfos.infos);

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

  // strongly recommended to pass lowestTick and highestTick because fetching the lowest and highest existent takes very long
  async getWhirlpoolLiquidityDistribution(
    pool: PublicKey,
    keepOrder: boolean = true,
    lowestTick?: number,
    highestTick?: number,
    isReversedTokensOrder: boolean = false
  ): Promise<LiquidityDistribution> {
    const orca = new OrcaWhirlpoolClient({
      connection: this._connection,
      network: this._orcaNetwork,
    });
    const poolData = await orca.getPool(pool);
    if (!poolData) {
      throw new Error(`Could not get pool data for Whirlpool ${pool}`);
    }

    let lowestInitializedTick: number;
    if (lowestTick) {
      lowestInitializedTick = lowestTick;
    } else {
      lowestInitializedTick = await orca.pool.getLowestInitializedTickArrayTickIndex(pool, poolData.tickSpacing);
    }

    let highestInitializedTick: number;
    if (highestTick) {
      highestInitializedTick = highestTick;
    } else {
      highestInitializedTick = await orca.pool.getHighestInitializedTickArrayTickIndex(pool, poolData.tickSpacing);
    }

    const orcaLiqDistribution = await orca.pool.getLiquidityDistribution(
      pool,
      lowestInitializedTick,
      highestInitializedTick
    );

    let liqDistribution: LiquidityDistribution = {
      currentPrice: poolData.price,
      currentTickIndex: poolData.tickCurrentIndex,
      distribution: [],
    };

    orcaLiqDistribution.datapoints.forEach((entry) => {
      let priceWithOrder = new Decimal(entry.price);
      if (!keepOrder) {
        priceWithOrder = new Decimal(1).div(priceWithOrder);
      }
      const liq: LiquidityForPrice = {
        price: priceWithOrder,
        liquidity: entry.liquidity,
        tickIndex: entry.tickIndex,
      };

      liqDistribution.distribution.push(liq);
    });

    if (isReversedTokensOrder) {
      liqDistribution.distribution = reverseLiquidityDistribution(liqDistribution.distribution);
    }

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

  async getPositionsCountByPool(pool: PublicKey): Promise<number> {
    const rawPositions = await this._connection.getProgramAccounts(WHIRLPOOL_PROGRAM_ID, {
      commitment: 'confirmed',
      filters: [
        // account LAYOUT: https://github.com/orca-so/whirlpools/blob/main/programs/whirlpool/src/state/position.rs#L20
        { dataSize: 216 },
        { memcmp: { bytes: pool.toBase58(), offset: 8 } },
      ],
    });

    return rawPositions.length;
  }
}
