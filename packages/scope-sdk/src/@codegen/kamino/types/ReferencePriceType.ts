import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface POOLJSON {
  kind: "POOL"
}

export class POOL {
  static readonly discriminator = 0
  static readonly kind = "POOL"
  readonly discriminator = 0
  readonly kind = "POOL"

  toJSON(): POOLJSON {
    return {
      kind: "POOL",
    }
  }

  toEncodable() {
    return {
      POOL: {},
    }
  }
}

export interface TWAPJSON {
  kind: "TWAP"
}

export class TWAP {
  static readonly discriminator = 1
  static readonly kind = "TWAP"
  readonly discriminator = 1
  readonly kind = "TWAP"

  toJSON(): TWAPJSON {
    return {
      kind: "TWAP",
    }
  }

  toEncodable() {
    return {
      TWAP: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.ReferencePriceTypeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("POOL" in obj) {
    return new POOL()
  }
  if ("TWAP" in obj) {
    return new TWAP()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.ReferencePriceTypeJSON
): types.ReferencePriceTypeKind {
  switch (obj.kind) {
    case "POOL": {
      return new POOL()
    }
    case "TWAP": {
      return new TWAP()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "POOL"),
    borsh.struct([], "TWAP"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
