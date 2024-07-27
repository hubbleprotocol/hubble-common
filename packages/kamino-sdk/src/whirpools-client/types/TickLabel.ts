import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface UpperJSON {
  kind: "Upper"
}

export class Upper {
  static readonly discriminator = 0
  static readonly kind = "Upper"
  readonly discriminator = 0
  readonly kind = "Upper"

  toJSON(): UpperJSON {
    return {
      kind: "Upper",
    }
  }

  toEncodable() {
    return {
      Upper: {},
    }
  }
}

export interface LowerJSON {
  kind: "Lower"
}

export class Lower {
  static readonly discriminator = 1
  static readonly kind = "Lower"
  readonly discriminator = 1
  readonly kind = "Lower"

  toJSON(): LowerJSON {
    return {
      kind: "Lower",
    }
  }

  toEncodable() {
    return {
      Lower: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.TickLabelKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Upper" in obj) {
    return new Upper()
  }
  if ("Lower" in obj) {
    return new Lower()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.TickLabelJSON): types.TickLabelKind {
  switch (obj.kind) {
    case "Upper": {
      return new Upper()
    }
    case "Lower": {
      return new Lower()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Upper"),
    borsh.struct([], "Lower"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
