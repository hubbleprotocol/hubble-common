import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface UninitializedJSON {
  kind: "Uninitialized"
}

export class Uninitialized {
  static readonly discriminator = 0
  static readonly kind = "Uninitialized"
  readonly discriminator = 0
  readonly kind = "Uninitialized"

  toJSON(): UninitializedJSON {
    return {
      kind: "Uninitialized",
    }
  }

  toEncodable() {
    return {
      Uninitialized: {},
    }
  }
}

export interface AutodriftingJSON {
  kind: "Autodrifting"
}

export class Autodrifting {
  static readonly discriminator = 1
  static readonly kind = "Autodrifting"
  readonly discriminator = 1
  readonly kind = "Autodrifting"

  toJSON(): AutodriftingJSON {
    return {
      kind: "Autodrifting",
    }
  }

  toEncodable() {
    return {
      Autodrifting: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.RebalanceAutodriftStepKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Uninitialized" in obj) {
    return new Uninitialized()
  }
  if ("Autodrifting" in obj) {
    return new Autodrifting()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.RebalanceAutodriftStepJSON
): types.RebalanceAutodriftStepKind {
  switch (obj.kind) {
    case "Uninitialized": {
      return new Uninitialized()
    }
    case "Autodrifting": {
      return new Autodrifting()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Uninitialized"),
    borsh.struct([], "Autodrifting"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
