export type CustomError =
  | IntegerOverflow
  | OperationForbidden
  | ZeroAmount
  | UnableToDeserializeAccount
  | VaultBalanceDoesNotMatchTokenA
  | VaultBalanceDoesNotMatchTokenB
  | SharesIssuedAmountDoesNotMatch
  | GlobalConfigKeyError
  | SystemInEmergencyMode
  | DepositBlocked
  | WithdrawBlocked
  | InvestBlocked
  | OutOfRangeIntegralConversion
  | MathOverflow
  | TooMuchLiquidityToWithdraw
  | DepositAmountsZero
  | SharesZero
  | StrategyNotActive
  | UnharvestedAmounts
  | InvalidRewardMapping
  | InvalidRewardIndex
  | OwnRewardUninitialized
  | PriceNotValid
  | SwapRewardImbalanced
  | SwapRewardTooSmall
  | SwapRewardLessThanRequested
  | SwapRewardLessThanMinimum
  | WrongDiscriminator
  | WrongMint
  | WrongVault
  | SwapAmountsZero
  | PriceTooOld
  | CannotInvestZeroAmount
  | MaxInvestableZero
  | CollectFeesBlocked
  | CollectRewardsBlocked
  | SwapRewardsBlocked
  | WrongRewardCollateralID
  | InvalidPositionAccount
  | CouldNotDeserializeScope
  | WrongCollateralID
  | CollateralTokensExceedDepositCap
  | SwapUnevenVaultsBlocked
  | VaultsAreAlreadyBalanced
  | CannotSwapUnevenOutOfRange
  | DivideByZero
  | DeltaATooLarge
  | DeltaBTooLarge
  | CannotExecutiveWithdrawZeroAmount
  | CannotWithdrawZeroAmount
  | CannotCollectFeesOnZeroLiquidityPosition
  | StrategyNotActiveWhenDepositing
  | StrategyNotActiveWhenOpeningPosition
  | CollateralTokensExceedDepositCapPerIxn
  | CannotDepositOutOfRange
  | CannotInvestOutOfRange
  | WithdrawalCapReached
  | TimestampDecrease
  | CPINotAllowed
  | OrcaPriceTooDifferentFromScope
  | LowerTickLargerThanUpperTick
  | LowerTickTooLow
  | UpperTickTooLarge
  | LowerTickNotMultipleOfTickSpacing
  | UpperTickNotMultipleOfTickSpacing
  | CannotChangeAdminAuthority
  | CannotResizeAccount
  | ScopeChainUpdateFailed
  | PriceTooDivergentFromTwap

export class IntegerOverflow extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "IntegerOverflow"
  readonly msg = "Integer overflow"

  constructor(readonly logs?: string[]) {
    super("6000: Integer overflow")
  }
}

export class OperationForbidden extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "OperationForbidden"
  readonly msg = "Operation Forbidden"

  constructor(readonly logs?: string[]) {
    super("6001: Operation Forbidden")
  }
}

export class ZeroAmount extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = "ZeroAmount"
  readonly msg = "Zero amount"

  constructor(readonly logs?: string[]) {
    super("6002: Zero amount")
  }
}

export class UnableToDeserializeAccount extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = "UnableToDeserializeAccount"
  readonly msg = "Unable to deserialize account"

  constructor(readonly logs?: string[]) {
    super("6003: Unable to deserialize account")
  }
}

export class VaultBalanceDoesNotMatchTokenA extends Error {
  static readonly code = 6004
  readonly code = 6004
  readonly name = "VaultBalanceDoesNotMatchTokenA"
  readonly msg = "Vault balance does not match for token A"

  constructor(readonly logs?: string[]) {
    super("6004: Vault balance does not match for token A")
  }
}

export class VaultBalanceDoesNotMatchTokenB extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = "VaultBalanceDoesNotMatchTokenB"
  readonly msg = "Vault balance does not match for token B"

  constructor(readonly logs?: string[]) {
    super("6005: Vault balance does not match for token B")
  }
}

