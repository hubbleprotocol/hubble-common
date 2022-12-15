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

export interface CORCA_ORCAJSON {
  kind: "CORCA_ORCA"
}

export class CORCA_ORCA {
  static readonly discriminator = 26
  static readonly kind = "CORCA_ORCA"
  readonly discriminator = 26
  readonly kind = "CORCA_ORCA"

  toJSON(): CORCA_ORCAJSON {
    return {
      kind: "CORCA_ORCA",
    }
  }

  toEncodable() {
    return {
      CORCA_ORCA: {},
    }
  }
}

export interface CSLND_SLNDJSON {
  kind: "CSLND_SLND"
}

export class CSLND_SLND {
  static readonly discriminator = 27
  static readonly kind = "CSLND_SLND"
  readonly discriminator = 27
  readonly kind = "CSLND_SLND"

  toJSON(): CSLND_SLNDJSON {
    return {
      kind: "CSLND_SLND",
    }
  }

  toEncodable() {
    return {
      CSLND_SLND: {},
    }
  }
}

export interface CSRM_SRMJSON {
  kind: "CSRM_SRM"
}

export class CSRM_SRM {
  static readonly discriminator = 28
  static readonly kind = "CSRM_SRM"
  readonly discriminator = 28
  readonly kind = "CSRM_SRM"

  toJSON(): CSRM_SRMJSON {
    return {
      kind: "CSRM_SRM",
    }
  }

  toEncodable() {
    return {
      CSRM_SRM: {},
    }
  }
}

export interface CRAY_RAYJSON {
  kind: "CRAY_RAY"
}

export class CRAY_RAY {
  static readonly discriminator = 29
  static readonly kind = "CRAY_RAY"
  readonly discriminator = 29
  readonly kind = "CRAY_RAY"

  toJSON(): CRAY_RAYJSON {
    return {
      kind: "CRAY_RAY",
    }
  }

  toEncodable() {
    return {
      CRAY_RAY: {},
    }
  }
}

export interface CFTT_FTTJSON {
  kind: "CFTT_FTT"
}

export class CFTT_FTT {
  static readonly discriminator = 30
  static readonly kind = "CFTT_FTT"
  readonly discriminator = 30
  readonly kind = "CFTT_FTT"

  toJSON(): CFTT_FTTJSON {
    return {
      kind: "CFTT_FTT",
    }
  }

  toEncodable() {
    return {
      CFTT_FTT: {},
    }
  }
}

export interface CSTSOL_STSOLJSON {
  kind: "CSTSOL_STSOL"
}

export class CSTSOL_STSOL {
  static readonly discriminator = 31
  static readonly kind = "CSTSOL_STSOL"
  readonly discriminator = 31
  readonly kind = "CSTSOL_STSOL"

  toJSON(): CSTSOL_STSOLJSON {
    return {
      kind: "CSTSOL_STSOL",
    }
  }

  toEncodable() {
    return {
      CSTSOL_STSOL: {},
    }
  }
}

export interface SLNDJSON {
  kind: "SLND"
}

export class SLND {
  static readonly discriminator = 32
  static readonly kind = "SLND"
  readonly discriminator = 32
  readonly kind = "SLND"

  toJSON(): SLNDJSON {
    return {
      kind: "SLND",
    }
  }

  toEncodable() {
    return {
      SLND: {},
    }
  }
}

export interface DAIJSON {
  kind: "DAI"
}

export class DAI {
  static readonly discriminator = 33
  static readonly kind = "DAI"
  readonly discriminator = 33
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

export interface JSOL_SOLJSON {
  kind: "JSOL_SOL"
}

export class JSOL_SOL {
  static readonly discriminator = 34
  static readonly kind = "JSOL_SOL"
  readonly discriminator = 34
  readonly kind = "JSOL_SOL"

  toJSON(): JSOL_SOLJSON {
    return {
      kind: "JSOL_SOL",
    }
  }

  toEncodable() {
    return {
      JSOL_SOL: {},
    }
  }
}

export interface USHJSON {
  kind: "USH"
}

export class USH {
  static readonly discriminator = 35
  static readonly kind = "USH"
  readonly discriminator = 35
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

export interface UXDJSON {
  kind: "UXD"
}

export class UXD {
  static readonly discriminator = 36
  static readonly kind = "UXD"
  readonly discriminator = 36
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

export interface USDH_TWAPJSON {
  kind: "USDH_TWAP"
}

export class USDH_TWAP {
  static readonly discriminator = 37
  static readonly kind = "USDH_TWAP"
  readonly discriminator = 37
  readonly kind = "USDH_TWAP"

