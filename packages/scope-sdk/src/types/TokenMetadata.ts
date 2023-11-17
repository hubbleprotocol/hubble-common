import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface TokenMetadataFields {
  name: Array<number>
  maxAgePriceSeconds: BN
  reserved: Array<BN>
}

export interface TokenMetadataJSON {
  name: Array<number>
  maxAgePriceSeconds: string
  reserved: Array<string>
}

export class TokenMetadata {
  readonly name: Array<number>
  readonly maxAgePriceSeconds: BN
  readonly reserved: Array<BN>

  constructor(fields: TokenMetadataFields) {
    this.name = fields.name
    this.maxAgePriceSeconds = fields.maxAgePriceSeconds
    this.reserved = fields.reserved
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.array(borsh.u8(), 32, "name"),
        borsh.u64("maxAgePriceSeconds"),
        borsh.array(borsh.u64(), 16, "reserved"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new TokenMetadata({
      name: obj.name,
      maxAgePriceSeconds: obj.maxAgePriceSeconds,
      reserved: obj.reserved,
    })
  }

  static toEncodable(fields: TokenMetadataFields) {
    return {
      name: fields.name,
      maxAgePriceSeconds: fields.maxAgePriceSeconds,
      reserved: fields.reserved,
    }
  }

  toJSON(): TokenMetadataJSON {
    return {
      name: this.name,
      maxAgePriceSeconds: this.maxAgePriceSeconds.toString(),
      reserved: this.reserved.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: TokenMetadataJSON): TokenMetadata {
    return new TokenMetadata({
      name: obj.name,
      maxAgePriceSeconds: new BN(obj.maxAgePriceSeconds),
      reserved: obj.reserved.map((item) => new BN(item)),
    })
  }

  toEncodable() {
    return TokenMetadata.toEncodable(this)
  }
}
