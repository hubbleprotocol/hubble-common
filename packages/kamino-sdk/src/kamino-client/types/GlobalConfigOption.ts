import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface EmergencyModeJSON {
  kind: "EmergencyMode"
}

export class EmergencyMode {
  static readonly discriminator = 0
  static readonly kind = "EmergencyMode"
  readonly discriminator = 0
  readonly kind = "EmergencyMode"

  toJSON(): EmergencyModeJSON {
    return {
      kind: "EmergencyMode",
    }
  }

  toEncodable() {
    return {
      EmergencyMode: {},
    }
  }
}

export interface BlockDepositJSON {
  kind: "BlockDeposit"
}

export class BlockDeposit {
  static readonly discriminator = 1
  static readonly kind = "BlockDeposit"
  readonly discriminator = 1
  readonly kind = "BlockDeposit"

  toJSON(): BlockDepositJSON {
    return {
      kind: "BlockDeposit",
    }
  }

  toEncodable() {
    return {
      BlockDeposit: {},
    }
  }
}

export interface BlockInvestJSON {
  kind: "BlockInvest"
}

export class BlockInvest {
  static readonly discriminator = 2
  static readonly kind = "BlockInvest"
  readonly discriminator = 2
  readonly kind = "BlockInvest"

  toJSON(): BlockInvestJSON {
    return {
      kind: "BlockInvest",
    }
  }

  toEncodable() {
    return {
      BlockInvest: {},
    }
  }
}

export interface BlockWithdrawJSON {
  kind: "BlockWithdraw"
}

export class BlockWithdraw {
  static readonly discriminator = 3
  static readonly kind = "BlockWithdraw"
  readonly discriminator = 3
  readonly kind = "BlockWithdraw"

  toJSON(): BlockWithdrawJSON {
    return {
      kind: "BlockWithdraw",
    }
  }

  toEncodable() {
    return {
      BlockWithdraw: {},
    }
  }
}

export interface BlockCollectFeesJSON {
  kind: "BlockCollectFees"
}

export class BlockCollectFees {
  static readonly discriminator = 4
  static readonly kind = "BlockCollectFees"
  readonly discriminator = 4
  readonly kind = "BlockCollectFees"

  toJSON(): BlockCollectFeesJSON {
    return {
      kind: "BlockCollectFees",
    }
  }

  toEncodable() {
    return {
      BlockCollectFees: {},
    }
  }
}

export interface BlockCollectRewardsJSON {
  kind: "BlockCollectRewards"
}

export class BlockCollectRewards {
  static readonly discriminator = 5
  static readonly kind = "BlockCollectRewards"
  readonly discriminator = 5
  readonly kind = "BlockCollectRewards"

  toJSON(): BlockCollectRewardsJSON {
    return {
      kind: "BlockCollectRewards",
    }
  }

  toEncodable() {
    return {
      BlockCollectRewards: {},
    }
  }
}

export interface BlockSwapRewardsJSON {
  kind: "BlockSwapRewards"
}

export class BlockSwapRewards {
  static readonly discriminator = 6
  static readonly kind = "BlockSwapRewards"
  readonly discriminator = 6
  readonly kind = "BlockSwapRewards"

  toJSON(): BlockSwapRewardsJSON {
    return {
      kind: "BlockSwapRewards",
    }
  }

  toEncodable() {
    return {
      BlockSwapRewards: {},
    }
  }
}

export interface BlockSwapUnevenVaultsJSON {
  kind: "BlockSwapUnevenVaults"
}

export class BlockSwapUnevenVaults {
  static readonly discriminator = 7
  static readonly kind = "BlockSwapUnevenVaults"
  readonly discriminator = 7
  readonly kind = "BlockSwapUnevenVaults"

  toJSON(): BlockSwapUnevenVaultsJSON {
    return {
      kind: "BlockSwapUnevenVaults",
    }
  }

  toEncodable() {
    return {
      BlockSwapUnevenVaults: {},
    }
  }
}