export class SharesIssuedAmountDoesNotMatch extends Error {
  static readonly code = 6006
  readonly code = 6006
  readonly name = "SharesIssuedAmountDoesNotMatch"
  readonly msg = "Shares issued amount does not match"

  constructor(readonly logs?: string[]) {
    super("6006: Shares issued amount does not match")
  }
}

export class GlobalConfigKeyError extends Error {
  static readonly code = 6007
  readonly code = 6007
  readonly name = "GlobalConfigKeyError"
  readonly msg = "Key is not present in global config"

  constructor(readonly logs?: string[]) {
    super("6007: Key is not present in global config")
  }
}

export class SystemInEmergencyMode extends Error {
  static readonly code = 6008
  readonly code = 6008
  readonly name = "SystemInEmergencyMode"
  readonly msg = "System is in emergency mode"

  constructor(readonly logs?: string[]) {
    super("6008: System is in emergency mode")
  }
}

export class DepositBlocked extends Error {
  static readonly code = 6009
  readonly code = 6009
  readonly name = "DepositBlocked"
  readonly msg = "Deposit is currently blocked"

  constructor(readonly logs?: string[]) {
    super("6009: Deposit is currently blocked")
  }
}

export class WithdrawBlocked extends Error {
  static readonly code = 6010
  readonly code = 6010
  readonly name = "WithdrawBlocked"
  readonly msg = "Withdraw is currently blocked"

  constructor(readonly logs?: string[]) {
    super("6010: Withdraw is currently blocked")
  }
}

export class InvestBlocked extends Error {
  static readonly code = 6011
  readonly code = 6011
  readonly name = "InvestBlocked"
  readonly msg = "Invest is currently blocked"

  constructor(readonly logs?: string[]) {
    super("6011: Invest is currently blocked")
  }
}

export class OutOfRangeIntegralConversion extends Error {
  static readonly code = 6012
  readonly code = 6012
  readonly name = "OutOfRangeIntegralConversion"
  readonly msg = "Out of range integral conversion attempted"

  constructor(readonly logs?: string[]) {
    super("6012: Out of range integral conversion attempted")
  }
}

export class MathOverflow extends Error {
  static readonly code = 6013
  readonly code = 6013
  readonly name = "MathOverflow"
  readonly msg = "Mathematical operation with overflow"

  constructor(readonly logs?: string[]) {
    super("6013: Mathematical operation with overflow")
  }
}

export class TooMuchLiquidityToWithdraw extends Error {
  static readonly code = 6014
  readonly code = 6014
  readonly name = "TooMuchLiquidityToWithdraw"
  readonly msg = "Unable to withdraw more liquidity than available in position"

  constructor(readonly logs?: string[]) {
    super("6014: Unable to withdraw more liquidity than available in position")
  }
}

export class DepositAmountsZero extends Error {
  static readonly code = 6015
  readonly code = 6015
  readonly name = "DepositAmountsZero"
  readonly msg = "Deposit amounts must be greater than zero"

  constructor(readonly logs?: string[]) {
    super("6015: Deposit amounts must be greater than zero")
  }
}

export class SharesZero extends Error {
  static readonly code = 6016
  readonly code = 6016
  readonly name = "SharesZero"
  readonly msg = "Number of shares to withdraw must be greater than zero"

  constructor(readonly logs?: string[]) {
    super("6016: Number of shares to withdraw must be greater than zero")
  }
}

export class StrategyNotActive extends Error {
  static readonly code = 6017
  readonly code = 6017
  readonly name = "StrategyNotActive"
  readonly msg = "Strategy not active"

  constructor(readonly logs?: string[]) {
    super("6017: Strategy not active")
  }
}

export class UnharvestedAmounts extends Error {
  static readonly code = 6018
  readonly code = 6018
  readonly name = "UnharvestedAmounts"
  readonly msg = "There are unharvested gains"

  constructor(readonly logs?: string[]) {
    super("6018: There are unharvested gains")
  }
}

export class InvalidRewardMapping extends Error {
  static readonly code = 6019
  readonly code = 6019
  readonly name = "InvalidRewardMapping"
  readonly msg = "Reward mapping incorrect"

