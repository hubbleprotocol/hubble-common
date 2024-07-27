import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface OracleFields {
  /** Index of latest observation slot */
  idx: BN
  /** Size of active sample. Active sample is initialized observation. */
  activeSize: BN
  /** Number of observations */
  length: BN
}

export interface OracleJSON {
  /** Index of latest observation slot */
  idx: string
  /** Size of active sample. Active sample is initialized observation. */
  activeSize: string
  /** Number of observations */
  length: string
}

export class Oracle {
  /** Index of latest observation slot */
  readonly idx: BN
  /** Size of active sample. Active sample is initialized observation. */
  readonly activeSize: BN
  /** Number of observations */
  readonly length: BN

  static readonly discriminator = Buffer.from([
    139, 194, 131, 179, 140, 179, 229, 244,
  ])

  static readonly layout = borsh.struct([
    borsh.u64("idx"),
    borsh.u64("activeSize"),
    borsh.u64("length"),
  ])

  constructor(fields: OracleFields) {
    this.idx = fields.idx
    this.activeSize = fields.activeSize
    this.length = fields.length
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<Oracle | null> {
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
  ): Promise<Array<Oracle | null>> {
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

  static decode(data: Buffer): Oracle {
    if (!data.slice(0, 8).equals(Oracle.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Oracle.layout.decode(data.slice(8))

    return new Oracle({
      idx: dec.idx,
      activeSize: dec.activeSize,
      length: dec.length,
    })
  }

  toJSON(): OracleJSON {
    return {
      idx: this.idx.toString(),
      activeSize: this.activeSize.toString(),
      length: this.length.toString(),
    }
  }

  static fromJSON(obj: OracleJSON): Oracle {
    return new Oracle({
      idx: new BN(obj.idx),
      activeSize: new BN(obj.activeSize),
      length: new BN(obj.length),
    })
  }
}
