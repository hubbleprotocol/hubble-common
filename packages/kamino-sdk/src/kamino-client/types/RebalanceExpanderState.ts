import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface RebalanceExpanderStateFields {
  initialPoolPrice: BN
  expansionCount: number
}

export interface RebalanceExpanderStateJSON {
  initialPoolPrice: string
  expansionCount: number
}

export class RebalanceExpanderState {
  readonly initialPoolPrice: BN
  readonly expansionCount: number

  constructor(fields: RebalanceExpanderStateFields) {
    this.initialPoolPrice = fields.initialPoolPrice
    this.expansionCount = fields.expansionCount
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.u128("initialPoolPrice"), borsh.u16("expansionCount")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new RebalanceExpanderState({
      initialPoolPrice: obj.initialPoolPrice,
      expansionCount: obj.expansionCount,
    })
  }

  static toEncodable(fields: RebalanceExpanderStateFields) {
    return {
      initialPoolPrice: fields.initialPoolPrice,
      expansionCount: fields.expansionCount,
    }
  }

  toJSON(): RebalanceExpanderStateJSON {
    return {
      initialPoolPrice: this.initialPoolPrice.toString(),
      expansionCount: this.expansionCount,
    }
  }

  static fromJSON(obj: RebalanceExpanderStateJSON): RebalanceExpanderState {
    return new RebalanceExpanderState({
      initialPoolPrice: new BN(obj.initialPoolPrice),
      expansionCount: obj.expansionCount,
    })
  }

  toEncodable() {
    return RebalanceExpanderState.toEncodable(this)
  }
}
