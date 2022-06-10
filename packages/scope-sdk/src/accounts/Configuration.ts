import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ConfigurationFields {
  adminPbk: PublicKey
  oracleMappingsPbk: PublicKey
  oraclePricesPbk: PublicKey
  padding: Array<BN>
}

export interface ConfigurationJSON {
  adminPbk: string
  oracleMappingsPbk: string
  oraclePricesPbk: string
  padding: Array<string>
}

export class Configuration {
  readonly adminPbk: PublicKey
  readonly oracleMappingsPbk: PublicKey
  readonly oraclePricesPbk: PublicKey
  readonly padding: Array<BN>

  static readonly discriminator = Buffer.from([
    192, 79, 172, 30, 21, 173, 25, 43,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("adminPbk"),
    borsh.publicKey("oracleMappingsPbk"),
    borsh.publicKey("oraclePricesPbk"),
    borsh.array(borsh.u64(), 1267, "padding"),
  ])

  constructor(fields: ConfigurationFields) {
    this.adminPbk = fields.adminPbk
    this.oracleMappingsPbk = fields.oracleMappingsPbk
    this.oraclePricesPbk = fields.oraclePricesPbk
    this.padding = fields.padding
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<Configuration | null> {
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
  ): Promise<Array<Configuration | null>> {
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

  static decode(data: Buffer): Configuration {
    if (!data.slice(0, 8).equals(Configuration.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Configuration.layout.decode(data.slice(8))

    return new Configuration({
      adminPbk: dec.adminPbk,
      oracleMappingsPbk: dec.oracleMappingsPbk,
      oraclePricesPbk: dec.oraclePricesPbk,
      padding: dec.padding,
    })
  }

  toJSON(): ConfigurationJSON {
    return {
      adminPbk: this.adminPbk.toString(),
      oracleMappingsPbk: this.oracleMappingsPbk.toString(),
      oraclePricesPbk: this.oraclePricesPbk.toString(),
      padding: this.padding.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: ConfigurationJSON): Configuration {
    return new Configuration({
      adminPbk: new PublicKey(obj.adminPbk),
      oracleMappingsPbk: new PublicKey(obj.oracleMappingsPbk),
      oraclePricesPbk: new PublicKey(obj.oraclePricesPbk),
      padding: obj.padding.map((item) => new BN(item)),
    })
  }
}
