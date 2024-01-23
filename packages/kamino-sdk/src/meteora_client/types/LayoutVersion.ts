import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface V0JSON {
  kind: "V0"
}

export class V0 {
  static readonly discriminator = 0
  static readonly kind = "V0"
  readonly discriminator = 0
  readonly kind = "V0"

  toJSON(): V0JSON {
    return {
      kind: "V0",
    }
  }

  toEncodable() {
    return {
      V0: {},
    }
  }
}

export interface V1JSON {
  kind: "V1"
}

export class V1 {
  static readonly discriminator = 1
  static readonly kind = "V1"
  readonly discriminator = 1
  readonly kind = "V1"

  toJSON(): V1JSON {
    return {
      kind: "V1",
    }
  }

  toEncodable() {
    return {
      V1: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.LayoutVersionKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("V0" in obj) {
    return new V0()
  }
  if ("V1" in obj) {
    return new V1()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.LayoutVersionJSON
): types.LayoutVersionKind {
  switch (obj.kind) {
    case "V0": {
      return new V0()
    }
    case "V1": {
      return new V1()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([borsh.struct([], "V0"), borsh.struct([], "V1")])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
