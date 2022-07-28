import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface SOLJSON {
  kind: "SOL"
}

export class SOL {
  static readonly discriminator = 0
  static readonly kind = "SOL"
  readonly discriminator = 0
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
  static readonly discriminator = 1
  static readonly kind = "ETH"
  readonly discriminator = 1
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
  static readonly discriminator = 2
  static readonly kind = "BTC"
  readonly discriminator = 2
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

export interface SRMJSON {
  kind: "SRM"
}

export class SRM {
  static readonly discriminator = 3
  static readonly kind = "SRM"
  readonly discriminator = 3
  readonly kind = "SRM"

  toJSON(): SRMJSON {
    return {
      kind: "SRM",
    }
  }

  toEncodable() {
    return {
      SRM: {},
    }
  }
}

export interface RAYJSON {
  kind: "RAY"
}

export class RAY {
  static readonly discriminator = 4
  static readonly kind = "RAY"
  readonly discriminator = 4
  readonly kind = "RAY"

  toJSON(): RAYJSON {
    return {
      kind: "RAY",
    }
  }

  toEncodable() {
    return {
      RAY: {},
    }
  }
}

export interface FTTJSON {
  kind: "FTT"
}

export class FTT {
  static readonly discriminator = 5
  static readonly kind = "FTT"
  readonly discriminator = 5
  readonly kind = "FTT"

  toJSON(): FTTJSON {
    return {
      kind: "FTT",
    }
  }

  toEncodable() {
    return {
      FTT: {},
    }
  }
}

export interface MSOLJSON {
  kind: "MSOL"
}

export class MSOL {
  static readonly discriminator = 6
  static readonly kind = "MSOL"
  readonly discriminator = 6
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

export interface scnSOL_SOLJSON {
  kind: "scnSOL_SOL"
}

export class scnSOL_SOL {
  static readonly discriminator = 7
  static readonly kind = "scnSOL_SOL"
  readonly discriminator = 7
  readonly kind = "scnSOL_SOL"

  toJSON(): scnSOL_SOLJSON {
    return {
      kind: "scnSOL_SOL",
    }
  }

  toEncodable() {
    return {
      scnSOL_SOL: {},
    }
  }
}

export interface BNBJSON {
  kind: "BNB"
}

export class BNB {
  static readonly discriminator = 8
  static readonly kind = "BNB"
  readonly discriminator = 8
  readonly kind = "BNB"

  toJSON(): BNBJSON {
    return {
      kind: "BNB",
    }
  }

  toEncodable() {
    return {
      BNB: {},
    }
  }
}

export interface AVAXJSON {
  kind: "AVAX"
}

export class AVAX {
  static readonly discriminator = 9
  static readonly kind = "AVAX"
  readonly discriminator = 9
  readonly kind = "AVAX"

  toJSON(): AVAXJSON {
    return {
      kind: "AVAX",
    }
  }

  toEncodable() {
    return {
      AVAX: {},
    }
  }
}

export interface DaoSOL_SOLJSON {
  kind: "DaoSOL_SOL"
}

export class DaoSOL_SOL {
  static readonly discriminator = 10
  static readonly kind = "DaoSOL_SOL"
  readonly discriminator = 10
  readonly kind = "DaoSOL_SOL"

  toJSON(): DaoSOL_SOLJSON {
    return {
      kind: "DaoSOL_SOL",
    }
  }

  toEncodable() {
    return {
      DaoSOL_SOL: {},
    }
  }
}

export interface SaberMSOL_SOLJSON {
  kind: "SaberMSOL_SOL"
}

export class SaberMSOL_SOL {
  static readonly discriminator = 11
  static readonly kind = "SaberMSOL_SOL"
  readonly discriminator = 11
  readonly kind = "SaberMSOL_SOL"

  toJSON(): SaberMSOL_SOLJSON {
    return {
      kind: "SaberMSOL_SOL",
    }
  }

