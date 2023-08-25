import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ProtocolPositionStateFields {
  /** Bump to identify PDA */
  bump: number
  /** The ID of the pool with which this token is connected */
  poolId: PublicKey
  /** The lower bound tick of the position */
  tickLowerIndex: number
  /** The upper bound tick of the position */
  tickUpperIndex: number
  /** The amount of liquidity owned by this position */
  liquidity: BN
  /** The token_0 fee growth per unit of liquidity as of the last update to liquidity or fees owed */
  feeGrowthInside0LastX64: BN
  /** The token_1 fee growth per unit of liquidity as of the last update to liquidity or fees owed */
  feeGrowthInside1LastX64: BN
  /** The fees owed to the position owner in token_0 */
  tokenFeesOwed0: BN
  /** The fees owed to the position owner in token_1 */
  tokenFeesOwed1: BN
  /** The reward growth per unit of liquidity as of the last update to liquidity */
  rewardGrowthInside: Array<BN>
  padding: Array<BN>
}

export interface ProtocolPositionStateJSON {
  /** Bump to identify PDA */
  bump: number
  /** The ID of the pool with which this token is connected */
  poolId: string
  /** The lower bound tick of the position */
  tickLowerIndex: number
  /** The upper bound tick of the position */
  tickUpperIndex: number
  /** The amount of liquidity owned by this position */
  liquidity: string
  /** The token_0 fee growth per unit of liquidity as of the last update to liquidity or fees owed */
  feeGrowthInside0LastX64: string
  /** The token_1 fee growth per unit of liquidity as of the last update to liquidity or fees owed */
  feeGrowthInside1LastX64: string
  /** The fees owed to the position owner in token_0 */
  tokenFeesOwed0: string
  /** The fees owed to the position owner in token_1 */
  tokenFeesOwed1: string
  /** The reward growth per unit of liquidity as of the last update to liquidity */
  rewardGrowthInside: Array<string>
  padding: Array<string>
}

export class ProtocolPositionState {
  /** Bump to identify PDA */
  readonly bump: number
  /** The ID of the pool with which this token is connected */
  readonly poolId: PublicKey
  /** The lower bound tick of the position */
  readonly tickLowerIndex: number
  /** The upper bound tick of the position */
  readonly tickUpperIndex: number
  /** The amount of liquidity owned by this position */
  readonly liquidity: BN
  /** The token_0 fee growth per unit of liquidity as of the last update to liquidity or fees owed */
  readonly feeGrowthInside0LastX64: BN
  /** The token_1 fee growth per unit of liquidity as of the last update to liquidity or fees owed */
  readonly feeGrowthInside1LastX64: BN
  /** The fees owed to the position owner in token_0 */
  readonly tokenFeesOwed0: BN
  /** The fees owed to the position owner in token_1 */
  readonly tokenFeesOwed1: BN
  /** The reward growth per unit of liquidity as of the last update to liquidity */
  readonly rewardGrowthInside: Array<BN>
  readonly padding: Array<BN>

  static readonly discriminator = Buffer.from([
    100, 226, 145, 99, 146, 218, 160, 106,
  ])

  static readonly layout = borsh.struct([
    borsh.u8("bump"),
    borsh.publicKey("poolId"),
    borsh.i32("tickLowerIndex"),
    borsh.i32("tickUpperIndex"),
    borsh.u128("liquidity"),
    borsh.u128("feeGrowthInside0LastX64"),
    borsh.u128("feeGrowthInside1LastX64"),
    borsh.u64("tokenFeesOwed0"),
    borsh.u64("tokenFeesOwed1"),
    borsh.array(borsh.u128(), 3, "rewardGrowthInside"),
    borsh.array(borsh.u64(), 8, "padding"),
  ])

  constructor(fields: ProtocolPositionStateFields) {
    this.bump = fields.bump
    this.poolId = fields.poolId
    this.tickLowerIndex = fields.tickLowerIndex
    this.tickUpperIndex = fields.tickUpperIndex
    this.liquidity = fields.liquidity
    this.feeGrowthInside0LastX64 = fields.feeGrowthInside0LastX64
    this.feeGrowthInside1LastX64 = fields.feeGrowthInside1LastX64
    this.tokenFeesOwed0 = fields.tokenFeesOwed0
    this.tokenFeesOwed1 = fields.tokenFeesOwed1
    this.rewardGrowthInside = fields.rewardGrowthInside
    this.padding = fields.padding
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<ProtocolPositionState | null> {
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
  ): Promise<Array<ProtocolPositionState | null>> {
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

  static decode(data: Buffer): ProtocolPositionState {
    if (!data.slice(0, 8).equals(ProtocolPositionState.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = ProtocolPositionState.layout.decode(data.slice(8))

    return new ProtocolPositionState({
      bump: dec.bump,
      poolId: dec.poolId,
      tickLowerIndex: dec.tickLowerIndex,
      tickUpperIndex: dec.tickUpperIndex,
      liquidity: dec.liquidity,
      feeGrowthInside0LastX64: dec.feeGrowthInside0LastX64,
      feeGrowthInside1LastX64: dec.feeGrowthInside1LastX64,
      tokenFeesOwed0: dec.tokenFeesOwed0,
      tokenFeesOwed1: dec.tokenFeesOwed1,
      rewardGrowthInside: dec.rewardGrowthInside,
      padding: dec.padding,
    })
  }

  toJSON(): ProtocolPositionStateJSON {
    return {
      bump: this.bump,
      poolId: this.poolId.toString(),
      tickLowerIndex: this.tickLowerIndex,
      tickUpperIndex: this.tickUpperIndex,
      liquidity: this.liquidity.toString(),
      feeGrowthInside0LastX64: this.feeGrowthInside0LastX64.toString(),
      feeGrowthInside1LastX64: this.feeGrowthInside1LastX64.toString(),
      tokenFeesOwed0: this.tokenFeesOwed0.toString(),
      tokenFeesOwed1: this.tokenFeesOwed1.toString(),
      rewardGrowthInside: this.rewardGrowthInside.map((item) =>
        item.toString()
      ),
      padding: this.padding.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: ProtocolPositionStateJSON): ProtocolPositionState {
    return new ProtocolPositionState({
      bump: obj.bump,
      poolId: new PublicKey(obj.poolId),
      tickLowerIndex: obj.tickLowerIndex,
      tickUpperIndex: obj.tickUpperIndex,
      liquidity: new BN(obj.liquidity),
      feeGrowthInside0LastX64: new BN(obj.feeGrowthInside0LastX64),
      feeGrowthInside1LastX64: new BN(obj.feeGrowthInside1LastX64),
      tokenFeesOwed0: new BN(obj.tokenFeesOwed0),
      tokenFeesOwed1: new BN(obj.tokenFeesOwed1),
      rewardGrowthInside: obj.rewardGrowthInside.map((item) => new BN(item)),
      padding: obj.padding.map((item) => new BN(item)),
    })
  }
}
