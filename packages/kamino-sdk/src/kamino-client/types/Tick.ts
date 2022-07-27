import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface TickFields {
  initialized: boolean
  liquidityNet: BN
  liquidityGross: BN
  feeGrowthOutsideA: BN
  feeGrowthOutsideB: BN
  rewardGrowthsOutside: Array<BN>
}

export interface TickJSON {
  initialized: boolean
  liquidityNet: string
  liquidityGross: string
  feeGrowthOutsideA: string
  feeGrowthOutsideB: string
  rewardGrowthsOutside: Array<string>
}

export class Tick {
  readonly initialized: boolean
  readonly liquidityNet: BN
  readonly liquidityGross: BN
  readonly feeGrowthOutsideA: BN
  readonly feeGrowthOutsideB: BN
  readonly rewardGrowthsOutside: Array<BN>

  constructor(fields: TickFields) {
    this.initialized = fields.initialized
    this.liquidityNet = fields.liquidityNet
    this.liquidityGross = fields.liquidityGross
    this.feeGrowthOutsideA = fields.feeGrowthOutsideA
    this.feeGrowthOutsideB = fields.feeGrowthOutsideB
    this.rewardGrowthsOutside = fields.rewardGrowthsOutside
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.bool("initialized"),
        borsh.i128("liquidityNet"),
        borsh.u128("liquidityGross"),
        borsh.u128("feeGrowthOutsideA"),
        borsh.u128("feeGrowthOutsideB"),
        borsh.array(borsh.u128(), 3, "rewardGrowthsOutside"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Tick({
      initialized: obj.initialized,
      liquidityNet: obj.liquidityNet,
      liquidityGross: obj.liquidityGross,
      feeGrowthOutsideA: obj.feeGrowthOutsideA,
      feeGrowthOutsideB: obj.feeGrowthOutsideB,
      rewardGrowthsOutside: obj.rewardGrowthsOutside,
    })
  }

  static toEncodable(fields: TickFields) {
    return {
      initialized: fields.initialized,
      liquidityNet: fields.liquidityNet,
      liquidityGross: fields.liquidityGross,
      feeGrowthOutsideA: fields.feeGrowthOutsideA,
      feeGrowthOutsideB: fields.feeGrowthOutsideB,
      rewardGrowthsOutside: fields.rewardGrowthsOutside,
    }
  }

  toJSON(): TickJSON {
    return {
      initialized: this.initialized,
      liquidityNet: this.liquidityNet.toString(),
      liquidityGross: this.liquidityGross.toString(),
      feeGrowthOutsideA: this.feeGrowthOutsideA.toString(),
      feeGrowthOutsideB: this.feeGrowthOutsideB.toString(),
      rewardGrowthsOutside: this.rewardGrowthsOutside.map((item) =>
        item.toString()
      ),
    }
  }

  static fromJSON(obj: TickJSON): Tick {
    return new Tick({
      initialized: obj.initialized,
      liquidityNet: new BN(obj.liquidityNet),
      liquidityGross: new BN(obj.liquidityGross),
      feeGrowthOutsideA: new BN(obj.feeGrowthOutsideA),
      feeGrowthOutsideB: new BN(obj.feeGrowthOutsideB),
      rewardGrowthsOutside: obj.rewardGrowthsOutside.map(
        (item) => new BN(item)
      ),
    })
  }

  toEncodable() {
    return Tick.toEncodable(this)
  }
}
