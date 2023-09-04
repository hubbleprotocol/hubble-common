import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface YiTokenFields {
  mint: PublicKey
  bump: number
  padding: Array<number>
  tokenMint: PublicKey
  tokenAccount: PublicKey
  stakeFee: number
  unstakeFee: number
}

export interface YiTokenJSON {
  mint: string
  bump: number
  padding: Array<number>
  tokenMint: string
  tokenAccount: string
  stakeFee: number
  unstakeFee: number
}

export class YiToken {
  readonly mint: PublicKey
  readonly bump: number
  readonly padding: Array<number>
  readonly tokenMint: PublicKey
  readonly tokenAccount: PublicKey
  readonly stakeFee: number
  readonly unstakeFee: number

  static readonly discriminator = Buffer.from([
    106, 239, 204, 150, 180, 3, 149, 28,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("mint"),
    borsh.u8("bump"),
    borsh.array(borsh.u8(), 7, "padding"),
    borsh.publicKey("tokenMint"),
    borsh.publicKey("tokenAccount"),
    borsh.u32("stakeFee"),
    borsh.u32("unstakeFee"),
  ])

  constructor(fields: YiTokenFields) {
    this.mint = fields.mint
    this.bump = fields.bump
    this.padding = fields.padding
    this.tokenMint = fields.tokenMint
    this.tokenAccount = fields.tokenAccount
    this.stakeFee = fields.stakeFee
    this.unstakeFee = fields.unstakeFee
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<YiToken | null> {
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
  ): Promise<Array<YiToken | null>> {
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

  static decode(data: Buffer): YiToken {
    if (!data.slice(0, 8).equals(YiToken.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = YiToken.layout.decode(data.slice(8))

    return new YiToken({
      mint: dec.mint,
      bump: dec.bump,
      padding: dec.padding,
      tokenMint: dec.tokenMint,
      tokenAccount: dec.tokenAccount,
      stakeFee: dec.stakeFee,
      unstakeFee: dec.unstakeFee,
    })
  }

  toJSON(): YiTokenJSON {
    return {
      mint: this.mint.toString(),
      bump: this.bump,
      padding: this.padding,
      tokenMint: this.tokenMint.toString(),
      tokenAccount: this.tokenAccount.toString(),
      stakeFee: this.stakeFee,
      unstakeFee: this.unstakeFee,
    }
  }

  static fromJSON(obj: YiTokenJSON): YiToken {
    return new YiToken({
      mint: new PublicKey(obj.mint),
      bump: obj.bump,
      padding: obj.padding,
      tokenMint: new PublicKey(obj.tokenMint),
      tokenAccount: new PublicKey(obj.tokenAccount),
      stakeFee: obj.stakeFee,
      unstakeFee: obj.unstakeFee,
    })
  }
}
