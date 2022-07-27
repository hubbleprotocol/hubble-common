import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface WhirlpoolBumpsFields {
  whirlpoolBump: number
}

export interface WhirlpoolBumpsJSON {
  whirlpoolBump: number
}

export class WhirlpoolBumps {
  readonly whirlpoolBump: number

  constructor(fields: WhirlpoolBumpsFields) {
    this.whirlpoolBump = fields.whirlpoolBump
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u8("whirlpoolBump")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new WhirlpoolBumps({
      whirlpoolBump: obj.whirlpoolBump,
    })
  }

  static toEncodable(fields: WhirlpoolBumpsFields) {
    return {
      whirlpoolBump: fields.whirlpoolBump,
    }
  }

  toJSON(): WhirlpoolBumpsJSON {
    return {
      whirlpoolBump: this.whirlpoolBump,
    }
  }

  static fromJSON(obj: WhirlpoolBumpsJSON): WhirlpoolBumps {
    return new WhirlpoolBumps({
      whirlpoolBump: obj.whirlpoolBump,
    })
  }

  toEncodable() {
    return WhirlpoolBumps.toEncodable(this)
  }
}
