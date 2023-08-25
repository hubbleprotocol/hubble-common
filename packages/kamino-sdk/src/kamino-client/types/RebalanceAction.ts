import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export type NewSqrtPriceRangeFields = [BN, BN]
export type NewSqrtPriceRangeValue = [BN, BN]

export interface NewSqrtPriceRangeJSON {
  kind: "NewSqrtPriceRange"
  value: [string, string]
}

export class NewSqrtPriceRange {
  static readonly discriminator = 0
  static readonly kind = "NewSqrtPriceRange"
  readonly discriminator = 0
  readonly kind = "NewSqrtPriceRange"
  readonly value: NewSqrtPriceRangeValue

  constructor(value: NewSqrtPriceRangeFields) {
    this.value = [value[0], value[1]]
  }

  toJSON(): NewSqrtPriceRangeJSON {
    return {
      kind: "NewSqrtPriceRange",
      value: [this.value[0].toString(), this.value[1].toString()],
    }
  }

  toEncodable() {
    return {
      NewSqrtPriceRange: {
        _0: this.value[0],
        _1: this.value[1],
      },
    }
  }
}

export type NewTickRangeFields = [number, number]
export type NewTickRangeValue = [number, number]

export interface NewTickRangeJSON {
  kind: "NewTickRange"
  value: [number, number]
}

export class NewTickRange {
  static readonly discriminator = 1
  static readonly kind = "NewTickRange"
  readonly discriminator = 1
  readonly kind = "NewTickRange"
  readonly value: NewTickRangeValue

  constructor(value: NewTickRangeFields) {
    this.value = [value[0], value[1]]
  }

  toJSON(): NewTickRangeJSON {
    return {
      kind: "NewTickRange",
      value: [this.value[0], this.value[1]],
    }
  }

  toEncodable() {
    return {
      NewTickRange: {
        _0: this.value[0],
        _1: this.value[1],
      },
    }
  }
}

export interface WithdrawAndFreezeJSON {
  kind: "WithdrawAndFreeze"
}

export class WithdrawAndFreeze {
  static readonly discriminator = 2
  static readonly kind = "WithdrawAndFreeze"
  readonly discriminator = 2
  readonly kind = "WithdrawAndFreeze"

  toJSON(): WithdrawAndFreezeJSON {
    return {
      kind: "WithdrawAndFreeze",
    }
  }

  toEncodable() {
    return {
      WithdrawAndFreeze: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.RebalanceActionKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("NewSqrtPriceRange" in obj) {
    const val = obj["NewSqrtPriceRange"]
    return new NewSqrtPriceRange([val["_0"], val["_1"]])
  }
  if ("NewTickRange" in obj) {
    const val = obj["NewTickRange"]
    return new NewTickRange([val["_0"], val["_1"]])
  }
  if ("WithdrawAndFreeze" in obj) {
    return new WithdrawAndFreeze()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.RebalanceActionJSON
): types.RebalanceActionKind {
  switch (obj.kind) {
    case "NewSqrtPriceRange": {
      return new NewSqrtPriceRange([new BN(obj.value[0]), new BN(obj.value[1])])
    }
    case "NewTickRange": {
      return new NewTickRange([obj.value[0], obj.value[1]])
    }
    case "WithdrawAndFreeze": {
      return new WithdrawAndFreeze()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([borsh.u128("_0"), borsh.u128("_1")], "NewSqrtPriceRange"),
    borsh.struct([borsh.i32("_0"), borsh.i32("_1")], "NewTickRange"),
    borsh.struct([], "WithdrawAndFreeze"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
