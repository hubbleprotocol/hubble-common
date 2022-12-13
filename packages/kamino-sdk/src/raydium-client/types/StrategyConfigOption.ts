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

export interface UpdateSwapVaultMaxSlippageJSON {
  kind: "UpdateSwapVaultMaxSlippage"
}

export class UpdateSwapVaultMaxSlippage {
  static readonly discriminator = 9
  static readonly kind = "UpdateSwapVaultMaxSlippage"
  readonly discriminator = 9
  readonly kind = "UpdateSwapVaultMaxSlippage"

  toJSON(): UpdateSwapVaultMaxSlippageJSON {
    return {
      kind: "UpdateSwapVaultMaxSlippage",
    }
  }

  toEncodable() {
    return {
      UpdateSwapVaultMaxSlippage: {},
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

export interface KaminoRewardIndex0TSJSON {
  kind: "KaminoRewardIndex0TS"
}

export class KaminoRewardIndex0TS {
  static readonly discriminator = 18
  static readonly kind = "KaminoRewardIndex0TS"
  readonly discriminator = 18
  readonly kind = "KaminoRewardIndex0TS"

  toJSON(): KaminoRewardIndex0TSJSON {
    return {
      kind: "KaminoRewardIndex0TS",
    }
  }

  toEncodable() {
    return {
      KaminoRewardIndex0TS: {},
    }
  }
}

export interface KaminoRewardIndex1TSJSON {
  kind: "KaminoRewardIndex1TS"
}

export class KaminoRewardIndex1TS {
  static readonly discriminator = 19
  static readonly kind = "KaminoRewardIndex1TS"
  readonly discriminator = 19
  readonly kind = "KaminoRewardIndex1TS"

  toJSON(): KaminoRewardIndex1TSJSON {
    return {
      kind: "KaminoRewardIndex1TS",
    }
  }

  toEncodable() {
    return {
      KaminoRewardIndex1TS: {},
    }
  }
}

export interface KaminoRewardIndex2TSJSON {
  kind: "KaminoRewardIndex2TS"
}

export class KaminoRewardIndex2TS {
  static readonly discriminator = 20
  static readonly kind = "KaminoRewardIndex2TS"
  readonly discriminator = 20
  readonly kind = "KaminoRewardIndex2TS"

  toJSON(): KaminoRewardIndex2TSJSON {
    return {
      kind: "KaminoRewardIndex2TS",
    }
  }

  toEncodable() {
    return {
      KaminoRewardIndex2TS: {},
    }
  }
}

export interface KaminoRewardIndex0RewardPerSecondJSON {
  kind: "KaminoRewardIndex0RewardPerSecond"
}

export class KaminoRewardIndex0RewardPerSecond {
  static readonly discriminator = 21
  static readonly kind = "KaminoRewardIndex0RewardPerSecond"
  readonly discriminator = 21
  readonly kind = "KaminoRewardIndex0RewardPerSecond"

  toJSON(): KaminoRewardIndex0RewardPerSecondJSON {
    return {
      kind: "KaminoRewardIndex0RewardPerSecond",
    }
  }

  toEncodable() {
    return {
      KaminoRewardIndex0RewardPerSecond: {},
    }
  }
}

export interface KaminoRewardIndex1RewardPerSecondJSON {
  kind: "KaminoRewardIndex1RewardPerSecond"
}

export class KaminoRewardIndex1RewardPerSecond {
  static readonly discriminator = 22
  static readonly kind = "KaminoRewardIndex1RewardPerSecond"
  readonly discriminator = 22
  readonly kind = "KaminoRewardIndex1RewardPerSecond"

  toJSON(): KaminoRewardIndex1RewardPerSecondJSON {
    return {
      kind: "KaminoRewardIndex1RewardPerSecond",
    }
  }

  toEncodable() {
    return {
      KaminoRewardIndex1RewardPerSecond: {},
    }
  }
}

export interface KaminoRewardIndex2RewardPerSecondJSON {
  kind: "KaminoRewardIndex2RewardPerSecond"
}

export class KaminoRewardIndex2RewardPerSecond {
  static readonly discriminator = 23
  static readonly kind = "KaminoRewardIndex2RewardPerSecond"
  readonly discriminator = 23
  readonly kind = "KaminoRewardIndex2RewardPerSecond"

  toJSON(): KaminoRewardIndex2RewardPerSecondJSON {
    return {
      kind: "KaminoRewardIndex2RewardPerSecond",
    }
  }

  toEncodable() {
    return {
      KaminoRewardIndex2RewardPerSecond: {},
    }
  }
}

export interface UpdateDepositBlockedJSON {
  kind: "UpdateDepositBlocked"
}

export class UpdateDepositBlocked {
  static readonly discriminator = 24
  static readonly kind = "UpdateDepositBlocked"
  readonly discriminator = 24
  readonly kind = "UpdateDepositBlocked"

  toJSON(): UpdateDepositBlockedJSON {
    return {
      kind: "UpdateDepositBlocked",
    }
  }

  toEncodable() {
    return {
      UpdateDepositBlocked: {},
    }
  }
}

export interface UpdateRaydiumProtocolPositionOrBaseVaultAuthorityJSON {
  kind: "UpdateRaydiumProtocolPositionOrBaseVaultAuthority"
}

export class UpdateRaydiumProtocolPositionOrBaseVaultAuthority {
  static readonly discriminator = 25
  static readonly kind = "UpdateRaydiumProtocolPositionOrBaseVaultAuthority"
  readonly discriminator = 25
  readonly kind = "UpdateRaydiumProtocolPositionOrBaseVaultAuthority"

  toJSON(): UpdateRaydiumProtocolPositionOrBaseVaultAuthorityJSON {
    return {
      kind: "UpdateRaydiumProtocolPositionOrBaseVaultAuthority",
    }
  }

  toEncodable() {
    return {
      UpdateRaydiumProtocolPositionOrBaseVaultAuthority: {},
    }
  }
}

export interface UpdateRaydiumPoolConfigOrBaseVaultAuthorityJSON {
  kind: "UpdateRaydiumPoolConfigOrBaseVaultAuthority"
}

export class UpdateRaydiumPoolConfigOrBaseVaultAuthority {
  static readonly discriminator = 26
  static readonly kind = "UpdateRaydiumPoolConfigOrBaseVaultAuthority"
  readonly discriminator = 26
  readonly kind = "UpdateRaydiumPoolConfigOrBaseVaultAuthority"

  toJSON(): UpdateRaydiumPoolConfigOrBaseVaultAuthorityJSON {
    return {
      kind: "UpdateRaydiumPoolConfigOrBaseVaultAuthority",
    }
  }

  toEncodable() {
    return {
      UpdateRaydiumPoolConfigOrBaseVaultAuthority: {},
    }
  }
}

export interface UpdateInvestBlockedJSON {
  kind: "UpdateInvestBlocked"
}

export class UpdateInvestBlocked {
  static readonly discriminator = 27
  static readonly kind = "UpdateInvestBlocked"
  readonly discriminator = 27
  readonly kind = "UpdateInvestBlocked"

  toJSON(): UpdateInvestBlockedJSON {
    return {
      kind: "UpdateInvestBlocked",
    }
  }

  toEncodable() {
    return {
      UpdateInvestBlocked: {},
    }
  }
}

export interface UpdateWithdrawBlockedJSON {
  kind: "UpdateWithdrawBlocked"
}

export class UpdateWithdrawBlocked {
  static readonly discriminator = 28
  static readonly kind = "UpdateWithdrawBlocked"
  readonly discriminator = 28
  readonly kind = "UpdateWithdrawBlocked"

  toJSON(): UpdateWithdrawBlockedJSON {
    return {
      kind: "UpdateWithdrawBlocked",
    }
  }

  toEncodable() {
    return {
      UpdateWithdrawBlocked: {},
    }
  }
}

export interface UpdateLocalAdminBlockedJSON {
  kind: "UpdateLocalAdminBlocked"
}

export class UpdateLocalAdminBlocked {
  static readonly discriminator = 29
  static readonly kind = "UpdateLocalAdminBlocked"
  readonly discriminator = 29
  readonly kind = "UpdateLocalAdminBlocked"

  toJSON(): UpdateLocalAdminBlockedJSON {
    return {
      kind: "UpdateLocalAdminBlocked",
    }
  }

  toEncodable() {
    return {
      UpdateLocalAdminBlocked: {},
    }
  }
}

export interface UpdateCollateralIdAJSON {
  kind: "UpdateCollateralIdA"
}

export class UpdateCollateralIdA {
  static readonly discriminator = 30
  static readonly kind = "UpdateCollateralIdA"
  readonly discriminator = 30
  readonly kind = "UpdateCollateralIdA"

  toJSON(): UpdateCollateralIdAJSON {
    return {
      kind: "UpdateCollateralIdA",
    }
  }

  toEncodable() {
    return {
      UpdateCollateralIdA: {},
    }
  }
}

export interface UpdateCollateralIdBJSON {
  kind: "UpdateCollateralIdB"
}

export class UpdateCollateralIdB {
  static readonly discriminator = 31
  static readonly kind = "UpdateCollateralIdB"
  readonly discriminator = 31
  readonly kind = "UpdateCollateralIdB"

  toJSON(): UpdateCollateralIdBJSON {
    return {
      kind: "UpdateCollateralIdB",
    }
  }

  toEncodable() {
    return {
      UpdateCollateralIdB: {},
    }
  }
}

export interface UpdateFlashVaultSwapJSON {
  kind: "UpdateFlashVaultSwap"
}

export class UpdateFlashVaultSwap {
  static readonly discriminator = 32
  static readonly kind = "UpdateFlashVaultSwap"
  readonly discriminator = 32
  readonly kind = "UpdateFlashVaultSwap"

  toJSON(): UpdateFlashVaultSwapJSON {
    return {
      kind: "UpdateFlashVaultSwap",
    }
  }

  toEncodable() {
    return {
      UpdateFlashVaultSwap: {},
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
  if ("UpdateSwapVaultMaxSlippage" in obj) {
    return new UpdateSwapVaultMaxSlippage()
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
  if ("KaminoRewardIndex0TS" in obj) {
    return new KaminoRewardIndex0TS()
  }
  if ("KaminoRewardIndex1TS" in obj) {
    return new KaminoRewardIndex1TS()
  }
  if ("KaminoRewardIndex2TS" in obj) {
    return new KaminoRewardIndex2TS()
  }
  if ("KaminoRewardIndex0RewardPerSecond" in obj) {
    return new KaminoRewardIndex0RewardPerSecond()
  }
  if ("KaminoRewardIndex1RewardPerSecond" in obj) {
    return new KaminoRewardIndex1RewardPerSecond()
  }
  if ("KaminoRewardIndex2RewardPerSecond" in obj) {
    return new KaminoRewardIndex2RewardPerSecond()
  }
  if ("UpdateDepositBlocked" in obj) {
    return new UpdateDepositBlocked()
  }
  if ("UpdateRaydiumProtocolPositionOrBaseVaultAuthority" in obj) {
    return new UpdateRaydiumProtocolPositionOrBaseVaultAuthority()
  }
  if ("UpdateRaydiumPoolConfigOrBaseVaultAuthority" in obj) {
    return new UpdateRaydiumPoolConfigOrBaseVaultAuthority()
  }
  if ("UpdateInvestBlocked" in obj) {
    return new UpdateInvestBlocked()
  }
  if ("UpdateWithdrawBlocked" in obj) {
    return new UpdateWithdrawBlocked()
  }
  if ("UpdateLocalAdminBlocked" in obj) {
    return new UpdateLocalAdminBlocked()
  }
  if ("UpdateCollateralIdA" in obj) {
    return new UpdateCollateralIdA()
  }
  if ("UpdateCollateralIdB" in obj) {
    return new UpdateCollateralIdB()
  }
  if ("UpdateFlashVaultSwap" in obj) {
    return new UpdateFlashVaultSwap()
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
    case "UpdateSwapVaultMaxSlippage": {
      return new UpdateSwapVaultMaxSlippage()
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
    case "KaminoRewardIndex0TS": {
      return new KaminoRewardIndex0TS()
    }
    case "KaminoRewardIndex1TS": {
      return new KaminoRewardIndex1TS()
    }
    case "KaminoRewardIndex2TS": {
      return new KaminoRewardIndex2TS()
    }
    case "KaminoRewardIndex0RewardPerSecond": {
      return new KaminoRewardIndex0RewardPerSecond()
    }
    case "KaminoRewardIndex1RewardPerSecond": {
      return new KaminoRewardIndex1RewardPerSecond()
    }
    case "KaminoRewardIndex2RewardPerSecond": {
      return new KaminoRewardIndex2RewardPerSecond()
    }
    case "UpdateDepositBlocked": {
      return new UpdateDepositBlocked()
    }
    case "UpdateRaydiumProtocolPositionOrBaseVaultAuthority": {
      return new UpdateRaydiumProtocolPositionOrBaseVaultAuthority()
    }
    case "UpdateRaydiumPoolConfigOrBaseVaultAuthority": {
      return new UpdateRaydiumPoolConfigOrBaseVaultAuthority()
    }
    case "UpdateInvestBlocked": {
      return new UpdateInvestBlocked()
    }
    case "UpdateWithdrawBlocked": {
      return new UpdateWithdrawBlocked()
    }
    case "UpdateLocalAdminBlocked": {
      return new UpdateLocalAdminBlocked()
    }
    case "UpdateCollateralIdA": {
      return new UpdateCollateralIdA()
    }
    case "UpdateCollateralIdB": {
      return new UpdateCollateralIdB()
    }
    case "UpdateFlashVaultSwap": {
      return new UpdateFlashVaultSwap()
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
    borsh.struct([], "UpdateSwapVaultMaxSlippage"),
    borsh.struct([], "UpdateStrategyType"),
    borsh.struct([], "UpdateDepositFee"),
    borsh.struct([], "UpdateWithdrawFee"),
    borsh.struct([], "UpdateCollectFeesFee"),
    borsh.struct([], "UpdateReward0Fee"),
    borsh.struct([], "UpdateReward1Fee"),
    borsh.struct([], "UpdateReward2Fee"),
    borsh.struct([], "UpdateAdminAuthority"),
    borsh.struct([], "KaminoRewardIndex0TS"),
    borsh.struct([], "KaminoRewardIndex1TS"),
    borsh.struct([], "KaminoRewardIndex2TS"),
    borsh.struct([], "KaminoRewardIndex0RewardPerSecond"),
    borsh.struct([], "KaminoRewardIndex1RewardPerSecond"),
    borsh.struct([], "KaminoRewardIndex2RewardPerSecond"),
    borsh.struct([], "UpdateDepositBlocked"),
    borsh.struct([], "UpdateRaydiumProtocolPositionOrBaseVaultAuthority"),
    borsh.struct([], "UpdateRaydiumPoolConfigOrBaseVaultAuthority"),
    borsh.struct([], "UpdateInvestBlocked"),
    borsh.struct([], "UpdateWithdrawBlocked"),
    borsh.struct([], "UpdateLocalAdminBlocked"),
    borsh.struct([], "UpdateCollateralIdA"),
    borsh.struct([], "UpdateCollateralIdB"),
    borsh.struct([], "UpdateFlashVaultSwap"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