  constructor(readonly logs?: string[]) {
    super("6019: Reward mapping incorrect")
  }
}

export class InvalidRewardIndex extends Error {
  static readonly code = 6020
  readonly code = 6020
  readonly name = "InvalidRewardIndex"
  readonly msg = "Reward index incorrect"

  constructor(readonly logs?: string[]) {
    super("6020: Reward index incorrect")
  }
}

export class OwnRewardUninitialized extends Error {
  static readonly code = 6021
  readonly code = 6021
  readonly name = "OwnRewardUninitialized"
  readonly msg = "Cannot use uninitialized reward vault"

  constructor(readonly logs?: string[]) {
    super("6021: Cannot use uninitialized reward vault")
  }
}

export class PriceNotValid extends Error {
  static readonly code = 6022
  readonly code = 6022
  readonly name = "PriceNotValid"
  readonly msg = "Price is not valid"

  constructor(readonly logs?: string[]) {
    super("6022: Price is not valid")
  }
}

export class SwapRewardImbalanced extends Error {
  static readonly code = 6023
  readonly code = 6023
  readonly name = "SwapRewardImbalanced"
  readonly msg = "Must provide almost equal amounts of tokens"

  constructor(readonly logs?: string[]) {
    super("6023: Must provide almost equal amounts of tokens")
  }
}

export class SwapRewardTooSmall extends Error {
  static readonly code = 6024
  readonly code = 6024
  readonly name = "SwapRewardTooSmall"
  readonly msg = "Swap reward is zero or less than requested"

  constructor(readonly logs?: string[]) {
    super("6024: Swap reward is zero or less than requested")
  }
}

export class SwapRewardLessThanRequested extends Error {
  static readonly code = 6025
  readonly code = 6025
  readonly name = "SwapRewardLessThanRequested"
  readonly msg = "Swap reward is less than what user requested as minimum"

  constructor(readonly logs?: string[]) {
    super("6025: Swap reward is less than what user requested as minimum")
  }
}

export class SwapRewardLessThanMinimum extends Error {
  static readonly code = 6026
  readonly code = 6026
  readonly name = "SwapRewardLessThanMinimum"
  readonly msg = "Swap reward is less than minimum acceptable"

  constructor(readonly logs?: string[]) {
    super("6026: Swap reward is less than minimum acceptable")
  }
}

export class WrongDiscriminator extends Error {
  static readonly code = 6027
  readonly code = 6027
  readonly name = "WrongDiscriminator"
  readonly msg = "Wrong discriminator"

  constructor(readonly logs?: string[]) {
    super("6027: Wrong discriminator")
  }
}

export class WrongMint extends Error {
  static readonly code = 6028
  readonly code = 6028
  readonly name = "WrongMint"
  readonly msg = "Wrong mint"

  constructor(readonly logs?: string[]) {
    super("6028: Wrong mint")
  }
}

export class WrongVault extends Error {
  static readonly code = 6029
  readonly code = 6029
  readonly name = "WrongVault"
  readonly msg = "Wrong vault"

  constructor(readonly logs?: string[]) {
    super("6029: Wrong vault")
  }
}

export class SwapAmountsZero extends Error {
  static readonly code = 6030
  readonly code = 6030
  readonly name = "SwapAmountsZero"
  readonly msg = "Swap amounts must be greater than zero"

  constructor(readonly logs?: string[]) {
    super("6030: Swap amounts must be greater than zero")
  }
}

export class PriceTooOld extends Error {
  static readonly code = 6031
  readonly code = 6031
  readonly name = "PriceTooOld"
  readonly msg = "Price too old"

  constructor(readonly logs?: string[]) {
    super("6031: Price too old")
  }
}

export class CannotInvestZeroAmount extends Error {
  static readonly code = 6032
  readonly code = 6032
  readonly name = "CannotInvestZeroAmount"
  readonly msg = "Cannot invest zero amount"

  constructor(readonly logs?: string[]) {
    super("6032: Cannot invest zero amount")
  }
}

