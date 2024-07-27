import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface RemainingAccountsSliceFields {
  accountsType: types.AccountsTypeKind
  length: number
}

export interface RemainingAccountsSliceJSON {
  accountsType: types.AccountsTypeJSON
  length: number
}

export class RemainingAccountsSlice {
  readonly accountsType: types.AccountsTypeKind
  readonly length: number

  constructor(fields: RemainingAccountsSliceFields) {
    this.accountsType = fields.accountsType
    this.length = fields.length
  }

  static layout(property?: string) {
    return borsh.struct(
      [types.AccountsType.layout("accountsType"), borsh.u8("length")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new RemainingAccountsSlice({
      accountsType: types.AccountsType.fromDecoded(obj.accountsType),
      length: obj.length,
    })
  }

  static toEncodable(fields: RemainingAccountsSliceFields) {
    return {
      accountsType: fields.accountsType.toEncodable(),
      length: fields.length,
    }
  }

  toJSON(): RemainingAccountsSliceJSON {
    return {
      accountsType: this.accountsType.toJSON(),
      length: this.length,
    }
  }

  static fromJSON(obj: RemainingAccountsSliceJSON): RemainingAccountsSlice {
    return new RemainingAccountsSlice({
      accountsType: types.AccountsType.fromJSON(obj.accountsType),
      length: obj.length,
    })
  }

  toEncodable() {
    return RemainingAccountsSlice.toEncodable(this)
  }
}