  toEncodable() {
    return {
      SaberMSOL_SOL: {},
    }
  }
}

export interface USDHJSON {
  kind: "USDH"
}

export class USDH {
  static readonly discriminator = 12
  static readonly kind = "USDH"
  readonly discriminator = 12
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

export interface StSOLJSON {
  kind: "StSOL"
}

export class StSOL {
  static readonly discriminator = 13
  static readonly kind = "StSOL"
  readonly discriminator = 13
  readonly kind = "StSOL"

  toJSON(): StSOLJSON {
    return {
      kind: "StSOL",
    }
  }

  toEncodable() {
    return {
      StSOL: {},
    }
  }
}

export interface CSOL_SOLJSON {
  kind: "CSOL_SOL"
}

export class CSOL_SOL {
  static readonly discriminator = 14
  static readonly kind = "CSOL_SOL"
  readonly discriminator = 14
  readonly kind = "CSOL_SOL"

  toJSON(): CSOL_SOLJSON {
    return {
      kind: "CSOL_SOL",
    }
  }

  toEncodable() {
    return {
      CSOL_SOL: {},
    }
  }
}

export interface CETH_ETHJSON {
  kind: "CETH_ETH"
}

export class CETH_ETH {
  static readonly discriminator = 15
  static readonly kind = "CETH_ETH"
  readonly discriminator = 15
  readonly kind = "CETH_ETH"

  toJSON(): CETH_ETHJSON {
    return {
      kind: "CETH_ETH",
    }
  }

  toEncodable() {
    return {
      CETH_ETH: {},
    }
  }
}

export interface CBTC_BTCJSON {
  kind: "CBTC_BTC"
}

export class CBTC_BTC {
  static readonly discriminator = 16
  static readonly kind = "CBTC_BTC"
  readonly discriminator = 16
  readonly kind = "CBTC_BTC"

  toJSON(): CBTC_BTCJSON {
    return {
      kind: "CBTC_BTC",
    }
  }

  toEncodable() {
    return {
      CBTC_BTC: {},
    }
  }
}

export interface CMSOL_SOLJSON {
  kind: "CMSOL_SOL"
}

export class CMSOL_SOL {
  static readonly discriminator = 17
  static readonly kind = "CMSOL_SOL"
  readonly discriminator = 17
  readonly kind = "CMSOL_SOL"

  toJSON(): CMSOL_SOLJSON {
    return {
      kind: "CMSOL_SOL",
    }
  }

  toEncodable() {
    return {
      CMSOL_SOL: {},
    }
  }
}

export interface wstETHJSON {
  kind: "wstETH"
}

export class wstETH {
  static readonly discriminator = 18
  static readonly kind = "wstETH"
  readonly discriminator = 18
  readonly kind = "wstETH"

  toJSON(): wstETHJSON {
    return {
      kind: "wstETH",
    }
  }

  toEncodable() {
    return {
      wstETH: {},
    }
  }
}

export interface LDOJSON {
  kind: "LDO"
}

export class LDO {
  static readonly discriminator = 19
  static readonly kind = "LDO"
  readonly discriminator = 19
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

export interface USDCJSON {
  kind: "USDC"
}

export class USDC {
  static readonly discriminator = 20
  static readonly kind = "USDC"
  readonly discriminator = 20
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

export interface CUSDC_USDCJSON {
  kind: "CUSDC_USDC"
}

export class CUSDC_USDC {
  static readonly discriminator = 21
  static readonly kind = "CUSDC_USDC"
  readonly discriminator = 21
  readonly kind = "CUSDC_USDC"

  toJSON(): CUSDC_USDCJSON {
    return {
      kind: "CUSDC_USDC",
    }
  }

