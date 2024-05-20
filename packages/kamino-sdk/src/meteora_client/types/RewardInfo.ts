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
  /** Accumulated seconds where when farm distribute rewards, but the bin is empty. The reward will be accumulated for next reward time window. */
  cumulativeSecondsWithEmptyLiquidityReward: BN
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
  /** Accumulated seconds where when farm distribute rewards, but the bin is empty. The reward will be accumulated for next reward time window. */
  cumulativeSecondsWithEmptyLiquidityReward: string
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
  /** Accumulated seconds where when farm distribute rewards, but the bin is empty. The reward will be accumulated for next reward time window. */
  readonly cumulativeSecondsWithEmptyLiquidityReward: BN

  constructor(fields: RewardInfoFields) {
    this.mint = fields.mint
    this.vault = fields.vault
    this.funder = fields.funder
    this.rewardDuration = fields.rewardDuration
    this.rewardDurationEnd = fields.rewardDurationEnd
    this.rewardRate = fields.rewardRate
    this.lastUpdateTime = fields.lastUpdateTime
    this.cumulativeSecondsWithEmptyLiquidityReward =
      fields.cumulativeSecondsWithEmptyLiquidityReward
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
        borsh.u64("cumulativeSecondsWithEmptyLiquidityReward"),
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
      cumulativeSecondsWithEmptyLiquidityReward:
        obj.cumulativeSecondsWithEmptyLiquidityReward,
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
      cumulativeSecondsWithEmptyLiquidityReward:
        fields.cumulativeSecondsWithEmptyLiquidityReward,
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
      cumulativeSecondsWithEmptyLiquidityReward:
        this.cumulativeSecondsWithEmptyLiquidityReward.toString(),
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
      cumulativeSecondsWithEmptyLiquidityReward: new BN(
        obj.cumulativeSecondsWithEmptyLiquidityReward
      ),
    })
  }

  toEncodable() {
    return RewardInfo.toEncodable(this)
  }
}
