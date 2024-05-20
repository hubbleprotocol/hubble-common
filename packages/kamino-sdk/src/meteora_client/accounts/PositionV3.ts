import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface PositionV3Fields {
  /** The LB pair of this position */
  lbPair: PublicKey
  /** Owner of the position. Client rely on this to to fetch their positions. */
  owner: PublicKey
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
  /** Padding */
  padding0: Array<number>
  /** Address is able to claim fee in this position, only valid for bootstrap_liquidity_position */
  feeOwner: PublicKey
  /** Number of bins */
  length: BN
  /** Reserved space for future use */
  reserved: Array<number>
}

export interface PositionV3JSON {
  /** The LB pair of this position */
  lbPair: string
  /** Owner of the position. Client rely on this to to fetch their positions. */
  owner: string
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
  /** Padding */
  padding0: Array<number>
  /** Address is able to claim fee in this position, only valid for bootstrap_liquidity_position */
  feeOwner: string
  /** Number of bins */
  length: string
  /** Reserved space for future use */
  reserved: Array<number>
}

export class PositionV3 {
  /** The LB pair of this position */
  readonly lbPair: PublicKey
  /** Owner of the position. Client rely on this to to fetch their positions. */
  readonly owner: PublicKey
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
  /** Padding */
  readonly padding0: Array<number>
  /** Address is able to claim fee in this position, only valid for bootstrap_liquidity_position */
  readonly feeOwner: PublicKey
  /** Number of bins */
  readonly length: BN
  /** Reserved space for future use */
  readonly reserved: Array<number>

  static readonly discriminator = Buffer.from([
    194, 247, 171, 54, 106, 219, 96, 51,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("lbPair"),
    borsh.publicKey("owner"),
    borsh.i32("lowerBinId"),
    borsh.i32("upperBinId"),
    borsh.i64("lastUpdatedAt"),
    borsh.u64("totalClaimedFeeXAmount"),
    borsh.u64("totalClaimedFeeYAmount"),
    borsh.array(borsh.u64(), 2, "totalClaimedRewards"),
    borsh.publicKey("operator"),
    borsh.u64("lockReleaseSlot"),
    borsh.u8("subjectedToBootstrapLiquidityLocking"),
    borsh.array(borsh.u8(), 7, "padding0"),
    borsh.publicKey("feeOwner"),
    borsh.u64("length"),
    borsh.array(borsh.u8(), 128, "reserved"),
  ])

  constructor(fields: PositionV3Fields) {
    this.lbPair = fields.lbPair
    this.owner = fields.owner
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
    this.padding0 = fields.padding0
    this.feeOwner = fields.feeOwner
    this.length = fields.length
    this.reserved = fields.reserved
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<PositionV3 | null> {
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
  ): Promise<Array<PositionV3 | null>> {
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

  static decode(data: Buffer): PositionV3 {
    if (!data.slice(0, 8).equals(PositionV3.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = PositionV3.layout.decode(data.slice(8))

    return new PositionV3({
      lbPair: dec.lbPair,
      owner: dec.owner,
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
      padding0: dec.padding0,
      feeOwner: dec.feeOwner,
      length: dec.length,
      reserved: dec.reserved,
    })
  }

  toJSON(): PositionV3JSON {
    return {
      lbPair: this.lbPair.toString(),
      owner: this.owner.toString(),
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
      padding0: this.padding0,
      feeOwner: this.feeOwner.toString(),
      length: this.length.toString(),
      reserved: this.reserved,
    }
  }

  static fromJSON(obj: PositionV3JSON): PositionV3 {
    return new PositionV3({
      lbPair: new PublicKey(obj.lbPair),
      owner: new PublicKey(obj.owner),
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
      padding0: obj.padding0,
      feeOwner: new PublicKey(obj.feeOwner),
      length: new BN(obj.length),
      reserved: obj.reserved,
    })
  }
}
