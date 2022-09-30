import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface UpdateDepositCapJSON {
  kind: "UpdateDepositCap"
}

export class UpdateDepositCap {
  static readonly discriminator = 0
  static readonly kind = "UpdateDepositCap"
  readonly discriminator = 0
  readonly kind = "UpdateDepositCap"

  toJSON(): UpdateDepositCapJSON {
    return {
      kind: "UpdateDepositCap",
    }
  }

  toEncodable() {
    return {
      UpdateDepositCap: {},
    }
  }
}

export interface UpdateDepositCapIxnJSON {
  kind: "UpdateDepositCapIxn"
}

export class UpdateDepositCapIxn {
  static readonly discriminator = 1
  static readonly kind = "UpdateDepositCapIxn"
  readonly discriminator = 1
  readonly kind = "UpdateDepositCapIxn"

  toJSON(): UpdateDepositCapIxnJSON {
    return {
      kind: "UpdateDepositCapIxn",
    }
  }

  toEncodable() {
    return {
      UpdateDepositCapIxn: {},
    }
  }
}

export interface UpdateWithdrawalCapACapacityJSON {
  kind: "UpdateWithdrawalCapACapacity"
}

export class UpdateWithdrawalCapACapacity {
  static readonly discriminator = 2
  static readonly kind = "UpdateWithdrawalCapACapacity"
  readonly discriminator = 2
  readonly kind = "UpdateWithdrawalCapACapacity"

  toJSON(): UpdateWithdrawalCapACapacityJSON {
    return {
      kind: "UpdateWithdrawalCapACapacity",
    }
  }

  toEncodable() {
    return {
      UpdateWithdrawalCapACapacity: {},
    }
  }
}

export interface UpdateWithdrawalCapAIntervalJSON {
  kind: "UpdateWithdrawalCapAInterval"
}

export class UpdateWithdrawalCapAInterval {
  static readonly discriminator = 3
  static readonly kind = "UpdateWithdrawalCapAInterval"
  readonly discriminator = 3
  readonly kind = "UpdateWithdrawalCapAInterval"

  toJSON(): UpdateWithdrawalCapAIntervalJSON {
    return {
      kind: "UpdateWithdrawalCapAInterval",
    }
  }

  toEncodable() {
    return {
      UpdateWithdrawalCapAInterval: {},
    }
  }
}

export interface UpdateWithdrawalCapACurrentTotalJSON {
  kind: "UpdateWithdrawalCapACurrentTotal"
}

export class UpdateWithdrawalCapACurrentTotal {
  static readonly discriminator = 4
  static readonly kind = "UpdateWithdrawalCapACurrentTotal"
  readonly discriminator = 4
  readonly kind = "UpdateWithdrawalCapACurrentTotal"

  toJSON(): UpdateWithdrawalCapACurrentTotalJSON {
    return {
      kind: "UpdateWithdrawalCapACurrentTotal",
    }
  }

  toEncodable() {
    return {
      UpdateWithdrawalCapACurrentTotal: {},
    }
  }
}

export interface UpdateWithdrawalCapBCapacityJSON {
  kind: "UpdateWithdrawalCapBCapacity"
}

export class UpdateWithdrawalCapBCapacity {
  static readonly discriminator = 5
  static readonly kind = "UpdateWithdrawalCapBCapacity"
  readonly discriminator = 5
  readonly kind = "UpdateWithdrawalCapBCapacity"

  toJSON(): UpdateWithdrawalCapBCapacityJSON {
    return {
      kind: "UpdateWithdrawalCapBCapacity",
    }
  }

  toEncodable() {
    return {
      UpdateWithdrawalCapBCapacity: {},
    }
  }
}

export interface UpdateWithdrawalCapBIntervalJSON {
  kind: "UpdateWithdrawalCapBInterval"
}

