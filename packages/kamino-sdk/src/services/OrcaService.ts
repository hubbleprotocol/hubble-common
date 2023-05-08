import { Connection, PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import {
  estimateAprsForPriceRange,
  OrcaNetwork,
  OrcaWhirlpoolClient,
  getNearestValidTickIndexFromTickIndex,
  priceToTickIndex,
  PDAUtil,
  PoolData,
  TickUtil,
  TICK_ARRAY_SIZE,
  WhirlpoolContext,
} from '@orca-so/whirlpool-sdk';
import axios from 'axios';
import { OrcaWhirlpoolsResponse, Whirlpool } from './OrcaWhirlpoolsResponse';
import { HubbleConfig, SolanaCluster } from '@hubbleprotocol/hubble-config';
import { WhirlpoolStrategy } from '../kamino-client/accounts';
import { Scope, ScopeToken } from '@hubbleprotocol/scope-sdk';
import { Position } from '../whirpools-client';
import { getKaminoTokenName, getScopeTokenFromKaminoMints } from '../constants';
import { WhirlpoolAprApy } from './WhirlpoolAprApy';
import { aprToApy, getStrategyPriceRangeOrca, ZERO } from '../utils';
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

  async getWhirlpoolLiquidityDistribution(poolPk: PublicKey): Promise<LiquidityDistribution> {
    const orca = new OrcaWhirlpoolClient({
      connection: this._connection,
      network: this._orcaNetwork,
    });

    const poolData = await orca.getPool(poolPk);
    if (!poolData) {
      throw new Error(`Could not get Orca Whirlpool ${poolPk.toString()}`);
    }

    const tickarray_start_indexes: number[] = [];
    const tickarray_pubkeys: PublicKey[] = [];

    const TICKARRAY_LOWER_OFFSET = -3;
    const TICKARRAY_UPPER_OFFSET = +3;
    for (let offset = TICKARRAY_LOWER_OFFSET; offset <= TICKARRAY_UPPER_OFFSET; offset++) {
      const start_tick_index = TickUtil.getStartTickIndex(poolData.tickCurrentIndex, poolData.tick_spacing, offset);
      const pda = PDAUtil.getTickArrayFromTickIndex(
        start_tick_index,
        poolData.tick_spacing,
        poolPk,
        WHIRLPOOL_PROGRAM_ID
      );
      tickarray_start_indexes.push(start_tick_index);
      tickarray_pubkeys.push(pda.publicKey);
    }

    // get tickarrays
    const tickarrays = await ctx.fetcher.listTickArrays(tickarray_pubkeys, true);

    // sweep liquidity
    const current_initializable_tick_index = Math.floor(poolData.tickCurrentIndex / tick_spacing) * tick_spacing;
    const current_pool_liquidity = whirlpool_data.liquidity;
    const liquidity_distribution = [];
    let liquidity = new BN(0);
    let liquidity_difference;
    for (let ta = 0; ta < tickarrays.length; ta++) {
      const tickarray = tickarrays[ta];

      for (let i = 0; i < TICK_ARRAY_SIZE; i++) {
        const tick_index = tickarray_start_indexes[ta] + i * tick_spacing;

        // move right (add liquidityNet)
        liquidity = tickarray == null ? liquidity : liquidity.add(tickarray.ticks[i].liquidityNet);

        liquidity_distribution.push({ tick_index, liquidity });

        // liquidity in TickArray not read
        if (tick_index === current_initializable_tick_index) {
          liquidity_difference = current_pool_liquidity.sub(liquidity);
        }
      }
    }
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
}
