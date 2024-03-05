import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface ConstantJSON {
  kind: "Constant"
}

export class Constant {
  static readonly discriminator = 0
  static readonly kind = "Constant"
  readonly discriminator = 0
  readonly kind = "Constant"

  toJSON(): ConstantJSON {
    return {
      kind: "Constant",
    }
  }

  toEncodable() {
    return {
      Constant: {},
    }
  }
}

export interface ScopeJSON {
  kind: "Scope"
}

export class Scope {
  static readonly discriminator = 1
  static readonly kind = "Scope"
  readonly discriminator = 1
  readonly kind = "Scope"

  toJSON(): ScopeJSON {
    return {
      kind: "Scope",
    }
  }

  toEncodable() {
    return {
      Scope: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.StakingRateSourceKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Constant" in obj) {
    return new Constant()
  }
  if ("Scope" in obj) {
    return new Scope()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.StakingRateSourceJSON
): types.StakingRateSourceKind {
  switch (obj.kind) {
    case "Constant": {
      return new Constant()
    }
    case "Scope": {
      return new Scope()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Constant"),
    borsh.struct([], "Scope"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
