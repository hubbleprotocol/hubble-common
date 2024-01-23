import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface PriceBasedJSON {
  kind: "PriceBased"
}

export class PriceBased {
  static readonly discriminator = 0
  static readonly kind = "PriceBased"
  readonly discriminator = 0
  readonly kind = "PriceBased"

  toJSON(): PriceBasedJSON {
    return {
      kind: "PriceBased",
    }
  }

  toEncodable() {
    return {
      PriceBased: {},
    }
  }
}

export interface ProportionalJSON {
  kind: "Proportional"
}

export class Proportional {
  static readonly discriminator = 1
  static readonly kind = "Proportional"
  readonly discriminator = 1
  readonly kind = "Proportional"

  toJSON(): ProportionalJSON {
    return {
      kind: "Proportional",
    }
  }

  toEncodable() {
    return {
      Proportional: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.MintingMethodKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("PriceBased" in obj) {
    return new PriceBased()
  }
  if ("Proportional" in obj) {
    return new Proportional()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.MintingMethodJSON
): types.MintingMethodKind {
  switch (obj.kind) {
    case "PriceBased": {
      return new PriceBased()
    }
    case "Proportional": {
      return new Proportional()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "PriceBased"),
    borsh.struct([], "Proportional"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
