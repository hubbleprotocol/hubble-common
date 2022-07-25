import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface IntegerOverflowJSON {
  kind: "IntegerOverflow"
}

export class IntegerOverflow {
  static readonly discriminator = 0
  static readonly kind = "IntegerOverflow"
  readonly discriminator = 0
  readonly kind = "IntegerOverflow"

  toJSON(): IntegerOverflowJSON {
    return {
      kind: "IntegerOverflow",
    }
  }

  toEncodable() {
    return {
      IntegerOverflow: {},
    }
  }
}

export interface OperationForbiddenJSON {
  kind: "OperationForbidden"
}

export class OperationForbidden {
  static readonly discriminator = 1
  static readonly kind = "OperationForbidden"
  readonly discriminator = 1
  readonly kind = "OperationForbidden"

  toJSON(): OperationForbiddenJSON {
    return {
      kind: "OperationForbidden",
    }
  }

  toEncodable() {
    return {
      OperationForbidden: {},
    }
  }
}

export interface ZeroAmountJSON {
  kind: "ZeroAmount"
}

export class ZeroAmount {
  static readonly discriminator = 2
  static readonly kind = "ZeroAmount"
  readonly discriminator = 2
  readonly kind = "ZeroAmount"

  toJSON(): ZeroAmountJSON {
    return {
      kind: "ZeroAmount",
    }
  }

  toEncodable() {
    return {
      ZeroAmount: {},
    }
  }
}

export interface UnableToDeserializeAccountJSON {
  kind: "UnableToDeserializeAccount"
}

export class UnableToDeserializeAccount {
  static readonly discriminator = 3
  static readonly kind = "UnableToDeserializeAccount"
  readonly discriminator = 3
  readonly kind = "UnableToDeserializeAccount"

  toJSON(): UnableToDeserializeAccountJSON {
    return {
      kind: "UnableToDeserializeAccount",
    }
  }

  toEncodable() {
    return {
      UnableToDeserializeAccount: {},
    }
  }
}

export interface VaultBalanceDoesNotMatchTokenAJSON {
  kind: "VaultBalanceDoesNotMatchTokenA"
}

export class VaultBalanceDoesNotMatchTokenA {
  static readonly discriminator = 4
  static readonly kind = "VaultBalanceDoesNotMatchTokenA"
  readonly discriminator = 4
  readonly kind = "VaultBalanceDoesNotMatchTokenA"

  toJSON(): VaultBalanceDoesNotMatchTokenAJSON {
    return {
      kind: "VaultBalanceDoesNotMatchTokenA",
    }
  }

  toEncodable() {
    return {
      VaultBalanceDoesNotMatchTokenA: {},
    }
  }
}

export interface VaultBalanceDoesNotMatchTokenBJSON {
  kind: "VaultBalanceDoesNotMatchTokenB"
}

export class VaultBalanceDoesNotMatchTokenB {
  static readonly discriminator = 5
  static readonly kind = "VaultBalanceDoesNotMatchTokenB"
  readonly discriminator = 5
  readonly kind = "VaultBalanceDoesNotMatchTokenB"

  toJSON(): VaultBalanceDoesNotMatchTokenBJSON {
    return {
      kind: "VaultBalanceDoesNotMatchTokenB",
    }
  }

  toEncodable() {
    return {
      VaultBalanceDoesNotMatchTokenB: {},
    }
  }
}

export interface SharesIssuedAmountDoesNotMatchJSON {
  kind: "SharesIssuedAmountDoesNotMatch"
}

export class SharesIssuedAmountDoesNotMatch {
  static readonly discriminator = 6
  static readonly kind = "SharesIssuedAmountDoesNotMatch"
  readonly discriminator = 6
  readonly kind = "SharesIssuedAmountDoesNotMatch"

  toJSON(): SharesIssuedAmountDoesNotMatchJSON {
    return {
      kind: "SharesIssuedAmountDoesNotMatch",
    }
  }

  toEncodable() {
    return {
      SharesIssuedAmountDoesNotMatch: {},
    }
  }
}

