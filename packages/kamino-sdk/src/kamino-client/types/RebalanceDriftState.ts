import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface RebalanceDriftStateFields {
  step: types.RebalanceDriftStepKind
  lastDriftTimestamp: BN
  lastMidTick: number
}

export interface RebalanceDriftStateJSON {
  step: types.RebalanceDriftStepJSON
  lastDriftTimestamp: string
  lastMidTick: number
}

export class RebalanceDriftState {
  readonly step: types.RebalanceDriftStepKind
  readonly lastDriftTimestamp: BN
  readonly lastMidTick: number

  constructor(fields: RebalanceDriftStateFields) {
    this.step = fields.step
    this.lastDriftTimestamp = fields.lastDriftTimestamp
    this.lastMidTick = fields.lastMidTick
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        types.RebalanceDriftStep.layout("step"),
        borsh.u64("lastDriftTimestamp"),
        borsh.i32("lastMidTick"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new RebalanceDriftState({
      step: types.RebalanceDriftStep.fromDecoded(obj.step),
      lastDriftTimestamp: obj.lastDriftTimestamp,
      lastMidTick: obj.lastMidTick,
    })
  }

  static toEncodable(fields: RebalanceDriftStateFields) {
    return {
      step: fields.step.toEncodable(),
      lastDriftTimestamp: fields.lastDriftTimestamp,
      lastMidTick: fields.lastMidTick,
    }
  }

  toJSON(): RebalanceDriftStateJSON {
    return {
      step: this.step.toJSON(),
      lastDriftTimestamp: this.lastDriftTimestamp.toString(),
      lastMidTick: this.lastMidTick,
    }
  }

  static fromJSON(obj: RebalanceDriftStateJSON): RebalanceDriftState {
    return new RebalanceDriftState({
      step: types.RebalanceDriftStep.fromJSON(obj.step),
      lastDriftTimestamp: new BN(obj.lastDriftTimestamp),
      lastMidTick: obj.lastMidTick,
    })
  }

  toEncodable() {
    return RebalanceDriftState.toEncodable(this)
  }
}
