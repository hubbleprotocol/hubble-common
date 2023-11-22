import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface NameJSON {
  kind: "Name"
}

export class Name {
  static readonly discriminator = 0
  static readonly kind = "Name"
  readonly discriminator = 0
  readonly kind = "Name"

  toJSON(): NameJSON {
    return {
      kind: "Name",
    }
  }

  toEncodable() {
    return {
      Name: {},
    }
  }
}

export interface MaxPriceAgeSecondsJSON {
  kind: "MaxPriceAgeSeconds"
}

export class MaxPriceAgeSeconds {
  static readonly discriminator = 1
  static readonly kind = "MaxPriceAgeSeconds"
  readonly discriminator = 1
  readonly kind = "MaxPriceAgeSeconds"

  toJSON(): MaxPriceAgeSecondsJSON {
    return {
      kind: "MaxPriceAgeSeconds",
    }
  }

  toEncodable() {
    return {
      MaxPriceAgeSeconds: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.UpdateTokenMetadataModeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Name" in obj) {
    return new Name()
  }
  if ("MaxPriceAgeSeconds" in obj) {
    return new MaxPriceAgeSeconds()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.UpdateTokenMetadataModeJSON
): types.UpdateTokenMetadataModeKind {
  switch (obj.kind) {
    case "Name": {
      return new Name()
    }
    case "MaxPriceAgeSeconds": {
      return new MaxPriceAgeSeconds()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Name"),
    borsh.struct([], "MaxPriceAgeSeconds"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