  toJSON(): USDH_TWAPJSON {
    return {
      kind: "USDH_TWAP",
    }
  }

  toEncodable() {
    return {
      USDH_TWAP: {},
    }
  }
}

export interface USH_TWAPJSON {
  kind: "USH_TWAP"
}

export class USH_TWAP {
  static readonly discriminator = 38
  static readonly kind = "USH_TWAP"
  readonly discriminator = 38
  readonly kind = "USH_TWAP"

  toJSON(): USH_TWAPJSON {
    return {
      kind: "USH_TWAP",
    }
  }

  toEncodable() {
    return {
      USH_TWAP: {},
    }
  }
}

export interface UXD_TWAPJSON {
  kind: "UXD_TWAP"
}

export class UXD_TWAP {
  static readonly discriminator = 39
  static readonly kind = "UXD_TWAP"
  readonly discriminator = 39
  readonly kind = "UXD_TWAP"

  toJSON(): UXD_TWAPJSON {
    return {
      kind: "UXD_TWAP",
    }
  }

  toEncodable() {
    return {
      UXD_TWAP: {},
    }
  }
}

export interface HDGJSON {
  kind: "HDG"
}

export class HDG {
  static readonly discriminator = 40
  static readonly kind = "HDG"
  readonly discriminator = 40
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
  static readonly discriminator = 41
  static readonly kind = "DUST"
  readonly discriminator = 41
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
  static readonly discriminator = 42
  static readonly kind = "USDR"
  readonly discriminator = 42
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

export interface USDR_TWAPJSON {
  kind: "USDR_TWAP"
}

export class USDR_TWAP {
  static readonly discriminator = 43
  static readonly kind = "USDR_TWAP"
  readonly discriminator = 43
  readonly kind = "USDR_TWAP"

  toJSON(): USDR_TWAPJSON {
    return {
      kind: "USDR_TWAP",
    }
  }

  toEncodable() {
    return {
      USDR_TWAP: {},
    }
  }
}

export interface RATIOJSON {
  kind: "RATIO"
}

export class RATIO {
  static readonly discriminator = 44
  static readonly kind = "RATIO"
  readonly discriminator = 44
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
  static readonly discriminator = 45
  static readonly kind = "UXP"
  readonly discriminator = 45
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

export interface KUXDUSDCORCAJSON {
  kind: "KUXDUSDCORCA"
}

export class KUXDUSDCORCA {
  static readonly discriminator = 46
  static readonly kind = "KUXDUSDCORCA"
  readonly discriminator = 46
  readonly kind = "KUXDUSDCORCA"

  toJSON(): KUXDUSDCORCAJSON {
    return {
      kind: "KUXDUSDCORCA",
    }
  }

  toEncodable() {
    return {
      KUXDUSDCORCA: {},
    }
  }
}

export interface JITOSOL_SOLJSON {
  kind: "JITOSOL_SOL"
}

export class JITOSOL_SOL {
  static readonly discriminator = 47
  static readonly kind = "JITOSOL_SOL"
  readonly discriminator = 47
  readonly kind = "JITOSOL_SOL"

  toJSON(): JITOSOL_SOLJSON {
    return {
      kind: "JITOSOL_SOL",
    }
  }

  toEncodable() {
    return {
      JITOSOL_SOL: {},
    }
  }
}

export interface SOL_EMAJSON {
  kind: "SOL_EMA"
}

export class SOL_EMA {
  static readonly discriminator = 48
  static readonly kind = "SOL_EMA"
  readonly discriminator = 48
  readonly kind = "SOL_EMA"

  toJSON(): SOL_EMAJSON {
    return {
      kind: "SOL_EMA",
    }
  }

  toEncodable() {
    return {
      SOL_EMA: {},
    }
  }
}

export interface ETH_EMAJSON {
  kind: "ETH_EMA"
}

export class ETH_EMA {
  static readonly discriminator = 49
  static readonly kind = "ETH_EMA"
  readonly discriminator = 49
  readonly kind = "ETH_EMA"

  toJSON(): ETH_EMAJSON {
    return {
      kind: "ETH_EMA",
    }
  }

  toEncodable() {
    return {
      ETH_EMA: {},
    }
  }
}

export interface BTC_EMAJSON {
  kind: "BTC_EMA"
}

export class BTC_EMA {
  static readonly discriminator = 50
  static readonly kind = "BTC_EMA"
  readonly discriminator = 50
  readonly kind = "BTC_EMA"

