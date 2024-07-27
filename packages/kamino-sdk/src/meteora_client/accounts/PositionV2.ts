import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface PositionV2Fields {
  /** The LB pair of this position */
  lbPair: PublicKey
  /** Owner of the position. Client rely on this to to fetch their positions. */
  owner: PublicKey
  /** Liquidity shares of this position in bins (lower_bin_id <-> upper_bin_id). This is the same as LP concept. */
  liquidityShares: Array<BN>
  /** Farming reward information */
  rewardInfos: Array<types.UserRewardInfoFields>
  /** Swap fee to claim information */
  feeInfos: Array<types.FeeInfoFields>
  /** Lower bin ID */
  lowerBinId: number
  /** Upper bin ID */
  upperBinId: number
  /** Last updated timestamp */
  lastUpdatedAt: BN
  /** Total claimed token fee X */
  totalClaimedFeeXAmount: BN
  /** Total claimed token fee Y */
  totalClaimedFeeYAmount: BN
  /** Total claimed rewards */
  totalClaimedRewards: Array<BN>
  /** Operator of position */
  operator: PublicKey
  /** Slot which the locked liquidity can be withdraw */
  lockReleaseSlot: BN
  /** Is the position subjected to liquidity locking for the launch pool. */
  subjectedToBootstrapLiquidityLocking: number
  /** Address is able to claim fee in this position, only valid for bootstrap_liquidity_position */
  feeOwner: PublicKey
  /** Reserved space for future use */
  reserved: Array<number>
}

export interface PositionV2JSON {
  /** The LB pair of this position */
  lbPair: string
  /** Owner of the position. Client rely on this to to fetch their positions. */
  owner: string
  /** Liquidity shares of this position in bins (lower_bin_id <-> upper_bin_id). This is the same as LP concept. */
  liquidityShares: Array<string>
  /** Farming reward information */
  rewardInfos: Array<types.UserRewardInfoJSON>
  /** Swap fee to claim information */
  feeInfos: Array<types.FeeInfoJSON>
  /** Lower bin ID */
  lowerBinId: number
  /** Upper bin ID */
  upperBinId: number
  /** Last updated timestamp */
  lastUpdatedAt: string
  /** Total claimed token fee X */
  totalClaimedFeeXAmount: string
  /** Total claimed token fee Y */
  totalClaimedFeeYAmount: string
  /** Total claimed rewards */
  totalClaimedRewards: Array<string>
  /** Operator of position */
  operator: string
  /** Slot which the locked liquidity can be withdraw */
  lockReleaseSlot: string
  /** Is the position subjected to liquidity locking for the launch pool. */
  subjectedToBootstrapLiquidityLocking: number
  /** Address is able to claim fee in this position, only valid for bootstrap_liquidity_position */
  feeOwner: string
  /** Reserved space for future use */
  reserved: Array<number>
}

export class PositionV2 {
  /** The LB pair of this position */
  readonly lbPair: PublicKey
  /** Owner of the position. Client rely on this to to fetch their positions. */
  readonly owner: PublicKey
  /** Liquidity shares of this position in bins (lower_bin_id <-> upper_bin_id). This is the same as LP concept. */
  readonly liquidityShares: Array<BN>
  /** Farming reward information */
  readonly rewardInfos: Array<types.UserRewardInfo>
  /** Swap fee to claim information */
  readonly feeInfos: Array<types.FeeInfo>
  /** Lower bin ID */
  readonly lowerBinId: number
  /** Upper bin ID */
  readonly upperBinId: number
  /** Last updated timestamp */
  readonly lastUpdatedAt: BN
  /** Total claimed token fee X */
  readonly totalClaimedFeeXAmount: BN
  /** Total claimed token fee Y */
  readonly totalClaimedFeeYAmount: BN
  /** Total claimed rewards */
  readonly totalClaimedRewards: Array<BN>
  /** Operator of position */
  readonly operator: PublicKey
  /** Slot which the locked liquidity can be withdraw */
  readonly lockReleaseSlot: BN
  /** Is the position subjected to liquidity locking for the launch pool. */
  readonly subjectedToBootstrapLiquidityLocking: number
  /** Address is able to claim fee in this position, only valid for bootstrap_liquidity_position */
  readonly feeOwner: PublicKey
  /** Reserved space for future use */
  readonly reserved: Array<number>

  static readonly discriminator = Buffer.from([
    117, 176, 212, 199, 245, 180, 133, 182,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("lbPair"),
    borsh.publicKey("owner"),
    borsh.array(borsh.u128(), 70, "liquidityShares"),
    borsh.array(types.UserRewardInfo.layout(), 70, "rewardInfos"),
    borsh.array(types.FeeInfo.layout(), 70, "feeInfos"),
    borsh.i32("lowerBinId"),
    borsh.i32("upperBinId"),
    borsh.i64("lastUpdatedAt"),
    borsh.u64("totalClaimedFeeXAmount"),
    borsh.u64("totalClaimedFeeYAmount"),
    borsh.array(borsh.u64(), 2, "totalClaimedRewards"),
    borsh.publicKey("operator"),
    borsh.u64("lockReleaseSlot"),
    borsh.u8("subjectedToBootstrapLiquidityLocking"),
    borsh.publicKey("feeOwner"),
    borsh.array(borsh.u8(), 87, "reserved"),
  ])

