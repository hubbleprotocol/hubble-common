import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface PoolFields {
  name: string
  custodies: Array<PublicKey>
  aumUsd: BN
  limit: types.LimitFields
  fees: types.FeesFields
  poolApr: types.PoolAprFields
  maxRequestExecutionSec: BN
  bump: number
  lpTokenBump: number
  inceptionTime: BN
}

export interface PoolJSON {
  name: string
  custodies: Array<string>
  aumUsd: string
  limit: types.LimitJSON
  fees: types.FeesJSON
  poolApr: types.PoolAprJSON
  maxRequestExecutionSec: string
  bump: number
  lpTokenBump: number
  inceptionTime: string
}

export class Pool {
  readonly name: string
  readonly custodies: Array<PublicKey>
  readonly aumUsd: BN
  readonly limit: types.Limit
  readonly fees: types.Fees
  readonly poolApr: types.PoolApr
  readonly maxRequestExecutionSec: BN
  readonly bump: number
  readonly lpTokenBump: number
  readonly inceptionTime: BN

  static readonly discriminator = Buffer.from([
    241, 154, 109, 4, 17, 177, 109, 188,
  ])

  static readonly layout = borsh.struct([
    borsh.str("name"),
    borsh.vec(borsh.publicKey(), "custodies"),
    borsh.u128("aumUsd"),
    types.Limit.layout("limit"),
    types.Fees.layout("fees"),
    types.PoolApr.layout("poolApr"),
    borsh.i64("maxRequestExecutionSec"),
    borsh.u8("bump"),
    borsh.u8("lpTokenBump"),
    borsh.i64("inceptionTime"),
  ])

  constructor(fields: PoolFields) {
    this.name = fields.name
    this.custodies = fields.custodies
    this.aumUsd = fields.aumUsd
    this.limit = new types.Limit({ ...fields.limit })
    this.fees = new types.Fees({ ...fields.fees })
    this.poolApr = new types.PoolApr({ ...fields.poolApr })
    this.maxRequestExecutionSec = fields.maxRequestExecutionSec
    this.bump = fields.bump
    this.lpTokenBump = fields.lpTokenBump
    this.inceptionTime = fields.inceptionTime
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<Pool | null> {
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
  ): Promise<Array<Pool | null>> {
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

  static decode(data: Buffer): Pool {
    if (!data.slice(0, 8).equals(Pool.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Pool.layout.decode(data.slice(8))

    return new Pool({
      name: dec.name,
      custodies: dec.custodies,
      aumUsd: dec.aumUsd,
      limit: types.Limit.fromDecoded(dec.limit),
      fees: types.Fees.fromDecoded(dec.fees),
      poolApr: types.PoolApr.fromDecoded(dec.poolApr),
      maxRequestExecutionSec: dec.maxRequestExecutionSec,
      bump: dec.bump,
      lpTokenBump: dec.lpTokenBump,
      inceptionTime: dec.inceptionTime,
    })
  }

  toJSON(): PoolJSON {
    return {
      name: this.name,
      custodies: this.custodies.map((item) => item.toString()),
      aumUsd: this.aumUsd.toString(),
      limit: this.limit.toJSON(),
      fees: this.fees.toJSON(),
      poolApr: this.poolApr.toJSON(),
      maxRequestExecutionSec: this.maxRequestExecutionSec.toString(),
      bump: this.bump,
      lpTokenBump: this.lpTokenBump,
      inceptionTime: this.inceptionTime.toString(),
    }
  }

  static fromJSON(obj: PoolJSON): Pool {
    return new Pool({
      name: obj.name,
      custodies: obj.custodies.map((item) => new PublicKey(item)),
      aumUsd: new BN(obj.aumUsd),
      limit: types.Limit.fromJSON(obj.limit),
      fees: types.Fees.fromJSON(obj.fees),
      poolApr: types.PoolApr.fromJSON(obj.poolApr),
      maxRequestExecutionSec: new BN(obj.maxRequestExecutionSec),
      bump: obj.bump,
      lpTokenBump: obj.lpTokenBump,
      inceptionTime: new BN(obj.inceptionTime),
    })
  }
}
