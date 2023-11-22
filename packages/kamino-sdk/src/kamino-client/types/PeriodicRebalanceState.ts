import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface PeriodicRebalanceStateFields {
  lastRebalanceTimestamp: BN
}

export interface PeriodicRebalanceStateJSON {
  lastRebalanceTimestamp: string
}

export class PeriodicRebalanceState {
  readonly lastRebalanceTimestamp: BN

  constructor(fields: PeriodicRebalanceStateFields) {
    this.lastRebalanceTimestamp = fields.lastRebalanceTimestamp
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u64("lastRebalanceTimestamp")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new PeriodicRebalanceState({
      lastRebalanceTimestamp: obj.lastRebalanceTimestamp,
    })
  }

  static toEncodable(fields: PeriodicRebalanceStateFields) {
    return {
      lastRebalanceTimestamp: fields.lastRebalanceTimestamp,
    }
  }

  toJSON(): PeriodicRebalanceStateJSON {
    return {
      lastRebalanceTimestamp: this.lastRebalanceTimestamp.toString(),
    }
  }

  static fromJSON(obj: PeriodicRebalanceStateJSON): PeriodicRebalanceState {
    return new PeriodicRebalanceState({
      lastRebalanceTimestamp: new BN(obj.lastRebalanceTimestamp),
    })
  }

  toEncodable() {
    return PeriodicRebalanceState.toEncodable(this)
  }
}
