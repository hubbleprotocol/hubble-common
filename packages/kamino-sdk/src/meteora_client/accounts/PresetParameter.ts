import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface PresetParameterFields {
  /** Bin step. Represent the price increment / decrement. */
  binStep: number
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
}

export interface PresetParameterJSON {
  /** Bin step. Represent the price increment / decrement. */
  binStep: number
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
}

export class PresetParameter {
  /** Bin step. Represent the price increment / decrement. */
  readonly binStep: number
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

  static readonly discriminator = Buffer.from([
    242, 62, 244, 34, 181, 112, 58, 170,
  ])

  static readonly layout = borsh.struct([
    borsh.u16("binStep"),
    borsh.u16("baseFactor"),
    borsh.u16("filterPeriod"),
    borsh.u16("decayPeriod"),
    borsh.u16("reductionFactor"),
    borsh.u32("variableFeeControl"),
    borsh.u32("maxVolatilityAccumulator"),
    borsh.i32("minBinId"),
    borsh.i32("maxBinId"),
    borsh.u16("protocolShare"),
  ])

  constructor(fields: PresetParameterFields) {
    this.binStep = fields.binStep
    this.baseFactor = fields.baseFactor
    this.filterPeriod = fields.filterPeriod
    this.decayPeriod = fields.decayPeriod
    this.reductionFactor = fields.reductionFactor
    this.variableFeeControl = fields.variableFeeControl
    this.maxVolatilityAccumulator = fields.maxVolatilityAccumulator
    this.minBinId = fields.minBinId
    this.maxBinId = fields.maxBinId
    this.protocolShare = fields.protocolShare
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<PresetParameter | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<PresetParameter | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): PresetParameter {
    if (!data.slice(0, 8).equals(PresetParameter.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = PresetParameter.layout.decode(data.slice(8))

    return new PresetParameter({
      binStep: dec.binStep,
      baseFactor: dec.baseFactor,
      filterPeriod: dec.filterPeriod,
      decayPeriod: dec.decayPeriod,
      reductionFactor: dec.reductionFactor,
      variableFeeControl: dec.variableFeeControl,
      maxVolatilityAccumulator: dec.maxVolatilityAccumulator,
      minBinId: dec.minBinId,
      maxBinId: dec.maxBinId,
      protocolShare: dec.protocolShare,
    })
  }

  toJSON(): PresetParameterJSON {
    return {
      binStep: this.binStep,
      baseFactor: this.baseFactor,
      filterPeriod: this.filterPeriod,
      decayPeriod: this.decayPeriod,
      reductionFactor: this.reductionFactor,
      variableFeeControl: this.variableFeeControl,
      maxVolatilityAccumulator: this.maxVolatilityAccumulator,
      minBinId: this.minBinId,
      maxBinId: this.maxBinId,
      protocolShare: this.protocolShare,
    }
  }

  static fromJSON(obj: PresetParameterJSON): PresetParameter {
    return new PresetParameter({
      binStep: obj.binStep,
      baseFactor: obj.baseFactor,
      filterPeriod: obj.filterPeriod,
      decayPeriod: obj.decayPeriod,
      reductionFactor: obj.reductionFactor,
      variableFeeControl: obj.variableFeeControl,
      maxVolatilityAccumulator: obj.maxVolatilityAccumulator,
      minBinId: obj.minBinId,
      maxBinId: obj.maxBinId,
      protocolShare: obj.protocolShare,
    })
  }
}
