import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface MintToScopeChainFields {
  mint: PublicKey
  scopeChain: Array<number>
}

export interface MintToScopeChainJSON {
  mint: string
  scopeChain: Array<number>
}

export class MintToScopeChain {
  readonly mint: PublicKey
  readonly scopeChain: Array<number>

  constructor(fields: MintToScopeChainFields) {
    this.mint = fields.mint
    this.scopeChain = fields.scopeChain
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.publicKey("mint"), borsh.array(borsh.u16(), 4, "scopeChain")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new MintToScopeChain({
      mint: obj.mint,
      scopeChain: obj.scopeChain,
    })
  }

  static toEncodable(fields: MintToScopeChainFields) {
    return {
      mint: fields.mint,
      scopeChain: fields.scopeChain,
    }
  }

  toJSON(): MintToScopeChainJSON {
    return {
      mint: this.mint.toString(),
      scopeChain: this.scopeChain,
    }
  }

  static fromJSON(obj: MintToScopeChainJSON): MintToScopeChain {
    return new MintToScopeChain({
      mint: new PublicKey(obj.mint),
      scopeChain: obj.scopeChain,
    })
  }

  toEncodable() {
    return MintToScopeChain.toEncodable(this)
  }
}
