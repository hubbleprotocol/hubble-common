import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface USDCJSON {
  kind: "USDC"
}

export class USDC {
  static readonly discriminator = 0
  static readonly kind = "USDC"
  readonly discriminator = 0
  readonly kind = "USDC"

  toJSON(): USDCJSON {
    return {
      kind: "USDC",
    }
  }

  toEncodable() {
    return {
      USDC: {},
    }
  }
}

export interface USDHJSON {
  kind: "USDH"
}

export class USDH {
  static readonly discriminator = 1
  static readonly kind = "USDH"
  readonly discriminator = 1
  readonly kind = "USDH"

  toJSON(): USDHJSON {
    return {
      kind: "USDH",
    }
  }

  toEncodable() {
    return {
      USDH: {},
    }
  }
}

export interface SOLJSON {
  kind: "SOL"
}

export class SOL {
  static readonly discriminator = 2
  static readonly kind = "SOL"
  readonly discriminator = 2
  readonly kind = "SOL"

  toJSON(): SOLJSON {
    return {
      kind: "SOL",
    }
  }

  toEncodable() {
    return {
      SOL: {},
    }
  }
}

export interface ETHJSON {
  kind: "ETH"
}

export class ETH {
  static readonly discriminator = 3
  static readonly kind = "ETH"
  readonly discriminator = 3
  readonly kind = "ETH"

  toJSON(): ETHJSON {
    return {
      kind: "ETH",
    }
  }

  toEncodable() {
    return {
      ETH: {},
    }
  }
}

export interface BTCJSON {
  kind: "BTC"
}

export class BTC {
  static readonly discriminator = 4
  static readonly kind = "BTC"
  readonly discriminator = 4
  readonly kind = "BTC"

  toJSON(): BTCJSON {
    return {
      kind: "BTC",
    }
  }

  toEncodable() {
    return {
      BTC: {},
    }
  }
}

export interface MSOLJSON {
  kind: "MSOL"
}

export class MSOL {
  static readonly discriminator = 5
  static readonly kind = "MSOL"
  readonly discriminator = 5
  readonly kind = "MSOL"

  toJSON(): MSOLJSON {
    return {
      kind: "MSOL",
    }
  }

  toEncodable() {
    return {
      MSOL: {},
    }
  }
}

export interface STSOLJSON {
  kind: "STSOL"
}

export class STSOL {
  static readonly discriminator = 6
  static readonly kind = "STSOL"
  readonly discriminator = 6
  readonly kind = "STSOL"

  toJSON(): STSOLJSON {
    return {
      kind: "STSOL",
    }
  }

  toEncodable() {
    return {
      STSOL: {},
    }
  }
}

export interface USDTJSON {
  kind: "USDT"
}

export class USDT {
  static readonly discriminator = 7
  static readonly kind = "USDT"
  readonly discriminator = 7
  readonly kind = "USDT"

  toJSON(): USDTJSON {
    return {
      kind: "USDT",
    }
  }

  toEncodable() {
    return {
      USDT: {},
    }
  }
}

export interface ORCAJSON {
  kind: "ORCA"
}

export class ORCA {
  static readonly discriminator = 8
  static readonly kind = "ORCA"
  readonly discriminator = 8
  readonly kind = "ORCA"

  toJSON(): ORCAJSON {
    return {
      kind: "ORCA",
    }
  }

  toEncodable() {
    return {
      ORCA: {},
    }
  }
}

export interface MNDEJSON {
  kind: "MNDE"
}

export class MNDE {
  static readonly discriminator = 9
  static readonly kind = "MNDE"
  readonly discriminator = 9
  readonly kind = "MNDE"

  toJSON(): MNDEJSON {
    return {
      kind: "MNDE",
    }
  }

  toEncodable() {
    return {
      MNDE: {},
    }
  }
}

export interface HBBJSON {
  kind: "HBB"
}

export class HBB {
  static readonly discriminator = 10
  static readonly kind = "HBB"
  readonly discriminator = 10
  readonly kind = "HBB"

  toJSON(): HBBJSON {
    return {
      kind: "HBB",
    }
  }

  toEncodable() {
    return {
      HBB: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.CollateralTokenKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("USDC" in obj) {
    return new USDC()
  }
  if ("USDH" in obj) {
    return new USDH()
  }
  if ("SOL" in obj) {
    return new SOL()
  }
  if ("ETH" in obj) {
    return new ETH()
  }
  if ("BTC" in obj) {
    return new BTC()
  }
  if ("MSOL" in obj) {
    return new MSOL()
  }
  if ("STSOL" in obj) {
    return new STSOL()
  }
  if ("USDT" in obj) {
    return new USDT()
  }
  if ("ORCA" in obj) {
    return new ORCA()
  }
  if ("MNDE" in obj) {
    return new MNDE()
  }
  if ("HBB" in obj) {
    return new HBB()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.CollateralTokenJSON
): types.CollateralTokenKind {
  switch (obj.kind) {
    case "USDC": {
      return new USDC()
    }
    case "USDH": {
      return new USDH()
    }
    case "SOL": {
      return new SOL()
    }
    case "ETH": {
      return new ETH()
    }
    case "BTC": {
      return new BTC()
    }
    case "MSOL": {
      return new MSOL()
    }
    case "STSOL": {
      return new STSOL()
    }
    case "USDT": {
      return new USDT()
    }
    case "ORCA": {
      return new ORCA()
    }
    case "MNDE": {
      return new MNDE()
    }
    case "HBB": {
      return new HBB()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "USDC"),
    borsh.struct([], "USDH"),
    borsh.struct([], "SOL"),
    borsh.struct([], "ETH"),
    borsh.struct([], "BTC"),
    borsh.struct([], "MSOL"),
    borsh.struct([], "STSOL"),
    borsh.struct([], "USDT"),
    borsh.struct([], "ORCA"),
    borsh.struct([], "MNDE"),
    borsh.struct([], "HBB"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
