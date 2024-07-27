import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface TokenBadgeFields {
  whirlpoolsConfig: PublicKey
  tokenMint: PublicKey
}

export interface TokenBadgeJSON {
  whirlpoolsConfig: string
  tokenMint: string
}

export class TokenBadge {
  readonly whirlpoolsConfig: PublicKey
  readonly tokenMint: PublicKey

  static readonly discriminator = Buffer.from([
    116, 219, 204, 229, 249, 116, 255, 150,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("whirlpoolsConfig"),
    borsh.publicKey("tokenMint"),
  ])

  constructor(fields: TokenBadgeFields) {
    this.whirlpoolsConfig = fields.whirlpoolsConfig
    this.tokenMint = fields.tokenMint
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = WHIRLPOOL_PROGRAM_ID
  ): Promise<TokenBadge | null> {
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
  ): Promise<Array<TokenBadge | null>> {
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

  static decode(data: Buffer): TokenBadge {
    if (!data.slice(0, 8).equals(TokenBadge.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = TokenBadge.layout.decode(data.slice(8))

    return new TokenBadge({
      whirlpoolsConfig: dec.whirlpoolsConfig,
      tokenMint: dec.tokenMint,
    })
  }

  toJSON(): TokenBadgeJSON {
    return {
      whirlpoolsConfig: this.whirlpoolsConfig.toString(),
      tokenMint: this.tokenMint.toString(),
    }
  }

  static fromJSON(obj: TokenBadgeJSON): TokenBadge {
    return new TokenBadge({
      whirlpoolsConfig: new PublicKey(obj.whirlpoolsConfig),
      tokenMint: new PublicKey(obj.tokenMint),
    })
  }
}
