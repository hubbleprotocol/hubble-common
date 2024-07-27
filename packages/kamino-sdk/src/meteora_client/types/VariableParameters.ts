import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface VariableParametersFields {
  /**
   * Volatility accumulator measure the number of bin crossed since reference bin ID. Normally (without filter period taken into consideration), reference bin ID is the active bin of last swap.
   * It affects the variable fee rate
   */
  volatilityAccumulator: number
  /** Volatility reference is decayed volatility accumulator. It is always <= volatility_accumulator */
  volatilityReference: number
  /** Active bin id of last swap. */
  indexReference: number
  /** Padding for bytemuck safe alignment */
  padding: Array<number>
  /** Last timestamp the variable parameters was updated */
  lastUpdateTimestamp: BN
  /** Padding for bytemuck safe alignment */
  padding1: Array<number>
}

export interface VariableParametersJSON {
  /**
   * Volatility accumulator measure the number of bin crossed since reference bin ID. Normally (without filter period taken into consideration), reference bin ID is the active bin of last swap.
   * It affects the variable fee rate
   */
  volatilityAccumulator: number
  /** Volatility reference is decayed volatility accumulator. It is always <= volatility_accumulator */
  volatilityReference: number
  /** Active bin id of last swap. */
  indexReference: number
  /** Padding for bytemuck safe alignment */
  padding: Array<number>
  /** Last timestamp the variable parameters was updated */
  lastUpdateTimestamp: string
  /** Padding for bytemuck safe alignment */
  padding1: Array<number>
}

/** Parameters that changes based on dynamic of the market */
export class VariableParameters {
  /**
   * Volatility accumulator measure the number of bin crossed since reference bin ID. Normally (without filter period taken into consideration), reference bin ID is the active bin of last swap.
   * It affects the variable fee rate
   */
  readonly volatilityAccumulator: number
  /** Volatility reference is decayed volatility accumulator. It is always <= volatility_accumulator */
  readonly volatilityReference: number
  /** Active bin id of last swap. */
  readonly indexReference: number
  /** Padding for bytemuck safe alignment */
  readonly padding: Array<number>
  /** Last timestamp the variable parameters was updated */
  readonly lastUpdateTimestamp: BN
  /** Padding for bytemuck safe alignment */
  readonly padding1: Array<number>

  constructor(fields: VariableParametersFields) {
    this.volatilityAccumulator = fields.volatilityAccumulator
    this.volatilityReference = fields.volatilityReference
    this.indexReference = fields.indexReference
    this.padding = fields.padding
    this.lastUpdateTimestamp = fields.lastUpdateTimestamp
    this.padding1 = fields.padding1
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u32("volatilityAccumulator"),
        borsh.u32("volatilityReference"),
        borsh.i32("indexReference"),
        borsh.array(borsh.u8(), 4, "padding"),
        borsh.i64("lastUpdateTimestamp"),
        borsh.array(borsh.u8(), 8, "padding1"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new VariableParameters({
      volatilityAccumulator: obj.volatilityAccumulator,
      volatilityReference: obj.volatilityReference,
      indexReference: obj.indexReference,
      padding: obj.padding,
      lastUpdateTimestamp: obj.lastUpdateTimestamp,
      padding1: obj.padding1,
    })
  }

  static toEncodable(fields: VariableParametersFields) {
    return {
      volatilityAccumulator: fields.volatilityAccumulator,
      volatilityReference: fields.volatilityReference,
      indexReference: fields.indexReference,
      padding: fields.padding,
      lastUpdateTimestamp: fields.lastUpdateTimestamp,
      padding1: fields.padding1,
    }
  }

  toJSON(): VariableParametersJSON {
    return {
      volatilityAccumulator: this.volatilityAccumulator,
      volatilityReference: this.volatilityReference,
      indexReference: this.indexReference,
      padding: this.padding,
      lastUpdateTimestamp: this.lastUpdateTimestamp.toString(),
      padding1: this.padding1,
    }
  }

  static fromJSON(obj: VariableParametersJSON): VariableParameters {
    return new VariableParameters({
      volatilityAccumulator: obj.volatilityAccumulator,
      volatilityReference: obj.volatilityReference,
      indexReference: obj.indexReference,
      padding: obj.padding,
      lastUpdateTimestamp: new BN(obj.lastUpdateTimestamp),
      padding1: obj.padding1,
    })
  }

  toEncodable() {
    return VariableParameters.toEncodable(this)
  }
}
