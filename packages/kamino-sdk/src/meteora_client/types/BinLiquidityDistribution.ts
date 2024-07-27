import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface BinLiquidityDistributionFields {
  /** Define the bin ID wish to deposit to. */
  binId: number
  /** DistributionX (or distributionY) is the percentages of amountX (or amountY) you want to add to each bin. */
  distributionX: number
  /** DistributionX (or distributionY) is the percentages of amountX (or amountY) you want to add to each bin. */
  distributionY: number
}

export interface BinLiquidityDistributionJSON {
  /** Define the bin ID wish to deposit to. */
  binId: number
  /** DistributionX (or distributionY) is the percentages of amountX (or amountY) you want to add to each bin. */
  distributionX: number
  /** DistributionX (or distributionY) is the percentages of amountX (or amountY) you want to add to each bin. */
  distributionY: number
}

export class BinLiquidityDistribution {
  /** Define the bin ID wish to deposit to. */
  readonly binId: number
  /** DistributionX (or distributionY) is the percentages of amountX (or amountY) you want to add to each bin. */
  readonly distributionX: number
  /** DistributionX (or distributionY) is the percentages of amountX (or amountY) you want to add to each bin. */
  readonly distributionY: number

  constructor(fields: BinLiquidityDistributionFields) {
    this.binId = fields.binId
    this.distributionX = fields.distributionX
    this.distributionY = fields.distributionY
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.i32("binId"),
        borsh.u16("distributionX"),
        borsh.u16("distributionY"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new BinLiquidityDistribution({
      binId: obj.binId,
      distributionX: obj.distributionX,
      distributionY: obj.distributionY,
    })
  }

  static toEncodable(fields: BinLiquidityDistributionFields) {
    return {
      binId: fields.binId,
      distributionX: fields.distributionX,
      distributionY: fields.distributionY,
    }
  }

  toJSON(): BinLiquidityDistributionJSON {
    return {
      binId: this.binId,
      distributionX: this.distributionX,
      distributionY: this.distributionY,
    }
  }

  static fromJSON(obj: BinLiquidityDistributionJSON): BinLiquidityDistribution {
    return new BinLiquidityDistribution({
      binId: obj.binId,
      distributionX: obj.distributionX,
      distributionY: obj.distributionY,
    })
  }

  toEncodable() {
    return BinLiquidityDistribution.toEncodable(this)
  }
}
