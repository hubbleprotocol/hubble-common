import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface SpotOneSideJSON {
  kind: "SpotOneSide"
}

export class SpotOneSide {
  static readonly discriminator = 0
  static readonly kind = "SpotOneSide"
  readonly discriminator = 0
  readonly kind = "SpotOneSide"

  toJSON(): SpotOneSideJSON {
    return {
      kind: "SpotOneSide",
    }
  }

  toEncodable() {
    return {
      SpotOneSide: {},
    }
  }
}

export interface CurveOneSideJSON {
  kind: "CurveOneSide"
}

export class CurveOneSide {
  static readonly discriminator = 1
  static readonly kind = "CurveOneSide"
  readonly discriminator = 1
  readonly kind = "CurveOneSide"

  toJSON(): CurveOneSideJSON {
    return {
      kind: "CurveOneSide",
    }
  }

  toEncodable() {
    return {
      CurveOneSide: {},
    }
  }
}

export interface BidAskOneSideJSON {
  kind: "BidAskOneSide"
}

export class BidAskOneSide {
  static readonly discriminator = 2
  static readonly kind = "BidAskOneSide"
  readonly discriminator = 2
  readonly kind = "BidAskOneSide"

  toJSON(): BidAskOneSideJSON {
    return {
      kind: "BidAskOneSide",
    }
  }

  toEncodable() {
    return {
      BidAskOneSide: {},
    }
  }
}

export interface SpotBalancedJSON {
  kind: "SpotBalanced"
}

export class SpotBalanced {
  static readonly discriminator = 3
  static readonly kind = "SpotBalanced"
  readonly discriminator = 3
  readonly kind = "SpotBalanced"

  toJSON(): SpotBalancedJSON {
    return {
      kind: "SpotBalanced",
    }
  }

  toEncodable() {
    return {
      SpotBalanced: {},
    }
  }
}

export interface CurveBalancedJSON {
  kind: "CurveBalanced"
}

export class CurveBalanced {
  static readonly discriminator = 4
  static readonly kind = "CurveBalanced"
  readonly discriminator = 4
  readonly kind = "CurveBalanced"

  toJSON(): CurveBalancedJSON {
    return {
      kind: "CurveBalanced",
    }
  }

  toEncodable() {
    return {
      CurveBalanced: {},
    }
  }
}

export interface BidAskBalancedJSON {
  kind: "BidAskBalanced"
}

export class BidAskBalanced {
  static readonly discriminator = 5
  static readonly kind = "BidAskBalanced"
  readonly discriminator = 5
  readonly kind = "BidAskBalanced"

  toJSON(): BidAskBalancedJSON {
    return {
      kind: "BidAskBalanced",
    }
  }

  toEncodable() {
    return {
      BidAskBalanced: {},
    }
  }
}

export interface SpotImBalancedJSON {
  kind: "SpotImBalanced"
}

export class SpotImBalanced {
  static readonly discriminator = 6
  static readonly kind = "SpotImBalanced"
  readonly discriminator = 6
  readonly kind = "SpotImBalanced"

  toJSON(): SpotImBalancedJSON {
    return {
      kind: "SpotImBalanced",
    }
  }

  toEncodable() {
    return {
      SpotImBalanced: {},
    }
  }
}

export interface CurveImBalancedJSON {
  kind: "CurveImBalanced"
}

export class CurveImBalanced {
  static readonly discriminator = 7
  static readonly kind = "CurveImBalanced"
  readonly discriminator = 7
  readonly kind = "CurveImBalanced"

  toJSON(): CurveImBalancedJSON {
    return {
      kind: "CurveImBalanced",
    }
  }

  toEncodable() {
    return {
      CurveImBalanced: {},
    }
  }
}

export interface BidAskImBalancedJSON {
  kind: "BidAskImBalanced"
}

export class BidAskImBalanced {
  static readonly discriminator = 8
  static readonly kind = "BidAskImBalanced"
  readonly discriminator = 8
  readonly kind = "BidAskImBalanced"

  toJSON(): BidAskImBalancedJSON {
    return {
      kind: "BidAskImBalanced",
    }
  }

  toEncodable() {
    return {
      BidAskImBalanced: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.StrategyTypeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("SpotOneSide" in obj) {
    return new SpotOneSide()
  }
  if ("CurveOneSide" in obj) {
    return new CurveOneSide()
  }
  if ("BidAskOneSide" in obj) {
    return new BidAskOneSide()
  }
  if ("SpotBalanced" in obj) {
    return new SpotBalanced()
  }
  if ("CurveBalanced" in obj) {
    return new CurveBalanced()
  }
  if ("BidAskBalanced" in obj) {
    return new BidAskBalanced()
  }
  if ("SpotImBalanced" in obj) {
    return new SpotImBalanced()
  }
  if ("CurveImBalanced" in obj) {
    return new CurveImBalanced()
  }
  if ("BidAskImBalanced" in obj) {
    return new BidAskImBalanced()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.StrategyTypeJSON): types.StrategyTypeKind {
  switch (obj.kind) {
    case "SpotOneSide": {
      return new SpotOneSide()
    }
    case "CurveOneSide": {
      return new CurveOneSide()
    }
    case "BidAskOneSide": {
      return new BidAskOneSide()
    }
    case "SpotBalanced": {
      return new SpotBalanced()
    }
    case "CurveBalanced": {
      return new CurveBalanced()
    }
    case "BidAskBalanced": {
      return new BidAskBalanced()
    }
    case "SpotImBalanced": {
      return new SpotImBalanced()
    }
    case "CurveImBalanced": {
      return new CurveImBalanced()
    }
    case "BidAskImBalanced": {
      return new BidAskImBalanced()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "SpotOneSide"),
    borsh.struct([], "CurveOneSide"),
    borsh.struct([], "BidAskOneSide"),
    borsh.struct([], "SpotBalanced"),
    borsh.struct([], "CurveBalanced"),
    borsh.struct([], "BidAskBalanced"),
    borsh.struct([], "SpotImBalanced"),
    borsh.struct([], "CurveImBalanced"),
    borsh.struct([], "BidAskImBalanced"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
