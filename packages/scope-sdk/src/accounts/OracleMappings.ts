import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface OracleMappingsFields {
  priceInfoAccounts: Array<PublicKey>
  priceTypes: Array<number>
  twapSource: Array<number>
  twapEnabled: Array<number>
  reserved1: Array<number>
  reserved2: Array<number>
}

export interface OracleMappingsJSON {
  priceInfoAccounts: Array<string>
  priceTypes: Array<number>
  twapSource: Array<number>
  twapEnabled: Array<number>
  reserved1: Array<number>
  reserved2: Array<number>
}

export class OracleMappings {
  readonly priceInfoAccounts: Array<PublicKey>
  readonly priceTypes: Array<number>
  readonly twapSource: Array<number>
  readonly twapEnabled: Array<number>
  readonly reserved1: Array<number>
  readonly reserved2: Array<number>

  static readonly discriminator = Buffer.from([
    40, 244, 110, 80, 255, 214, 243, 188,
  ])

  static readonly layout = borsh.struct([
    borsh.array(borsh.publicKey(), 512, "priceInfoAccounts"),
    borsh.array(borsh.u8(), 512, "priceTypes"),
    borsh.array(borsh.u16(), 512, "twapSource"),
    borsh.array(borsh.u8(), 512, "twapEnabled"),
    borsh.array(borsh.u8(), 512, "reserved1"),
    borsh.array(borsh.u32(), 512, "reserved2"),
  ])

  constructor(fields: OracleMappingsFields) {
    this.priceInfoAccounts = fields.priceInfoAccounts
    this.priceTypes = fields.priceTypes
    this.twapSource = fields.twapSource
    this.twapEnabled = fields.twapEnabled
    this.reserved1 = fields.reserved1
    this.reserved2 = fields.reserved2
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<OracleMappings | null> {
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
  ): Promise<Array<OracleMappings | null>> {
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

  static decode(data: Buffer): OracleMappings {
    if (!data.slice(0, 8).equals(OracleMappings.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = OracleMappings.layout.decode(data.slice(8))

    return new OracleMappings({
      priceInfoAccounts: dec.priceInfoAccounts,
      priceTypes: dec.priceTypes,
      twapSource: dec.twapSource,
      twapEnabled: dec.twapEnabled,
      reserved1: dec.reserved1,
      reserved2: dec.reserved2,
    })
  }

  toJSON(): OracleMappingsJSON {
    return {
      priceInfoAccounts: this.priceInfoAccounts.map((item) => item.toString()),
      priceTypes: this.priceTypes,
      twapSource: this.twapSource,
      twapEnabled: this.twapEnabled,
      reserved1: this.reserved1,
      reserved2: this.reserved2,
    }
  }

  static fromJSON(obj: OracleMappingsJSON): OracleMappings {
    return new OracleMappings({
      priceInfoAccounts: obj.priceInfoAccounts.map(
        (item) => new PublicKey(item)
      ),
      priceTypes: obj.priceTypes,
      twapSource: obj.twapSource,
      twapEnabled: obj.twapEnabled,
      reserved1: obj.reserved1,
      reserved2: obj.reserved2,
    })
  }
}
