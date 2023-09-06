import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface TickArrayFields {
  startTickIndex: number
  ticks: Array<types.TickFields>
  whirlpool: PublicKey
}

export interface TickArrayJSON {
  startTickIndex: number
  ticks: Array<types.TickJSON>
  whirlpool: string
}

export class TickArray {
  readonly startTickIndex: number
  readonly ticks: Array<types.Tick>
  readonly whirlpool: PublicKey

  static readonly discriminator = Buffer.from([
    69, 97, 189, 190, 110, 7, 66, 187,
  ])

  static readonly layout = borsh.struct([
    borsh.i32("startTickIndex"),
    borsh.array(types.Tick.layout(), 88, "ticks"),
    borsh.publicKey("whirlpool"),
  ])

  constructor(fields: TickArrayFields) {
    this.startTickIndex = fields.startTickIndex
    this.ticks = fields.ticks.map((item) => new types.Tick({ ...item }))
    this.whirlpool = fields.whirlpool
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<TickArray | null> {
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
  ): Promise<Array<TickArray | null>> {
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

  static decode(data: Buffer): TickArray {
    if (!data.slice(0, 8).equals(TickArray.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = TickArray.layout.decode(data.slice(8))

    return new TickArray({
      startTickIndex: dec.startTickIndex,
      ticks: dec.ticks.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.Tick.fromDecoded(item)
      ),
      whirlpool: dec.whirlpool,
    })
  }

  toJSON(): TickArrayJSON {
    return {
      startTickIndex: this.startTickIndex,
      ticks: this.ticks.map((item) => item.toJSON()),
      whirlpool: this.whirlpool.toString(),
    }
  }

  static fromJSON(obj: TickArrayJSON): TickArray {
    return new TickArray({
      startTickIndex: obj.startTickIndex,
      ticks: obj.ticks.map((item) => types.Tick.fromJSON(item)),
      whirlpool: new PublicKey(obj.whirlpool),
    })
  }
}
