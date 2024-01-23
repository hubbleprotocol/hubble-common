import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface RewardInfoFields {
  /** Reward token mint. */
  mint: PublicKey
  /** Reward vault token account. */
  vault: PublicKey
  /** Authority account that allows to fund rewards */
  funder: PublicKey
  /** TODO check whether we need to store it in pool */
  rewardDuration: BN
  /** TODO check whether we need to store it in pool */
  rewardDurationEnd: BN
  /** TODO check whether we need to store it in pool */
  rewardRate: BN
  /** The last time reward states were updated. */
  lastUpdateTime: BN
  /** padding, ignored field */
  padding: Array<number>
}

export interface RewardInfoJSON {
  /** Reward token mint. */
  mint: string
  /** Reward vault token account. */
  vault: string
  /** Authority account that allows to fund rewards */
  funder: string
  /** TODO check whether we need to store it in pool */
  rewardDuration: string
  /** TODO check whether we need to store it in pool */
  rewardDurationEnd: string
  /** TODO check whether we need to store it in pool */
  rewardRate: string
  /** The last time reward states were updated. */
  lastUpdateTime: string
  /** padding, ignored field */
  padding: Array<number>
}

/** Stores the state relevant for tracking liquidity mining rewards */
export class RewardInfo {
  /** Reward token mint. */
  readonly mint: PublicKey
  /** Reward vault token account. */
  readonly vault: PublicKey
  /** Authority account that allows to fund rewards */
  readonly funder: PublicKey
  /** TODO check whether we need to store it in pool */
  readonly rewardDuration: BN
  /** TODO check whether we need to store it in pool */
  readonly rewardDurationEnd: BN
  /** TODO check whether we need to store it in pool */
  readonly rewardRate: BN
  /** The last time reward states were updated. */
  readonly lastUpdateTime: BN
  /** padding, ignored field */
  readonly padding: Array<number>

  constructor(fields: RewardInfoFields) {
    this.mint = fields.mint
    this.vault = fields.vault
    this.funder = fields.funder
    this.rewardDuration = fields.rewardDuration
    this.rewardDurationEnd = fields.rewardDurationEnd
    this.rewardRate = fields.rewardRate
    this.lastUpdateTime = fields.lastUpdateTime
    this.padding = fields.padding
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.publicKey("mint"),
        borsh.publicKey("vault"),
        borsh.publicKey("funder"),
        borsh.u64("rewardDuration"),
        borsh.u64("rewardDurationEnd"),
        borsh.u128("rewardRate"),
        borsh.u64("lastUpdateTime"),
        borsh.array(borsh.u8(), 8, "padding"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new RewardInfo({
      mint: obj.mint,
      vault: obj.vault,
      funder: obj.funder,
      rewardDuration: obj.rewardDuration,
      rewardDurationEnd: obj.rewardDurationEnd,
      rewardRate: obj.rewardRate,
      lastUpdateTime: obj.lastUpdateTime,
      padding: obj.padding,
    })
  }

  static toEncodable(fields: RewardInfoFields) {
    return {
      mint: fields.mint,
      vault: fields.vault,
      funder: fields.funder,
      rewardDuration: fields.rewardDuration,
      rewardDurationEnd: fields.rewardDurationEnd,
      rewardRate: fields.rewardRate,
      lastUpdateTime: fields.lastUpdateTime,
      padding: fields.padding,
    }
  }

  toJSON(): RewardInfoJSON {
    return {
      mint: this.mint.toString(),
      vault: this.vault.toString(),
      funder: this.funder.toString(),
      rewardDuration: this.rewardDuration.toString(),
      rewardDurationEnd: this.rewardDurationEnd.toString(),
      rewardRate: this.rewardRate.toString(),
      lastUpdateTime: this.lastUpdateTime.toString(),
      padding: this.padding,
    }
  }

  static fromJSON(obj: RewardInfoJSON): RewardInfo {
    return new RewardInfo({
      mint: new PublicKey(obj.mint),
      vault: new PublicKey(obj.vault),
      funder: new PublicKey(obj.funder),
      rewardDuration: new BN(obj.rewardDuration),
      rewardDurationEnd: new BN(obj.rewardDurationEnd),
      rewardRate: new BN(obj.rewardRate),
      lastUpdateTime: new BN(obj.lastUpdateTime),
      padding: obj.padding,
    })
  }

  toEncodable() {
    return RewardInfo.toEncodable(this)
  }
}
