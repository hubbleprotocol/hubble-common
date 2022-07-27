import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface OpenPositionBumpsFields {
  positionBump: number
}

export interface OpenPositionBumpsJSON {
  positionBump: number
}

export class OpenPositionBumps {
  readonly positionBump: number

  constructor(fields: OpenPositionBumpsFields) {
    this.positionBump = fields.positionBump
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u8("positionBump")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new OpenPositionBumps({
      positionBump: obj.positionBump,
    })
  }

  static toEncodable(fields: OpenPositionBumpsFields) {
    return {
      positionBump: fields.positionBump,
    }
  }

  toJSON(): OpenPositionBumpsJSON {
    return {
      positionBump: this.positionBump,
    }
  }

  static fromJSON(obj: OpenPositionBumpsJSON): OpenPositionBumps {
    return new OpenPositionBumps({
      positionBump: obj.positionBump,
    })
  }

  toEncodable() {
    return OpenPositionBumps.toEncodable(this)
  }
}
