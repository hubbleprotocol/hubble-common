import { Connection, PublicKey } from '@solana/web3.js';
import { SolanaCluster } from '@hubbleprotocol/hubble-config';
import { RaydiumPoolsResponse } from './RaydiumPoolsResponse';
import { PersonalPositionState, PoolState } from '../raydium_client';
import Decimal from 'decimal.js';
import { AmmV3, AmmV3PoolInfo } from '@raydium-io/raydium-sdk';
import { WhirlpoolAprApy } from './WhirlpoolAprApy';
import { PROGRAM_ID } from '../raydium_client/programId';
import { WhirlpoolStrategy } from '../kamino-client';
import { aprToApy, getStrategyPriceRangeRaydium, ZERO } from '../utils';
import axios from 'axios';

export class RaydiumService {
  private readonly _connection: Connection;
  private readonly _cluster: SolanaCluster;

  constructor(connection: Connection, cluster: SolanaCluster) {
    this._connection = connection;
    this._cluster = cluster;
  }

  private async getRaydiumWhirlpools() {
    return (await axios.get<RaydiumPoolsResponse>(`https://api.raydium.io/v2/ammV3/ammPools`)).data;
  }

  getStrategyWhirlpoolPoolAprApy = async (strategy: WhirlpoolStrategy): Promise<WhirlpoolAprApy> => {
    const position = await PersonalPositionState.fetch(this._connection, strategy.position);
    if (!position) {
      throw Error(`Position ${strategy.position} does not exist`);
    }
    const poolState = await PoolState.fetch(this._connection, strategy.pool);
    if (!poolState) {
      throw Error(`Raydium pool state ${strategy.pool} does not exist`);
    }

    const pools = await this.getRaydiumWhirlpools();
    if (!pools || pools.data.length === 0) {
      throw Error(`Could not get Raydium amm pools from Raydium API`);
    }

    const raydiumPool = pools.data.filter((d) => d.ammConfig.id.toString() === poolState.ammConfig.toString()).shift();

    if (!raydiumPool) {
      throw Error(`Could not get find Raydium amm pool ${strategy.pool} from Raydium API`);
    }

    const priceRange = getStrategyPriceRangeRaydium(
      position.tickLowerIndex,
      position.tickUpperIndex,
      Number(poolState.tickCurrent.toString()),
      strategy
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

    const poolInfo: AmmV3PoolInfo = {
      id: new PublicKey(raydiumPool.id),
      mintA: {
        mint: poolState.tokenMint0,
        vault: poolState.tokenVault0,
        decimals: poolState.mintDecimals0,
      },
      mintB: {
        mint: poolState.tokenMint1,
        vault: poolState.tokenVault1,
        decimals: poolState.mintDecimals1,
      },
      ammConfig: raydiumPool.ammConfig,
      observationId: PublicKey.unique(),
      creator: PublicKey.unique(),
      programId: PROGRAM_ID,
      version: 6,
      tickSpacing: poolState.tickSpacing,
      liquidity: poolState.liquidity,
      sqrtPriceX64: poolState.sqrtPriceX64,
      // @ts-ignore
      currentPrice: priceRange.poolPrice,
      tickCurrent: poolState.tickCurrent,
      observationIndex: poolState.observationIndex,
      observationUpdateDuration: poolState.observationUpdateDuration,
      feeGrowthGlobalX64A: poolState.feeGrowthGlobal0X64,
      feeGrowthGlobalX64B: poolState.feeGrowthGlobal1X64,
      protocolFeesTokenA: poolState.protocolFeesToken0,
      protocolFeesTokenB: poolState.protocolFeesToken1,
      swapInAmountTokenA: poolState.swapInAmountToken0,
      swapOutAmountTokenB: poolState.swapOutAmountToken1,
      swapInAmountTokenB: poolState.swapInAmountToken1,
      swapOutAmountTokenA: poolState.swapOutAmountToken0,
      tickArrayBitmap: poolState.tickArrayBitmap,
      // @ts-ignore
      rewardInfos: poolState.rewardInfos,
      day: {
        volume: raydiumPool.day.volume,
        volumeFee: raydiumPool.day.volumeFee,
        feeA: raydiumPool.day.feeA,
        feeB: raydiumPool.day.feeB,
        feeApr: raydiumPool.day.feeApr,
        rewardApr: {
          A: raydiumPool.day.rewardApr.A,
          B: raydiumPool.day.rewardApr.B,
          C: raydiumPool.day.rewardApr.C,
        },
        apr: raydiumPool.day.apr,
        priceMin: raydiumPool.day.priceMin,
        priceMax: raydiumPool.day.priceMax,
      },
      week: {
        volume: raydiumPool.week.volume,
        volumeFee: raydiumPool.week.volumeFee,
        feeA: raydiumPool.week.feeA,
        feeB: raydiumPool.week.feeB,
        feeApr: raydiumPool.week.feeApr,
        rewardApr: {
          A: raydiumPool.week.rewardApr.A,
          B: raydiumPool.week.rewardApr.B,
          C: raydiumPool.week.rewardApr.C,
        },
        apr: raydiumPool.week.apr,
        priceMin: raydiumPool.week.priceMin,
        priceMax: raydiumPool.week.priceMax,
      },
      month: {
        volume: raydiumPool.month.volume,
        volumeFee: raydiumPool.month.volumeFee,
        feeA: raydiumPool.month.feeA,
        feeB: raydiumPool.month.feeB,
        feeApr: raydiumPool.month.feeApr,
        rewardApr: {
          A: raydiumPool.month.rewardApr.A,
          B: raydiumPool.month.rewardApr.B,
          C: raydiumPool.month.rewardApr.C,
        },
        apr: raydiumPool.month.apr,
        priceMin: raydiumPool.month.priceMin,
        priceMax: raydiumPool.month.priceMax,
      },
      tvl: raydiumPool.tvl,
    };

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
}
