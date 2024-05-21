import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface OracleMappingsCoreFields {
  data: Array<number>
}

export interface OracleMappingsCoreJSON {
  data: Array<number>
}

export class OracleMappingsCore {
  readonly data: Array<number>

  constructor(fields: OracleMappingsCoreFields) {
    this.data = fields.data
  }

  static layout(property?: string) {
    return borsh.struct([borsh.array(borsh.u8(), 19456, "data")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new OracleMappingsCore({
      data: obj.data,
    })
  }

  static toEncodable(fields: OracleMappingsCoreFields) {
    return {
      data: fields.data,
    }
  }

  toJSON(): OracleMappingsCoreJSON {
    return {
      data: this.data,
    }
  }

  static fromJSON(obj: OracleMappingsCoreJSON): OracleMappingsCore {
    return new OracleMappingsCore({
      data: obj.data,
    })
  }

  toEncodable() {
    return OracleMappingsCore.toEncodable(this)
  }
}
