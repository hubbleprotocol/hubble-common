import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface ParabolicParameterFields {
  /** amplification */
  a: number
}

export interface ParabolicParameterJSON {
  /** amplification */
  a: number
}

export class ParabolicParameter {
  /** amplification */
  readonly a: number

  constructor(fields: ParabolicParameterFields) {
    this.a = fields.a
  }

  static layout(property?: string) {
    return borsh.struct([borsh.i16("a")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new ParabolicParameter({
      a: obj.a,
    })
  }

  static toEncodable(fields: ParabolicParameterFields) {
    return {
      a: fields.a,
    }
  }

  toJSON(): ParabolicParameterJSON {
    return {
      a: this.a,
    }
  }

  static fromJSON(obj: ParabolicParameterJSON): ParabolicParameter {
    return new ParabolicParameter({
      a: obj.a,
    })
  }

  toEncodable() {
    return ParabolicParameter.toEncodable(this)
  }
}