export class UpdateWithdrawalCapBInterval {
  static readonly discriminator = 6
  static readonly kind = "UpdateWithdrawalCapBInterval"
  readonly discriminator = 6
  readonly kind = "UpdateWithdrawalCapBInterval"

  toJSON(): UpdateWithdrawalCapBIntervalJSON {
    return {
      kind: "UpdateWithdrawalCapBInterval",
    }
  }

  toEncodable() {
    return {
      UpdateWithdrawalCapBInterval: {},
    }
  }
}

export interface UpdateWithdrawalCapBCurrentTotalJSON {
  kind: "UpdateWithdrawalCapBCurrentTotal"
}

export class UpdateWithdrawalCapBCurrentTotal {
  static readonly discriminator = 7
  static readonly kind = "UpdateWithdrawalCapBCurrentTotal"
  readonly discriminator = 7
  readonly kind = "UpdateWithdrawalCapBCurrentTotal"

  toJSON(): UpdateWithdrawalCapBCurrentTotalJSON {
    return {
      kind: "UpdateWithdrawalCapBCurrentTotal",
    }
  }

  toEncodable() {
    return {
      UpdateWithdrawalCapBCurrentTotal: {},
    }
  }
}

export interface UpdateMaxDeviationBpsJSON {
  kind: "UpdateMaxDeviationBps"
}

export class UpdateMaxDeviationBps {
  static readonly discriminator = 8
  static readonly kind = "UpdateMaxDeviationBps"
  readonly discriminator = 8
  readonly kind = "UpdateMaxDeviationBps"

  toJSON(): UpdateMaxDeviationBpsJSON {
    return {
      kind: "UpdateMaxDeviationBps",
    }
  }

  toEncodable() {
    return {
      UpdateMaxDeviationBps: {},
    }
  }
}

export interface UpdateSwapUnevenMaxSlippageJSON {
  kind: "UpdateSwapUnevenMaxSlippage"
}

export class UpdateSwapUnevenMaxSlippage {
  static readonly discriminator = 9
  static readonly kind = "UpdateSwapUnevenMaxSlippage"
  readonly discriminator = 9
  readonly kind = "UpdateSwapUnevenMaxSlippage"

  toJSON(): UpdateSwapUnevenMaxSlippageJSON {
    return {
      kind: "UpdateSwapUnevenMaxSlippage",
    }
  }

  toEncodable() {
    return {
      UpdateSwapUnevenMaxSlippage: {},
    }
  }
}

export interface UpdateStrategyTypeJSON {
  kind: "UpdateStrategyType"
}

export class UpdateStrategyType {
  static readonly discriminator = 10
  static readonly kind = "UpdateStrategyType"
  readonly discriminator = 10
  readonly kind = "UpdateStrategyType"

  toJSON(): UpdateStrategyTypeJSON {
    return {
      kind: "UpdateStrategyType",
    }
  }

  toEncodable() {
    return {
      UpdateStrategyType: {},
    }
  }
}

export interface UpdateDepositFeeJSON {
  kind: "UpdateDepositFee"
}

export class UpdateDepositFee {
  static readonly discriminator = 11
  static readonly kind = "UpdateDepositFee"
  readonly discriminator = 11
  readonly kind = "UpdateDepositFee"

  toJSON(): UpdateDepositFeeJSON {
    return {
      kind: "UpdateDepositFee",
    }
  }

  toEncodable() {
    return {
      UpdateDepositFee: {},
    }
  }
}

export interface UpdateWithdrawFeeJSON {
  kind: "UpdateWithdrawFee"
}

export class UpdateWithdrawFee {
  static readonly discriminator = 12
  static readonly kind = "UpdateWithdrawFee"
  readonly discriminator = 12
  readonly kind = "UpdateWithdrawFee"

  toJSON(): UpdateWithdrawFeeJSON {
    return {
      kind: "UpdateWithdrawFee",
    }
  }

  toEncodable() {
    return {
      UpdateWithdrawFee: {},
    }
  }
}