export interface FeesBpsJSON {
  kind: "FeesBps"
}

export class FeesBps {
  static readonly discriminator = 8
  static readonly kind = "FeesBps"
  readonly discriminator = 8
  readonly kind = "FeesBps"

  toJSON(): FeesBpsJSON {
    return {
      kind: "FeesBps",
    }
  }

  toEncodable() {
    return {
      FeesBps: {},
    }
  }
}

export interface SwapDiscountBpsJSON {
  kind: "SwapDiscountBps"
}

export class SwapDiscountBps {
  static readonly discriminator = 9
  static readonly kind = "SwapDiscountBps"
  readonly discriminator = 9
  readonly kind = "SwapDiscountBps"

  toJSON(): SwapDiscountBpsJSON {
    return {
      kind: "SwapDiscountBps",
    }
  }

  toEncodable() {
    return {
      SwapDiscountBps: {},
    }
  }
}

export interface ActionsAuthorityJSON {
  kind: "ActionsAuthority"
}

export class ActionsAuthority {
  static readonly discriminator = 10
  static readonly kind = "ActionsAuthority"
  readonly discriminator = 10
  readonly kind = "ActionsAuthority"

  toJSON(): ActionsAuthorityJSON {
    return {
      kind: "ActionsAuthority",
    }
  }

  toEncodable() {
    return {
      ActionsAuthority: {},
    }
  }
}

export interface TreasuryFeeVaultsJSON {
  kind: "TreasuryFeeVaults"
}

export class TreasuryFeeVaults {
  static readonly discriminator = 11
  static readonly kind = "TreasuryFeeVaults"
  readonly discriminator = 11
  readonly kind = "TreasuryFeeVaults"

  toJSON(): TreasuryFeeVaultsJSON {
    return {
      kind: "TreasuryFeeVaults",
    }
  }

  toEncodable() {
    return {
      TreasuryFeeVaults: {},
    }
  }
}

export interface AdminAuthorityJSON {
  kind: "AdminAuthority"
}

export class AdminAuthority {
  static readonly discriminator = 12
  static readonly kind = "AdminAuthority"
  readonly discriminator = 12
  readonly kind = "AdminAuthority"

  toJSON(): AdminAuthorityJSON {
    return {
      kind: "AdminAuthority",
    }
  }

  toEncodable() {
    return {
      AdminAuthority: {},
    }
  }
}

export interface BlockEmergencySwapJSON {
  kind: "BlockEmergencySwap"
}

export class BlockEmergencySwap {
  static readonly discriminator = 13
  static readonly kind = "BlockEmergencySwap"
  readonly discriminator = 13
  readonly kind = "BlockEmergencySwap"

  toJSON(): BlockEmergencySwapJSON {
    return {
      kind: "BlockEmergencySwap",
    }
  }

  toEncodable() {
    return {
      BlockEmergencySwap: {},
    }
  }
}

export interface BlockLocalAdminJSON {
  kind: "BlockLocalAdmin"
}

export class BlockLocalAdmin {
  static readonly discriminator = 14
  static readonly kind = "BlockLocalAdmin"
  readonly discriminator = 14
  readonly kind = "BlockLocalAdmin"

  toJSON(): BlockLocalAdminJSON {
    return {
      kind: "BlockLocalAdmin",
    }
  }

  toEncodable() {
    return {
      BlockLocalAdmin: {},
    }
  }
}

export interface UpdateTokenInfosJSON {
  kind: "UpdateTokenInfos"
}

export class UpdateTokenInfos {
  static readonly discriminator = 15
  static readonly kind = "UpdateTokenInfos"
  readonly discriminator = 15
  readonly kind = "UpdateTokenInfos"

  toJSON(): UpdateTokenInfosJSON {
    return {
      kind: "UpdateTokenInfos",
    }
  }

  toEncodable() {
    return {
      UpdateTokenInfos: {},
    }
  }
}