export class MaxInvestableZero extends Error {
  static readonly code = 6033
  readonly code = 6033
  readonly name = "MaxInvestableZero"
  readonly msg = "Cannot have zero investable amount"

  constructor(readonly logs?: string[]) {
    super("6033: Cannot have zero investable amount")
  }
}

export class CollectFeesBlocked extends Error {
  static readonly code = 6034
  readonly code = 6034
  readonly name = "CollectFeesBlocked"
  readonly msg = "Collect fees is blocked"

  constructor(readonly logs?: string[]) {
    super("6034: Collect fees is blocked")
  }
}

export class CollectRewardsBlocked extends Error {
  static readonly code = 6035
  readonly code = 6035
  readonly name = "CollectRewardsBlocked"
  readonly msg = "Collect rewards is blocked"

  constructor(readonly logs?: string[]) {
    super("6035: Collect rewards is blocked")
  }
}

export class SwapRewardsBlocked extends Error {
  static readonly code = 6036
  readonly code = 6036
  readonly name = "SwapRewardsBlocked"
  readonly msg = "Swap rewards is blocked"

  constructor(readonly logs?: string[]) {
    super("6036: Swap rewards is blocked")
  }
}

export class WrongRewardCollateralID extends Error {
  static readonly code = 6037
  readonly code = 6037
  readonly name = "WrongRewardCollateralID"
  readonly msg = "Reward collateral ID is incorrect for strategy"

  constructor(readonly logs?: string[]) {
    super("6037: Reward collateral ID is incorrect for strategy")
  }
}

export class InvalidPositionAccount extends Error {
  static readonly code = 6038
  readonly code = 6038
  readonly name = "InvalidPositionAccount"
  readonly msg = "Position account doesn't match internal records"

  constructor(readonly logs?: string[]) {
    super("6038: Position account doesn't match internal records")
  }
}

export class CouldNotDeserializeScope extends Error {
  static readonly code = 6039
  readonly code = 6039
  readonly name = "CouldNotDeserializeScope"
  readonly msg = "Scope account could not be deserialized"

  constructor(readonly logs?: string[]) {
    super("6039: Scope account could not be deserialized")
  }
}

export class WrongCollateralID extends Error {
  static readonly code = 6040
  readonly code = 6040
  readonly name = "WrongCollateralID"
  readonly msg = "Collateral ID invalid for strategy"

  constructor(readonly logs?: string[]) {
    super("6040: Collateral ID invalid for strategy")
  }
}

export class CollateralTokensExceedDepositCap extends Error {
  static readonly code = 6041
  readonly code = 6041
  readonly name = "CollateralTokensExceedDepositCap"
  readonly msg = "Collaterals exceed deposit cap"

  constructor(readonly logs?: string[]) {
    super("6041: Collaterals exceed deposit cap")
  }
}

export class SwapUnevenVaultsBlocked extends Error {
  static readonly code = 6042
  readonly code = 6042
  readonly name = "SwapUnevenVaultsBlocked"
  readonly msg = "Swap uneven vaults is blocked"

  constructor(readonly logs?: string[]) {
    super("6042: Swap uneven vaults is blocked")
  }
}

export class VaultsAreAlreadyBalanced extends Error {
  static readonly code = 6043
  readonly code = 6043
  readonly name = "VaultsAreAlreadyBalanced"
  readonly msg = "Cannot swap as vaults are already balanced"

  constructor(readonly logs?: string[]) {
    super("6043: Cannot swap as vaults are already balanced")
  }
}

export class CannotSwapUnevenOutOfRange extends Error {
  static readonly code = 6044
  readonly code = 6044
  readonly name = "CannotSwapUnevenOutOfRange"
  readonly msg = "Cannot swap uneven vaults when position is out of range"

  constructor(readonly logs?: string[]) {
    super("6044: Cannot swap uneven vaults when position is out of range")
  }
}

export class DivideByZero extends Error {
  static readonly code = 6045
  readonly code = 6045
  readonly name = "DivideByZero"
  readonly msg = "Cannot divide by zero"

  constructor(readonly logs?: string[]) {
    super("6045: Cannot divide by zero")
  }
}

