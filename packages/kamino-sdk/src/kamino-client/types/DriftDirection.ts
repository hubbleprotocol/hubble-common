import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface IncreasingJSON {
  kind: "Increasing"
}

export class Increasing {
  static readonly discriminator = 0
  static readonly kind = "Increasing"
  readonly discriminator = 0
  readonly kind = "Increasing"

  toJSON(): IncreasingJSON {
    return {
      kind: "Increasing",
    }
  }

  toEncodable() {
    return {
      Increasing: {},
    }
  }
}

export interface DecreasingJSON {
  kind: "Decreasing"
}

export class Decreasing {
  static readonly discriminator = 1
  static readonly kind = "Decreasing"
  readonly discriminator = 1
  readonly kind = "Decreasing"

  toJSON(): DecreasingJSON {
    return {
      kind: "Decreasing",
    }
  }

  toEncodable() {
    return {
      Decreasing: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.DriftDirectionKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Increasing" in obj) {
    return new Increasing()
  }
  if ("Decreasing" in obj) {
    return new Decreasing()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.DriftDirectionJSON
): types.DriftDirectionKind {
  switch (obj.kind) {
    case "Increasing": {
      return new Increasing()
    }
    case "Decreasing": {
      return new Decreasing()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Increasing"),
    borsh.struct([], "Decreasing"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
