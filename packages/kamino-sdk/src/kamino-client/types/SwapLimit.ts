import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export type BpsFields = [BN]
export type BpsValue = [BN]

export interface BpsJSON {
  kind: "Bps"
  value: [string]
}

export class Bps {
  static readonly discriminator = 0
  static readonly kind = "Bps"
  readonly discriminator = 0
  readonly kind = "Bps"
  readonly value: BpsValue

  constructor(value: BpsFields) {
    this.value = [value[0]]
  }

  toJSON(): BpsJSON {
    return {
      kind: "Bps",
      value: [this.value[0].toString()],
    }
  }

  toEncodable() {
    return {
      Bps: {
        _0: this.value[0],
      },
    }
  }
}

export type AbsoluteFields = {
  /** Amount of src token expected by the user to perform the swap */
  srcAmountToSwap: BN
  /** Amount of dst token the user provides in exchange */
  dstAmountToVault: BN
  aToB: boolean
}
export type AbsoluteValue = {
  /** Amount of src token expected by the user to perform the swap */
  srcAmountToSwap: BN
  /** Amount of dst token the user provides in exchange */
  dstAmountToVault: BN
  aToB: boolean
}

export interface AbsoluteJSON {
  kind: "Absolute"
  value: {
    /** Amount of src token expected by the user to perform the swap */
    srcAmountToSwap: string
    /** Amount of dst token the user provides in exchange */
    dstAmountToVault: string
    aToB: boolean
  }
}

export class Absolute {
  static readonly discriminator = 1
  static readonly kind = "Absolute"
  readonly discriminator = 1
  readonly kind = "Absolute"
  readonly value: AbsoluteValue

  constructor(value: AbsoluteFields) {
    this.value = {
      srcAmountToSwap: value.srcAmountToSwap,
      dstAmountToVault: value.dstAmountToVault,
      aToB: value.aToB,
    }
  }

  toJSON(): AbsoluteJSON {
    return {
      kind: "Absolute",
      value: {
        srcAmountToSwap: this.value.srcAmountToSwap.toString(),
        dstAmountToVault: this.value.dstAmountToVault.toString(),
        aToB: this.value.aToB,
      },
    }
  }

  toEncodable() {
    return {
      Absolute: {
        src_amount_to_swap: this.value.srcAmountToSwap,
        dst_amount_to_vault: this.value.dstAmountToVault,
        a_to_b: this.value.aToB,
      },
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.SwapLimitKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Bps" in obj) {
    const val = obj["Bps"]
    return new Bps([val["_0"]])
  }
  if ("Absolute" in obj) {
    const val = obj["Absolute"]
    return new Absolute({
      srcAmountToSwap: val["src_amount_to_swap"],
      dstAmountToVault: val["dst_amount_to_vault"],
      aToB: val["a_to_b"],
    })
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.SwapLimitJSON): types.SwapLimitKind {
  switch (obj.kind) {
    case "Bps": {
      return new Bps([new BN(obj.value[0])])
    }
    case "Absolute": {
      return new Absolute({
        srcAmountToSwap: new BN(obj.value.srcAmountToSwap),
        dstAmountToVault: new BN(obj.value.dstAmountToVault),
        aToB: obj.value.aToB,
      })
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([borsh.u64("_0")], "Bps"),
    borsh.struct(
      [
        borsh.u64("src_amount_to_swap"),
        borsh.u64("dst_amount_to_vault"),
        borsh.bool("a_to_b"),
      ],
      "Absolute"
    ),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
