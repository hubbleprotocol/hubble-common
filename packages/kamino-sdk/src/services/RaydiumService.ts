import { Connection, PublicKey } from '@solana/web3.js';
import { SolanaCluster } from '@hubbleprotocol/hubble-config';
import {
  LiquidityDistribution as RaydiumLiquidityDistribuion,
  Pool,
  RaydiumPoolsResponse,
} from './RaydiumPoolsResponse';
import { PersonalPositionState, PoolState } from '../raydium_client';
import Decimal from 'decimal.js';
import { AmmV3, AmmV3PoolInfo, PoolInfoLayout, PositionInfoLayout, TickMath, TickUtils } from '@raydium-io/raydium-sdk';
import { WhirlpoolAprApy } from './WhirlpoolAprApy';
import { WhirlpoolStrategy } from '../kamino-client/accounts';
import {
  aprToApy,
  GenericPoolInfo,
  getStrategyPriceRangeRaydium,
  LiquidityDistribution,
  LiquidityForPrice,
  ZERO,
} from '../utils';
import axios from 'axios';
import { FullBPS } from '../utils/CreationParameters';
import { PROGRAM_ID as RAYDIUM_PROGRAM_ID } from '../raydium_client/programId';

export class RaydiumService {
  private readonly _connection: Connection;
  private readonly _cluster: SolanaCluster;

  constructor(connection: Connection, cluster: SolanaCluster) {
    this._connection = connection;
    this._cluster = cluster;
  }

  async getRaydiumWhirlpools(): Promise<RaydiumPoolsResponse> {
    return (await axios.get<RaydiumPoolsResponse>(`https://api.raydium.io/v2/ammV3/ammPools`)).data;
  }

  async getRaydiumPoolLiquidityDistribution(pool: PublicKey): Promise<LiquidityDistribution> {
    let raydiumLiqDistribution = (
      await axios.get<RaydiumLiquidityDistribuion>(`https://api.raydium.io/v2/ammV3/positionLine/${pool.toString()}`)
    ).data;

    let liqDistribution: LiquidityDistribution = {
      distribution: [],
    };
    raydiumLiqDistribution.data.forEach((entry) => {
      const liq: LiquidityForPrice = {
        price: new Decimal(entry.price),
        liquidity: new Decimal(entry.liquidity),
      };
      liqDistribution.distribution.push(liq);
    });

    return liqDistribution;
  }