export interface ScopeProgramIdJSON {
  kind: "ScopeProgramId"
}

export class ScopeProgramId {
  static readonly discriminator = 16
  static readonly kind = "ScopeProgramId"
  readonly discriminator = 16
  readonly kind = "ScopeProgramId"

  toJSON(): ScopeProgramIdJSON {
    return {
      kind: "ScopeProgramId",
    }
  }

  toEncodable() {
    return {
      ScopeProgramId: {},
    }
  }
}

export interface ScopePriceIdJSON {
  kind: "ScopePriceId"
}

export class ScopePriceId {
  static readonly discriminator = 17
  static readonly kind = "ScopePriceId"
  readonly discriminator = 17
  readonly kind = "ScopePriceId"

  toJSON(): ScopePriceIdJSON {
    return {
      kind: "ScopePriceId",
    }
  }

  toEncodable() {
    return {
      ScopePriceId: {},
    }
  }
}

export interface MinPerformanceFeeBpsJSON {
  kind: "MinPerformanceFeeBps"
}

export class MinPerformanceFeeBps {
  static readonly discriminator = 18
  static readonly kind = "MinPerformanceFeeBps"
  readonly discriminator = 18
  readonly kind = "MinPerformanceFeeBps"

  toJSON(): MinPerformanceFeeBpsJSON {
    return {
      kind: "MinPerformanceFeeBps",
    }
  }

  toEncodable() {
    return {
      MinPerformanceFeeBps: {},
    }
  }
}

export interface MinSwapUnevenSlippageToleranceBpsJSON {
  kind: "MinSwapUnevenSlippageToleranceBps"
}

export class MinSwapUnevenSlippageToleranceBps {
  static readonly discriminator = 19
  static readonly kind = "MinSwapUnevenSlippageToleranceBps"
  readonly discriminator = 19
  readonly kind = "MinSwapUnevenSlippageToleranceBps"

  toJSON(): MinSwapUnevenSlippageToleranceBpsJSON {
    return {
      kind: "MinSwapUnevenSlippageToleranceBps",
    }
  }

  toEncodable() {
    return {
      MinSwapUnevenSlippageToleranceBps: {},
    }
  }
}

export interface MinReferencePriceSlippageToleranceBpsJSON {
  kind: "MinReferencePriceSlippageToleranceBps"
}

export class MinReferencePriceSlippageToleranceBps {
  static readonly discriminator = 20
  static readonly kind = "MinReferencePriceSlippageToleranceBps"
  readonly discriminator = 20
  readonly kind = "MinReferencePriceSlippageToleranceBps"

  toJSON(): MinReferencePriceSlippageToleranceBpsJSON {
    return {
      kind: "MinReferencePriceSlippageToleranceBps",
    }
  }