export interface GlobalConfigKeyErrorJSON {
  kind: "GlobalConfigKeyError"
}

export class GlobalConfigKeyError {
  static readonly discriminator = 7
  static readonly kind = "GlobalConfigKeyError"
  readonly discriminator = 7
  readonly kind = "GlobalConfigKeyError"

  toJSON(): GlobalConfigKeyErrorJSON {
    return {
      kind: "GlobalConfigKeyError",
    }
  }

  toEncodable() {
    return {
      GlobalConfigKeyError: {},
    }
  }
}

export interface SystemInEmergencyModeJSON {
  kind: "SystemInEmergencyMode"
}

export class SystemInEmergencyMode {
  static readonly discriminator = 8
  static readonly kind = "SystemInEmergencyMode"
  readonly discriminator = 8
  readonly kind = "SystemInEmergencyMode"

  toJSON(): SystemInEmergencyModeJSON {
    return {
      kind: "SystemInEmergencyMode",
    }
  }

  toEncodable() {
    return {
      SystemInEmergencyMode: {},
    }
  }
}

export interface DepositBlockedJSON {
  kind: "DepositBlocked"
}

export class DepositBlocked {
  static readonly discriminator = 9
  static readonly kind = "DepositBlocked"
  readonly discriminator = 9
  readonly kind = "DepositBlocked"

  toJSON(): DepositBlockedJSON {
    return {
      kind: "DepositBlocked",
    }
  }

  toEncodable() {
    return {
      DepositBlocked: {},
    }
  }
}

export interface WithdrawBlockedJSON {
  kind: "WithdrawBlocked"
}

export class WithdrawBlocked {
  static readonly discriminator = 10
  static readonly kind = "WithdrawBlocked"
  readonly discriminator = 10
  readonly kind = "WithdrawBlocked"

  toJSON(): WithdrawBlockedJSON {
    return {
      kind: "WithdrawBlocked",
    }
  }

  toEncodable() {
    return {
      WithdrawBlocked: {},
    }
  }
}

export interface InvestBlockedJSON {
  kind: "InvestBlocked"
}

export class InvestBlocked {
  static readonly discriminator = 11
  static readonly kind = "InvestBlocked"
  readonly discriminator = 11
  readonly kind = "InvestBlocked"

  toJSON(): InvestBlockedJSON {
    return {
      kind: "InvestBlocked",
    }
  }

  toEncodable() {
    return {
      InvestBlocked: {},
    }
  }
}

export interface OutOfRangeIntegralConversionJSON {
  kind: "OutOfRangeIntegralConversion"
}

export class OutOfRangeIntegralConversion {
  static readonly discriminator = 12
  static readonly kind = "OutOfRangeIntegralConversion"
  readonly discriminator = 12
  readonly kind = "OutOfRangeIntegralConversion"

  toJSON(): OutOfRangeIntegralConversionJSON {
    return {
      kind: "OutOfRangeIntegralConversion",
    }
  }

  toEncodable() {
    return {
      OutOfRangeIntegralConversion: {},
    }
  }
}

export interface MathOverflowJSON {
  kind: "MathOverflow"
}

export class MathOverflow {
  static readonly discriminator = 13
  static readonly kind = "MathOverflow"
  readonly discriminator = 13
  readonly kind = "MathOverflow"

  toJSON(): MathOverflowJSON {
    return {
      kind: "MathOverflow",
    }
  }

  toEncodable() {
    return {
      MathOverflow: {},
    }
  }
}

export interface TooMuchLiquidityToWithdrawJSON {
  kind: "TooMuchLiquidityToWithdraw"
}

export class TooMuchLiquidityToWithdraw {
  static readonly discriminator = 14
  static readonly kind = "TooMuchLiquidityToWithdraw"
  readonly discriminator = 14
  readonly kind = "TooMuchLiquidityToWithdraw"

  toJSON(): TooMuchLiquidityToWithdrawJSON {
    return {
      kind: "TooMuchLiquidityToWithdraw",
    }
  }