  getStrategyWhirlpoolPoolAprApy = async (strategy: WhirlpoolStrategy, pools?: Pool[]): Promise<WhirlpoolAprApy> => {
    const position = await PersonalPositionState.fetch(this._connection, strategy.position);
    if (!position) {
      throw Error(`Position ${strategy.position} does not exist`);
    }
    const poolState = await PoolState.fetch(this._connection, strategy.pool);
    if (!poolState) {
      throw Error(`Raydium pool state ${strategy.pool} does not exist`);
    }

    if (!pools) {
      ({ data: pools } = await this.getRaydiumWhirlpools());
    }

    if (!pools || pools.length === 0) {
      throw Error(`Could not get Raydium amm pools from Raydium API`);
    }

    const raydiumPool = pools.filter((d) => d.id === position.poolId.toString()).shift();
    if (!raydiumPool) {
      throw Error(`Could not get find Raydium amm pool ${strategy.pool} from Raydium API`);
    }

    const poolInfo = (
      await AmmV3.fetchMultiplePoolInfos({
        connection: this._connection,
        // @ts-ignore
        poolKeys: [raydiumPool],
        batchRequest: true,
        chainTime: new Date().getTime() / 1000,
      })
    )[strategy.pool.toString()].state;

    const priceRange = getStrategyPriceRangeRaydium(
      position.tickLowerIndex,
      position.tickUpperIndex,
      Number(poolState.tickCurrent.toString()),
      Number(strategy.tokenAMintDecimals.toString()),
      Number(strategy.tokenBMintDecimals.toString())
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

    const params: {
      poolInfo: AmmV3PoolInfo;
      aprType: 'day' | 'week' | 'month';
      positionTickLowerIndex: number;
      positionTickUpperIndex: number;
    } = {
      poolInfo,
      aprType: 'day',
      positionTickLowerIndex: position.tickLowerIndex,
      positionTickUpperIndex: position.tickUpperIndex,
    };

    const { apr, feeApr, rewardsApr } = AmmV3.estimateAprsForPriceRangeMultiplier(params);
    const totalApr = new Decimal(apr).div(100);
    const fee = new Decimal(feeApr).div(100);
    const rewards = rewardsApr.map((reward) => new Decimal(reward).div(100));

    return {
      totalApr,
      totalApy: aprToApy(totalApr, 365),
      feeApr: fee,
      feeApy: aprToApy(fee, 365),
      rewardsApr: rewards,
      rewardsApy: rewards.map((x) => aprToApy(x, 365)),
      ...priceRange,
    };
  };

  getRaydiumPositionAprApy = async (
    poolPubkey: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    pools?: Pool[]
  ): Promise<WhirlpoolAprApy> => {
    const poolState = await PoolState.fetch(this._connection, poolPubkey);
    if (!poolState) {
      throw Error(`Raydium pool state ${poolPubkey} does not exist`);
    }

    if (!pools) {
      ({ data: pools } = await this.getRaydiumWhirlpools());
    }

    if (!pools || pools.length === 0) {
      throw Error(`Could not get Raydium amm pools from Raydium API`);
    }

    const raydiumPool = pools.filter((d) => d.id === poolPubkey.toString()).shift();
    if (!raydiumPool) {
      throw Error(`Could not get find Raydium amm pool ${poolPubkey.toString()} from Raydium API`);
    }

    const poolInfo = (
      await AmmV3.fetchMultiplePoolInfos({
        connection: this._connection,
        // @ts-ignore
        poolKeys: [raydiumPool],
        batchRequest: true,
        chainTime: new Date().getTime() / 1000,
      })
    )[poolPubkey.toString()].state;

    let tickLowerIndex = TickMath.getTickWithPriceAndTickspacing(
      priceLower,
      poolState.tickSpacing,
      poolState.mintDecimals0,
      poolState.mintDecimals1
    );

    let tickUpperIndex = TickMath.getTickWithPriceAndTickspacing(
      priceUpper,
      poolState.tickSpacing,
      poolState.mintDecimals0,
      poolState.mintDecimals1
    );

    const priceRange = getStrategyPriceRangeRaydium(
      tickLowerIndex,
      tickUpperIndex,
      Number(poolState.tickCurrent.toString()),
      raydiumPool.mintDecimalsA,
      raydiumPool.mintDecimalsB
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

    const params: {
      poolInfo: AmmV3PoolInfo;
      aprType: 'day' | 'week' | 'month';
      positionTickLowerIndex: number;
      positionTickUpperIndex: number;
    } = {
      poolInfo,
      aprType: 'day',
      positionTickLowerIndex: tickLowerIndex,
      positionTickUpperIndex: tickUpperIndex,
    };

    const { apr, feeApr, rewardsApr } = AmmV3.estimateAprsForPriceRangeMultiplier(params);
    const totalApr = new Decimal(apr).div(100);
    const fee = new Decimal(feeApr).div(100);
    const rewards = rewardsApr.map((reward) => new Decimal(reward).div(100));

    return {
      totalApr,
      totalApy: aprToApy(totalApr, 365),
      feeApr: fee,
      feeApy: aprToApy(fee, 365),
      rewardsApr: rewards,
      rewardsApy: rewards.map((x) => aprToApy(x, 365)),
      ...priceRange,
    };
  };

  async getGenericPoolInfo(poolPubkey: PublicKey, pools?: Pool[]) {
    const poolState = await PoolState.fetch(this._connection, poolPubkey);
    if (!poolState) {
      throw Error(`Raydium pool state ${poolPubkey} does not exist`);
    }

    if (!pools) {
      ({ data: pools } = await this.getRaydiumWhirlpools());
    }

    if (!pools || pools.length === 0) {
      throw Error(`Could not get Raydium amm pools from Raydium API`);
    }

    const raydiumPool = pools.filter((d) => d.id === poolPubkey.toString()).shift();
    if (!raydiumPool) {
      throw Error(`Could not get find Raydium amm pool ${poolPubkey.toString()} from Raydium API`);
    }

    let poolInfo: GenericPoolInfo = {
      dex: 'RAYDIUM',
      address: new PublicKey(poolPubkey),
      tokenMintA: poolState.tokenMint0,
      tokenMintB: poolState.tokenMint1,
      price: new Decimal(raydiumPool.price),
      feeRate: new Decimal(raydiumPool.ammConfig.tradeFeeRate).div(new Decimal(FullBPS)),
      volumeOnLast7d: new Decimal(raydiumPool.week.volume),
      tvl: new Decimal(raydiumPool.tvl),
      tickSpacing: new Decimal(raydiumPool.ammConfig.tickSpacing),
      // todo(Silviu): get real amount of positions
      positions: new Decimal(0),
    };
    return poolInfo;
  }

  async getPositionsCountByPool(pool: PublicKey): Promise<number> {
    const positions = await this._connection.getProgramAccounts(RAYDIUM_PROGRAM_ID, {
      commitment: 'confirmed',
      filters: [
        { dataSize: PositionInfoLayout.span },
        { memcmp: { bytes: pool.toBase58(), offset: PositionInfoLayout.offsetOf('poolId') } },
      ],
    });

    return positions.length;
  }
}