  toEncodable() {
    return {
      MinReferencePriceSlippageToleranceBps: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.GlobalConfigOptionKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("EmergencyMode" in obj) {
    return new EmergencyMode()
  }
  if ("BlockDeposit" in obj) {
    return new BlockDeposit()
  }
  if ("BlockInvest" in obj) {
    return new BlockInvest()
  }
  if ("BlockWithdraw" in obj) {
    return new BlockWithdraw()
  }
  if ("BlockCollectFees" in obj) {
    return new BlockCollectFees()
  }
  if ("BlockCollectRewards" in obj) {
    return new BlockCollectRewards()
  }
  if ("BlockSwapRewards" in obj) {
    return new BlockSwapRewards()
  }
  if ("BlockSwapUnevenVaults" in obj) {
    return new BlockSwapUnevenVaults()
  }
  if ("FeesBps" in obj) {
    return new FeesBps()
  }
  if ("SwapDiscountBps" in obj) {
    return new SwapDiscountBps()
  }
  if ("ActionsAuthority" in obj) {
    return new ActionsAuthority()
  }
  if ("TreasuryFeeVaults" in obj) {
    return new TreasuryFeeVaults()
  }
  if ("AdminAuthority" in obj) {
    return new AdminAuthority()
  }
  if ("BlockEmergencySwap" in obj) {
    return new BlockEmergencySwap()
  }
  if ("BlockLocalAdmin" in obj) {
    return new BlockLocalAdmin()
  }
  if ("UpdateTokenInfos" in obj) {
    return new UpdateTokenInfos()
  }
  if ("ScopeProgramId" in obj) {
    return new ScopeProgramId()
  }
  if ("ScopePriceId" in obj) {
    return new ScopePriceId()
  }
  if ("MinPerformanceFeeBps" in obj) {
    return new MinPerformanceFeeBps()
  }
  if ("MinSwapUnevenSlippageToleranceBps" in obj) {
    return new MinSwapUnevenSlippageToleranceBps()
  }
  if ("MinReferencePriceSlippageToleranceBps" in obj) {
    return new MinReferencePriceSlippageToleranceBps()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.GlobalConfigOptionJSON
): types.GlobalConfigOptionKind {
  switch (obj.kind) {
    case "EmergencyMode": {
      return new EmergencyMode()
    }
    case "BlockDeposit": {
      return new BlockDeposit()
    }
    case "BlockInvest": {
      return new BlockInvest()
    }
    case "BlockWithdraw": {
      return new BlockWithdraw()
    }
    case "BlockCollectFees": {
      return new BlockCollectFees()
    }
    case "BlockCollectRewards": {
      return new BlockCollectRewards()
    }
    case "BlockSwapRewards": {
      return new BlockSwapRewards()
    }
    case "BlockSwapUnevenVaults": {
      return new BlockSwapUnevenVaults()
    }
    case "FeesBps": {
      return new FeesBps()
    }
    case "SwapDiscountBps": {
      return new SwapDiscountBps()
    }
    case "ActionsAuthority": {
      return new ActionsAuthority()
    }
    case "TreasuryFeeVaults": {
      return new TreasuryFeeVaults()
    }
    case "AdminAuthority": {
      return new AdminAuthority()
    }
    case "BlockEmergencySwap": {
      return new BlockEmergencySwap()
    }
    case "BlockLocalAdmin": {
      return new BlockLocalAdmin()
    }
    case "UpdateTokenInfos": {
      return new UpdateTokenInfos()
    }
    case "ScopeProgramId": {
      return new ScopeProgramId()
    }
    case "ScopePriceId": {
      return new ScopePriceId()
    }
    case "MinPerformanceFeeBps": {
      return new MinPerformanceFeeBps()
    }
    case "MinSwapUnevenSlippageToleranceBps": {
      return new MinSwapUnevenSlippageToleranceBps()
    }
    case "MinReferencePriceSlippageToleranceBps": {
      return new MinReferencePriceSlippageToleranceBps()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "EmergencyMode"),
    borsh.struct([], "BlockDeposit"),
    borsh.struct([], "BlockInvest"),
    borsh.struct([], "BlockWithdraw"),
    borsh.struct([], "BlockCollectFees"),
    borsh.struct([], "BlockCollectRewards"),
    borsh.struct([], "BlockSwapRewards"),
    borsh.struct([], "BlockSwapUnevenVaults"),
    borsh.struct([], "FeesBps"),
    borsh.struct([], "SwapDiscountBps"),
    borsh.struct([], "ActionsAuthority"),
    borsh.struct([], "TreasuryFeeVaults"),
    borsh.struct([], "AdminAuthority"),
    borsh.struct([], "BlockEmergencySwap"),
    borsh.struct([], "BlockLocalAdmin"),
    borsh.struct([], "UpdateTokenInfos"),
    borsh.struct([], "ScopeProgramId"),
    borsh.struct([], "ScopePriceId"),
    borsh.struct([], "MinPerformanceFeeBps"),
    borsh.struct([], "MinSwapUnevenSlippageToleranceBps"),
    borsh.struct([], "MinReferencePriceSlippageToleranceBps"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
