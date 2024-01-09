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
import { SolanaCluster } from '@hubbleprotocol/hubble-config';
import { CollateralInfos, GlobalConfig, WhirlpoolStrategy } from '../kamino-client/accounts';
import {
  aprToApy,
  GenericPoolInfo,
  getMeteoraPriceLowerUpper,
  getPriceLowerUpper,
  getStrategyPriceRangeMeteora,
  LiquidityDistribution,
  LiquidityForPrice,
  ZERO,
} from '../utils';
import { getMintDecimals } from '@project-serum/serum/lib/market';
import { CollateralInfo } from '../kamino-client/types';
import { KaminoPrices } from '../models';
import { LbPair, PositionV2 } from '../meteora_client/accounts';
import { WhirlpoolAprApy } from './WhirlpoolAprApy';
import { METEORA_PROGRAM_ID } from '../meteora_client/programId';
import { getBinIdFromPriceWithDecimals, getPriceOfBinByBinIdWithDecimals } from '../utils/meteora';

export interface MeteoraPool {
  key: PublicKey;
  pool: LbPair;
}

export class MeteoraService {
  private readonly _connection: Connection;
  private readonly _globalConfig: PublicKey;

  constructor(connection: Connection, globalConfig: PublicKey) {
    this._connection = connection;
    this._globalConfig = globalConfig;
  }

  /**
   * Get token prices for a strategy - for use with meteora sdk
   * @param strategy
   * @param prices
   * @param collateralInfos
   * @returns {Record<string, Decimal>} - token prices by mint string
   * @private
   */
  private getTokenPrices(
    strategy: WhirlpoolStrategy,
    prices: KaminoPrices,
    collateralInfos: CollateralInfo[]
  ): Record<string, Decimal> {
    const tokensPrices: Record<string, Decimal> = {};

    const tokenA = collateralInfos[strategy.tokenACollateralId.toNumber()];
    const tokenB = collateralInfos[strategy.tokenBCollateralId.toNumber()];
    const rewardToken0 = collateralInfos[strategy.reward0CollateralId.toNumber()];
    const rewardToken1 = collateralInfos[strategy.reward1CollateralId.toNumber()];

    const aPrice = prices[tokenA.mint.toString()];
    const bPrice = prices[tokenB.mint.toString()];
    const reward0Price = strategy.reward0Decimals.toNumber() !== 0 ? prices[rewardToken0.mint.toString()] : null;
    const reward1Price = strategy.reward1Decimals.toNumber() !== 0 ? prices[rewardToken1.mint.toString()] : null;

    const [mintA, mintB] = [strategy.tokenAMint.toString(), strategy.tokenBMint.toString()];
    const reward0 = collateralInfos[strategy.reward0CollateralId.toNumber()]?.mint?.toString();
    const reward1 = collateralInfos[strategy.reward1CollateralId.toNumber()]?.mint?.toString();

    tokensPrices[mintA] = aPrice;
    tokensPrices[mintB] = bPrice;
    if (reward0Price !== null) {
      tokensPrices[reward0] = reward0Price;
    }
    if (reward1Price !== null) {
      tokensPrices[reward1] = reward1Price;
    }

    return tokensPrices;
  }

  private getPoolTokensPrices(pool: PoolData, prices: KaminoPrices) {
    const tokensPrices: Record<string, Decimal> = {};
    const tokens = [
      pool.tokenMintA.toString(),
      pool.tokenMintB.toString(),
      pool.rewards[0].mint.toString(),
      pool.rewards[1].mint.toString(),
    ];
    for (const mint of tokens) {
      if (mint) {
        const price = prices.spot[mint]?.price;
        if (!price) {
          throw new Error(`Could not get token ${mint} price`);
        }
        tokensPrices[mint] = price;
      }
    }

    return tokensPrices;
  }

  async getPool(poolAddress: PublicKey): Promise<LbPair | null> {
    return await LbPair.fetch(this._connection, poolAddress);
  }

  async getPosition(position: PublicKey): Promise<PositionV2 | null> {
    return await PositionV2.fetch(this._connection, position);
  }

  async getMeteoraPools(): Promise<MeteoraPool[]> {
    const rawPools = await this._connection.getProgramAccounts(METEORA_PROGRAM_ID, {
      commitment: 'confirmed',
      filters: [{ memcmp: { bytes: LbPair.discriminator.toString(), offset: 0 } }],
    });
    let pools: MeteoraPool[] = [];
    for (let i = 0; i < rawPools.length; i++) {
      let lbPair = LbPair.decode(rawPools[i].account.data);
      pools.push({ pool: lbPair, key: rawPools[i].pubkey });
    }
    return pools;
  }

