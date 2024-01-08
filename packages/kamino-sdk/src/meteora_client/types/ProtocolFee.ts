import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface ProtocolFeeFields {
  amountX: BN
  amountY: BN
}

export interface ProtocolFeeJSON {
  amountX: string
  amountY: string
}

export class ProtocolFee {
  readonly amountX: BN
  readonly amountY: BN

  constructor(fields: ProtocolFeeFields) {
    this.amountX = fields.amountX
    this.amountY = fields.amountY
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u64("amountX"), borsh.u64("amountY")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new ProtocolFee({
      amountX: obj.amountX,
      amountY: obj.amountY,
    })
  }

  static toEncodable(fields: ProtocolFeeFields) {
    return {
      amountX: fields.amountX,
      amountY: fields.amountY,
    }
  }

  toJSON(): ProtocolFeeJSON {
    return {
      amountX: this.amountX.toString(),
      amountY: this.amountY.toString(),
    }
  }

  static fromJSON(obj: ProtocolFeeJSON): ProtocolFee {
    return new ProtocolFee({
      amountX: new BN(obj.amountX),
      amountY: new BN(obj.amountY),
    })
  }

  toEncodable() {
    return ProtocolFee.toEncodable(this)
  }
}