export interface UpdateCollectFeesFeeJSON {
  kind: "UpdateCollectFeesFee"
}

export class UpdateCollectFeesFee {
  static readonly discriminator = 13
  static readonly kind = "UpdateCollectFeesFee"
  readonly discriminator = 13
  readonly kind = "UpdateCollectFeesFee"

  toJSON(): UpdateCollectFeesFeeJSON {
    return {
      kind: "UpdateCollectFeesFee",
    }
  }

  toEncodable() {
    return {
      UpdateCollectFeesFee: {},
    }
  }
}

export interface UpdateReward0FeeJSON {
  kind: "UpdateReward0Fee"
}

export class UpdateReward0Fee {
  static readonly discriminator = 14
  static readonly kind = "UpdateReward0Fee"
  readonly discriminator = 14
  readonly kind = "UpdateReward0Fee"

  toJSON(): UpdateReward0FeeJSON {
    return {
      kind: "UpdateReward0Fee",
    }
  }

  toEncodable() {
    return {
      UpdateReward0Fee: {},
    }
  }
}

export interface UpdateReward1FeeJSON {
  kind: "UpdateReward1Fee"
}

export class UpdateReward1Fee {
  static readonly discriminator = 15
  static readonly kind = "UpdateReward1Fee"
  readonly discriminator = 15
  readonly kind = "UpdateReward1Fee"

  toJSON(): UpdateReward1FeeJSON {
    return {
      kind: "UpdateReward1Fee",
    }
  }

  toEncodable() {
    return {
      UpdateReward1Fee: {},
    }
  }
}

export interface UpdateReward2FeeJSON {
  kind: "UpdateReward2Fee"
}

export class UpdateReward2Fee {
  static readonly discriminator = 16
  static readonly kind = "UpdateReward2Fee"
  readonly discriminator = 16
  readonly kind = "UpdateReward2Fee"

  toJSON(): UpdateReward2FeeJSON {
    return {
      kind: "UpdateReward2Fee",
    }
  }

  toEncodable() {
    return {
      UpdateReward2Fee: {},
    }
  }
}

export interface UpdateAdminAuthorityJSON {
  kind: "UpdateAdminAuthority"
}

export class UpdateAdminAuthority {
  static readonly discriminator = 17
  static readonly kind = "UpdateAdminAuthority"
  readonly discriminator = 17
  readonly kind = "UpdateAdminAuthority"

  toJSON(): UpdateAdminAuthorityJSON {
    return {
      kind: "UpdateAdminAuthority",
    }
  }