  toJSON(): BTC_EMAJSON {
    return {
      kind: "BTC_EMA",
    }
  }

  toEncodable() {
    return {
      BTC_EMA: {},
    }
  }
}

export interface SRM_EMAJSON {
  kind: "SRM_EMA"
}

export class SRM_EMA {
  static readonly discriminator = 51
  static readonly kind = "SRM_EMA"
  readonly discriminator = 51
  readonly kind = "SRM_EMA"

  toJSON(): SRM_EMAJSON {
    return {
      kind: "SRM_EMA",
    }
  }

  toEncodable() {
    return {
      SRM_EMA: {},
    }
  }
}

export interface RAY_EMAJSON {
  kind: "RAY_EMA"
}

export class RAY_EMA {
  static readonly discriminator = 52
  static readonly kind = "RAY_EMA"
  readonly discriminator = 52
  readonly kind = "RAY_EMA"

  toJSON(): RAY_EMAJSON {
    return {
      kind: "RAY_EMA",
    }
  }

  toEncodable() {
    return {
      RAY_EMA: {},
    }
  }
}

export interface FTT_EMAJSON {
  kind: "FTT_EMA"
}

export class FTT_EMA {
  static readonly discriminator = 53
  static readonly kind = "FTT_EMA"
  readonly discriminator = 53
  readonly kind = "FTT_EMA"

  toJSON(): FTT_EMAJSON {
    return {
      kind: "FTT_EMA",
    }
  }

  toEncodable() {
    return {
      FTT_EMA: {},
    }
  }
}

export interface MSOL_EMAJSON {
  kind: "MSOL_EMA"
}

export class MSOL_EMA {
  static readonly discriminator = 54
  static readonly kind = "MSOL_EMA"
  readonly discriminator = 54
  readonly kind = "MSOL_EMA"

  toJSON(): MSOL_EMAJSON {
    return {
      kind: "MSOL_EMA",
    }
  }

  toEncodable() {
    return {
      MSOL_EMA: {},
    }
  }
}

export interface BNB_EMAJSON {
  kind: "BNB_EMA"
}

export class BNB_EMA {
  static readonly discriminator = 55
  static readonly kind = "BNB_EMA"
  readonly discriminator = 55
  readonly kind = "BNB_EMA"

  toJSON(): BNB_EMAJSON {
    return {
      kind: "BNB_EMA",
    }
  }

  toEncodable() {
    return {
      BNB_EMA: {},
    }
  }
}

export interface AVAX_EMAJSON {
  kind: "AVAX_EMA"
}

export class AVAX_EMA {
  static readonly discriminator = 56
  static readonly kind = "AVAX_EMA"
  readonly discriminator = 56
  readonly kind = "AVAX_EMA"

  toJSON(): AVAX_EMAJSON {
    return {
      kind: "AVAX_EMA",
    }
  }

  toEncodable() {
    return {
      AVAX_EMA: {},
    }
  }
}

export interface STSOL_EMAJSON {
  kind: "STSOL_EMA"
}

export class STSOL_EMA {
  static readonly discriminator = 57
  static readonly kind = "STSOL_EMA"
  readonly discriminator = 57
  readonly kind = "STSOL_EMA"

  toJSON(): STSOL_EMAJSON {
    return {
      kind: "STSOL_EMA",
    }
  }

  toEncodable() {
    return {
      STSOL_EMA: {},
    }
  }
}

export interface USDC_EMAJSON {
  kind: "USDC_EMA"
}

export class USDC_EMA {
  static readonly discriminator = 58
  static readonly kind = "USDC_EMA"
  readonly discriminator = 58
  readonly kind = "USDC_EMA"

  toJSON(): USDC_EMAJSON {
    return {
      kind: "USDC_EMA",
    }
  }

  toEncodable() {
    return {
      USDC_EMA: {},
    }
  }
}

export interface USDT_EMAJSON {
  kind: "USDT_EMA"
}

export class USDT_EMA {
  static readonly discriminator = 59
  static readonly kind = "USDT_EMA"
  readonly discriminator = 59
  readonly kind = "USDT_EMA"

  toJSON(): USDT_EMAJSON {
    return {
      kind: "USDT_EMA",
    }
  }

  toEncodable() {
    return {
      USDT_EMA: {},
    }
  }
}

export interface SLND_EMAJSON {
  kind: "SLND_EMA"
}

export class SLND_EMA {
  static readonly discriminator = 60
  static readonly kind = "SLND_EMA"
  readonly discriminator = 60
  readonly kind = "SLND_EMA"

