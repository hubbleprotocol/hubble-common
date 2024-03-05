import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface RebalanceDriftParamsFields {
  startMidTick: number
  ticksBelowMid: number
  ticksAboveMid: number
  secondsPerTick: BN
  direction: types.DriftDirectionKind
}

export interface RebalanceDriftParamsJSON {
  startMidTick: number
  ticksBelowMid: number
  ticksAboveMid: number
  secondsPerTick: string
  direction: types.DriftDirectionJSON
}

export class RebalanceDriftParams {
  readonly startMidTick: number
  readonly ticksBelowMid: number
  readonly ticksAboveMid: number
  readonly secondsPerTick: BN
  readonly direction: types.DriftDirectionKind

  constructor(fields: RebalanceDriftParamsFields) {
    this.startMidTick = fields.startMidTick
    this.ticksBelowMid = fields.ticksBelowMid
    this.ticksAboveMid = fields.ticksAboveMid
    this.secondsPerTick = fields.secondsPerTick
    this.direction = fields.direction
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.i32("startMidTick"),
        borsh.i32("ticksBelowMid"),
        borsh.i32("ticksAboveMid"),
        borsh.u64("secondsPerTick"),
        types.DriftDirection.layout("direction"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new RebalanceDriftParams({
      startMidTick: obj.startMidTick,
      ticksBelowMid: obj.ticksBelowMid,
      ticksAboveMid: obj.ticksAboveMid,
      secondsPerTick: obj.secondsPerTick,
      direction: types.DriftDirection.fromDecoded(obj.direction),
    })
  }

  static toEncodable(fields: RebalanceDriftParamsFields) {
    return {
      startMidTick: fields.startMidTick,
      ticksBelowMid: fields.ticksBelowMid,
      ticksAboveMid: fields.ticksAboveMid,
      secondsPerTick: fields.secondsPerTick,
      direction: fields.direction.toEncodable(),
    }
  }

  toJSON(): RebalanceDriftParamsJSON {
    return {
      startMidTick: this.startMidTick,
      ticksBelowMid: this.ticksBelowMid,
      ticksAboveMid: this.ticksAboveMid,
      secondsPerTick: this.secondsPerTick.toString(),
      direction: this.direction.toJSON(),
    }
  }

  static fromJSON(obj: RebalanceDriftParamsJSON): RebalanceDriftParams {
    return new RebalanceDriftParams({
      startMidTick: obj.startMidTick,
      ticksBelowMid: obj.ticksBelowMid,
      ticksAboveMid: obj.ticksAboveMid,
      secondsPerTick: new BN(obj.secondsPerTick),
      direction: types.DriftDirection.fromJSON(obj.direction),
    })
  }

  toEncodable() {
    return RebalanceDriftParams.toEncodable(this)
  }
}