  toEncodable() {
    return {
      TooMuchLiquidityToWithdraw: {},
    }
  }
}

export interface DepositAmountsZeroJSON {
  kind: "DepositAmountsZero"
}

export class DepositAmountsZero {
  static readonly discriminator = 15
  static readonly kind = "DepositAmountsZero"
  readonly discriminator = 15
  readonly kind = "DepositAmountsZero"

  toJSON(): DepositAmountsZeroJSON {
    return {
      kind: "DepositAmountsZero",
    }
  }

  toEncodable() {
    return {
      DepositAmountsZero: {},
    }
  }
}

export interface SharesZeroJSON {
  kind: "SharesZero"
}

export class SharesZero {
  static readonly discriminator = 16
  static readonly kind = "SharesZero"
  readonly discriminator = 16
  readonly kind = "SharesZero"

  toJSON(): SharesZeroJSON {
    return {
      kind: "SharesZero",
    }
  }

  toEncodable() {
    return {
      SharesZero: {},
    }
  }
}

export interface StrategyNotActiveJSON {
  kind: "StrategyNotActive"
}

export class StrategyNotActive {
  static readonly discriminator = 17
  static readonly kind = "StrategyNotActive"
  readonly discriminator = 17
  readonly kind = "StrategyNotActive"

  toJSON(): StrategyNotActiveJSON {
    return {
      kind: "StrategyNotActive",
    }
  }

  toEncodable() {
    return {
      StrategyNotActive: {},
    }
  }
}

export interface UnharvestedAmountsJSON {
  kind: "UnharvestedAmounts"
}

export class UnharvestedAmounts {
  static readonly discriminator = 18
  static readonly kind = "UnharvestedAmounts"
  readonly discriminator = 18
  readonly kind = "UnharvestedAmounts"

  toJSON(): UnharvestedAmountsJSON {
    return {
      kind: "UnharvestedAmounts",
    }
  }

  toEncodable() {
    return {
      UnharvestedAmounts: {},
    }
  }
}

export interface InvalidRewardMappingJSON {
  kind: "InvalidRewardMapping"
}

export class InvalidRewardMapping {
  static readonly discriminator = 19
  static readonly kind = "InvalidRewardMapping"
  readonly discriminator = 19
  readonly kind = "InvalidRewardMapping"

  toJSON(): InvalidRewardMappingJSON {
    return {
      kind: "InvalidRewardMapping",
    }
  }

  toEncodable() {
    return {
      InvalidRewardMapping: {},
    }
  }
}

export interface InvalidRewardIndexJSON {
  kind: "InvalidRewardIndex"
}

export class InvalidRewardIndex {
  static readonly discriminator = 20
  static readonly kind = "InvalidRewardIndex"
  readonly discriminator = 20
  readonly kind = "InvalidRewardIndex"

  toJSON(): InvalidRewardIndexJSON {
    return {
      kind: "InvalidRewardIndex",
    }
  }

  toEncodable() {
    return {
      InvalidRewardIndex: {},
    }
  }
}

export interface OwnRewardUninitializedJSON {
  kind: "OwnRewardUninitialized"
}

export class OwnRewardUninitialized {
  static readonly discriminator = 21
  static readonly kind = "OwnRewardUninitialized"
  readonly discriminator = 21
  readonly kind = "OwnRewardUninitialized"

  toJSON(): OwnRewardUninitializedJSON {
    return {
      kind: "OwnRewardUninitialized",
    }
  }

  toEncodable() {
    return {
      OwnRewardUninitialized: {},
    }
  }
}

export interface PriceNotValidJSON {
  kind: "PriceNotValid"
}

export class PriceNotValid {
  static readonly discriminator = 22
  static readonly kind = "PriceNotValid"
  readonly discriminator = 22
  readonly kind = "PriceNotValid"

  toJSON(): PriceNotValidJSON {
    return {
      kind: "PriceNotValid",
    }
  }

  toEncodable() {
    return {
      PriceNotValid: {},
    }
  }
}

