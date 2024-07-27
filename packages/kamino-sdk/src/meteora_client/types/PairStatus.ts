import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface EnabledJSON {
  kind: "Enabled"
}

export class Enabled {
  static readonly discriminator = 0
  static readonly kind = "Enabled"
  readonly discriminator = 0
  readonly kind = "Enabled"

  toJSON(): EnabledJSON {
    return {
      kind: "Enabled",
    }
  }

  toEncodable() {
    return {
      Enabled: {},
    }
  }
}

export interface DisabledJSON {
  kind: "Disabled"
}

export class Disabled {
  static readonly discriminator = 1
  static readonly kind = "Disabled"
  readonly discriminator = 1
  readonly kind = "Disabled"

  toJSON(): DisabledJSON {
    return {
      kind: "Disabled",
    }
  }

  toEncodable() {
    return {
      Disabled: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.PairStatusKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Enabled" in obj) {
    return new Enabled()
  }
  if ("Disabled" in obj) {
    return new Disabled()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.PairStatusJSON): types.PairStatusKind {
  switch (obj.kind) {
    case "Enabled": {
      return new Enabled()
    }
    case "Disabled": {
      return new Disabled()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Enabled"),
    borsh.struct([], "Disabled"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
