import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface StakeSystemFields {
  stakeList: types.ListFields
  delayedUnstakeCoolingDown: BN
  stakeDepositBumpSeed: number
  stakeWithdrawBumpSeed: number
  /** set by admin, how much slots before the end of the epoch, stake-delta can start */
  slotsForStakeDelta: BN
  /**
   * Marks the start of stake-delta operations, meaning that if somebody starts a delayed-unstake ticket
   * after this var is set with epoch_num the ticket will have epoch_created = current_epoch+1
   * (the user must wait one more epoch, because their unstake-delta will be execute in this epoch)
   */
  lastStakeDeltaEpoch: BN
  minStake: BN
  /**
   * can be set by validator-manager-auth to allow a second run of stake-delta to stake late stakers in the last minute of the epoch
   * so we maximize user's rewards
   */
  extraStakeDeltaRuns: number
}

export interface StakeSystemJSON {
  stakeList: types.ListJSON
  delayedUnstakeCoolingDown: string
  stakeDepositBumpSeed: number
  stakeWithdrawBumpSeed: number
  /** set by admin, how much slots before the end of the epoch, stake-delta can start */
  slotsForStakeDelta: string
  /**
   * Marks the start of stake-delta operations, meaning that if somebody starts a delayed-unstake ticket
   * after this var is set with epoch_num the ticket will have epoch_created = current_epoch+1
   * (the user must wait one more epoch, because their unstake-delta will be execute in this epoch)
   */
  lastStakeDeltaEpoch: string
  minStake: string
  /**
   * can be set by validator-manager-auth to allow a second run of stake-delta to stake late stakers in the last minute of the epoch
   * so we maximize user's rewards
   */
  extraStakeDeltaRuns: number
}

export class StakeSystem {
  readonly stakeList: types.List
  readonly delayedUnstakeCoolingDown: BN
  readonly stakeDepositBumpSeed: number
  readonly stakeWithdrawBumpSeed: number
  /** set by admin, how much slots before the end of the epoch, stake-delta can start */
  readonly slotsForStakeDelta: BN
  /**
   * Marks the start of stake-delta operations, meaning that if somebody starts a delayed-unstake ticket
   * after this var is set with epoch_num the ticket will have epoch_created = current_epoch+1
   * (the user must wait one more epoch, because their unstake-delta will be execute in this epoch)
   */
  readonly lastStakeDeltaEpoch: BN
  readonly minStake: BN
  /**
   * can be set by validator-manager-auth to allow a second run of stake-delta to stake late stakers in the last minute of the epoch
   * so we maximize user's rewards
   */
  readonly extraStakeDeltaRuns: number

  constructor(fields: StakeSystemFields) {
    this.stakeList = new types.List({ ...fields.stakeList })
    this.delayedUnstakeCoolingDown = fields.delayedUnstakeCoolingDown
    this.stakeDepositBumpSeed = fields.stakeDepositBumpSeed
    this.stakeWithdrawBumpSeed = fields.stakeWithdrawBumpSeed
    this.slotsForStakeDelta = fields.slotsForStakeDelta
    this.lastStakeDeltaEpoch = fields.lastStakeDeltaEpoch
    this.minStake = fields.minStake
    this.extraStakeDeltaRuns = fields.extraStakeDeltaRuns
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        types.List.layout("stakeList"),
        borsh.u64("delayedUnstakeCoolingDown"),
        borsh.u8("stakeDepositBumpSeed"),
        borsh.u8("stakeWithdrawBumpSeed"),
        borsh.u64("slotsForStakeDelta"),
        borsh.u64("lastStakeDeltaEpoch"),
        borsh.u64("minStake"),
        borsh.u32("extraStakeDeltaRuns"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new StakeSystem({
      stakeList: types.List.fromDecoded(obj.stakeList),
      delayedUnstakeCoolingDown: obj.delayedUnstakeCoolingDown,
      stakeDepositBumpSeed: obj.stakeDepositBumpSeed,
      stakeWithdrawBumpSeed: obj.stakeWithdrawBumpSeed,
      slotsForStakeDelta: obj.slotsForStakeDelta,
      lastStakeDeltaEpoch: obj.lastStakeDeltaEpoch,
      minStake: obj.minStake,
      extraStakeDeltaRuns: obj.extraStakeDeltaRuns,
    })
  }

  static toEncodable(fields: StakeSystemFields) {
    return {
      stakeList: types.List.toEncodable(fields.stakeList),
      delayedUnstakeCoolingDown: fields.delayedUnstakeCoolingDown,
      stakeDepositBumpSeed: fields.stakeDepositBumpSeed,
      stakeWithdrawBumpSeed: fields.stakeWithdrawBumpSeed,
      slotsForStakeDelta: fields.slotsForStakeDelta,
      lastStakeDeltaEpoch: fields.lastStakeDeltaEpoch,
      minStake: fields.minStake,
      extraStakeDeltaRuns: fields.extraStakeDeltaRuns,
    }
  }

  toJSON(): StakeSystemJSON {
    return {
      stakeList: this.stakeList.toJSON(),
      delayedUnstakeCoolingDown: this.delayedUnstakeCoolingDown.toString(),
      stakeDepositBumpSeed: this.stakeDepositBumpSeed,
      stakeWithdrawBumpSeed: this.stakeWithdrawBumpSeed,
      slotsForStakeDelta: this.slotsForStakeDelta.toString(),
      lastStakeDeltaEpoch: this.lastStakeDeltaEpoch.toString(),
      minStake: this.minStake.toString(),
      extraStakeDeltaRuns: this.extraStakeDeltaRuns,
    }
  }

  static fromJSON(obj: StakeSystemJSON): StakeSystem {
    return new StakeSystem({
      stakeList: types.List.fromJSON(obj.stakeList),
      delayedUnstakeCoolingDown: new BN(obj.delayedUnstakeCoolingDown),
      stakeDepositBumpSeed: obj.stakeDepositBumpSeed,
      stakeWithdrawBumpSeed: obj.stakeWithdrawBumpSeed,
      slotsForStakeDelta: new BN(obj.slotsForStakeDelta),
      lastStakeDeltaEpoch: new BN(obj.lastStakeDeltaEpoch),
      minStake: new BN(obj.minStake),
      extraStakeDeltaRuns: obj.extraStakeDeltaRuns,
    })
  }

  toEncodable() {
    return StakeSystem.toEncodable(this)
  }
}
