import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh';

export interface TickStateFields {
  tick: number;
  /** Amount of net liquidity added (subtracted) when tick is crossed from left to right (right to left) */
  liquidityNet: BN;
  /** The total position liquidity that references this tick */
  liquidityGross: BN;
  /**
   * Fee growth per unit of liquidity on the _other_ side of this tick (relative to the current tick)
   * only has relative meaning, not absolute — the value depends on when the tick is initialized
   */
  feeGrowthOutside0X64: BN;
  feeGrowthOutside1X64: BN;
  rewardGrowthsOutsideX64: Array<BN>;
  padding: Array<number>;
}

export interface TickStateJSON {
  tick: number;
  /** Amount of net liquidity added (subtracted) when tick is crossed from left to right (right to left) */
  liquidityNet: string;
  /** The total position liquidity that references this tick */
  liquidityGross: string;
  /**
   * Fee growth per unit of liquidity on the _other_ side of this tick (relative to the current tick)
   * only has relative meaning, not absolute — the value depends on when the tick is initialized
   */
  feeGrowthOutside0X64: string;
  feeGrowthOutside1X64: string;
  rewardGrowthsOutsideX64: Array<string>;
  padding: Array<number>;
}

export class TickState {
  readonly tick: number;
  /** Amount of net liquidity added (subtracted) when tick is crossed from left to right (right to left) */
  readonly liquidityNet: BN;
  /** The total position liquidity that references this tick */
  readonly liquidityGross: BN;
  /**
   * Fee growth per unit of liquidity on the _other_ side of this tick (relative to the current tick)
   * only has relative meaning, not absolute — the value depends on when the tick is initialized
   */
  readonly feeGrowthOutside0X64: BN;
  readonly feeGrowthOutside1X64: BN;
  readonly rewardGrowthsOutsideX64: Array<BN>;
  readonly padding: Array<number>;

  constructor(fields: TickStateFields) {
    this.tick = fields.tick;
    this.liquidityNet = fields.liquidityNet;
    this.liquidityGross = fields.liquidityGross;
    this.feeGrowthOutside0X64 = fields.feeGrowthOutside0X64;
    this.feeGrowthOutside1X64 = fields.feeGrowthOutside1X64;
    this.rewardGrowthsOutsideX64 = fields.rewardGrowthsOutsideX64;
    this.padding = fields.padding;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.i32('tick'),
        borsh.i128('liquidityNet'),
        borsh.u128('liquidityGross'),
        borsh.u128('feeGrowthOutside0X64'),
        borsh.u128('feeGrowthOutside1X64'),
        borsh.array(borsh.u128(), 3, 'rewardGrowthsOutsideX64'),
        borsh.array(borsh.u32(), 13, 'padding'),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new TickState({
      tick: obj.tick,
      liquidityNet: obj.liquidityNet,
      liquidityGross: obj.liquidityGross,
      feeGrowthOutside0X64: obj.feeGrowthOutside0X64,
      feeGrowthOutside1X64: obj.feeGrowthOutside1X64,
      rewardGrowthsOutsideX64: obj.rewardGrowthsOutsideX64,
      padding: obj.padding,
    });
  }

  static toEncodable(fields: TickStateFields) {
    return {
      tick: fields.tick,
      liquidityNet: fields.liquidityNet,
      liquidityGross: fields.liquidityGross,
      feeGrowthOutside0X64: fields.feeGrowthOutside0X64,
      feeGrowthOutside1X64: fields.feeGrowthOutside1X64,
      rewardGrowthsOutsideX64: fields.rewardGrowthsOutsideX64,
      padding: fields.padding,
    };
  }

  toJSON(): TickStateJSON {
    return {
      tick: this.tick,
      liquidityNet: this.liquidityNet.toString(),
      liquidityGross: this.liquidityGross.toString(),
      feeGrowthOutside0X64: this.feeGrowthOutside0X64.toString(),
      feeGrowthOutside1X64: this.feeGrowthOutside1X64.toString(),
      rewardGrowthsOutsideX64: this.rewardGrowthsOutsideX64.map((item) => item.toString()),
      padding: this.padding,
    };
  }

  static fromJSON(obj: TickStateJSON): TickState {
    return new TickState({
      tick: obj.tick,
      liquidityNet: new BN(obj.liquidityNet),
      liquidityGross: new BN(obj.liquidityGross),
      feeGrowthOutside0X64: new BN(obj.feeGrowthOutside0X64),
      feeGrowthOutside1X64: new BN(obj.feeGrowthOutside1X64),
      rewardGrowthsOutsideX64: obj.rewardGrowthsOutsideX64.map((item) => new BN(item)),
      padding: obj.padding,
    });
  }

  toEncodable() {
    return TickState.toEncodable(this);
  }
}