export interface SwapRewardImbalancedJSON {
  kind: "SwapRewardImbalanced"
}

export class SwapRewardImbalanced {
  static readonly discriminator = 23
  static readonly kind = "SwapRewardImbalanced"
  readonly discriminator = 23
  readonly kind = "SwapRewardImbalanced"

  toJSON(): SwapRewardImbalancedJSON {
    return {
      kind: "SwapRewardImbalanced",
    }
  }

  toEncodable() {
    return {
      SwapRewardImbalanced: {},
    }
  }
}

export interface SwapRewardTooSmallJSON {
  kind: "SwapRewardTooSmall"
}

export class SwapRewardTooSmall {
  static readonly discriminator = 24
  static readonly kind = "SwapRewardTooSmall"
  readonly discriminator = 24
  readonly kind = "SwapRewardTooSmall"

  toJSON(): SwapRewardTooSmallJSON {
    return {
      kind: "SwapRewardTooSmall",
    }
  }

  toEncodable() {
    return {
      SwapRewardTooSmall: {},
    }
  }
}

export interface SwapRewardLessThanRequestedJSON {
  kind: "SwapRewardLessThanRequested"
}

export class SwapRewardLessThanRequested {
  static readonly discriminator = 25
  static readonly kind = "SwapRewardLessThanRequested"
  readonly discriminator = 25
  readonly kind = "SwapRewardLessThanRequested"

  toJSON(): SwapRewardLessThanRequestedJSON {
    return {
      kind: "SwapRewardLessThanRequested",
    }
  }

  toEncodable() {
    return {
      SwapRewardLessThanRequested: {},
    }
  }
}

export interface SwapRewardLessThanMinimumJSON {
  kind: "SwapRewardLessThanMinimum"
}

export class SwapRewardLessThanMinimum {
  static readonly discriminator = 26
  static readonly kind = "SwapRewardLessThanMinimum"
  readonly discriminator = 26
  readonly kind = "SwapRewardLessThanMinimum"

  toJSON(): SwapRewardLessThanMinimumJSON {
    return {
      kind: "SwapRewardLessThanMinimum",
    }
  }

  toEncodable() {
    return {
      SwapRewardLessThanMinimum: {},
    }
  }
}

export interface WrongDiscriminatorJSON {
  kind: "WrongDiscriminator"
}

export class WrongDiscriminator {
  static readonly discriminator = 27
  static readonly kind = "WrongDiscriminator"
  readonly discriminator = 27
  readonly kind = "WrongDiscriminator"

  toJSON(): WrongDiscriminatorJSON {
    return {
      kind: "WrongDiscriminator",
    }
  }

  toEncodable() {
    return {
      WrongDiscriminator: {},
    }
  }
}

export interface WrongMintJSON {
  kind: "WrongMint"
}

export class WrongMint {
  static readonly discriminator = 28
  static readonly kind = "WrongMint"
  readonly discriminator = 28
  readonly kind = "WrongMint"

  toJSON(): WrongMintJSON {
    return {
      kind: "WrongMint",
    }
  }

  toEncodable() {
    return {
      WrongMint: {},
    }
  }
}

export interface WrongVaultJSON {
  kind: "WrongVault"
}

export class WrongVault {
  static readonly discriminator = 29
  static readonly kind = "WrongVault"
  readonly discriminator = 29
  readonly kind = "WrongVault"

  toJSON(): WrongVaultJSON {
    return {
      kind: "WrongVault",
    }
  }

  toEncodable() {
    return {
      WrongVault: {},
    }
  }
}

export interface SwapAmountsZeroJSON {
  kind: "SwapAmountsZero"
}

export class SwapAmountsZero {
  static readonly discriminator = 30
  static readonly kind = "SwapAmountsZero"
  readonly discriminator = 30
  readonly kind = "SwapAmountsZero"

  toJSON(): SwapAmountsZeroJSON {
    return {
      kind: "SwapAmountsZero",
    }
  }

  toEncodable() {
    return {
      SwapAmountsZero: {},
    }
  }
}