  toJSON(): SLND_EMAJSON {
    return {
      kind: "SLND_EMA",
    }
  }

  toEncodable() {
    return {
      SLND_EMA: {},
    }
  }
}

export interface DAI_EMAJSON {
  kind: "DAI_EMA"
}

export class DAI_EMA {
  static readonly discriminator = 61
  static readonly kind = "DAI_EMA"
  readonly discriminator = 61
  readonly kind = "DAI_EMA"

  toJSON(): DAI_EMAJSON {
    return {
      kind: "DAI_EMA",
    }
  }

  toEncodable() {
    return {
      DAI_EMA: {},
    }
  }
}

export interface wstETH_TWAPJSON {
  kind: "wstETH_TWAP"
}

export class wstETH_TWAP {
  static readonly discriminator = 62
  static readonly kind = "wstETH_TWAP"
  readonly discriminator = 62
  readonly kind = "wstETH_TWAP"

  toJSON(): wstETH_TWAPJSON {
    return {
      kind: "wstETH_TWAP",
    }
  }

  toEncodable() {
    return {
      wstETH_TWAP: {},
    }
  }
}

export interface DUST_TWAPJSON {
  kind: "DUST_TWAP"
}

export class DUST_TWAP {
  static readonly discriminator = 63
  static readonly kind = "DUST_TWAP"
  readonly discriminator = 63
  readonly kind = "DUST_TWAP"

  toJSON(): DUST_TWAPJSON {
    return {
      kind: "DUST_TWAP",
    }
  }

