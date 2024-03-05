import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface StableJSON {
  kind: "Stable"
}

export class Stable {
  static readonly discriminator = 0
  static readonly kind = "Stable"
  readonly discriminator = 0
  readonly kind = "Stable"

  toJSON(): StableJSON {
    return {
      kind: "Stable",
    }
  }

  toEncodable() {
    return {
      Stable: {},
    }
  }
}

export interface PeggedJSON {
  kind: "Pegged"
}

export class Pegged {
  static readonly discriminator = 1
  static readonly kind = "Pegged"
  readonly discriminator = 1
  readonly kind = "Pegged"

  toJSON(): PeggedJSON {
    return {
      kind: "Pegged",
    }
  }

  toEncodable() {
    return {
      Pegged: {},
    }
  }
}

export interface VolatileJSON {
  kind: "Volatile"
}

export class Volatile {
  static readonly discriminator = 2
  static readonly kind = "Volatile"
  readonly discriminator = 2
  readonly kind = "Volatile"

  toJSON(): VolatileJSON {
    return {
      kind: "Volatile",
    }
  }

  toEncodable() {
    return {
      Volatile: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.StrategyTypeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Stable" in obj) {
    return new Stable()
  }
  if ("Pegged" in obj) {
    return new Pegged()
  }
  if ("Volatile" in obj) {
    return new Volatile()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.StrategyTypeJSON): types.StrategyTypeKind {
  switch (obj.kind) {
    case "Stable": {
      return new Stable()
    }
    case "Pegged": {
      return new Pegged()
    }
    case "Volatile": {
      return new Volatile()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Stable"),
    borsh.struct([], "Pegged"),
    borsh.struct([], "Volatile"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
