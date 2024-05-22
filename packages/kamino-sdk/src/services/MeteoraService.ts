import { Connection, PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { WhirlpoolStrategy } from '../kamino-client/accounts';
import {
  aprToApy,
  GenericPoolInfo,
  getMeteoraPriceLowerUpper,
  getStrategyPriceRangeMeteora,
  LiquidityDistribution,
  ZERO,
} from '../utils';
import { getMintDecimals } from '@project-serum/serum/lib/market';
import { KaminoPrices } from '../models';
import { LbPair, PositionV3 } from '../meteora_client/accounts';
import { WhirlpoolAprApy } from './WhirlpoolAprApy';
import { METEORA_PROGRAM_ID } from '../meteora_client/programId';
import { getPriceOfBinByBinIdWithDecimals } from '../utils/meteora';
import { PositionBinData } from '../meteora_client/types';

export const POSITION_V3_INIT_SPACE = 328;
export const POSITION_BIN_INIT_SPACE = 112;

export class DynamicPosition {
  readonly position: PositionV3;
  readonly bins: PositionBinData[];

  constructor(position: PositionV3, bins: PositionBinData[]) {
    this.position = position;
    this.bins = bins;
  }
  static decodeBins(data: Buffer): PositionBinData[] {
    let bins: PositionBinData[] = [];
    let offset = 0;
    while (data.length - offset >= POSITION_BIN_INIT_SPACE) {
      let bin = DynamicPosition.decodePositionBinData(data.slice(offset, offset + POSITION_BIN_INIT_SPACE));
      bins.push(bin);
      offset += POSITION_BIN_INIT_SPACE;
    }
    return bins;
  }

  static decodePositionBinData(data: Buffer): PositionBinData {
    const dec = PositionBinData.layout().decode(data);

    return new PositionBinData({
      feeInfo: dec.feeInfo,
      liquidityShare: dec.liquidityShare,
      rewardInfo: dec.rewardInfo,
    });
  }

  static decode(data: Buffer): DynamicPosition {
    const position = PositionV3.decode(data.slice(0, 8 + POSITION_V3_INIT_SPACE));
    const bins = DynamicPosition.decodeBins(data.slice(8 + POSITION_V3_INIT_SPACE));
    return { position, bins };
  }

  static async fetch(c: Connection, address: PublicKey): Promise<DynamicPosition | null> {
    const info = await c.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(METEORA_PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(c: Connection, addresses: PublicKey[]): Promise<Array<DynamicPosition | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses);

    return infos.map((info) => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(METEORA_PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }
}

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

  async getPool(poolAddress: PublicKey): Promise<LbPair | null> {
    return await LbPair.fetch(this._connection, poolAddress);
  }

  async getPosition(address: PublicKey): Promise<DynamicPosition | null> {
    return DynamicPosition.fetch(this._connection, address);
  }

  async getMeteoraPools(): Promise<MeteoraPool[]> {
    const rawPools = await this._connection.getProgramAccounts(METEORA_PROGRAM_ID, {
      commitment: 'confirmed',
      filters: [{ dataSize: 904 }],
    });
    let pools: MeteoraPool[] = [];
    for (let i = 0; i < rawPools.length; i++) {
      try {
        let lbPair = LbPair.decode(rawPools[i].account.data);
        pools.push({ pool: lbPair, key: rawPools[i].pubkey });
      } catch (e) {
        console.log(e);
      }
    }
    return pools;
  }

  async getStrategyMeteoraPoolAprApy(strategy: WhirlpoolStrategy, prices: KaminoPrices): Promise<WhirlpoolAprApy> {
    const position = await this.getPosition(strategy.position);

    const pool = await this.getPool(strategy.pool);

    let decimalsX = strategy.tokenAMintDecimals.toNumber();
    let decimalsY = strategy.tokenBMintDecimals.toNumber();
    let priceLower: Decimal = new Decimal(0);
    let priceUpper: Decimal = new Decimal(0);
    if (position && pool) {
      const priceRange = getMeteoraPriceLowerUpper(
        position.position.lowerBinId,
        position.position.upperBinId,
        pool.binStep,
        decimalsX,
        decimalsY
      );
      priceLower = priceRange.priceLower;
      priceUpper = priceRange.priceUpper;
    }

    let priceRange = { priceLower, poolPrice: new Decimal(0), priceUpper, strategyOutOfRange: true };
    if (pool && position) {
      priceRange = getStrategyPriceRangeMeteora(
        priceLower,
        priceUpper,
        pool.activeId,
        pool.binStep,
        decimalsX,
        decimalsY
      );
    }

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

    // TODO: fix this
    let totalApr = new Decimal(0);
    let feeApr = new Decimal(0);
    let rewardsApr = [new Decimal(0)];
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
  async getMeteoraLiquidityDistribution(
    poolKey: PublicKey,
    keepOrder: boolean = true,
    lowestTick?: number,
    highestTick?: number
  ): Promise<LiquidityDistribution> {
    //TODO: fix this
    const pool = await this.getPool(poolKey);
    if (!pool) {
      // if the pool doesn't exist, return empty distribution
      return {
        currentPrice: new Decimal(0),
        currentTickIndex: 0,
        distribution: [],
      };
    }

    let currentTickIndex = pool.activeId;
    let tokenXDecimals = await getMintDecimals(this._connection, pool.tokenXMint);
    let tokenYDecimals = await getMintDecimals(this._connection, pool.tokenYMint);
    const currentPrice = getPriceOfBinByBinIdWithDecimals(
      currentTickIndex,
      pool.binStep,
      tokenXDecimals,
      tokenYDecimals
    );
    // TODO: add actual distribution
    return {
      currentPrice,
      currentTickIndex,
      distribution: [],
    };
  }

  async getMeteoraPositionAprApy(
    poolPubkey: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal
  ): Promise<WhirlpoolAprApy> {
    const pool = await this.getPool(poolPubkey);
    if (!pool) {
      return {
        priceLower: ZERO,
        priceUpper: ZERO,
        poolPrice: ZERO,
        strategyOutOfRange: true,
        rewardsApy: [],
        rewardsApr: [],
        feeApy: ZERO,
        feeApr: ZERO,
        totalApy: ZERO,
        totalApr: ZERO,
      };
    }
    let tokenXDecimals = await getMintDecimals(this._connection, pool.tokenXMint);
    let tokenYDecimals = await getMintDecimals(this._connection, pool.tokenYMint);
    const priceRange = getStrategyPriceRangeMeteora(
      priceLower,
      priceUpper,
      pool.activeId,
      pool.binStep,
      tokenXDecimals,
      tokenYDecimals
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
    let totalApr = new Decimal(0);
    let feeApr = new Decimal(0);
    let rewardsApr = [new Decimal(0)];
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

  async getGenericPoolInfo(poolPubkey: PublicKey): Promise<GenericPoolInfo> {
    const pool = await this.getPool(poolPubkey);
    if (!pool) {
      return {
        dex: 'METEORA',
        address: new PublicKey(0),
        tokenMintA: new PublicKey(0),
        tokenMintB: new PublicKey(0),
        price: new Decimal(0),
        feeRate: new Decimal(0),
        volumeOnLast7d: new Decimal(0),
        tvl: new Decimal(0),
        tickSpacing: new Decimal(0),
        positions: new Decimal(0),
      };
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
      feeRate: computeMeteoraFee(pool),
      // TODO: add these
      volumeOnLast7d: new Decimal(0),
      tvl: new Decimal(0),
      tickSpacing: new Decimal(pool.binStep),
      // todo(Silviu): get real amount of positions
      positions: new Decimal(await this.getPositionsCountByPool(poolPubkey)),
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

export function computeMeteoraFee(pool: LbPair): Decimal {
  return new Decimal(pool.parameters.baseFactor).mul(new Decimal(pool.binStep)).div(new Decimal(1e6));
}
