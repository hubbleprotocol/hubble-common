import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface FeeFields {
  basisPoints: number
}

export interface FeeJSON {
  basisPoints: number
}

export class Fee {
  readonly basisPoints: number

  constructor(fields: FeeFields) {
    this.basisPoints = fields.basisPoints
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u32("basisPoints")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Fee({
      basisPoints: obj.basisPoints,
    })
  }

  static toEncodable(fields: FeeFields) {
    return {
      basisPoints: fields.basisPoints,
    }
  }

  toJSON(): FeeJSON {
    return {
      basisPoints: this.basisPoints,
    }
  }

  static fromJSON(obj: FeeJSON): Fee {
    return new Fee({
      basisPoints: obj.basisPoints,
    })
  }

  toEncodable() {
    return Fee.toEncodable(this)
  }
}
