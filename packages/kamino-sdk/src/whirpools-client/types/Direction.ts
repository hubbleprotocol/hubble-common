import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface LeftJSON {
  kind: "Left"
}

export class Left {
  static readonly discriminator = 0
  static readonly kind = "Left"
  readonly discriminator = 0
  readonly kind = "Left"

  toJSON(): LeftJSON {
    return {
      kind: "Left",
    }
  }

  toEncodable() {
    return {
      Left: {},
    }
  }
}

export interface RightJSON {
  kind: "Right"
}

export class Right {
  static readonly discriminator = 1
  static readonly kind = "Right"
  readonly discriminator = 1
  readonly kind = "Right"

  toJSON(): RightJSON {
    return {
      kind: "Right",
    }
  }

  toEncodable() {
    return {
      Right: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.DirectionKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Left" in obj) {
    return new Left()
  }
  if ("Right" in obj) {
    return new Right()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.DirectionJSON): types.DirectionKind {
  switch (obj.kind) {
    case "Left": {
      return new Left()
    }
    case "Right": {
      return new Right()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Left"),
    borsh.struct([], "Right"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
