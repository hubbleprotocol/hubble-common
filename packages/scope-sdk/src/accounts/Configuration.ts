import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ConfigurationFields {
  admin: PublicKey
  oracleMappings: PublicKey
  oraclePrices: PublicKey
  tokensMetadata: PublicKey
  oracleTwaps: PublicKey
  padding: Array<BN>
}

export interface ConfigurationJSON {
  admin: string
  oracleMappings: string
  oraclePrices: string
  tokensMetadata: string
  oracleTwaps: string
  padding: Array<string>
}

export class Configuration {
  readonly admin: PublicKey
  readonly oracleMappings: PublicKey
  readonly oraclePrices: PublicKey
  readonly tokensMetadata: PublicKey
  readonly oracleTwaps: PublicKey
  readonly padding: Array<BN>

  static readonly discriminator = Buffer.from([
    192, 79, 172, 30, 21, 173, 25, 43,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("admin"),
    borsh.publicKey("oracleMappings"),
    borsh.publicKey("oraclePrices"),
    borsh.publicKey("tokensMetadata"),
    borsh.publicKey("oracleTwaps"),
    borsh.array(borsh.u64(), 1259, "padding"),
  ])

  constructor(fields: ConfigurationFields) {
    this.admin = fields.admin
    this.oracleMappings = fields.oracleMappings
    this.oraclePrices = fields.oraclePrices
    this.tokensMetadata = fields.tokensMetadata
    this.oracleTwaps = fields.oracleTwaps
    this.padding = fields.padding
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<Configuration | null> {
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
  ): Promise<Array<Configuration | null>> {
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

  static decode(data: Buffer): Configuration {
    if (!data.slice(0, 8).equals(Configuration.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Configuration.layout.decode(data.slice(8))

    return new Configuration({
      admin: dec.admin,
      oracleMappings: dec.oracleMappings,
      oraclePrices: dec.oraclePrices,
      tokensMetadata: dec.tokensMetadata,
      oracleTwaps: dec.oracleTwaps,
      padding: dec.padding,
    })
  }

  toJSON(): ConfigurationJSON {
    return {
      admin: this.admin.toString(),
      oracleMappings: this.oracleMappings.toString(),
      oraclePrices: this.oraclePrices.toString(),
      tokensMetadata: this.tokensMetadata.toString(),
      oracleTwaps: this.oracleTwaps.toString(),
      padding: this.padding.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: ConfigurationJSON): Configuration {
    return new Configuration({
      admin: new PublicKey(obj.admin),
      oracleMappings: new PublicKey(obj.oracleMappings),
      oraclePrices: new PublicKey(obj.oraclePrices),
      tokensMetadata: new PublicKey(obj.tokensMetadata),
      oracleTwaps: new PublicKey(obj.oracleTwaps),
      padding: obj.padding.map((item) => new BN(item)),
    })
  }
}
