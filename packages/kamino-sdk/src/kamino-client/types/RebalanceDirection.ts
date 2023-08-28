import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface ExpandJSON {
  kind: "Expand"
}

export class Expand {
  static readonly discriminator = 0
  static readonly kind = "Expand"
  readonly discriminator = 0
  readonly kind = "Expand"

  toJSON(): ExpandJSON {
    return {
      kind: "Expand",
    }
  }

  toEncodable() {
    return {
      Expand: {},
    }
  }
}

export interface NarrowJSON {
  kind: "Narrow"
}

export class Narrow {
  static readonly discriminator = 1
  static readonly kind = "Narrow"
  readonly discriminator = 1
  readonly kind = "Narrow"

  toJSON(): NarrowJSON {
    return {
      kind: "Narrow",
    }
  }

  toEncodable() {
    return {
      Narrow: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.RebalanceDirectionKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Expand" in obj) {
    return new Expand()
  }
  if ("Narrow" in obj) {
    return new Narrow()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.RebalanceDirectionJSON
): types.RebalanceDirectionKind {
  switch (obj.kind) {
    case "Expand": {
      return new Expand()
    }
    case "Narrow": {
      return new Narrow()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Expand"),
    borsh.struct([], "Narrow"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
