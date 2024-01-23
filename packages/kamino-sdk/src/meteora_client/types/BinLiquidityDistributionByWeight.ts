import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface BinLiquidityDistributionByWeightFields {
  /** Define the bin ID wish to deposit to. */
  binId: number
  /** weight of liquidity distributed for this bin id */
  weight: number
}

export interface BinLiquidityDistributionByWeightJSON {
  /** Define the bin ID wish to deposit to. */
  binId: number
  /** weight of liquidity distributed for this bin id */
  weight: number
}

export class BinLiquidityDistributionByWeight {
  /** Define the bin ID wish to deposit to. */
  readonly binId: number
  /** weight of liquidity distributed for this bin id */
  readonly weight: number

  constructor(fields: BinLiquidityDistributionByWeightFields) {
    this.binId = fields.binId
    this.weight = fields.weight
  }

  static layout(property?: string) {
    return borsh.struct([borsh.i32("binId"), borsh.u16("weight")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new BinLiquidityDistributionByWeight({
      binId: obj.binId,
      weight: obj.weight,
    })
  }

  static toEncodable(fields: BinLiquidityDistributionByWeightFields) {
    return {
      binId: fields.binId,
      weight: fields.weight,
    }
  }

  toJSON(): BinLiquidityDistributionByWeightJSON {
    return {
      binId: this.binId,
      weight: this.weight,
    }
  }

  static fromJSON(
    obj: BinLiquidityDistributionByWeightJSON
  ): BinLiquidityDistributionByWeight {
    return new BinLiquidityDistributionByWeight({
      binId: obj.binId,
      weight: obj.weight,
    })
  }

  toEncodable() {
    return BinLiquidityDistributionByWeight.toEncodable(this)
  }
}