  toEncodable() {
    return {
      CUSDC_USDC: {},
    }
  }
}

export interface USDTJSON {
  kind: "USDT"
}

export class USDT {
  static readonly discriminator = 22
  static readonly kind = "USDT"
  readonly discriminator = 22
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
  static readonly discriminator = 23
  static readonly kind = "ORCA"
  readonly discriminator = 23
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
  static readonly discriminator = 24
  static readonly kind = "MNDE"
  readonly discriminator = 24
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
  static readonly discriminator = 25
  static readonly kind = "HBB"
  readonly discriminator = 25
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
export function fromDecoded(obj: any): types.ScopePriceIdKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
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
  if ("SRM" in obj) {
    return new SRM()
  }
  if ("RAY" in obj) {
    return new RAY()
  }
  if ("FTT" in obj) {
    return new FTT()
  }
  if ("MSOL" in obj) {
    return new MSOL()
  }
  if ("scnSOL_SOL" in obj) {
    return new scnSOL_SOL()
  }
  if ("BNB" in obj) {
    return new BNB()
  }
  if ("AVAX" in obj) {
    return new AVAX()
  }
  if ("DaoSOL_SOL" in obj) {
    return new DaoSOL_SOL()
  }
  if ("SaberMSOL_SOL" in obj) {
    return new SaberMSOL_SOL()
  }
  if ("USDH" in obj) {
    return new USDH()
  }
  if ("StSOL" in obj) {
    return new StSOL()
  }
  if ("CSOL_SOL" in obj) {
    return new CSOL_SOL()
  }
  if ("CETH_ETH" in obj) {
    return new CETH_ETH()
  }
  if ("CBTC_BTC" in obj) {
    return new CBTC_BTC()
  }
  if ("CMSOL_SOL" in obj) {
    return new CMSOL_SOL()
  }
  if ("wstETH" in obj) {
    return new wstETH()
  }
  if ("LDO" in obj) {
    return new LDO()
  }
  if ("USDC" in obj) {
    return new USDC()
  }
  if ("CUSDC_USDC" in obj) {
    return new CUSDC_USDC()
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

export function fromJSON(obj: types.ScopePriceIdJSON): types.ScopePriceIdKind {
  switch (obj.kind) {
    case "SOL": {
      return new SOL()
    }
    case "ETH": {
      return new ETH()
    }
    case "BTC": {
      return new BTC()
    }
    case "SRM": {
      return new SRM()
    }
    case "RAY": {
      return new RAY()
    }
    case "FTT": {
      return new FTT()
    }
    case "MSOL": {
      return new MSOL()
    }
    case "scnSOL_SOL": {
      return new scnSOL_SOL()
    }
    case "BNB": {
      return new BNB()
    }
    case "AVAX": {
      return new AVAX()
    }
    case "DaoSOL_SOL": {
      return new DaoSOL_SOL()
    }
    case "SaberMSOL_SOL": {
      return new SaberMSOL_SOL()
    }
    case "USDH": {
      return new USDH()
    }
    case "StSOL": {
      return new StSOL()
    }
    case "CSOL_SOL": {
      return new CSOL_SOL()
    }
    case "CETH_ETH": {
      return new CETH_ETH()
    }
    case "CBTC_BTC": {
      return new CBTC_BTC()
    }
    case "CMSOL_SOL": {
      return new CMSOL_SOL()
    }
    case "wstETH": {
      return new wstETH()
    }
    case "LDO": {
      return new LDO()
    }
    case "USDC": {
      return new USDC()
    }
    case "CUSDC_USDC": {
      return new CUSDC_USDC()
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
    borsh.struct([], "SOL"),
    borsh.struct([], "ETH"),
    borsh.struct([], "BTC"),
    borsh.struct([], "SRM"),
    borsh.struct([], "RAY"),
    borsh.struct([], "FTT"),
    borsh.struct([], "MSOL"),
    borsh.struct([], "scnSOL_SOL"),
    borsh.struct([], "BNB"),
    borsh.struct([], "AVAX"),
    borsh.struct([], "DaoSOL_SOL"),
    borsh.struct([], "SaberMSOL_SOL"),
    borsh.struct([], "USDH"),
    borsh.struct([], "StSOL"),
    borsh.struct([], "CSOL_SOL"),
    borsh.struct([], "CETH_ETH"),
    borsh.struct([], "CBTC_BTC"),
    borsh.struct([], "CMSOL_SOL"),
    borsh.struct([], "wstETH"),
    borsh.struct([], "LDO"),
    borsh.struct([], "USDC"),
    borsh.struct([], "CUSDC_USDC"),
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