  toEncodable() {
    return {
      UpdateAdminAuthority: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.StrategyConfigOptionKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("UpdateDepositCap" in obj) {
    return new UpdateDepositCap()
  }
  if ("UpdateDepositCapIxn" in obj) {
    return new UpdateDepositCapIxn()
  }
  if ("UpdateWithdrawalCapACapacity" in obj) {
    return new UpdateWithdrawalCapACapacity()
  }
  if ("UpdateWithdrawalCapAInterval" in obj) {
    return new UpdateWithdrawalCapAInterval()
  }
  if ("UpdateWithdrawalCapACurrentTotal" in obj) {
    return new UpdateWithdrawalCapACurrentTotal()
  }
  if ("UpdateWithdrawalCapBCapacity" in obj) {
    return new UpdateWithdrawalCapBCapacity()
  }
  if ("UpdateWithdrawalCapBInterval" in obj) {
    return new UpdateWithdrawalCapBInterval()
  }
  if ("UpdateWithdrawalCapBCurrentTotal" in obj) {
    return new UpdateWithdrawalCapBCurrentTotal()
  }
  if ("UpdateMaxDeviationBps" in obj) {
    return new UpdateMaxDeviationBps()
  }
  if ("UpdateSwapUnevenMaxSlippage" in obj) {
    return new UpdateSwapUnevenMaxSlippage()
  }
  if ("UpdateStrategyType" in obj) {
    return new UpdateStrategyType()
  }
  if ("UpdateDepositFee" in obj) {
    return new UpdateDepositFee()
  }
  if ("UpdateWithdrawFee" in obj) {
    return new UpdateWithdrawFee()
  }
  if ("UpdateCollectFeesFee" in obj) {
    return new UpdateCollectFeesFee()
  }
  if ("UpdateReward0Fee" in obj) {
    return new UpdateReward0Fee()
  }
  if ("UpdateReward1Fee" in obj) {
    return new UpdateReward1Fee()
  }
  if ("UpdateReward2Fee" in obj) {
    return new UpdateReward2Fee()
  }
  if ("UpdateAdminAuthority" in obj) {
    return new UpdateAdminAuthority()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.StrategyConfigOptionJSON
): types.StrategyConfigOptionKind {
  switch (obj.kind) {
    case "UpdateDepositCap": {
      return new UpdateDepositCap()
    }
    case "UpdateDepositCapIxn": {
      return new UpdateDepositCapIxn()
    }
    case "UpdateWithdrawalCapACapacity": {
      return new UpdateWithdrawalCapACapacity()
    }
    case "UpdateWithdrawalCapAInterval": {
      return new UpdateWithdrawalCapAInterval()
    }
    case "UpdateWithdrawalCapACurrentTotal": {
      return new UpdateWithdrawalCapACurrentTotal()
    }
    case "UpdateWithdrawalCapBCapacity": {
      return new UpdateWithdrawalCapBCapacity()
    }
    case "UpdateWithdrawalCapBInterval": {
      return new UpdateWithdrawalCapBInterval()
    }
    case "UpdateWithdrawalCapBCurrentTotal": {
      return new UpdateWithdrawalCapBCurrentTotal()
    }
    case "UpdateMaxDeviationBps": {
      return new UpdateMaxDeviationBps()
    }
    case "UpdateSwapUnevenMaxSlippage": {
      return new UpdateSwapUnevenMaxSlippage()
    }
    case "UpdateStrategyType": {
      return new UpdateStrategyType()
    }
    case "UpdateDepositFee": {
      return new UpdateDepositFee()
    }
    case "UpdateWithdrawFee": {
      return new UpdateWithdrawFee()
    }
    case "UpdateCollectFeesFee": {
      return new UpdateCollectFeesFee()
    }
    case "UpdateReward0Fee": {
      return new UpdateReward0Fee()
    }
    case "UpdateReward1Fee": {
      return new UpdateReward1Fee()
    }
    case "UpdateReward2Fee": {
      return new UpdateReward2Fee()
    }
    case "UpdateAdminAuthority": {
      return new UpdateAdminAuthority()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "UpdateDepositCap"),
    borsh.struct([], "UpdateDepositCapIxn"),
    borsh.struct([], "UpdateWithdrawalCapACapacity"),
    borsh.struct([], "UpdateWithdrawalCapAInterval"),
    borsh.struct([], "UpdateWithdrawalCapACurrentTotal"),
    borsh.struct([], "UpdateWithdrawalCapBCapacity"),
    borsh.struct([], "UpdateWithdrawalCapBInterval"),
    borsh.struct([], "UpdateWithdrawalCapBCurrentTotal"),
    borsh.struct([], "UpdateMaxDeviationBps"),
    borsh.struct([], "UpdateSwapUnevenMaxSlippage"),
    borsh.struct([], "UpdateStrategyType"),
    borsh.struct([], "UpdateDepositFee"),
    borsh.struct([], "UpdateWithdrawFee"),
    borsh.struct([], "UpdateCollectFeesFee"),
    borsh.struct([], "UpdateReward0Fee"),
    borsh.struct([], "UpdateReward1Fee"),
    borsh.struct([], "UpdateReward2Fee"),
    borsh.struct([], "UpdateAdminAuthority"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
