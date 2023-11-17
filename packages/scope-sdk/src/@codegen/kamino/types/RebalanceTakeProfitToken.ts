import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface AJSON {
  kind: "A"
}

export class A {
  static readonly discriminator = 0
  static readonly kind = "A"
  readonly discriminator = 0
  readonly kind = "A"

  toJSON(): AJSON {
    return {
      kind: "A",
    }
  }

  toEncodable() {
    return {
      A: {},
    }
  }
}

export interface BJSON {
  kind: "B"
}

export class B {
  static readonly discriminator = 1
  static readonly kind = "B"
  readonly discriminator = 1
  readonly kind = "B"

  toJSON(): BJSON {
    return {
      kind: "B",
    }
  }

  toEncodable() {
    return {
      B: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.RebalanceTakeProfitTokenKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("A" in obj) {
    return new A()
  }
  if ("B" in obj) {
    return new B()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.RebalanceTakeProfitTokenJSON
): types.RebalanceTakeProfitTokenKind {
  switch (obj.kind) {
    case "A": {
      return new A()
    }
    case "B": {
      return new B()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([borsh.struct([], "A"), borsh.struct([], "B")])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
