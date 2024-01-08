import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface StaticParametersFields {
  /** Used for base fee calculation. base_fee_rate = base_factor * bin_step */
  baseFactor: number
  /** Filter period determine high frequency trading time window. */
  filterPeriod: number
  /** Decay period determine when the volatile fee start decay / decrease. */
  decayPeriod: number
  /** Reduction factor controls the volatile fee rate decrement rate. */
  reductionFactor: number
  /** Used to scale the variable fee component depending on the dynamic of the market */
  variableFeeControl: number
  /** Maximum number of bin crossed can be accumulated. Used to cap volatile fee rate. */
  maxVolatilityAccumulator: number
  /** Min bin id supported by the pool based on the configured bin step. */
  minBinId: number
  /** Max bin id supported by the pool based on the configured bin step. */
  maxBinId: number
  /** Portion of swap fees retained by the protocol by controlling protocol_share parameter. protocol_swap_fee = protocol_share * total_swap_fee */
  protocolShare: number
  /** Padding for bytemuck safe alignment */
  padding: Array<number>
}

export interface StaticParametersJSON {
  /** Used for base fee calculation. base_fee_rate = base_factor * bin_step */
  baseFactor: number
  /** Filter period determine high frequency trading time window. */
  filterPeriod: number
  /** Decay period determine when the volatile fee start decay / decrease. */
  decayPeriod: number
  /** Reduction factor controls the volatile fee rate decrement rate. */
  reductionFactor: number
  /** Used to scale the variable fee component depending on the dynamic of the market */
  variableFeeControl: number
  /** Maximum number of bin crossed can be accumulated. Used to cap volatile fee rate. */
  maxVolatilityAccumulator: number
  /** Min bin id supported by the pool based on the configured bin step. */
  minBinId: number
  /** Max bin id supported by the pool based on the configured bin step. */
  maxBinId: number
  /** Portion of swap fees retained by the protocol by controlling protocol_share parameter. protocol_swap_fee = protocol_share * total_swap_fee */
  protocolShare: number
  /** Padding for bytemuck safe alignment */
  padding: Array<number>
}

/** Parameter that set by the protocol */
export class StaticParameters {
  /** Used for base fee calculation. base_fee_rate = base_factor * bin_step */
  readonly baseFactor: number
  /** Filter period determine high frequency trading time window. */
  readonly filterPeriod: number
  /** Decay period determine when the volatile fee start decay / decrease. */
  readonly decayPeriod: number
  /** Reduction factor controls the volatile fee rate decrement rate. */
  readonly reductionFactor: number
  /** Used to scale the variable fee component depending on the dynamic of the market */
  readonly variableFeeControl: number
  /** Maximum number of bin crossed can be accumulated. Used to cap volatile fee rate. */
  readonly maxVolatilityAccumulator: number
  /** Min bin id supported by the pool based on the configured bin step. */
  readonly minBinId: number
  /** Max bin id supported by the pool based on the configured bin step. */
  readonly maxBinId: number
  /** Portion of swap fees retained by the protocol by controlling protocol_share parameter. protocol_swap_fee = protocol_share * total_swap_fee */
  readonly protocolShare: number
  /** Padding for bytemuck safe alignment */
  readonly padding: Array<number>

  constructor(fields: StaticParametersFields) {
    this.baseFactor = fields.baseFactor
    this.filterPeriod = fields.filterPeriod
    this.decayPeriod = fields.decayPeriod
    this.reductionFactor = fields.reductionFactor
    this.variableFeeControl = fields.variableFeeControl
    this.maxVolatilityAccumulator = fields.maxVolatilityAccumulator
    this.minBinId = fields.minBinId
    this.maxBinId = fields.maxBinId
    this.protocolShare = fields.protocolShare
    this.padding = fields.padding
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u16("baseFactor"),
        borsh.u16("filterPeriod"),
        borsh.u16("decayPeriod"),
        borsh.u16("reductionFactor"),
        borsh.u32("variableFeeControl"),
        borsh.u32("maxVolatilityAccumulator"),
        borsh.i32("minBinId"),
        borsh.i32("maxBinId"),
        borsh.u16("protocolShare"),
        borsh.array(borsh.u8(), 6, "padding"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new StaticParameters({
      baseFactor: obj.baseFactor,
      filterPeriod: obj.filterPeriod,
      decayPeriod: obj.decayPeriod,
      reductionFactor: obj.reductionFactor,
      variableFeeControl: obj.variableFeeControl,
      maxVolatilityAccumulator: obj.maxVolatilityAccumulator,
      minBinId: obj.minBinId,
      maxBinId: obj.maxBinId,
      protocolShare: obj.protocolShare,
      padding: obj.padding,
    })
  }

  static toEncodable(fields: StaticParametersFields) {
    return {
      baseFactor: fields.baseFactor,
      filterPeriod: fields.filterPeriod,
      decayPeriod: fields.decayPeriod,
      reductionFactor: fields.reductionFactor,
      variableFeeControl: fields.variableFeeControl,
      maxVolatilityAccumulator: fields.maxVolatilityAccumulator,
      minBinId: fields.minBinId,
      maxBinId: fields.maxBinId,
      protocolShare: fields.protocolShare,
      padding: fields.padding,
    }
  }

  toJSON(): StaticParametersJSON {
    return {
      baseFactor: this.baseFactor,
      filterPeriod: this.filterPeriod,
      decayPeriod: this.decayPeriod,
      reductionFactor: this.reductionFactor,
      variableFeeControl: this.variableFeeControl,
      maxVolatilityAccumulator: this.maxVolatilityAccumulator,
      minBinId: this.minBinId,
      maxBinId: this.maxBinId,
      protocolShare: this.protocolShare,
      padding: this.padding,
    }
  }

  static fromJSON(obj: StaticParametersJSON): StaticParameters {
    return new StaticParameters({
      baseFactor: obj.baseFactor,
      filterPeriod: obj.filterPeriod,
      decayPeriod: obj.decayPeriod,
      reductionFactor: obj.reductionFactor,
      variableFeeControl: obj.variableFeeControl,
      maxVolatilityAccumulator: obj.maxVolatilityAccumulator,
      minBinId: obj.minBinId,
      maxBinId: obj.maxBinId,
      protocolShare: obj.protocolShare,
      padding: obj.padding,
    })
  }

  toEncodable() {
    return StaticParameters.toEncodable(this)
  }
}
