import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface RebalanceAutodriftParamsFields {
  initDriftTicksPerEpoch: number
  ticksBelowMid: number
  ticksAboveMid: number
  frontrunMultiplierBps: number
  stakingRateASource: types.StakingRateSourceKind
  stakingRateBSource: types.StakingRateSourceKind
  initDriftDirection: types.DriftDirectionKind
}

export interface RebalanceAutodriftParamsJSON {
  initDriftTicksPerEpoch: number
  ticksBelowMid: number
  ticksAboveMid: number
  frontrunMultiplierBps: number
  stakingRateASource: types.StakingRateSourceJSON
  stakingRateBSource: types.StakingRateSourceJSON
  initDriftDirection: types.DriftDirectionJSON
}

export class RebalanceAutodriftParams {
  readonly initDriftTicksPerEpoch: number
  readonly ticksBelowMid: number
  readonly ticksAboveMid: number
  readonly frontrunMultiplierBps: number
  readonly stakingRateASource: types.StakingRateSourceKind
  readonly stakingRateBSource: types.StakingRateSourceKind
  readonly initDriftDirection: types.DriftDirectionKind

  constructor(fields: RebalanceAutodriftParamsFields) {
    this.initDriftTicksPerEpoch = fields.initDriftTicksPerEpoch
    this.ticksBelowMid = fields.ticksBelowMid
    this.ticksAboveMid = fields.ticksAboveMid
    this.frontrunMultiplierBps = fields.frontrunMultiplierBps
    this.stakingRateASource = fields.stakingRateASource
    this.stakingRateBSource = fields.stakingRateBSource
    this.initDriftDirection = fields.initDriftDirection
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u32("initDriftTicksPerEpoch"),
        borsh.i32("ticksBelowMid"),
        borsh.i32("ticksAboveMid"),
        borsh.u16("frontrunMultiplierBps"),
        types.StakingRateSource.layout("stakingRateASource"),
        types.StakingRateSource.layout("stakingRateBSource"),
        types.DriftDirection.layout("initDriftDirection"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new RebalanceAutodriftParams({
      initDriftTicksPerEpoch: obj.initDriftTicksPerEpoch,
      ticksBelowMid: obj.ticksBelowMid,
      ticksAboveMid: obj.ticksAboveMid,
      frontrunMultiplierBps: obj.frontrunMultiplierBps,
      stakingRateASource: types.StakingRateSource.fromDecoded(
        obj.stakingRateASource
      ),
      stakingRateBSource: types.StakingRateSource.fromDecoded(
        obj.stakingRateBSource
      ),
      initDriftDirection: types.DriftDirection.fromDecoded(
        obj.initDriftDirection
      ),
    })
  }

  static toEncodable(fields: RebalanceAutodriftParamsFields) {
    return {
      initDriftTicksPerEpoch: fields.initDriftTicksPerEpoch,
      ticksBelowMid: fields.ticksBelowMid,
      ticksAboveMid: fields.ticksAboveMid,
      frontrunMultiplierBps: fields.frontrunMultiplierBps,
      stakingRateASource: fields.stakingRateASource.toEncodable(),
      stakingRateBSource: fields.stakingRateBSource.toEncodable(),
      initDriftDirection: fields.initDriftDirection.toEncodable(),
    }
  }

  toJSON(): RebalanceAutodriftParamsJSON {
    return {
      initDriftTicksPerEpoch: this.initDriftTicksPerEpoch,
      ticksBelowMid: this.ticksBelowMid,
      ticksAboveMid: this.ticksAboveMid,
      frontrunMultiplierBps: this.frontrunMultiplierBps,
      stakingRateASource: this.stakingRateASource.toJSON(),
      stakingRateBSource: this.stakingRateBSource.toJSON(),
      initDriftDirection: this.initDriftDirection.toJSON(),
    }
  }

  static fromJSON(obj: RebalanceAutodriftParamsJSON): RebalanceAutodriftParams {
    return new RebalanceAutodriftParams({
      initDriftTicksPerEpoch: obj.initDriftTicksPerEpoch,
      ticksBelowMid: obj.ticksBelowMid,
      ticksAboveMid: obj.ticksAboveMid,
      frontrunMultiplierBps: obj.frontrunMultiplierBps,
      stakingRateASource: types.StakingRateSource.fromJSON(
        obj.stakingRateASource
      ),
      stakingRateBSource: types.StakingRateSource.fromJSON(
        obj.stakingRateBSource
      ),
      initDriftDirection: types.DriftDirection.fromJSON(obj.initDriftDirection),
    })
  }

  toEncodable() {
    return RebalanceAutodriftParams.toEncodable(this)
  }
}
