import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface EmaTwapFields {
  lastUpdateSlot: BN
  lastUpdateUnixTimestamp: BN
  currentEma1h: BN
  padding: Array<BN>
}

export interface EmaTwapJSON {
  lastUpdateSlot: string
  lastUpdateUnixTimestamp: string
  currentEma1h: string
  padding: Array<string>
}

export class EmaTwap {
  readonly lastUpdateSlot: BN
  readonly lastUpdateUnixTimestamp: BN
  readonly currentEma1h: BN
  readonly padding: Array<BN>

  constructor(fields: EmaTwapFields) {
    this.lastUpdateSlot = fields.lastUpdateSlot
    this.lastUpdateUnixTimestamp = fields.lastUpdateUnixTimestamp
    this.currentEma1h = fields.currentEma1h
    this.padding = fields.padding
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u64("lastUpdateSlot"),
        borsh.u64("lastUpdateUnixTimestamp"),
        borsh.u128("currentEma1h"),
        borsh.array(borsh.u128(), 40, "padding"),
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
      padding: obj.padding,
    })
  }

  static toEncodable(fields: EmaTwapFields) {
    return {
      lastUpdateSlot: fields.lastUpdateSlot,
      lastUpdateUnixTimestamp: fields.lastUpdateUnixTimestamp,
      currentEma1h: fields.currentEma1h,
      padding: fields.padding,
    }
  }

  toJSON(): EmaTwapJSON {
    return {
      lastUpdateSlot: this.lastUpdateSlot.toString(),
      lastUpdateUnixTimestamp: this.lastUpdateUnixTimestamp.toString(),
      currentEma1h: this.currentEma1h.toString(),
      padding: this.padding.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: EmaTwapJSON): EmaTwap {
    return new EmaTwap({
      lastUpdateSlot: new BN(obj.lastUpdateSlot),
      lastUpdateUnixTimestamp: new BN(obj.lastUpdateUnixTimestamp),
      currentEma1h: new BN(obj.currentEma1h),
      padding: obj.padding.map((item) => new BN(item)),
    })
  }

  toEncodable() {
    return EmaTwap.toEncodable(this)
  }
}
