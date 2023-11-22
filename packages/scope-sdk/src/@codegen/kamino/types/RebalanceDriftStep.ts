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

export interface DriftingJSON {
  kind: "Drifting"
}

export class Drifting {
  static readonly discriminator = 1
  static readonly kind = "Drifting"
  readonly discriminator = 1
  readonly kind = "Drifting"

  toJSON(): DriftingJSON {
    return {
      kind: "Drifting",
    }
  }

  toEncodable() {
    return {
      Drifting: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.RebalanceDriftStepKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Uninitialized" in obj) {
    return new Uninitialized()
  }
  if ("Drifting" in obj) {
    return new Drifting()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.RebalanceDriftStepJSON
): types.RebalanceDriftStepKind {
  switch (obj.kind) {
    case "Uninitialized": {
      return new Uninitialized()
    }
    case "Drifting": {
      return new Drifting()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Uninitialized"),
    borsh.struct([], "Drifting"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
