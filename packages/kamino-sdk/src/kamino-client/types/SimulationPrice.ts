import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface PoolPriceJSON {
  kind: "PoolPrice"
}

export class PoolPrice {
  static readonly discriminator = 0
  static readonly kind = "PoolPrice"
  readonly discriminator = 0
  readonly kind = "PoolPrice"

  toJSON(): PoolPriceJSON {
    return {
      kind: "PoolPrice",
    }
  }

  toEncodable() {
    return {
      PoolPrice: {},
    }
  }
}

export type SqrtPriceFields = [BN]
export type SqrtPriceValue = [BN]

export interface SqrtPriceJSON {
  kind: "SqrtPrice"
  value: [string]
}

export class SqrtPrice {
  static readonly discriminator = 1
  static readonly kind = "SqrtPrice"
  readonly discriminator = 1
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

export type TickIndexFields = [number]
export type TickIndexValue = [number]

export interface TickIndexJSON {
  kind: "TickIndex"
  value: [number]
}

export class TickIndex {
  static readonly discriminator = 2
  static readonly kind = "TickIndex"
  readonly discriminator = 2
  readonly kind = "TickIndex"
  readonly value: TickIndexValue

  constructor(value: TickIndexFields) {
    this.value = [value[0]]
  }

  toJSON(): TickIndexJSON {
    return {
      kind: "TickIndex",
      value: [this.value[0]],
    }
  }

  toEncodable() {
    return {
      TickIndex: {
        _0: this.value[0],
      },
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.SimulationPriceKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("PoolPrice" in obj) {
    return new PoolPrice()
  }
  if ("SqrtPrice" in obj) {
    const val = obj["SqrtPrice"]
    return new SqrtPrice([val["_0"]])
  }
  if ("TickIndex" in obj) {
    const val = obj["TickIndex"]
    return new TickIndex([val["_0"]])
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.SimulationPriceJSON
): types.SimulationPriceKind {
  switch (obj.kind) {
    case "PoolPrice": {
      return new PoolPrice()
    }
    case "SqrtPrice": {
      return new SqrtPrice([new BN(obj.value[0])])
    }
    case "TickIndex": {
      return new TickIndex([obj.value[0]])
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "PoolPrice"),
    borsh.struct([borsh.u128("_0")], "SqrtPrice"),
    borsh.struct([borsh.i32("_0")], "TickIndex"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
