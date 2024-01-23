import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ScopeChainAccountFields {
  chainArray: Array<Array<number>>
}

export interface ScopeChainAccountJSON {
  chainArray: Array<Array<number>>
}

export class ScopeChainAccount {
  readonly chainArray: Array<Array<number>>

  static readonly discriminator = Buffer.from([
    180, 51, 138, 247, 240, 173, 119, 79,
  ])

  static readonly layout = borsh.struct([
    borsh.array(borsh.array(borsh.u16(), 4), 512, "chainArray"),
  ])

  constructor(fields: ScopeChainAccountFields) {
    this.chainArray = fields.chainArray
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<ScopeChainAccount | null> {
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
  ): Promise<Array<ScopeChainAccount | null>> {
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

  static decode(data: Buffer): ScopeChainAccount {
    if (!data.slice(0, 8).equals(ScopeChainAccount.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = ScopeChainAccount.layout.decode(data.slice(8))

    return new ScopeChainAccount({
      chainArray: dec.chainArray,
    })
  }

  toJSON(): ScopeChainAccountJSON {
    return {
      chainArray: this.chainArray,
    }
  }

  static fromJSON(obj: ScopeChainAccountJSON): ScopeChainAccount {
    return new ScopeChainAccount({
      chainArray: obj.chainArray,
    })
  }
}
