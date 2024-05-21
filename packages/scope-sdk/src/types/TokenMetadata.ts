import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface TokenMetadataFields {
  name: Array<number>
  maxAgePriceSlots: BN
  reserved: Array<BN>
}

export interface TokenMetadataJSON {
  name: Array<number>
  maxAgePriceSlots: string
  reserved: Array<string>
}

export class TokenMetadata {
  readonly name: Array<number>
  readonly maxAgePriceSlots: BN
  readonly reserved: Array<BN>

  constructor(fields: TokenMetadataFields) {
    this.name = fields.name
    this.maxAgePriceSlots = fields.maxAgePriceSlots
    this.reserved = fields.reserved
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.array(borsh.u8(), 32, "name"),
        borsh.u64("maxAgePriceSlots"),
        borsh.array(borsh.u64(), 16, "reserved"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new TokenMetadata({
      name: obj.name,
      maxAgePriceSlots: obj.maxAgePriceSlots,
      reserved: obj.reserved,
    })
  }

  static toEncodable(fields: TokenMetadataFields) {
    return {
      name: fields.name,
      maxAgePriceSlots: fields.maxAgePriceSlots,
      reserved: fields.reserved,
    }
  }

  toJSON(): TokenMetadataJSON {
    return {
      name: this.name,
      maxAgePriceSlots: this.maxAgePriceSlots.toString(),
      reserved: this.reserved.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: TokenMetadataJSON): TokenMetadata {
    return new TokenMetadata({
      name: obj.name,
      maxAgePriceSlots: new BN(obj.maxAgePriceSlots),
      reserved: obj.reserved.map((item) => new BN(item)),
    })
  }

  toEncodable() {
    return TokenMetadata.toEncodable(this)
  }
}