export class DeltaATooLarge extends Error {
  static readonly code = 6046
  readonly code = 6046
  readonly name = "DeltaATooLarge"
  readonly msg = "Delta A too large"

  constructor(readonly logs?: string[]) {
    super("6046: Delta A too large")
  }
}

export class DeltaBTooLarge extends Error {
  static readonly code = 6047
  readonly code = 6047
  readonly name = "DeltaBTooLarge"
  readonly msg = "Delta B too large"

  constructor(readonly logs?: string[]) {
    super("6047: Delta B too large")
  }
}

export class CannotExecutiveWithdrawZeroAmount extends Error {
  static readonly code = 6048
  readonly code = 6048
  readonly name = "CannotExecutiveWithdrawZeroAmount"
  readonly msg = "Cannot executive withdraw zero amount"

  constructor(readonly logs?: string[]) {
    super("6048: Cannot executive withdraw zero amount")
  }
}

export class CannotWithdrawZeroAmount extends Error {
  static readonly code = 6049
  readonly code = 6049
  readonly name = "CannotWithdrawZeroAmount"
  readonly msg = "Cannot withdraw zero amount"

  constructor(readonly logs?: string[]) {
    super("6049: Cannot withdraw zero amount")
  }
}

export class CannotCollectFeesOnZeroLiquidityPosition extends Error {
  static readonly code = 6050
  readonly code = 6050
  readonly name = "CannotCollectFeesOnZeroLiquidityPosition"
  readonly msg = "Cannot collect fees on zero liquidity position"

  constructor(readonly logs?: string[]) {
    super("6050: Cannot collect fees on zero liquidity position")
  }
}

export class StrategyNotActiveWhenDepositing extends Error {
  static readonly code = 6051
  readonly code = 6051
  readonly name = "StrategyNotActiveWhenDepositing"
  readonly msg = "Cannot deposit inactive position"

  constructor(readonly logs?: string[]) {
    super("6051: Cannot deposit inactive position")
  }
}

export class StrategyNotActiveWhenOpeningPosition extends Error {
  static readonly code = 6052
  readonly code = 6052
  readonly name = "StrategyNotActiveWhenOpeningPosition"
  readonly msg = "Cannot open position with existing opened position"

  constructor(readonly logs?: string[]) {
    super("6052: Cannot open position with existing opened position")
  }
}

export class CollateralTokensExceedDepositCapPerIxn extends Error {
  static readonly code = 6053
  readonly code = 6053
  readonly name = "CollateralTokensExceedDepositCapPerIxn"
  readonly msg = "Collaterals exceed deposit ixn cap"

  constructor(readonly logs?: string[]) {
    super("6053: Collaterals exceed deposit ixn cap")
  }
}

export class CannotDepositOutOfRange extends Error {
  static readonly code = 6054
  readonly code = 6054
  readonly name = "CannotDepositOutOfRange"
  readonly msg = "Cannot deposit when strategy out of range"

  constructor(readonly logs?: string[]) {
    super("6054: Cannot deposit when strategy out of range")
  }
}

export class CannotInvestOutOfRange extends Error {
  static readonly code = 6055
  readonly code = 6055
  readonly name = "CannotInvestOutOfRange"
  readonly msg = "Cannot invest when strategy out of range"

  constructor(readonly logs?: string[]) {
    super("6055: Cannot invest when strategy out of range")
  }
}

export class WithdrawalCapReached extends Error {
  static readonly code = 6056
  readonly code = 6056
  readonly name = "WithdrawalCapReached"
  readonly msg = "Withdrawal cap is reached"

  constructor(readonly logs?: string[]) {
    super("6056: Withdrawal cap is reached")
  }
}

export class TimestampDecrease extends Error {
  static readonly code = 6057
  readonly code = 6057
  readonly name = "TimestampDecrease"
  readonly msg = "Timestamp decrease"

  constructor(readonly logs?: string[]) {
    super("6057: Timestamp decrease")
  }
}

export class CPINotAllowed extends Error {
  static readonly code = 6058
  readonly code = 6058
  readonly name = "CPINotAllowed"
  readonly msg = "CPI not allowed"

