import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface PersonalPositionStateFields {
  /** Bump to identify PDA */
  bump: number
  /** Mint address of the tokenized position */
  nftMint: PublicKey
  /** The ID of the pool with which this token is connected */
  poolId: PublicKey
  /** The lower bound tick of the position */
  tickLowerIndex: number
  /** The upper bound tick of the position */
  tickUpperIndex: number
  /** The amount of liquidity owned by this position */
  liquidity: BN
  /** The token_0 fee growth of the aggregate position as of the last action on the individual position */
  feeGrowthInside0LastX64: BN
  /** The token_1 fee growth of the aggregate position as of the last action on the individual position */
  feeGrowthInside1LastX64: BN
  /** The fees owed to the position owner in token_0, as of the last computation */
  tokenFeesOwed0: BN
  /** The fees owed to the position owner in token_1, as of the last computation */
  tokenFeesOwed1: BN
  rewardInfos: Array<types.PositionRewardInfoFields>
  padding: Array<BN>
}

export interface PersonalPositionStateJSON {
  /** Bump to identify PDA */
  bump: number
  /** Mint address of the tokenized position */
  nftMint: string
  /** The ID of the pool with which this token is connected */
  poolId: string
  /** The lower bound tick of the position */
  tickLowerIndex: number
  /** The upper bound tick of the position */
  tickUpperIndex: number
  /** The amount of liquidity owned by this position */
  liquidity: string
  /** The token_0 fee growth of the aggregate position as of the last action on the individual position */
  feeGrowthInside0LastX64: string
  /** The token_1 fee growth of the aggregate position as of the last action on the individual position */
  feeGrowthInside1LastX64: string
  /** The fees owed to the position owner in token_0, as of the last computation */
  tokenFeesOwed0: string
  /** The fees owed to the position owner in token_1, as of the last computation */
  tokenFeesOwed1: string
  rewardInfos: Array<types.PositionRewardInfoJSON>
  padding: Array<string>
}

export class PersonalPositionState {
  /** Bump to identify PDA */
  readonly bump: number
  /** Mint address of the tokenized position */
  readonly nftMint: PublicKey
  /** The ID of the pool with which this token is connected */
  readonly poolId: PublicKey
  /** The lower bound tick of the position */
  readonly tickLowerIndex: number
  /** The upper bound tick of the position */
  readonly tickUpperIndex: number
  /** The amount of liquidity owned by this position */
  readonly liquidity: BN
  /** The token_0 fee growth of the aggregate position as of the last action on the individual position */
  readonly feeGrowthInside0LastX64: BN
  /** The token_1 fee growth of the aggregate position as of the last action on the individual position */
  readonly feeGrowthInside1LastX64: BN
  /** The fees owed to the position owner in token_0, as of the last computation */
  readonly tokenFeesOwed0: BN
  /** The fees owed to the position owner in token_1, as of the last computation */
  readonly tokenFeesOwed1: BN
  readonly rewardInfos: Array<types.PositionRewardInfo>
  readonly padding: Array<BN>

  static readonly discriminator = Buffer.from([
    70, 111, 150, 126, 230, 15, 25, 117,
  ])

  static readonly layout = borsh.struct([
    borsh.u8("bump"),
    borsh.publicKey("nftMint"),
    borsh.publicKey("poolId"),
    borsh.i32("tickLowerIndex"),
    borsh.i32("tickUpperIndex"),
    borsh.u128("liquidity"),
    borsh.u128("feeGrowthInside0LastX64"),
    borsh.u128("feeGrowthInside1LastX64"),
    borsh.u64("tokenFeesOwed0"),
    borsh.u64("tokenFeesOwed1"),
    borsh.array(types.PositionRewardInfo.layout(), 3, "rewardInfos"),
    borsh.array(borsh.u64(), 8, "padding"),
  ])

  constructor(fields: PersonalPositionStateFields) {
    this.bump = fields.bump
    this.nftMint = fields.nftMint
    this.poolId = fields.poolId
    this.tickLowerIndex = fields.tickLowerIndex
    this.tickUpperIndex = fields.tickUpperIndex
    this.liquidity = fields.liquidity
    this.feeGrowthInside0LastX64 = fields.feeGrowthInside0LastX64
    this.feeGrowthInside1LastX64 = fields.feeGrowthInside1LastX64
    this.tokenFeesOwed0 = fields.tokenFeesOwed0
    this.tokenFeesOwed1 = fields.tokenFeesOwed1
    this.rewardInfos = fields.rewardInfos.map(
      (item) => new types.PositionRewardInfo({ ...item })
    )
    this.padding = fields.padding
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<PersonalPositionState | null> {
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
  ): Promise<Array<PersonalPositionState | null>> {
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

  static decode(data: Buffer): PersonalPositionState {
    if (!data.slice(0, 8).equals(PersonalPositionState.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = PersonalPositionState.layout.decode(data.slice(8))

    return new PersonalPositionState({
      bump: dec.bump,
      nftMint: dec.nftMint,
      poolId: dec.poolId,
      tickLowerIndex: dec.tickLowerIndex,
      tickUpperIndex: dec.tickUpperIndex,
      liquidity: dec.liquidity,
      feeGrowthInside0LastX64: dec.feeGrowthInside0LastX64,
      feeGrowthInside1LastX64: dec.feeGrowthInside1LastX64,
      tokenFeesOwed0: dec.tokenFeesOwed0,
      tokenFeesOwed1: dec.tokenFeesOwed1,
      rewardInfos: dec.rewardInfos.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.PositionRewardInfo.fromDecoded(item)
      ),
      padding: dec.padding,
    })
  }

  toJSON(): PersonalPositionStateJSON {
    return {
      bump: this.bump,
      nftMint: this.nftMint.toString(),
      poolId: this.poolId.toString(),
      tickLowerIndex: this.tickLowerIndex,
      tickUpperIndex: this.tickUpperIndex,
      liquidity: this.liquidity.toString(),
      feeGrowthInside0LastX64: this.feeGrowthInside0LastX64.toString(),
      feeGrowthInside1LastX64: this.feeGrowthInside1LastX64.toString(),
      tokenFeesOwed0: this.tokenFeesOwed0.toString(),
      tokenFeesOwed1: this.tokenFeesOwed1.toString(),
      rewardInfos: this.rewardInfos.map((item) => item.toJSON()),
      padding: this.padding.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: PersonalPositionStateJSON): PersonalPositionState {
    return new PersonalPositionState({
      bump: obj.bump,
      nftMint: new PublicKey(obj.nftMint),
      poolId: new PublicKey(obj.poolId),
      tickLowerIndex: obj.tickLowerIndex,
      tickUpperIndex: obj.tickUpperIndex,
      liquidity: new BN(obj.liquidity),
      feeGrowthInside0LastX64: new BN(obj.feeGrowthInside0LastX64),
      feeGrowthInside1LastX64: new BN(obj.feeGrowthInside1LastX64),
      tokenFeesOwed0: new BN(obj.tokenFeesOwed0),
      tokenFeesOwed1: new BN(obj.tokenFeesOwed1),
      rewardInfos: obj.rewardInfos.map((item) =>
        types.PositionRewardInfo.fromJSON(item)
      ),
      padding: obj.padding.map((item) => new BN(item)),
    })
  }
}
