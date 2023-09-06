import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface PositionFields {
  whirlpool: PublicKey
  positionMint: PublicKey
  liquidity: BN
  tickLowerIndex: number
  tickUpperIndex: number
  feeGrowthCheckpointA: BN
  feeOwedA: BN
  feeGrowthCheckpointB: BN
  feeOwedB: BN
  rewardInfos: Array<types.PositionRewardInfoFields>
}

export interface PositionJSON {
  whirlpool: string
  positionMint: string
  liquidity: string
  tickLowerIndex: number
  tickUpperIndex: number
  feeGrowthCheckpointA: string
  feeOwedA: string
  feeGrowthCheckpointB: string
  feeOwedB: string
  rewardInfos: Array<types.PositionRewardInfoJSON>
}

export class Position {
  readonly whirlpool: PublicKey
  readonly positionMint: PublicKey
  readonly liquidity: BN
  readonly tickLowerIndex: number
  readonly tickUpperIndex: number
  readonly feeGrowthCheckpointA: BN
  readonly feeOwedA: BN
  readonly feeGrowthCheckpointB: BN
  readonly feeOwedB: BN
  readonly rewardInfos: Array<types.PositionRewardInfo>

  static readonly discriminator = Buffer.from([
    170, 188, 143, 228, 122, 64, 247, 208,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("whirlpool"),
    borsh.publicKey("positionMint"),
    borsh.u128("liquidity"),
    borsh.i32("tickLowerIndex"),
    borsh.i32("tickUpperIndex"),
    borsh.u128("feeGrowthCheckpointA"),
    borsh.u64("feeOwedA"),
    borsh.u128("feeGrowthCheckpointB"),
    borsh.u64("feeOwedB"),
    borsh.array(types.PositionRewardInfo.layout(), 3, "rewardInfos"),
  ])

  constructor(fields: PositionFields) {
    this.whirlpool = fields.whirlpool
    this.positionMint = fields.positionMint
    this.liquidity = fields.liquidity
    this.tickLowerIndex = fields.tickLowerIndex
    this.tickUpperIndex = fields.tickUpperIndex
    this.feeGrowthCheckpointA = fields.feeGrowthCheckpointA
    this.feeOwedA = fields.feeOwedA
    this.feeGrowthCheckpointB = fields.feeGrowthCheckpointB
    this.feeOwedB = fields.feeOwedB
    this.rewardInfos = fields.rewardInfos.map(
      (item) => new types.PositionRewardInfo({ ...item })
    )
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<Position | null> {
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
  ): Promise<Array<Position | null>> {
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

  static decode(data: Buffer): Position {
    if (!data.slice(0, 8).equals(Position.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Position.layout.decode(data.slice(8))

    return new Position({
      whirlpool: dec.whirlpool,
      positionMint: dec.positionMint,
      liquidity: dec.liquidity,
      tickLowerIndex: dec.tickLowerIndex,
      tickUpperIndex: dec.tickUpperIndex,
      feeGrowthCheckpointA: dec.feeGrowthCheckpointA,
      feeOwedA: dec.feeOwedA,
      feeGrowthCheckpointB: dec.feeGrowthCheckpointB,
      feeOwedB: dec.feeOwedB,
      rewardInfos: dec.rewardInfos.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.PositionRewardInfo.fromDecoded(item)
      ),
    })
  }

  toJSON(): PositionJSON {
    return {
      whirlpool: this.whirlpool.toString(),
      positionMint: this.positionMint.toString(),
      liquidity: this.liquidity.toString(),
      tickLowerIndex: this.tickLowerIndex,
      tickUpperIndex: this.tickUpperIndex,
      feeGrowthCheckpointA: this.feeGrowthCheckpointA.toString(),
      feeOwedA: this.feeOwedA.toString(),
      feeGrowthCheckpointB: this.feeGrowthCheckpointB.toString(),
      feeOwedB: this.feeOwedB.toString(),
      rewardInfos: this.rewardInfos.map((item) => item.toJSON()),
    }
  }

  static fromJSON(obj: PositionJSON): Position {
    return new Position({
      whirlpool: new PublicKey(obj.whirlpool),
      positionMint: new PublicKey(obj.positionMint),
      liquidity: new BN(obj.liquidity),
      tickLowerIndex: obj.tickLowerIndex,
      tickUpperIndex: obj.tickUpperIndex,
      feeGrowthCheckpointA: new BN(obj.feeGrowthCheckpointA),
      feeOwedA: new BN(obj.feeOwedA),
      feeGrowthCheckpointB: new BN(obj.feeGrowthCheckpointB),
      feeOwedB: new BN(obj.feeOwedB),
      rewardInfos: obj.rewardInfos.map((item) =>
        types.PositionRewardInfo.fromJSON(item)
      ),
    })
  }
}
