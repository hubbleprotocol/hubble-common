import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface OracleTwapsFields {
  oraclePrices: PublicKey
  oracleMappings: PublicKey
  twaps: Array<types.EmaTwapFields>
}

export interface OracleTwapsJSON {
  oraclePrices: string
  oracleMappings: string
  twaps: Array<types.EmaTwapJSON>
}

export class OracleTwaps {
  readonly oraclePrices: PublicKey
  readonly oracleMappings: PublicKey
  readonly twaps: Array<types.EmaTwap>

  static readonly discriminator = Buffer.from([
    192, 139, 27, 250, 53, 166, 101, 61,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("oraclePrices"),
    borsh.publicKey("oracleMappings"),
    borsh.array(types.EmaTwap.layout(), 512, "twaps"),
  ])

  constructor(fields: OracleTwapsFields) {
    this.oraclePrices = fields.oraclePrices
    this.oracleMappings = fields.oracleMappings
    this.twaps = fields.twaps.map((item) => new types.EmaTwap({ ...item }))
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<OracleTwaps | null> {
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
  ): Promise<Array<OracleTwaps | null>> {
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

  static decode(data: Buffer): OracleTwaps {
    if (!data.slice(0, 8).equals(OracleTwaps.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = OracleTwaps.layout.decode(data.slice(8))

    return new OracleTwaps({
      oraclePrices: dec.oraclePrices,
      oracleMappings: dec.oracleMappings,
      twaps: dec.twaps.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.EmaTwap.fromDecoded(item)
      ),
    })
  }

  toJSON(): OracleTwapsJSON {
    return {
      oraclePrices: this.oraclePrices.toString(),
      oracleMappings: this.oracleMappings.toString(),
      twaps: this.twaps.map((item) => item.toJSON()),
    }
  }

  static fromJSON(obj: OracleTwapsJSON): OracleTwaps {
    return new OracleTwaps({
      oraclePrices: new PublicKey(obj.oraclePrices),
      oracleMappings: new PublicKey(obj.oracleMappings),
      twaps: obj.twaps.map((item) => types.EmaTwap.fromJSON(item)),
    })
  }
}
