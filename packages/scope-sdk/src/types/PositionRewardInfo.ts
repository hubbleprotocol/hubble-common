import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface PositionRewardInfoFields {
  growthInsideCheckpoint: BN
  amountOwed: BN
}

export interface PositionRewardInfoJSON {
  growthInsideCheckpoint: string
  amountOwed: string
}

export class PositionRewardInfo {
  readonly growthInsideCheckpoint: BN
  readonly amountOwed: BN

  constructor(fields: PositionRewardInfoFields) {
    this.growthInsideCheckpoint = fields.growthInsideCheckpoint
    this.amountOwed = fields.amountOwed
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.u128("growthInsideCheckpoint"), borsh.u64("amountOwed")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new PositionRewardInfo({
      growthInsideCheckpoint: obj.growthInsideCheckpoint,
      amountOwed: obj.amountOwed,
    })
  }

  static toEncodable(fields: PositionRewardInfoFields) {
    return {
      growthInsideCheckpoint: fields.growthInsideCheckpoint,
      amountOwed: fields.amountOwed,
    }
  }

  toJSON(): PositionRewardInfoJSON {
    return {
      growthInsideCheckpoint: this.growthInsideCheckpoint.toString(),
      amountOwed: this.amountOwed.toString(),
    }
  }

  static fromJSON(obj: PositionRewardInfoJSON): PositionRewardInfo {
    return new PositionRewardInfo({
      growthInsideCheckpoint: new BN(obj.growthInsideCheckpoint),
      amountOwed: new BN(obj.amountOwed),
    })
  }

  toEncodable() {
    return PositionRewardInfo.toEncodable(this)
  }
}
