import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface ManualJSON {
  kind: "Manual"
}

export class Manual {
  static readonly discriminator = 0
  static readonly kind = "Manual"
  readonly discriminator = 0
  readonly kind = "Manual"

  toJSON(): ManualJSON {
    return {
      kind: "Manual",
    }
  }

  toEncodable() {
    return {
      Manual: {},
    }
  }
}

export interface PricePercentageJSON {
  kind: "PricePercentage"
}

export class PricePercentage {
  static readonly discriminator = 1
  static readonly kind = "PricePercentage"
  readonly discriminator = 1
  readonly kind = "PricePercentage"

  toJSON(): PricePercentageJSON {
    return {
      kind: "PricePercentage",
    }
  }

  toEncodable() {
    return {
      PricePercentage: {},
    }
  }
}

export interface PricePercentageWithResetJSON {
  kind: "PricePercentageWithReset"
}

export class PricePercentageWithReset {
  static readonly discriminator = 2
  static readonly kind = "PricePercentageWithReset"
  readonly discriminator = 2
  readonly kind = "PricePercentageWithReset"

  toJSON(): PricePercentageWithResetJSON {
    return {
      kind: "PricePercentageWithReset",
    }
  }

  toEncodable() {
    return {
      PricePercentageWithReset: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.RebalanceTypeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Manual" in obj) {
    return new Manual()
  }
  if ("PricePercentage" in obj) {
    return new PricePercentage()
  }
  if ("PricePercentageWithReset" in obj) {
    return new PricePercentageWithReset()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.RebalanceTypeJSON
): types.RebalanceTypeKind {
  switch (obj.kind) {
    case "Manual": {
      return new Manual()
    }
    case "PricePercentage": {
      return new PricePercentage()
    }
    case "PricePercentageWithReset": {
      return new PricePercentageWithReset()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Manual"),
    borsh.struct([], "PricePercentage"),
    borsh.struct([], "PricePercentageWithReset"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
