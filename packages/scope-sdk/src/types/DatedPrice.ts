import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface DatedPriceFields {
  price: types.PriceFields
  lastUpdatedSlot: BN
  reserved: Array<BN>
}

export interface DatedPriceJSON {
  price: types.PriceJSON
  lastUpdatedSlot: string
  reserved: Array<string>
}

export class DatedPrice {
  readonly price: types.Price
  readonly lastUpdatedSlot: BN
  readonly reserved: Array<BN>

  constructor(fields: DatedPriceFields) {
    this.price = new types.Price({ ...fields.price })
    this.lastUpdatedSlot = fields.lastUpdatedSlot
    this.reserved = fields.reserved
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        types.Price.layout("price"),
        borsh.u64("lastUpdatedSlot"),
        borsh.array(borsh.u64(), 4, "reserved"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new DatedPrice({
      price: types.Price.fromDecoded(obj.price),
      lastUpdatedSlot: obj.lastUpdatedSlot,
      reserved: obj.reserved,
    })
  }

  static toEncodable(fields: DatedPriceFields) {
    return {
      price: types.Price.toEncodable(fields.price),
      lastUpdatedSlot: fields.lastUpdatedSlot,
      reserved: fields.reserved,
    }
  }

  toJSON(): DatedPriceJSON {
    return {
      price: this.price.toJSON(),
      lastUpdatedSlot: this.lastUpdatedSlot.toString(),
      reserved: this.reserved.map((item) => item.toString()),
    }
  }

  static fromJSON(obj: DatedPriceJSON): DatedPrice {
    return new DatedPrice({
      price: types.Price.fromJSON(obj.price),
      lastUpdatedSlot: new BN(obj.lastUpdatedSlot),
      reserved: obj.reserved.map((item) => new BN(item)),
    })
  }

  toEncodable() {
    return DatedPrice.toEncodable(this)
  }
}