  constructor(readonly logs?: string[]) {
    super("6058: CPI not allowed")
  }
}

export class OrcaPriceTooDifferentFromScope extends Error {
  static readonly code = 6059
  readonly code = 6059
  readonly name = "OrcaPriceTooDifferentFromScope"
  readonly msg = "Cannot use orca price as it is too different from scope price"

  constructor(readonly logs?: string[]) {
    super("6059: Cannot use orca price as it is too different from scope price")
  }
}

export class LowerTickLargerThanUpperTick extends Error {
  static readonly code = 6060
  readonly code = 6060
  readonly name = "LowerTickLargerThanUpperTick"
  readonly msg = "Lower tick larger than upper tick"

  constructor(readonly logs?: string[]) {
    super("6060: Lower tick larger than upper tick")
  }
}

export class LowerTickTooLow extends Error {
  static readonly code = 6061
  readonly code = 6061
  readonly name = "LowerTickTooLow"
  readonly msg = "Lower tick is lower than the minimal supported low tick"

  constructor(readonly logs?: string[]) {
    super("6061: Lower tick is lower than the minimal supported low tick")
  }
}

export class UpperTickTooLarge extends Error {
  static readonly code = 6062
  readonly code = 6062
  readonly name = "UpperTickTooLarge"
  readonly msg = "Upper tick is larger than the maximum supported tick"

  constructor(readonly logs?: string[]) {
    super("6062: Upper tick is larger than the maximum supported tick")
  }
}

export class LowerTickNotMultipleOfTickSpacing extends Error {
  static readonly code = 6063
  readonly code = 6063
  readonly name = "LowerTickNotMultipleOfTickSpacing"
  readonly msg = "Lower tick is not a multiple of tick spacing"

  constructor(readonly logs?: string[]) {
    super("6063: Lower tick is not a multiple of tick spacing")
  }
}

export class UpperTickNotMultipleOfTickSpacing extends Error {
  static readonly code = 6064
  readonly code = 6064
  readonly name = "UpperTickNotMultipleOfTickSpacing"
  readonly msg = "Upper tick is not a multiple of tick spacing"

  constructor(readonly logs?: string[]) {
    super("6064: Upper tick is not a multiple of tick spacing")
  }
}

export class CannotChangeAdminAuthority extends Error {
  static readonly code = 6065
  readonly code = 6065
  readonly name = "CannotChangeAdminAuthority"
  readonly msg = "Cannot change admin authority"

  constructor(readonly logs?: string[]) {
    super("6065: Cannot change admin authority")
  }
}

export class CannotResizeAccount extends Error {
  static readonly code = 6066
  readonly code = 6066
  readonly name = "CannotResizeAccount"
  readonly msg = "Cannot resize with smaller new size"

  constructor(readonly logs?: string[]) {
    super("6066: Cannot resize with smaller new size")
  }
}

export class ScopeChainUpdateFailed extends Error {
  static readonly code = 6067
  readonly code = 6067
  readonly name = "ScopeChainUpdateFailed"
  readonly msg = "Scope chain update failed"

  constructor(readonly logs?: string[]) {
    super("6067: Scope chain update failed")
  }
}

export class PriceTooDivergentFromTwap extends Error {
  static readonly code = 6068
  readonly code = 6068
  readonly name = "PriceTooDivergentFromTwap"
  readonly msg = "Price too divergent from twap"

