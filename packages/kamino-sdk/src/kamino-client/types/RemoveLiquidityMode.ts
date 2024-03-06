import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export type LiquidityFields = [BN]
export type LiquidityValue = [BN]

export interface LiquidityJSON {
  kind: "Liquidity"
  value: [string]
}

export class Liquidity {
  static readonly discriminator = 0
  static readonly kind = "Liquidity"
  readonly discriminator = 0
  readonly kind = "Liquidity"
  readonly value: LiquidityValue

  constructor(value: LiquidityFields) {
    this.value = [value[0]]
  }

  toJSON(): LiquidityJSON {
    return {
      kind: "Liquidity",
      value: [this.value[0].toString()],
    }
  }

  toEncodable() {
    return {
      Liquidity: {
        _0: this.value[0],
      },
    }
  }
}

export type BpsFields = [number]
export type BpsValue = [number]

export interface BpsJSON {
  kind: "Bps"
  value: [number]
}

export class Bps {
  static readonly discriminator = 1
  static readonly kind = "Bps"
  readonly discriminator = 1
  readonly kind = "Bps"
  readonly value: BpsValue

  constructor(value: BpsFields) {
    this.value = [value[0]]
  }

  toJSON(): BpsJSON {
    return {
      kind: "Bps",
      value: [this.value[0]],
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

export interface AllJSON {
  kind: "All"
}

export class All {
  static readonly discriminator = 2
  static readonly kind = "All"
  readonly discriminator = 2
  readonly kind = "All"

  toJSON(): AllJSON {
    return {
      kind: "All",
    }
  }

  toEncodable() {
    return {
      All: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.RemoveLiquidityModeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Liquidity" in obj) {
    const val = obj["Liquidity"]
    return new Liquidity([val["_0"]])
  }
  if ("Bps" in obj) {
    const val = obj["Bps"]
    return new Bps([val["_0"]])
  }
  if ("All" in obj) {
    return new All()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.RemoveLiquidityModeJSON
): types.RemoveLiquidityModeKind {
  switch (obj.kind) {
    case "Liquidity": {
      return new Liquidity([new BN(obj.value[0])])
    }
    case "Bps": {
      return new Bps([obj.value[0]])
    }
    case "All": {
      return new All()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([borsh.u128("_0")], "Liquidity"),
    borsh.struct([borsh.u16("_0")], "Bps"),
    borsh.struct([], "All"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
