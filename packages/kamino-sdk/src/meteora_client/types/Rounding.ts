import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface UpJSON {
  kind: "Up"
}

export class Up {
  static readonly discriminator = 0
  static readonly kind = "Up"
  readonly discriminator = 0
  readonly kind = "Up"

  toJSON(): UpJSON {
    return {
      kind: "Up",
    }
  }

  toEncodable() {
    return {
      Up: {},
    }
  }
}

export interface DownJSON {
  kind: "Down"
}

export class Down {
  static readonly discriminator = 1
  static readonly kind = "Down"
  readonly discriminator = 1
  readonly kind = "Down"

  toJSON(): DownJSON {
    return {
      kind: "Down",
    }
  }

  toEncodable() {
    return {
      Down: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.RoundingKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Up" in obj) {
    return new Up()
  }
  if ("Down" in obj) {
    return new Down()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.RoundingJSON): types.RoundingKind {
  switch (obj.kind) {
    case "Up": {
      return new Up()
    }
    case "Down": {
      return new Down()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([borsh.struct([], "Up"), borsh.struct([], "Down")])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
