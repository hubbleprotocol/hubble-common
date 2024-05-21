import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface Ema1hJSON {
  kind: "Ema1h"
}

export class Ema1h {
  static readonly discriminator = 0
  static readonly kind = "Ema1h"
  readonly discriminator = 0
  readonly kind = "Ema1h"

  toJSON(): Ema1hJSON {
    return {
      kind: "Ema1h",
    }
  }

  toEncodable() {
    return {
      Ema1h: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.EmaTypeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Ema1h" in obj) {
    return new Ema1h()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.EmaTypeJSON): types.EmaTypeKind {
  switch (obj.kind) {
    case "Ema1h": {
      return new Ema1h()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([borsh.struct([], "Ema1h")])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