  async getStrategyMeteoraPoolAprApy(strategy: WhirlpoolStrategy, prices: KaminoPrices): Promise<WhirlpoolAprApy> {
    throw new Error('unimplemented getStrategyMeteoraPoolAprApy');
    // const position = await this.getPosition(strategy.position);
    // if (!position) {
    //   throw new Error(`Position ${strategy.position} does not exist`);
    // }

    // const pool = await this.getPool(strategy.pool);
    // if (!pool) {
    //   throw Error(`Could not get meteora pool data for ${strategy.pool}`);
    // }
    // let decimalsX = strategy.tokenAMintDecimals.toNumber();
    // let decimalsY = strategy.tokenBMintDecimals.toNumber();
    // let {priceLower, priceUpper} = getMeteoraPriceLowerUpper(position.lowerBinId, position.upperBinId, decimalsX, decimalsY, pool.binStep);
    // const priceRange = getStrategyPriceRangeMeteora(priceLower, priceUpper, pool.activeId, pool.binStep, decimalsX, decimalsY);
    // if (priceRange.strategyOutOfRange) {
    //   return {
    //     ...priceRange,
    //     rewardsApy: [],
    //     rewardsApr: [],
    //     feeApy: ZERO,
    //     feeApr: ZERO,
    //     totalApy: ZERO,
    //     totalApr: ZERO,
    //   };
    // }

    // // TODO: fix this
    // let totalApr = new Decimal(100);
    // let feeApr = new Decimal(100);
    // let rewardsApr = [new Decimal(100)];
    // return {
    //   totalApr,
    //   totalApy: aprToApy(totalApr, 365),
    //   feeApr,
    //   feeApy: aprToApy(feeApr, 365),
    //   rewardsApr,
    //   rewardsApy: rewardsApr.map((x) => aprToApy(x, 365)),
    //   ...priceRange,
    // };
  }

  // strongly recommended to pass lowestTick and highestTick because fetching the lowest and highest existent takes very long
  async getMeteoraLiquidityDistribution(
    poolKey: PublicKey,
    keepOrder: boolean = true,
    lowestTick?: number,
    highestTick?: number
  ): Promise<LiquidityDistribution> {
    throw new Error('unimplemented getMeteoraLiquidityDistribution');
    // TODO: fix this
    // const pool = await this.getPool(poolKey);
    // if (!pool) {
    //   throw Error(`Could not get meteora pool data for ${poolKey}`);
    // }
    // let currentTickIndex = pool.activeId;
    // let tokenXDecimals = await getMintDecimals(this._connection, pool.tokenXMint);
    // let tokenYDecimals = await getMintDecimals(this._connection, pool.tokenYMint);
    // const currentPrice = getPriceOfBinByBinIdWithDecimals(currentTickIndex, pool.binStep, tokenXDecimals, tokenYDecimals);
    // // TODO: add actual distribution
    // return {
    //   currentPrice, currentTickIndex, distribution: []
    // };
  }

  async getMeteoraPositionAprApy(
    poolPubkey: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    prices: KaminoPrices
  ): Promise<WhirlpoolAprApy> {
    throw new Error('unimplemented getMeteoraPositionAprApy');

    // const pool = await this.getPool(poolPubkey);
    // if (!pool) {
    //   throw Error(`Could not get meteora pool data for ${poolPubkey}`);
    // }
    // let tokenXDecimals = await getMintDecimals(this._connection, pool.tokenXMint);
    // let tokenYDecimals = await getMintDecimals(this._connection, pool.tokenYMint);
    // const priceRange = getStrategyPriceRangeMeteora(priceLower, priceUpper, pool.activeId, pool.binStep, tokenXDecimals, tokenYDecimals);
    // if (priceRange.strategyOutOfRange) {
    //   return {
    //     ...priceRange,
    //     rewardsApy: [],
    //     rewardsApr: [],
    //     feeApy: ZERO,
    //     feeApr: ZERO,
    //     totalApy: ZERO,
    //     totalApr: ZERO,
    //   };
    // }
    // let totalApr = new Decimal(100);
    // let feeApr = new Decimal(100);
    // let rewardsApr = [new Decimal(100)];
    // return {
    //   totalApr,
    //   totalApy: aprToApy(totalApr, 365),
    //   feeApr,
    //   feeApy: aprToApy(feeApr, 365),
    //   rewardsApr,
    //   rewardsApy: rewardsApr.map((x) => aprToApy(x, 365)),
    //   ...priceRange,
    // };
  }

  async getGenericPoolInfo(poolPubkey: PublicKey) {
    const pool = await this.getPool(poolPubkey);
    if (!pool) {
      throw Error(`Could not get meteora pool data for ${poolPubkey}`);
    }
    let tokenXDecimals = await getMintDecimals(this._connection, pool.tokenXMint);
    let tokenYDecimals = await getMintDecimals(this._connection, pool.tokenYMint);
    let price = getPriceOfBinByBinIdWithDecimals(pool.activeId, pool.binStep, tokenXDecimals, tokenYDecimals);

    let poolInfo: GenericPoolInfo = {
      dex: 'METEORA',
      address: new PublicKey(poolPubkey),
      tokenMintA: pool.tokenXMint,
      tokenMintB: pool.tokenYMint,
      price,
      // TODO: add these
      feeRate: new Decimal(100),
      volumeOnLast7d: new Decimal(100),
      tvl: new Decimal(100),
      tickSpacing: new Decimal(pool.binStep),
      // todo(Silviu): get real amount of positions
      positions: new Decimal(0),
    };
    return poolInfo;
  }

  async getPositionsCountByPool(pool: PublicKey): Promise<number> {
    const rawPositions = await this._connection.getProgramAccounts(METEORA_PROGRAM_ID, {
      commitment: 'confirmed',
      filters: [{ dataSize: 8120 }, { memcmp: { bytes: pool.toBase58(), offset: 8 } }],
    });

    return rawPositions.length;
  }
}