export interface PriceTooOldJSON {
  kind: "PriceTooOld"
}

export class PriceTooOld {
  static readonly discriminator = 31
  static readonly kind = "PriceTooOld"
  readonly discriminator = 31
  readonly kind = "PriceTooOld"

  toJSON(): PriceTooOldJSON {
    return {
      kind: "PriceTooOld",
    }
  }

  toEncodable() {
    return {
      PriceTooOld: {},
    }
  }
}

export interface CannotInvestZeroAmountJSON {
  kind: "CannotInvestZeroAmount"
}

export class CannotInvestZeroAmount {
  static readonly discriminator = 32
  static readonly kind = "CannotInvestZeroAmount"
  readonly discriminator = 32
  readonly kind = "CannotInvestZeroAmount"

  toJSON(): CannotInvestZeroAmountJSON {
    return {
      kind: "CannotInvestZeroAmount",
    }
  }

  toEncodable() {
    return {
      CannotInvestZeroAmount: {},
    }
  }
}

export interface MaxInvestableZeroJSON {
  kind: "MaxInvestableZero"
}

export class MaxInvestableZero {
  static readonly discriminator = 33
  static readonly kind = "MaxInvestableZero"
  readonly discriminator = 33
  readonly kind = "MaxInvestableZero"

  toJSON(): MaxInvestableZeroJSON {
    return {
      kind: "MaxInvestableZero",
    }
  }

  toEncodable() {
    return {
      MaxInvestableZero: {},
    }
  }
}

export interface CollectFeesBlockedJSON {
  kind: "CollectFeesBlocked"
}

export class CollectFeesBlocked {
  static readonly discriminator = 34
  static readonly kind = "CollectFeesBlocked"
  readonly discriminator = 34
  readonly kind = "CollectFeesBlocked"

  toJSON(): CollectFeesBlockedJSON {
    return {
      kind: "CollectFeesBlocked",
    }
  }

  toEncodable() {
    return {
      CollectFeesBlocked: {},
    }
  }
}

export interface CollectRewardsBlockedJSON {
  kind: "CollectRewardsBlocked"
}

export class CollectRewardsBlocked {
  static readonly discriminator = 35
  static readonly kind = "CollectRewardsBlocked"
  readonly discriminator = 35
  readonly kind = "CollectRewardsBlocked"

  toJSON(): CollectRewardsBlockedJSON {
    return {
      kind: "CollectRewardsBlocked",
    }
  }

  toEncodable() {
    return {
      CollectRewardsBlocked: {},
    }
  }
}

export interface SwapRewardsBlockedJSON {
  kind: "SwapRewardsBlocked"
}

export class SwapRewardsBlocked {
  static readonly discriminator = 36
  static readonly kind = "SwapRewardsBlocked"
  readonly discriminator = 36
  readonly kind = "SwapRewardsBlocked"

  toJSON(): SwapRewardsBlockedJSON {
    return {
      kind: "SwapRewardsBlocked",
    }
  }

  toEncodable() {
    return {
      SwapRewardsBlocked: {},
    }
  }
}

export interface WrongRewardCollateralIDJSON {
  kind: "WrongRewardCollateralID"
}

export class WrongRewardCollateralID {
  static readonly discriminator = 37
  static readonly kind = "WrongRewardCollateralID"
  readonly discriminator = 37
  readonly kind = "WrongRewardCollateralID"

  toJSON(): WrongRewardCollateralIDJSON {
    return {
      kind: "WrongRewardCollateralID",
    }
  }

  toEncodable() {
    return {
      WrongRewardCollateralID: {},
    }
  }
}

export interface InvalidPositionAccountJSON {
  kind: "InvalidPositionAccount"
}

export class InvalidPositionAccount {
  static readonly discriminator = 38
  static readonly kind = "InvalidPositionAccount"
  readonly discriminator = 38
  readonly kind = "InvalidPositionAccount"

  toJSON(): InvalidPositionAccountJSON {
    return {
      kind: "InvalidPositionAccount",
    }
  }

