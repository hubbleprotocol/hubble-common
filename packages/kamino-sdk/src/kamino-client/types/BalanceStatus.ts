import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface BalancedJSON {
  kind: "Balanced"
}

export class Balanced {
  static readonly discriminator = 0
  static readonly kind = "Balanced"
  readonly discriminator = 0
  readonly kind = "Balanced"

  toJSON(): BalancedJSON {
    return {
      kind: "Balanced",
    }
  }

  toEncodable() {
    return {
      Balanced: {},
    }
  }
}

export interface UnbalancedJSON {
  kind: "Unbalanced"
}

export class Unbalanced {
  static readonly discriminator = 1
  static readonly kind = "Unbalanced"
  readonly discriminator = 1
  readonly kind = "Unbalanced"

  toJSON(): UnbalancedJSON {
    return {
      kind: "Unbalanced",
    }
  }

  toEncodable() {
    return {
      Unbalanced: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.BalanceStatusKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Balanced" in obj) {
    return new Balanced()
  }
  if ("Unbalanced" in obj) {
    return new Unbalanced()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.BalanceStatusJSON
): types.BalanceStatusKind {
  switch (obj.kind) {
    case "Balanced": {
      return new Balanced()
    }
    case "Unbalanced": {
      return new Unbalanced()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Balanced"),
    borsh.struct([], "Unbalanced"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
