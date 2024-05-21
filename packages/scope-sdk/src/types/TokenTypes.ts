import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface TokenAJSON {
  kind: "TokenA"
}

export class TokenA {
  static readonly discriminator = 0
  static readonly kind = "TokenA"
  readonly discriminator = 0
  readonly kind = "TokenA"

  toJSON(): TokenAJSON {
    return {
      kind: "TokenA",
    }
  }

  toEncodable() {
    return {
      TokenA: {},
    }
  }
}

export interface TokenBJSON {
  kind: "TokenB"
}

export class TokenB {
  static readonly discriminator = 1
  static readonly kind = "TokenB"
  readonly discriminator = 1
  readonly kind = "TokenB"

  toJSON(): TokenBJSON {
    return {
      kind: "TokenB",
    }
  }

  toEncodable() {
    return {
      TokenB: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.TokenTypesKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("TokenA" in obj) {
    return new TokenA()
  }
  if ("TokenB" in obj) {
    return new TokenB()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.TokenTypesJSON): types.TokenTypesKind {
  switch (obj.kind) {
    case "TokenA": {
      return new TokenA()
    }
    case "TokenB": {
      return new TokenB()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "TokenA"),
    borsh.struct([], "TokenB"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
