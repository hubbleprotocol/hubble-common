import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface WhirlpoolsConfigExtensionFields {
  whirlpoolsConfig: PublicKey
  configExtensionAuthority: PublicKey
  tokenBadgeAuthority: PublicKey
}

export interface WhirlpoolsConfigExtensionJSON {
  whirlpoolsConfig: string
  configExtensionAuthority: string
  tokenBadgeAuthority: string
}

export class WhirlpoolsConfigExtension {
  readonly whirlpoolsConfig: PublicKey
  readonly configExtensionAuthority: PublicKey
  readonly tokenBadgeAuthority: PublicKey

  static readonly discriminator = Buffer.from([
    2, 99, 215, 163, 240, 26, 153, 58,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("whirlpoolsConfig"),
    borsh.publicKey("configExtensionAuthority"),
    borsh.publicKey("tokenBadgeAuthority"),
  ])

  constructor(fields: WhirlpoolsConfigExtensionFields) {
    this.whirlpoolsConfig = fields.whirlpoolsConfig
    this.configExtensionAuthority = fields.configExtensionAuthority
    this.tokenBadgeAuthority = fields.tokenBadgeAuthority
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = WHIRLPOOL_PROGRAM_ID
  ): Promise<WhirlpoolsConfigExtension | null> {
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
  ): Promise<Array<WhirlpoolsConfigExtension | null>> {
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

  static decode(data: Buffer): WhirlpoolsConfigExtension {
    if (!data.slice(0, 8).equals(WhirlpoolsConfigExtension.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = WhirlpoolsConfigExtension.layout.decode(data.slice(8))

    return new WhirlpoolsConfigExtension({
      whirlpoolsConfig: dec.whirlpoolsConfig,
      configExtensionAuthority: dec.configExtensionAuthority,
      tokenBadgeAuthority: dec.tokenBadgeAuthority,
    })
  }

  toJSON(): WhirlpoolsConfigExtensionJSON {
    return {
      whirlpoolsConfig: this.whirlpoolsConfig.toString(),
      configExtensionAuthority: this.configExtensionAuthority.toString(),
      tokenBadgeAuthority: this.tokenBadgeAuthority.toString(),
    }
  }

  static fromJSON(
    obj: WhirlpoolsConfigExtensionJSON
  ): WhirlpoolsConfigExtension {
    return new WhirlpoolsConfigExtension({
      whirlpoolsConfig: new PublicKey(obj.whirlpoolsConfig),
      configExtensionAuthority: new PublicKey(obj.configExtensionAuthority),
      tokenBadgeAuthority: new PublicKey(obj.tokenBadgeAuthority),
    })
  }
}
