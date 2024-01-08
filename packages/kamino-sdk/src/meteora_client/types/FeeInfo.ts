import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface FeeInfoFields {
  feeXPerTokenComplete: BN
  feeYPerTokenComplete: BN
  feeXPending: BN
  feeYPending: BN
}

export interface FeeInfoJSON {
  feeXPerTokenComplete: string
  feeYPerTokenComplete: string
  feeXPending: string
  feeYPending: string
}

export class FeeInfo {
  readonly feeXPerTokenComplete: BN
  readonly feeYPerTokenComplete: BN
  readonly feeXPending: BN
  readonly feeYPending: BN

  constructor(fields: FeeInfoFields) {
    this.feeXPerTokenComplete = fields.feeXPerTokenComplete
    this.feeYPerTokenComplete = fields.feeYPerTokenComplete
    this.feeXPending = fields.feeXPending
    this.feeYPending = fields.feeYPending
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u128("feeXPerTokenComplete"),
        borsh.u128("feeYPerTokenComplete"),
        borsh.u64("feeXPending"),
        borsh.u64("feeYPending"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new FeeInfo({
      feeXPerTokenComplete: obj.feeXPerTokenComplete,
      feeYPerTokenComplete: obj.feeYPerTokenComplete,
      feeXPending: obj.feeXPending,
      feeYPending: obj.feeYPending,
    })
  }

  static toEncodable(fields: FeeInfoFields) {
    return {
      feeXPerTokenComplete: fields.feeXPerTokenComplete,
      feeYPerTokenComplete: fields.feeYPerTokenComplete,
      feeXPending: fields.feeXPending,
      feeYPending: fields.feeYPending,
    }
  }

  toJSON(): FeeInfoJSON {
    return {
      feeXPerTokenComplete: this.feeXPerTokenComplete.toString(),
      feeYPerTokenComplete: this.feeYPerTokenComplete.toString(),
      feeXPending: this.feeXPending.toString(),
      feeYPending: this.feeYPending.toString(),
    }
  }

  static fromJSON(obj: FeeInfoJSON): FeeInfo {
    return new FeeInfo({
      feeXPerTokenComplete: new BN(obj.feeXPerTokenComplete),
      feeYPerTokenComplete: new BN(obj.feeYPerTokenComplete),
      feeXPending: new BN(obj.feeXPending),
      feeYPending: new BN(obj.feeYPending),
    })
  }

  toEncodable() {
    return FeeInfo.toEncodable(this)
  }
}
