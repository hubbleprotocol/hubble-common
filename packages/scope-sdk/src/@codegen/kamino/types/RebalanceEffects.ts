import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export type NewRangeFields = [number, number]
export type NewRangeValue = [number, number]

export interface NewRangeJSON {
  kind: "NewRange"
  value: [number, number]
}

export class NewRange {
  static readonly discriminator = 0
  static readonly kind = "NewRange"
  readonly discriminator = 0
  readonly kind = "NewRange"
  readonly value: NewRangeValue

  constructor(value: NewRangeFields) {
    this.value = [value[0], value[1]]
  }

  toJSON(): NewRangeJSON {
    return {
      kind: "NewRange",
      value: [this.value[0], this.value[1]],
    }
  }

  toEncodable() {
    return {
      NewRange: {
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
  static readonly discriminator = 1
  static readonly kind = "WithdrawAndFreeze"
  readonly discriminator = 1
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
export function fromDecoded(obj: any): types.RebalanceEffectsKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("NewRange" in obj) {
    const val = obj["NewRange"]
    return new NewRange([val["_0"], val["_1"]])
  }
  if ("WithdrawAndFreeze" in obj) {
    return new WithdrawAndFreeze()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.RebalanceEffectsJSON
): types.RebalanceEffectsKind {
  switch (obj.kind) {
    case "NewRange": {
      return new NewRange([obj.value[0], obj.value[1]])
    }
    case "WithdrawAndFreeze": {
      return new WithdrawAndFreeze()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([borsh.i32("_0"), borsh.i32("_1")], "NewRange"),
    borsh.struct([], "WithdrawAndFreeze"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