  toEncodable() {
    return {
      DUST_TWAP: {},
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
  if ("CORCA_ORCA" in obj) {
    return new CORCA_ORCA()
  }
  if ("CSLND_SLND" in obj) {
    return new CSLND_SLND()
  }
  if ("CSRM_SRM" in obj) {
    return new CSRM_SRM()
  }
  if ("CRAY_RAY" in obj) {
    return new CRAY_RAY()
  }
  if ("CFTT_FTT" in obj) {
    return new CFTT_FTT()
  }
  if ("CSTSOL_STSOL" in obj) {
    return new CSTSOL_STSOL()
  }
  if ("SLND" in obj) {
    return new SLND()
  }
  if ("DAI" in obj) {
    return new DAI()
  }
  if ("JSOL_SOL" in obj) {
    return new JSOL_SOL()
  }
  if ("USH" in obj) {
    return new USH()
  }
  if ("UXD" in obj) {
    return new UXD()
  }
  if ("USDH_TWAP" in obj) {
    return new USDH_TWAP()
  }
  if ("USH_TWAP" in obj) {
    return new USH_TWAP()
  }
  if ("UXD_TWAP" in obj) {
    return new UXD_TWAP()
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
  if ("USDR_TWAP" in obj) {
    return new USDR_TWAP()
  }
  if ("RATIO" in obj) {
    return new RATIO()
  }
  if ("UXP" in obj) {
    return new UXP()
  }
  if ("KUXDUSDCORCA" in obj) {
    return new KUXDUSDCORCA()
  }
  if ("JITOSOL_SOL" in obj) {
    return new JITOSOL_SOL()
  }
  if ("SOL_EMA" in obj) {
    return new SOL_EMA()
  }
  if ("ETH_EMA" in obj) {
    return new ETH_EMA()
  }
  if ("BTC_EMA" in obj) {
    return new BTC_EMA()
  }
  if ("SRM_EMA" in obj) {
    return new SRM_EMA()
  }
  if ("RAY_EMA" in obj) {
    return new RAY_EMA()
  }
  if ("FTT_EMA" in obj) {
    return new FTT_EMA()
  }
  if ("MSOL_EMA" in obj) {
    return new MSOL_EMA()
  }
  if ("BNB_EMA" in obj) {
    return new BNB_EMA()
  }
  if ("AVAX_EMA" in obj) {
    return new AVAX_EMA()
  }
  if ("STSOL_EMA" in obj) {
    return new STSOL_EMA()
  }
  if ("USDC_EMA" in obj) {
    return new USDC_EMA()
  }
  if ("USDT_EMA" in obj) {
    return new USDT_EMA()
  }
  if ("SLND_EMA" in obj) {
    return new SLND_EMA()
  }
  if ("DAI_EMA" in obj) {
    return new DAI_EMA()
  }
  if ("wstETH_TWAP" in obj) {
    return new wstETH_TWAP()
  }
  if ("DUST_TWAP" in obj) {
    return new DUST_TWAP()
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
    case "CORCA_ORCA": {
      return new CORCA_ORCA()
    }
    case "CSLND_SLND": {
      return new CSLND_SLND()
    }
    case "CSRM_SRM": {
      return new CSRM_SRM()
    }
    case "CRAY_RAY": {
      return new CRAY_RAY()
    }
    case "CFTT_FTT": {
      return new CFTT_FTT()
    }
    case "CSTSOL_STSOL": {
      return new CSTSOL_STSOL()
    }
    case "SLND": {
      return new SLND()
    }
    case "DAI": {
      return new DAI()
    }
    case "JSOL_SOL": {
      return new JSOL_SOL()
    }
    case "USH": {
      return new USH()
    }
    case "UXD": {
      return new UXD()
    }
    case "USDH_TWAP": {
      return new USDH_TWAP()
    }
    case "USH_TWAP": {
      return new USH_TWAP()
    }
    case "UXD_TWAP": {
      return new UXD_TWAP()
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
    case "USDR_TWAP": {
      return new USDR_TWAP()
    }
    case "RATIO": {
      return new RATIO()
    }
    case "UXP": {
      return new UXP()
    }
    case "KUXDUSDCORCA": {
      return new KUXDUSDCORCA()
    }
    case "JITOSOL_SOL": {
      return new JITOSOL_SOL()
    }
    case "SOL_EMA": {
      return new SOL_EMA()
    }
    case "ETH_EMA": {
      return new ETH_EMA()
    }
    case "BTC_EMA": {
      return new BTC_EMA()
    }
    case "SRM_EMA": {
      return new SRM_EMA()
    }
    case "RAY_EMA": {
      return new RAY_EMA()
    }
    case "FTT_EMA": {
      return new FTT_EMA()
    }
    case "MSOL_EMA": {
      return new MSOL_EMA()
    }
    case "BNB_EMA": {
      return new BNB_EMA()
    }
    case "AVAX_EMA": {
      return new AVAX_EMA()
    }
    case "STSOL_EMA": {
      return new STSOL_EMA()
    }
    case "USDC_EMA": {
      return new USDC_EMA()
    }
    case "USDT_EMA": {
      return new USDT_EMA()
    }
    case "SLND_EMA": {
      return new SLND_EMA()
    }
    case "DAI_EMA": {
      return new DAI_EMA()
    }
    case "wstETH_TWAP": {
      return new wstETH_TWAP()
    }
    case "DUST_TWAP": {
      return new DUST_TWAP()
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
    borsh.struct([], "CORCA_ORCA"),
    borsh.struct([], "CSLND_SLND"),
    borsh.struct([], "CSRM_SRM"),
    borsh.struct([], "CRAY_RAY"),
    borsh.struct([], "CFTT_FTT"),
    borsh.struct([], "CSTSOL_STSOL"),
    borsh.struct([], "SLND"),
    borsh.struct([], "DAI"),
    borsh.struct([], "JSOL_SOL"),
    borsh.struct([], "USH"),
    borsh.struct([], "UXD"),
    borsh.struct([], "USDH_TWAP"),
    borsh.struct([], "USH_TWAP"),
    borsh.struct([], "UXD_TWAP"),
    borsh.struct([], "HDG"),
    borsh.struct([], "DUST"),
    borsh.struct([], "USDR"),
    borsh.struct([], "USDR_TWAP"),
    borsh.struct([], "RATIO"),
    borsh.struct([], "UXP"),
    borsh.struct([], "KUXDUSDCORCA"),
    borsh.struct([], "JITOSOL_SOL"),
    borsh.struct([], "SOL_EMA"),
    borsh.struct([], "ETH_EMA"),
    borsh.struct([], "BTC_EMA"),
    borsh.struct([], "SRM_EMA"),
    borsh.struct([], "RAY_EMA"),
    borsh.struct([], "FTT_EMA"),
    borsh.struct([], "MSOL_EMA"),
    borsh.struct([], "BNB_EMA"),
    borsh.struct([], "AVAX_EMA"),
    borsh.struct([], "STSOL_EMA"),
    borsh.struct([], "USDC_EMA"),
    borsh.struct([], "USDT_EMA"),
    borsh.struct([], "SLND_EMA"),
    borsh.struct([], "DAI_EMA"),
    borsh.struct([], "wstETH_TWAP"),
    borsh.struct([], "DUST_TWAP"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
