import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface SpotJSON {
  kind: "Spot"
}

export class Spot {
  static readonly discriminator = 0
  static readonly kind = "Spot"
  readonly discriminator = 0
  readonly kind = "Spot"

  toJSON(): SpotJSON {
    return {
      kind: "Spot",
    }
  }

  toEncodable() {
    return {
      Spot: {},
    }
  }
}

export interface CurveJSON {
  kind: "Curve"
}

export class Curve {
  static readonly discriminator = 1
  static readonly kind = "Curve"
  readonly discriminator = 1
  readonly kind = "Curve"

  toJSON(): CurveJSON {
    return {
      kind: "Curve",
    }
  }

  toEncodable() {
    return {
      Curve: {},
    }
  }
}

export interface BidAskJSON {
  kind: "BidAsk"
}

export class BidAsk {
  static readonly discriminator = 2
  static readonly kind = "BidAsk"
  readonly discriminator = 2
  readonly kind = "BidAsk"

  toJSON(): BidAskJSON {
    return {
      kind: "BidAsk",
    }
  }

  toEncodable() {
    return {
      BidAsk: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.StrategyTypeKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Spot" in obj) {
    return new Spot()
  }
  if ("Curve" in obj) {
    return new Curve()
  }
  if ("BidAsk" in obj) {
    return new BidAsk()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.StrategyTypeJSON): types.StrategyTypeKind {
  switch (obj.kind) {
    case "Spot": {
      return new Spot()
    }
    case "Curve": {
      return new Curve()
    }
    case "BidAsk": {
      return new BidAsk()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Spot"),
    borsh.struct([], "Curve"),
    borsh.struct([], "BidAsk"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
