import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface StrategyParametersFields {
  /** min bin id */
  minBinId: number
  /** max bin id */
  maxBinId: number
  /** strategy type */
  strategyType: types.StrategyTypeKind
  /** parameters */
  parameteres: Array<number>
}

export interface StrategyParametersJSON {
  /** min bin id */
  minBinId: number
  /** max bin id */
  maxBinId: number
  /** strategy type */
  strategyType: types.StrategyTypeJSON
  /** parameters */
  parameteres: Array<number>
}

export class StrategyParameters {
  /** min bin id */
  readonly minBinId: number
  /** max bin id */
  readonly maxBinId: number
  /** strategy type */
  readonly strategyType: types.StrategyTypeKind
  /** parameters */
  readonly parameteres: Array<number>

  constructor(fields: StrategyParametersFields) {
    this.minBinId = fields.minBinId
    this.maxBinId = fields.maxBinId
    this.strategyType = fields.strategyType
    this.parameteres = fields.parameteres
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.i32("minBinId"),
        borsh.i32("maxBinId"),
        types.StrategyType.layout("strategyType"),
        borsh.array(borsh.u8(), 64, "parameteres"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new StrategyParameters({
      minBinId: obj.minBinId,
      maxBinId: obj.maxBinId,
      strategyType: types.StrategyType.fromDecoded(obj.strategyType),
      parameteres: obj.parameteres,
    })
  }

  static toEncodable(fields: StrategyParametersFields) {
    return {
      minBinId: fields.minBinId,
      maxBinId: fields.maxBinId,
      strategyType: fields.strategyType.toEncodable(),
      parameteres: fields.parameteres,
    }
  }

  toJSON(): StrategyParametersJSON {
    return {
      minBinId: this.minBinId,
      maxBinId: this.maxBinId,
      strategyType: this.strategyType.toJSON(),
      parameteres: this.parameteres,
    }
  }

  static fromJSON(obj: StrategyParametersJSON): StrategyParameters {
    return new StrategyParameters({
      minBinId: obj.minBinId,
      maxBinId: obj.maxBinId,
      strategyType: types.StrategyType.fromJSON(obj.strategyType),
      parameteres: obj.parameteres,
    })
  }

  toEncodable() {
    return StrategyParameters.toEncodable(this)
  }
}
