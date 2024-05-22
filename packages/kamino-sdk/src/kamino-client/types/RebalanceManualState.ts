import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface RebalanceManualStateFields {}

export interface RebalanceManualStateJSON {}

export class RebalanceManualState {
  constructor(fields: RebalanceManualStateFields) {}

  static layout(property?: string) {
    return borsh.struct([], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new RebalanceManualState({})
  }

  static toEncodable(fields: RebalanceManualStateFields) {
    return {}
  }

  toJSON(): RebalanceManualStateJSON {
    return {}
  }

  static fromJSON(obj: RebalanceManualStateJSON): RebalanceManualState {
    return new RebalanceManualState({})
  }

  toEncodable() {
    return RebalanceManualState.toEncodable(this)
  }
}
