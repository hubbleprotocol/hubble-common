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

export interface JSOLJSON {
  kind: "JSOL"
}

export class JSOL {
  static readonly discriminator = 11
  static readonly kind = "JSOL"
  readonly discriminator = 11
  readonly kind = "JSOL"

  toJSON(): JSOLJSON {
    return {
      kind: "JSOL",
    }
  }

  toEncodable() {
    return {
      JSOL: {},
    }
  }
}

export interface USHJSON {
  kind: "USH"
}

export class USH {
  static readonly discriminator = 12
  static readonly kind = "USH"
  readonly discriminator = 12
  readonly kind = "USH"

  toJSON(): USHJSON {
    return {
      kind: "USH",
    }
  }

  toEncodable() {
    return {
      USH: {},
    }
  }
}

export interface DAIJSON {
  kind: "DAI"
}

export class DAI {
  static readonly discriminator = 13
  static readonly kind = "DAI"
  readonly discriminator = 13
  readonly kind = "DAI"

  toJSON(): DAIJSON {
    return {
      kind: "DAI",
    }
  }

  toEncodable() {
    return {
      DAI: {},
    }
  }
}

export interface LDOJSON {
  kind: "LDO"
}

export class LDO {
  static readonly discriminator = 14
  static readonly kind = "LDO"
  readonly discriminator = 14
  readonly kind = "LDO"

  toJSON(): LDOJSON {
    return {
      kind: "LDO",
    }
  }

  toEncodable() {
    return {
      LDO: {},
    }
  }
}

export interface SCNSOLJSON {
  kind: "SCNSOL"
}

export class SCNSOL {
  static readonly discriminator = 15
  static readonly kind = "SCNSOL"
  readonly discriminator = 15
  readonly kind = "SCNSOL"

  toJSON(): SCNSOLJSON {
    return {
      kind: "SCNSOL",
    }
  }

  toEncodable() {
    return {
      SCNSOL: {},
    }
  }
}

export interface UXDJSON {
  kind: "UXD"
}

export class UXD {
  static readonly discriminator = 16
  static readonly kind = "UXD"
  readonly discriminator = 16
  readonly kind = "UXD"

  toJSON(): UXDJSON {
    return {
      kind: "UXD",
    }
  }

  toEncodable() {
    return {
      UXD: {},
    }
  }
}

export interface HDGJSON {
  kind: "HDG"
}

export class HDG {
  static readonly discriminator = 17
  static readonly kind = "HDG"
  readonly discriminator = 17
  readonly kind = "HDG"

  toJSON(): HDGJSON {
    return {
      kind: "HDG",
    }
  }

  toEncodable() {
    return {
      HDG: {},
    }
  }
}

export interface DUSTJSON {
  kind: "DUST"
}

export class DUST {
  static readonly discriminator = 18
  static readonly kind = "DUST"
  readonly discriminator = 18
  readonly kind = "DUST"

  toJSON(): DUSTJSON {
    return {
      kind: "DUST",
    }
  }

  toEncodable() {
    return {
      DUST: {},
    }
  }
}

export interface USDRJSON {
  kind: "USDR"
}

export class USDR {
  static readonly discriminator = 19
  static readonly kind = "USDR"
  readonly discriminator = 19
  readonly kind = "USDR"

  toJSON(): USDRJSON {
    return {
      kind: "USDR",
    }
  }

  toEncodable() {
    return {
      USDR: {},
    }
  }
}

export interface RATIOJSON {
  kind: "RATIO"
}

export class RATIO {
  static readonly discriminator = 20
  static readonly kind = "RATIO"
  readonly discriminator = 20
  readonly kind = "RATIO"

  toJSON(): RATIOJSON {
    return {
      kind: "RATIO",
    }
  }

  toEncodable() {
    return {
      RATIO: {},
    }
  }
}

export interface UXPJSON {
  kind: "UXP"
}

export class UXP {
  static readonly discriminator = 21
  static readonly kind = "UXP"
  readonly discriminator = 21
  readonly kind = "UXP"

  toJSON(): UXPJSON {
    return {
      kind: "UXP",
    }
  }

  toEncodable() {
    return {
      UXP: {},
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
  if ("JSOL" in obj) {
    return new JSOL()
  }
  if ("USH" in obj) {
    return new USH()
  }
  if ("DAI" in obj) {
    return new DAI()
  }
  if ("LDO" in obj) {
    return new LDO()
  }
  if ("SCNSOL" in obj) {
    return new SCNSOL()
  }
  if ("UXD" in obj) {
    return new UXD()
  }
  if ("HDG" in obj) {
    return new HDG()
  }
  if ("DUST" in obj) {
    return new DUST()
  }
  if ("USDR" in obj) {
    return new USDR()
  }
  if ("RATIO" in obj) {
    return new RATIO()
  }
  if ("UXP" in obj) {
    return new UXP()
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
    case "JSOL": {
      return new JSOL()
    }
    case "USH": {
      return new USH()
    }
    case "DAI": {
      return new DAI()
    }
    case "LDO": {
      return new LDO()
    }
    case "SCNSOL": {
      return new SCNSOL()
    }
    case "UXD": {
      return new UXD()
    }
    case "HDG": {
      return new HDG()
    }
    case "DUST": {
      return new DUST()
    }
    case "USDR": {
      return new USDR()
    }
    case "RATIO": {
      return new RATIO()
    }
    case "UXP": {
      return new UXP()
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
    borsh.struct([], "JSOL"),
    borsh.struct([], "USH"),
    borsh.struct([], "DAI"),
    borsh.struct([], "LDO"),
    borsh.struct([], "SCNSOL"),
    borsh.struct([], "UXD"),
    borsh.struct([], "HDG"),
    borsh.struct([], "DUST"),
    borsh.struct([], "USDR"),
    borsh.struct([], "RATIO"),
    borsh.struct([], "UXP"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
