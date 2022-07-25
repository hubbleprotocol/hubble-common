import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface PriceFields {
  value: BN
  exp: BN
}

export interface PriceJSON {
  value: string
  exp: string
}

export class Price {
  readonly value: BN
  readonly exp: BN

  constructor(fields: PriceFields) {
    this.value = fields.value
    this.exp = fields.exp
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u64("value"), borsh.u64("exp")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Price({
      value: obj.value,
      exp: obj.exp,
    })
  }

  static toEncodable(fields: PriceFields) {
    return {
      value: fields.value,
      exp: fields.exp,
    }
  }

  toJSON(): PriceJSON {
    return {
      value: this.value.toString(),
      exp: this.exp.toString(),
    }
  }

  static fromJSON(obj: PriceJSON): Price {
    return new Price({
      value: new BN(obj.value),
      exp: new BN(obj.exp),
    })
  }

  toEncodable() {
    return Price.toEncodable(this)
  }
}
