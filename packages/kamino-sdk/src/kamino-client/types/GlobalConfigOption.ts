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

export interface ScopeProgramIdJSON {
  kind: "ScopeProgramId"
}

export class ScopeProgramId {
  static readonly discriminator = 10
  static readonly kind = "ScopeProgramId"
  readonly discriminator = 10
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
  static readonly discriminator = 11
  static readonly kind = "ScopePriceId"
  readonly discriminator = 11
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
  if ("ScopeProgramId" in obj) {
    return new ScopeProgramId()
  }
  if ("ScopePriceId" in obj) {
    return new ScopePriceId()
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
    case "ScopeProgramId": {
      return new ScopeProgramId()
    }
    case "ScopePriceId": {
      return new ScopePriceId()
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
    borsh.struct([], "ScopeProgramId"),
    borsh.struct([], "ScopePriceId"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
