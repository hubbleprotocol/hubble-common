import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface FeeTierFields {
  whirlpoolsConfig: PublicKey
  tickSpacing: number
  defaultFeeRate: number
}

export interface FeeTierJSON {
  whirlpoolsConfig: string
  tickSpacing: number
  defaultFeeRate: number
}

export class FeeTier {
  readonly whirlpoolsConfig: PublicKey
  readonly tickSpacing: number
  readonly defaultFeeRate: number

  static readonly discriminator = Buffer.from([
    56, 75, 159, 76, 142, 68, 190, 105,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("whirlpoolsConfig"),
    borsh.u16("tickSpacing"),
    borsh.u16("defaultFeeRate"),
  ])

  constructor(fields: FeeTierFields) {
    this.whirlpoolsConfig = fields.whirlpoolsConfig
    this.tickSpacing = fields.tickSpacing
    this.defaultFeeRate = fields.defaultFeeRate
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = WHIRLPOOL_PROGRAM_ID
  ): Promise<FeeTier | null> {
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
    programId: PublicKey = WHIRLPOOL_PROGRAM_ID
  ): Promise<Array<FeeTier | null>> {
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

  static decode(data: Buffer): FeeTier {
    if (!data.slice(0, 8).equals(FeeTier.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = FeeTier.layout.decode(data.slice(8))

    return new FeeTier({
      whirlpoolsConfig: dec.whirlpoolsConfig,
      tickSpacing: dec.tickSpacing,
      defaultFeeRate: dec.defaultFeeRate,
    })
  }

  toJSON(): FeeTierJSON {
    return {
      whirlpoolsConfig: this.whirlpoolsConfig.toString(),
      tickSpacing: this.tickSpacing,
      defaultFeeRate: this.defaultFeeRate,
    }
  }

  static fromJSON(obj: FeeTierJSON): FeeTier {
    return new FeeTier({
      whirlpoolsConfig: new PublicKey(obj.whirlpoolsConfig),
      tickSpacing: obj.tickSpacing,
      defaultFeeRate: obj.defaultFeeRate,
    })
  }
}
