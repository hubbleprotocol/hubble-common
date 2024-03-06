import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export type SqrtPriceFields = [BN]
export type SqrtPriceValue = [BN]

export interface SqrtPriceJSON {
  kind: "SqrtPrice"
  value: [string]
}

export class SqrtPrice {
  static readonly discriminator = 0
  static readonly kind = "SqrtPrice"
  readonly discriminator = 0
  readonly kind = "SqrtPrice"
  readonly value: SqrtPriceValue

  constructor(value: SqrtPriceFields) {
    this.value = [value[0]]
  }

  toJSON(): SqrtPriceJSON {
    return {
      kind: "SqrtPrice",
      value: [this.value[0].toString()],
    }
  }

  toEncodable() {
    return {
      SqrtPrice: {
        _0: this.value[0],
      },
    }
  }
}

export type Q64_64Fields = [BN]
export type Q64_64Value = [BN]

export interface Q64_64JSON {
  kind: "Q64_64"
  value: [string]
}

export class Q64_64 {
  static readonly discriminator = 1
  static readonly kind = "Q64_64"
  readonly discriminator = 1
  readonly kind = "Q64_64"
  readonly value: Q64_64Value

  constructor(value: Q64_64Fields) {
    this.value = [value[0]]
  }

  toJSON(): Q64_64JSON {
    return {
      kind: "Q64_64",
      value: [this.value[0].toString()],
    }
  }

  toEncodable() {
    return {
      Q64_64: {
        _0: this.value[0],
      },
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.DexSpecificPriceKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("SqrtPrice" in obj) {
    const val = obj["SqrtPrice"]
    return new SqrtPrice([val["_0"]])
  }
  if ("Q64_64" in obj) {
    const val = obj["Q64_64"]
    return new Q64_64([val["_0"]])
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.DexSpecificPriceJSON
): types.DexSpecificPriceKind {
  switch (obj.kind) {
    case "SqrtPrice": {
      return new SqrtPrice([new BN(obj.value[0])])
    }
    case "Q64_64": {
      return new Q64_64([new BN(obj.value[0])])
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([borsh.u128("_0")], "SqrtPrice"),
    borsh.struct([borsh.u128("_0")], "Q64_64"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
