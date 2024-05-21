import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface EmaTwapFields {
  lastUpdateSlot: BN
  lastUpdateUnixTimestamp: BN
  currentEma1h: BN
  /** The sample tracker is a 64 bit number where each bit represents a point in time. */
  updatesTracker1h: BN
  padding0: BN
  padding1: Array<BN>
}

export interface EmaTwapJSON {
  lastUpdateSlot: string
  lastUpdateUnixTimestamp: string
  currentEma1h: string
  /** The sample tracker is a 64 bit number where each bit represents a point in time. */
  updatesTracker1h: string
  padding0: string
  padding1: Array<string>
}

export class EmaTwap {
  readonly lastUpdateSlot: BN
  readonly lastUpdateUnixTimestamp: BN
  readonly currentEma1h: BN
  /** The sample tracker is a 64 bit number where each bit represents a point in time. */
  readonly updatesTracker1h: BN
  readonly padding0: BN
  readonly padding1: Array<BN>

  constructor(fields: EmaTwapFields) {
    this.lastUpdateSlot = fields.lastUpdateSlot
    this.lastUpdateUnixTimestamp = fields.lastUpdateUnixTimestamp
    this.currentEma1h = fields.currentEma1h
    this.updatesTracker1h = fields.updatesTracker1h
    this.padding0 = fields.padding0
    this.padding1 = fields.padding1
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u64("lastUpdateSlot"),
        borsh.u64("lastUpdateUnixTimestamp"),
        borsh.u128("currentEma1h"),
        borsh.u64("updatesTracker1h"),
        borsh.u64("padding0"),
        borsh.array(borsh.u128(), 39, "padding1"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new EmaTwap({
      lastUpdateSlot: obj.lastUpdateSlot,
      lastUpdateUnixTimestamp: obj.lastUpdateUnixTimestamp,
      currentEma1h: obj.currentEma1h,
      updatesTracker1h: obj.updatesTracker1h,
      padding0: obj.padding0,
      padding1: obj.padding1,
    })
  }

  static toEncodable(fields: EmaTwapFields) {
    return {
      lastUpdateSlot: fields.lastUpdateSlot,
      lastUpdateUnixTimestamp: fields.lastUpdateUnixTimestamp,
      currentEma1h: fields.currentEma1h,
      updatesTracker1h: fields.updatesTracker1h,
      padding0: fields.padding0,
      padding1: fields.padding1,
    }
  }

  toJSON(): EmaTwapJSON {
    return {
      lastUpdateSlot: this.lastUpdateSlot.toString(),
      lastUpdateUnixTimestamp: this.lastUpdateUnixTimestamp.toString(),
      currentEma1h: this.currentEma1h.toString(),
      updatesTracker1h: this.updatesTracker1h.toString(),
      padding0: this.padding0.toString(),
      padding1: this.padding1.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: EmaTwapJSON): EmaTwap {
    return new EmaTwap({
      lastUpdateSlot: new BN(obj.lastUpdateSlot),
      lastUpdateUnixTimestamp: new BN(obj.lastUpdateUnixTimestamp),
      currentEma1h: new BN(obj.currentEma1h),
      updatesTracker1h: new BN(obj.updatesTracker1h),
      padding0: new BN(obj.padding0),
      padding1: obj.padding1.map((item) => new BN(item)),
    })
  }

  toEncodable() {
    return EmaTwap.toEncodable(this)
  }
}