  constructor(fields: PositionV2Fields) {
    this.lbPair = fields.lbPair
    this.owner = fields.owner
    this.liquidityShares = fields.liquidityShares
    this.rewardInfos = fields.rewardInfos.map(
      (item) => new types.UserRewardInfo({ ...item })
    )
    this.feeInfos = fields.feeInfos.map(
      (item) => new types.FeeInfo({ ...item })
    )
    this.lowerBinId = fields.lowerBinId
    this.upperBinId = fields.upperBinId
    this.lastUpdatedAt = fields.lastUpdatedAt
    this.totalClaimedFeeXAmount = fields.totalClaimedFeeXAmount
    this.totalClaimedFeeYAmount = fields.totalClaimedFeeYAmount
    this.totalClaimedRewards = fields.totalClaimedRewards
    this.operator = fields.operator
    this.lockReleaseSlot = fields.lockReleaseSlot
    this.subjectedToBootstrapLiquidityLocking =
      fields.subjectedToBootstrapLiquidityLocking
    this.feeOwner = fields.feeOwner
    this.reserved = fields.reserved
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<PositionV2 | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(programId)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[],
    programId: PublicKey = PROGRAM_ID
  ): Promise<Array<PositionV2 | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(programId)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): PositionV2 {
    if (!data.slice(0, 8).equals(PositionV2.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = PositionV2.layout.decode(data.slice(8))

    return new PositionV2({
      lbPair: dec.lbPair,
      owner: dec.owner,
      liquidityShares: dec.liquidityShares,
      rewardInfos: dec.rewardInfos.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.UserRewardInfo.fromDecoded(item)
      ),
      feeInfos: dec.feeInfos.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.FeeInfo.fromDecoded(item)
      ),
      lowerBinId: dec.lowerBinId,
      upperBinId: dec.upperBinId,
      lastUpdatedAt: dec.lastUpdatedAt,
      totalClaimedFeeXAmount: dec.totalClaimedFeeXAmount,
      totalClaimedFeeYAmount: dec.totalClaimedFeeYAmount,
      totalClaimedRewards: dec.totalClaimedRewards,
      operator: dec.operator,
      lockReleaseSlot: dec.lockReleaseSlot,
      subjectedToBootstrapLiquidityLocking:
        dec.subjectedToBootstrapLiquidityLocking,
      feeOwner: dec.feeOwner,
      reserved: dec.reserved,
    })
  }

  toJSON(): PositionV2JSON {
    return {
      lbPair: this.lbPair.toString(),
      owner: this.owner.toString(),
      liquidityShares: this.liquidityShares.map((item) => item.toString()),
      rewardInfos: this.rewardInfos.map((item) => item.toJSON()),
      feeInfos: this.feeInfos.map((item) => item.toJSON()),
      lowerBinId: this.lowerBinId,
      upperBinId: this.upperBinId,
      lastUpdatedAt: this.lastUpdatedAt.toString(),
      totalClaimedFeeXAmount: this.totalClaimedFeeXAmount.toString(),
      totalClaimedFeeYAmount: this.totalClaimedFeeYAmount.toString(),
      totalClaimedRewards: this.totalClaimedRewards.map((item) =>
        item.toString()
      ),
      operator: this.operator.toString(),
      lockReleaseSlot: this.lockReleaseSlot.toString(),
      subjectedToBootstrapLiquidityLocking:
        this.subjectedToBootstrapLiquidityLocking,
      feeOwner: this.feeOwner.toString(),
      reserved: this.reserved,
    }
  }

  static fromJSON(obj: PositionV2JSON): PositionV2 {
    return new PositionV2({
      lbPair: new PublicKey(obj.lbPair),
      owner: new PublicKey(obj.owner),
      liquidityShares: obj.liquidityShares.map((item) => new BN(item)),
      rewardInfos: obj.rewardInfos.map((item) =>
        types.UserRewardInfo.fromJSON(item)
      ),
      feeInfos: obj.feeInfos.map((item) => types.FeeInfo.fromJSON(item)),
      lowerBinId: obj.lowerBinId,
      upperBinId: obj.upperBinId,
      lastUpdatedAt: new BN(obj.lastUpdatedAt),
      totalClaimedFeeXAmount: new BN(obj.totalClaimedFeeXAmount),
      totalClaimedFeeYAmount: new BN(obj.totalClaimedFeeYAmount),
      totalClaimedRewards: obj.totalClaimedRewards.map((item) => new BN(item)),
      operator: new PublicKey(obj.operator),
      lockReleaseSlot: new BN(obj.lockReleaseSlot),
      subjectedToBootstrapLiquidityLocking:
        obj.subjectedToBootstrapLiquidityLocking,
      feeOwner: new PublicKey(obj.feeOwner),
      reserved: obj.reserved,
    })
  }
}