  toEncodable() {
    return {
      InvalidPositionAccount: {},
    }
  }
}

export interface CouldNotDeserializeScopeJSON {
  kind: "CouldNotDeserializeScope"
}

export class CouldNotDeserializeScope {
  static readonly discriminator = 39
  static readonly kind = "CouldNotDeserializeScope"
  readonly discriminator = 39
  readonly kind = "CouldNotDeserializeScope"

  toJSON(): CouldNotDeserializeScopeJSON {
    return {
      kind: "CouldNotDeserializeScope",
    }
  }

  toEncodable() {
    return {
      CouldNotDeserializeScope: {},
    }
  }
}

export interface WrongCollateralIDJSON {
  kind: "WrongCollateralID"
}

export class WrongCollateralID {
  static readonly discriminator = 40
  static readonly kind = "WrongCollateralID"
  readonly discriminator = 40
  readonly kind = "WrongCollateralID"

  toJSON(): WrongCollateralIDJSON {
    return {
      kind: "WrongCollateralID",
    }
  }

  toEncodable() {
    return {
      WrongCollateralID: {},
    }
  }
}

export interface CollateralTokensExceedDepositCapJSON {
  kind: "CollateralTokensExceedDepositCap"
}

export class CollateralTokensExceedDepositCap {
  static readonly discriminator = 41
  static readonly kind = "CollateralTokensExceedDepositCap"
  readonly discriminator = 41
  readonly kind = "CollateralTokensExceedDepositCap"

  toJSON(): CollateralTokensExceedDepositCapJSON {
    return {
      kind: "CollateralTokensExceedDepositCap",
    }
  }

