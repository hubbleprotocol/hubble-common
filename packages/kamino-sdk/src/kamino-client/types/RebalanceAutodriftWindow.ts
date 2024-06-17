import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface RebalanceAutodriftWindowFields {
  stakingRateA: types.PriceFields | null
  stakingRateB: types.PriceFields | null
  epoch: BN
  theoreticalTick: number
  stratMidTick: number
}

export interface RebalanceAutodriftWindowJSON {
  stakingRateA: types.PriceJSON | null
  stakingRateB: types.PriceJSON | null
  epoch: string
  theoreticalTick: number
  stratMidTick: number
}

export class RebalanceAutodriftWindow {
  readonly stakingRateA: types.Price | null
  readonly stakingRateB: types.Price | null
  readonly epoch: BN
  readonly theoreticalTick: number
  readonly stratMidTick: number

  constructor(fields: RebalanceAutodriftWindowFields) {
    this.stakingRateA =
      (fields.stakingRateA && new types.Price({ ...fields.stakingRateA })) ||
      null
    this.stakingRateB =
      (fields.stakingRateB && new types.Price({ ...fields.stakingRateB })) ||
      null
    this.epoch = fields.epoch
    this.theoreticalTick = fields.theoreticalTick
    this.stratMidTick = fields.stratMidTick
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.option(types.Price.layout(), "stakingRateA"),
        borsh.option(types.Price.layout(), "stakingRateB"),
        borsh.u64("epoch"),
        borsh.i32("theoreticalTick"),
        borsh.i32("stratMidTick"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new RebalanceAutodriftWindow({
      stakingRateA:
        (obj.stakingRateA && types.Price.fromDecoded(obj.stakingRateA)) || null,
      stakingRateB:
        (obj.stakingRateB && types.Price.fromDecoded(obj.stakingRateB)) || null,
      epoch: obj.epoch,
      theoreticalTick: obj.theoreticalTick,
      stratMidTick: obj.stratMidTick,
    })
  }

  static toEncodable(fields: RebalanceAutodriftWindowFields) {
    return {
      stakingRateA:
        (fields.stakingRateA && types.Price.toEncodable(fields.stakingRateA)) ||
        null,
      stakingRateB:
        (fields.stakingRateB && types.Price.toEncodable(fields.stakingRateB)) ||
        null,
      epoch: fields.epoch,
      theoreticalTick: fields.theoreticalTick,
      stratMidTick: fields.stratMidTick,
    }
  }

  toJSON(): RebalanceAutodriftWindowJSON {
    return {
      stakingRateA: (this.stakingRateA && this.stakingRateA.toJSON()) || null,
      stakingRateB: (this.stakingRateB && this.stakingRateB.toJSON()) || null,
      epoch: this.epoch.toString(),
      theoreticalTick: this.theoreticalTick,
      stratMidTick: this.stratMidTick,
    }
  }

  static fromJSON(obj: RebalanceAutodriftWindowJSON): RebalanceAutodriftWindow {
    return new RebalanceAutodriftWindow({
      stakingRateA:
        (obj.stakingRateA && types.Price.fromJSON(obj.stakingRateA)) || null,
      stakingRateB:
        (obj.stakingRateB && types.Price.fromJSON(obj.stakingRateB)) || null,
      epoch: new BN(obj.epoch),
      theoreticalTick: obj.theoreticalTick,
      stratMidTick: obj.stratMidTick,
    })
  }

  toEncodable() {
    return RebalanceAutodriftWindow.toEncodable(this)
  }
}