  constructor(readonly logs?: string[]) {
    super("6068: Price too divergent from twap")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new IntegerOverflow(logs)
    case 6001:
      return new OperationForbidden(logs)
    case 6002:
      return new ZeroAmount(logs)
    case 6003:
      return new UnableToDeserializeAccount(logs)
    case 6004:
      return new VaultBalanceDoesNotMatchTokenA(logs)
    case 6005:
      return new VaultBalanceDoesNotMatchTokenB(logs)
    case 6006:
      return new SharesIssuedAmountDoesNotMatch(logs)
    case 6007:
      return new GlobalConfigKeyError(logs)
    case 6008:
      return new SystemInEmergencyMode(logs)
    case 6009:
      return new DepositBlocked(logs)
    case 6010:
      return new WithdrawBlocked(logs)
    case 6011:
      return new InvestBlocked(logs)
    case 6012:
      return new OutOfRangeIntegralConversion(logs)
    case 6013:
      return new MathOverflow(logs)
    case 6014:
      return new TooMuchLiquidityToWithdraw(logs)
    case 6015:
      return new DepositAmountsZero(logs)
    case 6016:
      return new SharesZero(logs)
    case 6017:
      return new StrategyNotActive(logs)
    case 6018:
      return new UnharvestedAmounts(logs)
    case 6019:
      return new InvalidRewardMapping(logs)
    case 6020:
      return new InvalidRewardIndex(logs)
    case 6021:
      return new OwnRewardUninitialized(logs)
    case 6022:
      return new PriceNotValid(logs)
    case 6023:
      return new SwapRewardImbalanced(logs)
    case 6024:
      return new SwapRewardTooSmall(logs)
    case 6025:
      return new SwapRewardLessThanRequested(logs)
    case 6026:
      return new SwapRewardLessThanMinimum(logs)
    case 6027:
      return new WrongDiscriminator(logs)
    case 6028:
      return new WrongMint(logs)
    case 6029:
      return new WrongVault(logs)
    case 6030:
      return new SwapAmountsZero(logs)
    case 6031:
      return new PriceTooOld(logs)
    case 6032:
      return new CannotInvestZeroAmount(logs)
    case 6033:
      return new MaxInvestableZero(logs)
    case 6034:
      return new CollectFeesBlocked(logs)
    case 6035:
      return new CollectRewardsBlocked(logs)
    case 6036:
      return new SwapRewardsBlocked(logs)
    case 6037:
      return new WrongRewardCollateralID(logs)
    case 6038:
      return new InvalidPositionAccount(logs)
    case 6039:
      return new CouldNotDeserializeScope(logs)
    case 6040:
      return new WrongCollateralID(logs)
    case 6041:
      return new CollateralTokensExceedDepositCap(logs)
    case 6042:
      return new SwapUnevenVaultsBlocked(logs)
    case 6043:
      return new VaultsAreAlreadyBalanced(logs)
    case 6044:
      return new CannotSwapUnevenOutOfRange(logs)
    case 6045:
      return new DivideByZero(logs)
    case 6046:
      return new DeltaATooLarge(logs)
    case 6047:
      return new DeltaBTooLarge(logs)
    case 6048:
      return new CannotExecutiveWithdrawZeroAmount(logs)
    case 6049:
      return new CannotWithdrawZeroAmount(logs)
    case 6050:
      return new CannotCollectFeesOnZeroLiquidityPosition(logs)
    case 6051:
      return new StrategyNotActiveWhenDepositing(logs)
    case 6052:
      return new StrategyNotActiveWhenOpeningPosition(logs)
    case 6053:
      return new CollateralTokensExceedDepositCapPerIxn(logs)
    case 6054:
      return new CannotDepositOutOfRange(logs)
    case 6055:
      return new CannotInvestOutOfRange(logs)
    case 6056:
      return new WithdrawalCapReached(logs)
    case 6057:
      return new TimestampDecrease(logs)
    case 6058:
      return new CPINotAllowed(logs)
    case 6059:
      return new OrcaPriceTooDifferentFromScope(logs)
    case 6060:
      return new LowerTickLargerThanUpperTick(logs)
    case 6061:
      return new LowerTickTooLow(logs)
    case 6062:
      return new UpperTickTooLarge(logs)
    case 6063:
      return new LowerTickNotMultipleOfTickSpacing(logs)
    case 6064:
      return new UpperTickNotMultipleOfTickSpacing(logs)
    case 6065:
      return new CannotChangeAdminAuthority(logs)
    case 6066:
      return new CannotResizeAccount(logs)
    case 6067:
      return new ScopeChainUpdateFailed(logs)
    case 6068:
      return new PriceTooDivergentFromTwap(logs)
  }

  return null
}
