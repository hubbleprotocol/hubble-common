import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface LowerJSON {
  kind: "Lower"
}

export class Lower {
  static readonly discriminator = 0
  static readonly kind = "Lower"
  readonly discriminator = 0
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

export interface UpperJSON {
  kind: "Upper"
}

export class Upper {
  static readonly discriminator = 1
  static readonly kind = "Upper"
  readonly discriminator = 1
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.ResizeSideKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Lower" in obj) {
    return new Lower()
  }
  if ("Upper" in obj) {
    return new Upper()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.ResizeSideJSON): types.ResizeSideKind {
  switch (obj.kind) {
    case "Lower": {
      return new Lower()
    }
    case "Upper": {
      return new Upper()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Lower"),
    borsh.struct([], "Upper"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
