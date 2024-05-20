import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface CompressedBinDepositAmountFields {
  binId: number
  amount: number
}

export interface CompressedBinDepositAmountJSON {
  binId: number
  amount: number
}

export class CompressedBinDepositAmount {
  readonly binId: number
  readonly amount: number

  constructor(fields: CompressedBinDepositAmountFields) {
    this.binId = fields.binId
    this.amount = fields.amount
  }

  static layout(property?: string) {
    return borsh.struct([borsh.i32("binId"), borsh.u32("amount")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new CompressedBinDepositAmount({
      binId: obj.binId,
      amount: obj.amount,
    })
  }

  static toEncodable(fields: CompressedBinDepositAmountFields) {
    return {
      binId: fields.binId,
      amount: fields.amount,
    }
  }

  toJSON(): CompressedBinDepositAmountJSON {
    return {
      binId: this.binId,
      amount: this.amount,
    }
  }

  static fromJSON(
    obj: CompressedBinDepositAmountJSON
  ): CompressedBinDepositAmount {
    return new CompressedBinDepositAmount({
      binId: obj.binId,
      amount: obj.amount,
    })
  }

  toEncodable() {
    return CompressedBinDepositAmount.toEncodable(this)
  }
}