  toEncodable() {
    return {
      CollateralTokensExceedDepositCap: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.VaultErrorKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("IntegerOverflow" in obj) {
    return new IntegerOverflow()
  }
  if ("OperationForbidden" in obj) {
    return new OperationForbidden()
  }
  if ("ZeroAmount" in obj) {
    return new ZeroAmount()
  }
  if ("UnableToDeserializeAccount" in obj) {
    return new UnableToDeserializeAccount()
  }
  if ("VaultBalanceDoesNotMatchTokenA" in obj) {
    return new VaultBalanceDoesNotMatchTokenA()
  }
  if ("VaultBalanceDoesNotMatchTokenB" in obj) {
    return new VaultBalanceDoesNotMatchTokenB()
  }
  if ("SharesIssuedAmountDoesNotMatch" in obj) {
    return new SharesIssuedAmountDoesNotMatch()
  }
  if ("GlobalConfigKeyError" in obj) {
    return new GlobalConfigKeyError()
  }
  if ("SystemInEmergencyMode" in obj) {
    return new SystemInEmergencyMode()
  }
  if ("DepositBlocked" in obj) {
    return new DepositBlocked()
  }
  if ("WithdrawBlocked" in obj) {
    return new WithdrawBlocked()
  }
  if ("InvestBlocked" in obj) {
    return new InvestBlocked()
  }
  if ("OutOfRangeIntegralConversion" in obj) {
    return new OutOfRangeIntegralConversion()
  }
  if ("MathOverflow" in obj) {
    return new MathOverflow()
  }
  if ("TooMuchLiquidityToWithdraw" in obj) {
    return new TooMuchLiquidityToWithdraw()
  }
  if ("DepositAmountsZero" in obj) {
    return new DepositAmountsZero()
  }
  if ("SharesZero" in obj) {
    return new SharesZero()
  }
  if ("StrategyNotActive" in obj) {
    return new StrategyNotActive()
  }
  if ("UnharvestedAmounts" in obj) {
    return new UnharvestedAmounts()
  }
  if ("InvalidRewardMapping" in obj) {
    return new InvalidRewardMapping()
  }
  if ("InvalidRewardIndex" in obj) {
    return new InvalidRewardIndex()
  }
  if ("OwnRewardUninitialized" in obj) {
    return new OwnRewardUninitialized()
  }
  if ("PriceNotValid" in obj) {
    return new PriceNotValid()
  }
  if ("SwapRewardImbalanced" in obj) {
    return new SwapRewardImbalanced()
  }
  if ("SwapRewardTooSmall" in obj) {
    return new SwapRewardTooSmall()
  }
  if ("SwapRewardLessThanRequested" in obj) {
    return new SwapRewardLessThanRequested()
  }
  if ("SwapRewardLessThanMinimum" in obj) {
    return new SwapRewardLessThanMinimum()
  }
  if ("WrongDiscriminator" in obj) {
    return new WrongDiscriminator()
  }
  if ("WrongMint" in obj) {
    return new WrongMint()
  }
  if ("WrongVault" in obj) {
    return new WrongVault()
  }
  if ("SwapAmountsZero" in obj) {
    return new SwapAmountsZero()
  }
  if ("PriceTooOld" in obj) {
    return new PriceTooOld()
  }
  if ("CannotInvestZeroAmount" in obj) {
    return new CannotInvestZeroAmount()
  }
  if ("MaxInvestableZero" in obj) {
    return new MaxInvestableZero()
  }
  if ("CollectFeesBlocked" in obj) {
    return new CollectFeesBlocked()
  }
  if ("CollectRewardsBlocked" in obj) {
    return new CollectRewardsBlocked()
  }
  if ("SwapRewardsBlocked" in obj) {
    return new SwapRewardsBlocked()
  }
  if ("WrongRewardCollateralID" in obj) {
    return new WrongRewardCollateralID()
  }
  if ("InvalidPositionAccount" in obj) {
    return new InvalidPositionAccount()
  }
  if ("CouldNotDeserializeScope" in obj) {
    return new CouldNotDeserializeScope()
  }
  if ("WrongCollateralID" in obj) {
    return new WrongCollateralID()
  }
  if ("CollateralTokensExceedDepositCap" in obj) {
    return new CollateralTokensExceedDepositCap()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.VaultErrorJSON): types.VaultErrorKind {
  switch (obj.kind) {
    case "IntegerOverflow": {
      return new IntegerOverflow()
    }
    case "OperationForbidden": {
      return new OperationForbidden()
    }
    case "ZeroAmount": {
      return new ZeroAmount()
    }
    case "UnableToDeserializeAccount": {
      return new UnableToDeserializeAccount()
    }
    case "VaultBalanceDoesNotMatchTokenA": {
      return new VaultBalanceDoesNotMatchTokenA()
    }
    case "VaultBalanceDoesNotMatchTokenB": {
      return new VaultBalanceDoesNotMatchTokenB()
    }
    case "SharesIssuedAmountDoesNotMatch": {
      return new SharesIssuedAmountDoesNotMatch()
    }
    case "GlobalConfigKeyError": {
      return new GlobalConfigKeyError()
    }
    case "SystemInEmergencyMode": {
      return new SystemInEmergencyMode()
    }
    case "DepositBlocked": {
      return new DepositBlocked()
    }
    case "WithdrawBlocked": {
      return new WithdrawBlocked()
    }
    case "InvestBlocked": {
      return new InvestBlocked()
    }
    case "OutOfRangeIntegralConversion": {
      return new OutOfRangeIntegralConversion()
    }
    case "MathOverflow": {
      return new MathOverflow()
    }
    case "TooMuchLiquidityToWithdraw": {
      return new TooMuchLiquidityToWithdraw()
    }
    case "DepositAmountsZero": {
      return new DepositAmountsZero()
    }
    case "SharesZero": {
      return new SharesZero()
    }
    case "StrategyNotActive": {
      return new StrategyNotActive()
    }
    case "UnharvestedAmounts": {
      return new UnharvestedAmounts()
    }
    case "InvalidRewardMapping": {
      return new InvalidRewardMapping()
    }
    case "InvalidRewardIndex": {
      return new InvalidRewardIndex()
    }
    case "OwnRewardUninitialized": {
      return new OwnRewardUninitialized()
    }
    case "PriceNotValid": {
      return new PriceNotValid()
    }
    case "SwapRewardImbalanced": {
      return new SwapRewardImbalanced()
    }
    case "SwapRewardTooSmall": {
      return new SwapRewardTooSmall()
    }
    case "SwapRewardLessThanRequested": {
      return new SwapRewardLessThanRequested()
    }
    case "SwapRewardLessThanMinimum": {
      return new SwapRewardLessThanMinimum()
    }
    case "WrongDiscriminator": {
      return new WrongDiscriminator()
    }
    case "WrongMint": {
      return new WrongMint()
    }
    case "WrongVault": {
      return new WrongVault()
    }
    case "SwapAmountsZero": {
      return new SwapAmountsZero()
    }
    case "PriceTooOld": {
      return new PriceTooOld()
    }
    case "CannotInvestZeroAmount": {
      return new CannotInvestZeroAmount()
    }
    case "MaxInvestableZero": {
      return new MaxInvestableZero()
    }
    case "CollectFeesBlocked": {
      return new CollectFeesBlocked()
    }
    case "CollectRewardsBlocked": {
      return new CollectRewardsBlocked()
    }
    case "SwapRewardsBlocked": {
      return new SwapRewardsBlocked()
    }
    case "WrongRewardCollateralID": {
      return new WrongRewardCollateralID()
    }
    case "InvalidPositionAccount": {
      return new InvalidPositionAccount()
    }
    case "CouldNotDeserializeScope": {
      return new CouldNotDeserializeScope()
    }
    case "WrongCollateralID": {
      return new WrongCollateralID()
    }
    case "CollateralTokensExceedDepositCap": {
      return new CollateralTokensExceedDepositCap()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "IntegerOverflow"),
    borsh.struct([], "OperationForbidden"),
    borsh.struct([], "ZeroAmount"),
    borsh.struct([], "UnableToDeserializeAccount"),
    borsh.struct([], "VaultBalanceDoesNotMatchTokenA"),
    borsh.struct([], "VaultBalanceDoesNotMatchTokenB"),
    borsh.struct([], "SharesIssuedAmountDoesNotMatch"),
    borsh.struct([], "GlobalConfigKeyError"),
    borsh.struct([], "SystemInEmergencyMode"),
    borsh.struct([], "DepositBlocked"),
    borsh.struct([], "WithdrawBlocked"),
    borsh.struct([], "InvestBlocked"),
    borsh.struct([], "OutOfRangeIntegralConversion"),
    borsh.struct([], "MathOverflow"),
    borsh.struct([], "TooMuchLiquidityToWithdraw"),
    borsh.struct([], "DepositAmountsZero"),
    borsh.struct([], "SharesZero"),
    borsh.struct([], "StrategyNotActive"),
    borsh.struct([], "UnharvestedAmounts"),
    borsh.struct([], "InvalidRewardMapping"),
    borsh.struct([], "InvalidRewardIndex"),
    borsh.struct([], "OwnRewardUninitialized"),
    borsh.struct([], "PriceNotValid"),
    borsh.struct([], "SwapRewardImbalanced"),
    borsh.struct([], "SwapRewardTooSmall"),
    borsh.struct([], "SwapRewardLessThanRequested"),
    borsh.struct([], "SwapRewardLessThanMinimum"),
    borsh.struct([], "WrongDiscriminator"),
    borsh.struct([], "WrongMint"),
    borsh.struct([], "WrongVault"),
    borsh.struct([], "SwapAmountsZero"),
    borsh.struct([], "PriceTooOld"),
    borsh.struct([], "CannotInvestZeroAmount"),
    borsh.struct([], "MaxInvestableZero"),
    borsh.struct([], "CollectFeesBlocked"),
    borsh.struct([], "CollectRewardsBlocked"),
    borsh.struct([], "SwapRewardsBlocked"),
    borsh.struct([], "WrongRewardCollateralID"),
    borsh.struct([], "InvalidPositionAccount"),
    borsh.struct([], "CouldNotDeserializeScope"),
    borsh.struct([], "WrongCollateralID"),
    borsh.struct([], "CollateralTokensExceedDepositCap"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
