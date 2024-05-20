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
  | GlobalDepositBlocked
  | GlobalWithdrawBlocked
  | GlobalInvestBlocked
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
  | ExistingRewardOverride
  | WrongKaminoRewardId
  | KaminoRewardNotExist
  | KaminoRewardAlreadyExists
  | KaminoCollateralNotValid
  | KaminoRewardExceedsAvailableAmount
  | SwapUnevenVaultsOvershoot
  | BpsNotInRange
  | EmergencySwapBlocked
  | StrategyNotFrozen
  | UnexpectedTokenAmountsPostSwap
  | AccountNotBelongToDEX
  | WrongDEXProgramID
  | OrcaRewardUninitialized
  | InvalidAdminAuthority
  | PriceIsBiggerThanHeuristic
  | PriceIsLowerThanHeuristic
  | AccountDifferentThanExpected
  | SwapAmountsTooSmall
  | InvalidDexProgramId
  | StrategyDepositBlocked
  | StrategyInvestBlocked
  | StrategyWithdrawBlocked
  | WrongSwapVaultDirection
  | SwapVaultsTooBig
  | SwapVaultsCashOutputBelowMinimum
  | FlashIxsNotEnded
  | FlashTxWithUnexpectedIxs
  | FlashIxsAccountMismatch
  | FlashIxsIncludeScope
  | FlashVaultSwapBlocked
  | FlashVaultSwapWrongAmountToLeave
  | DepositLessThanMinimum
  | DepositWithoutInvestDisallowed
  | InvalidScopeChain
  | InvalidScopeTWAPChain
  | PositionHasRemainingLiquidity
  | PoolRebalancing
  | PermissionlessRebalancingDisabled
  | ManualRebalanceInvalidOwner
  | InvalidRebalanceType
  | NoRebalanceNecessary
  | TickArraysDoNotMatchRebalance
  | StrategyPositionNotValid
  | CouldNotDeserializeRebalanceState
  | CouldNotSerializeRebalanceState
  | CouldNotDeserializeRebalanceParams
  | NotEnoughTokensForRatio
  | AmountsRepresentZeroShares
  | MaxLossExceeded
  | RewardNotStrategyToken
  | DecimalToU64ConversionFailed
  | DecimalOperationFailed
  | VaultBalancesCausesWrongSharesIssuance
  | TokenDisabled
  | InvalidReferencePriceType
  | TokenToSwapNotEnough
  | TokenAccountBalanceMismatch
  | UnexpectedProgramIdForPrerequisiteIx
  | ComputeFeesAndRewardsUpdateError
  | SharesNotZero
  | InvalidScopeStakingRateChain
  | StakingRateNotValid
  | DecimalToU128ConversionFailed
  | DecimalNegativeSqrtRoot
  | DriftingOppositeDirection
  | WrongRewardCollateralId
  | CollateralInfoAlreadyExists
  | InvestTooEarly
  | SwapUnevenTooEarly
  | FlashSwapTooEarly
  | RebalancesCapReached
  | SwapUnevenInvalidAuthority
  | InvalidTick
  | MeteoraMathOverflow
  | StrategyTickArrayNotValid
  | WrongEventAuthority
  | StrategyFieldUpdateNotAllowed
  | UnsupportedDex
  | InvalidBPSValue
  | RewardVaultOverrideNotAllowed
  | ComputeFeesAndRewardsInvalidReward
  | EmptyTreasury
  | ChangingPoolRewardMintMismatch
  | ProvidedRewardVaultMismatch
  | CannotMutateMeteoraPosition
  | MigrateOnlyMeteoraStrategies

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
  readonly msg = "[DEPRECATED] Zero amount"

  constructor(readonly logs?: string[]) {
    super("6002: [DEPRECATED] Zero amount")
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
  readonly msg = "[DEPRECATED] Vault balance does not match for token A"

  constructor(readonly logs?: string[]) {
    super("6004: [DEPRECATED] Vault balance does not match for token A")
  }
}

export class VaultBalanceDoesNotMatchTokenB extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = "VaultBalanceDoesNotMatchTokenB"
  readonly msg = "[DEPRECATED] Vault balance does not match for token B"

  constructor(readonly logs?: string[]) {
    super("6005: [DEPRECATED] Vault balance does not match for token B")
  }
}

export class SharesIssuedAmountDoesNotMatch extends Error {
  static readonly code = 6006
  readonly code = 6006
  readonly name = "SharesIssuedAmountDoesNotMatch"
  readonly msg = "[DEPRECATED] Shares issued amount does not match"

  constructor(readonly logs?: string[]) {
    super("6006: [DEPRECATED] Shares issued amount does not match")
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
  readonly msg = "[DEPRECATED] System is in emergency mode"

  constructor(readonly logs?: string[]) {
    super("6008: [DEPRECATED] System is in emergency mode")
  }
}

export class GlobalDepositBlocked extends Error {
  static readonly code = 6009
  readonly code = 6009
  readonly name = "GlobalDepositBlocked"
  readonly msg = "Global deposit is currently blocked"

  constructor(readonly logs?: string[]) {
    super("6009: Global deposit is currently blocked")
  }
}

export class GlobalWithdrawBlocked extends Error {
  static readonly code = 6010
  readonly code = 6010
  readonly name = "GlobalWithdrawBlocked"
  readonly msg = "Global withdraw is currently blocked"

  constructor(readonly logs?: string[]) {
    super("6010: Global withdraw is currently blocked")
  }
}

export class GlobalInvestBlocked extends Error {
  static readonly code = 6011
  readonly code = 6011
  readonly name = "GlobalInvestBlocked"
  readonly msg = "Global invest is currently blocked"

  constructor(readonly logs?: string[]) {
    super("6011: Global invest is currently blocked")
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
  readonly msg = "[DEPRECATED] Mathematical operation with overflow"

  constructor(readonly logs?: string[]) {
    super("6013: [DEPRECATED] Mathematical operation with overflow")
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
  readonly msg = "[DEPRECATED] Collateral ID invalid for strategy"

  constructor(readonly logs?: string[]) {
    super("6040: [DEPRECATED] Collateral ID invalid for strategy")
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
  readonly msg = "[DEPRECATED] Delta A too large"

  constructor(readonly logs?: string[]) {
    super("6046: [DEPRECATED] Delta A too large")
  }
}

export class DeltaBTooLarge extends Error {
  static readonly code = 6047
  readonly code = 6047
  readonly name = "DeltaBTooLarge"
  readonly msg = "[DEPRECATED] Delta B too large"

  constructor(readonly logs?: string[]) {
    super("6047: [DEPRECATED] Delta B too large")
  }
}

export class CannotExecutiveWithdrawZeroAmount extends Error {
  static readonly code = 6048
  readonly code = 6048
  readonly name = "CannotExecutiveWithdrawZeroAmount"
  readonly msg = "[DEPRECATED] Cannot executive withdraw zero amount"

  constructor(readonly logs?: string[]) {
    super("6048: [DEPRECATED] Cannot executive withdraw zero amount")
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
  readonly msg = "[DEPRECATED] Cannot collect fees on zero liquidity position"

  constructor(readonly logs?: string[]) {
    super("6050: [DEPRECATED] Cannot collect fees on zero liquidity position")
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

export class ExistingRewardOverride extends Error {
  static readonly code = 6069
  readonly code = 6069
  readonly name = "ExistingRewardOverride"
  readonly msg = "[DEPRECATED] Can not override the existing reward"

  constructor(readonly logs?: string[]) {
    super("6069: [DEPRECATED] Can not override the existing reward")
  }
}

export class WrongKaminoRewardId extends Error {
  static readonly code = 6070
  readonly code = 6070
  readonly name = "WrongKaminoRewardId"
  readonly msg = "Kamino reward id exceeds the available slots"

  constructor(readonly logs?: string[]) {
    super("6070: Kamino reward id exceeds the available slots")
  }
}

export class KaminoRewardNotExist extends Error {
  static readonly code = 6071
  readonly code = 6071
  readonly name = "KaminoRewardNotExist"
  readonly msg = "Kamino reward is not initialized"

  constructor(readonly logs?: string[]) {
    super("6071: Kamino reward is not initialized")
  }
}

export class KaminoRewardAlreadyExists extends Error {
  static readonly code = 6072
  readonly code = 6072
  readonly name = "KaminoRewardAlreadyExists"
  readonly msg = "Kamino reward is already initialized"

  constructor(readonly logs?: string[]) {
    super("6072: Kamino reward is already initialized")
  }
}

export class KaminoCollateralNotValid extends Error {
  static readonly code = 6073
  readonly code = 6073
  readonly name = "KaminoCollateralNotValid"
  readonly msg = "Kamino collateral is not valid"

  constructor(readonly logs?: string[]) {
    super("6073: Kamino collateral is not valid")
  }
}

export class KaminoRewardExceedsAvailableAmount extends Error {
  static readonly code = 6074
  readonly code = 6074
  readonly name = "KaminoRewardExceedsAvailableAmount"
  readonly msg =
    "[DEPRECATED] Expected kamino reward is bigger then the available amount within the vault"

  constructor(readonly logs?: string[]) {
    super(
      "6074: [DEPRECATED] Expected kamino reward is bigger then the available amount within the vault"
    )
  }
}

export class SwapUnevenVaultsOvershoot extends Error {
  static readonly code = 6075
  readonly code = 6075
  readonly name = "SwapUnevenVaultsOvershoot"
  readonly msg =
    "Swap uneven vaults result in the opposite unbalance of the vaults"

  constructor(readonly logs?: string[]) {
    super(
      "6075: Swap uneven vaults result in the opposite unbalance of the vaults"
    )
  }
}

export class BpsNotInRange extends Error {
  static readonly code = 6076
  readonly code = 6076
  readonly name = "BpsNotInRange"
  readonly msg = "Bps parameter passed to instruction is not in range"

  constructor(readonly logs?: string[]) {
    super("6076: Bps parameter passed to instruction is not in range")
  }
}

export class EmergencySwapBlocked extends Error {
  static readonly code = 6077
  readonly code = 6077
  readonly name = "EmergencySwapBlocked"
  readonly msg = "Emergency Swap is blocked"

  constructor(readonly logs?: string[]) {
    super("6077: Emergency Swap is blocked")
  }
}

export class StrategyNotFrozen extends Error {
  static readonly code = 6078
  readonly code = 6078
  readonly name = "StrategyNotFrozen"
  readonly msg = "Strategy is expected to be frozen for this operation"

  constructor(readonly logs?: string[]) {
    super("6078: Strategy is expected to be frozen for this operation")
  }
}

export class UnexpectedTokenAmountsPostSwap extends Error {
  static readonly code = 6079
  readonly code = 6079
  readonly name = "UnexpectedTokenAmountsPostSwap"
  readonly msg = "Token left in vault post swap are lower than expected"

  constructor(readonly logs?: string[]) {
    super("6079: Token left in vault post swap are lower than expected")
  }
}

export class AccountNotBelongToDEX extends Error {
  static readonly code = 6080
  readonly code = 6080
  readonly name = "AccountNotBelongToDEX"
  readonly msg = "Account doesn't belong to the DEX"

  constructor(readonly logs?: string[]) {
    super("6080: Account doesn't belong to the DEX")
  }
}

export class WrongDEXProgramID extends Error {
  static readonly code = 6081
  readonly code = 6081
  readonly name = "WrongDEXProgramID"
  readonly msg = "Wrong DEX program ID"

  constructor(readonly logs?: string[]) {
    super("6081: Wrong DEX program ID")
  }
}

export class OrcaRewardUninitialized extends Error {
  static readonly code = 6082
  readonly code = 6082
  readonly name = "OrcaRewardUninitialized"
  readonly msg = "Cannot use uninitialized orca reward vault"

  constructor(readonly logs?: string[]) {
    super("6082: Cannot use uninitialized orca reward vault")
  }
}

export class InvalidAdminAuthority extends Error {
  static readonly code = 6083
  readonly code = 6083
  readonly name = "InvalidAdminAuthority"
  readonly msg = "Invalid admin authority"

  constructor(readonly logs?: string[]) {
    super("6083: Invalid admin authority")
  }
}

export class PriceIsBiggerThanHeuristic extends Error {
  static readonly code = 6084
  readonly code = 6084
  readonly name = "PriceIsBiggerThanHeuristic"
  readonly msg = "Token price is bigger than heuristic"

  constructor(readonly logs?: string[]) {
    super("6084: Token price is bigger than heuristic")
  }
}

export class PriceIsLowerThanHeuristic extends Error {
  static readonly code = 6085
  readonly code = 6085
  readonly name = "PriceIsLowerThanHeuristic"
  readonly msg = "Token price is lower than heuristic"

  constructor(readonly logs?: string[]) {
    super("6085: Token price is lower than heuristic")
  }
}

export class AccountDifferentThanExpected extends Error {
  static readonly code = 6086
  readonly code = 6086
  readonly name = "AccountDifferentThanExpected"
  readonly msg = "Account different than expected"

  constructor(readonly logs?: string[]) {
    super("6086: Account different than expected")
  }
}

export class SwapAmountsTooSmall extends Error {
  static readonly code = 6087
  readonly code = 6087
  readonly name = "SwapAmountsTooSmall"
  readonly msg = "Swap amount below the minimum value"

  constructor(readonly logs?: string[]) {
    super("6087: Swap amount below the minimum value")
  }
}

export class InvalidDexProgramId extends Error {
  static readonly code = 6088
  readonly code = 6088
  readonly name = "InvalidDexProgramId"
  readonly msg = "Invalid dex program id"

  constructor(readonly logs?: string[]) {
    super("6088: Invalid dex program id")
  }
}

export class StrategyDepositBlocked extends Error {
  static readonly code = 6089
  readonly code = 6089
  readonly name = "StrategyDepositBlocked"
  readonly msg = "Strategy deposit is currently blocked"

  constructor(readonly logs?: string[]) {
    super("6089: Strategy deposit is currently blocked")
  }
}

export class StrategyInvestBlocked extends Error {
  static readonly code = 6090
  readonly code = 6090
  readonly name = "StrategyInvestBlocked"
  readonly msg = "Strategy invest is currently blocked"

  constructor(readonly logs?: string[]) {
    super("6090: Strategy invest is currently blocked")
  }
}

export class StrategyWithdrawBlocked extends Error {
  static readonly code = 6091
  readonly code = 6091
  readonly name = "StrategyWithdrawBlocked"
  readonly msg = "Strategy withdraw is currently blocked"

  constructor(readonly logs?: string[]) {
    super("6091: Strategy withdraw is currently blocked")
  }
}

export class WrongSwapVaultDirection extends Error {
  static readonly code = 6092
  readonly code = 6092
  readonly name = "WrongSwapVaultDirection"
  readonly msg = "Vault swap can't be performed in the required direction"

  constructor(readonly logs?: string[]) {
    super("6092: Vault swap can't be performed in the required direction")
  }
}

export class SwapVaultsTooBig extends Error {
  static readonly code = 6093
  readonly code = 6093
  readonly name = "SwapVaultsTooBig"
  readonly msg = "Provided amount for vault swap is over the limit"

  constructor(readonly logs?: string[]) {
    super("6093: Provided amount for vault swap is over the limit")
  }
}

export class SwapVaultsCashOutputBelowMinimum extends Error {
  static readonly code = 6094
  readonly code = 6094
  readonly name = "SwapVaultsCashOutputBelowMinimum"
  readonly msg = "Token out for cash based vault swap is below minimum expected"

  constructor(readonly logs?: string[]) {
    super("6094: Token out for cash based vault swap is below minimum expected")
  }
}

export class FlashIxsNotEnded extends Error {
  static readonly code = 6095
  readonly code = 6095
  readonly name = "FlashIxsNotEnded"
  readonly msg = "Flash ixs initiated without the closing ix in the transaction"

  constructor(readonly logs?: string[]) {
    super("6095: Flash ixs initiated without the closing ix in the transaction")
  }
}

export class FlashTxWithUnexpectedIxs extends Error {
  static readonly code = 6096
  readonly code = 6096
  readonly name = "FlashTxWithUnexpectedIxs"
  readonly msg =
    "Some unexpected instructions are present in the tx. Either before or after the flash ixs, or some ix target the same program between"

  constructor(readonly logs?: string[]) {
    super(
      "6096: Some unexpected instructions are present in the tx. Either before or after the flash ixs, or some ix target the same program between"
    )
  }
}

export class FlashIxsAccountMismatch extends Error {
  static readonly code = 6097
  readonly code = 6097
  readonly name = "FlashIxsAccountMismatch"
  readonly msg = "Some accounts differ between the two flash ixs"

  constructor(readonly logs?: string[]) {
    super("6097: Some accounts differ between the two flash ixs")
  }
}

export class FlashIxsIncludeScope extends Error {
  static readonly code = 6098
  readonly code = 6098
  readonly name = "FlashIxsIncludeScope"
  readonly msg = "A scope ix is present in a flash tx"

  constructor(readonly logs?: string[]) {
    super("6098: A scope ix is present in a flash tx")
  }
}

export class FlashVaultSwapBlocked extends Error {
  static readonly code = 6099
  readonly code = 6099
  readonly name = "FlashVaultSwapBlocked"
  readonly msg = "Flash vault swap is blocked on this strategy"

  constructor(readonly logs?: string[]) {
    super("6099: Flash vault swap is blocked on this strategy")
  }
}

export class FlashVaultSwapWrongAmountToLeave extends Error {
  static readonly code = 6100
  readonly code = 6100
  readonly name = "FlashVaultSwapWrongAmountToLeave"
  readonly msg =
    "Unexpected amount of tokens in ata prior flash vault swap (wrong amount_to_leave_to_user)"

  constructor(readonly logs?: string[]) {
    super(
      "6100: Unexpected amount of tokens in ata prior flash vault swap (wrong amount_to_leave_to_user)"
    )
  }
}

export class DepositLessThanMinimum extends Error {
  static readonly code = 6101
  readonly code = 6101
  readonly name = "DepositLessThanMinimum"
  readonly msg = "Deposit amount less than minimal allowed"

  constructor(readonly logs?: string[]) {
    super("6101: Deposit amount less than minimal allowed")
  }
}

export class DepositWithoutInvestDisallowed extends Error {
  static readonly code = 6102
  readonly code = 6102
  readonly name = "DepositWithoutInvestDisallowed"
  readonly msg = "Cannot deposit without invest"

  constructor(readonly logs?: string[]) {
    super("6102: Cannot deposit without invest")
  }
}

export class InvalidScopeChain extends Error {
  static readonly code = 6103
  readonly code = 6103
  readonly name = "InvalidScopeChain"
  readonly msg = "Invalid Scope Chain"

  constructor(readonly logs?: string[]) {
    super("6103: Invalid Scope Chain")
  }
}

export class InvalidScopeTWAPChain extends Error {
  static readonly code = 6104
  readonly code = 6104
  readonly name = "InvalidScopeTWAPChain"
  readonly msg = "Invalid Scope TWAP Chain"

  constructor(readonly logs?: string[]) {
    super("6104: Invalid Scope TWAP Chain")
  }
}

export class PositionHasRemainingLiquidity extends Error {
  static readonly code = 6105
  readonly code = 6105
  readonly name = "PositionHasRemainingLiquidity"
  readonly msg =
    "Existent position has liquidity, new position creation is forbidden"

  constructor(readonly logs?: string[]) {
    super(
      "6105: Existent position has liquidity, new position creation is forbidden"
    )
  }
}

export class PoolRebalancing extends Error {
  static readonly code = 6106
  readonly code = 6106
  readonly name = "PoolRebalancing"
  readonly msg = "Deposit is not allowed as pool is rebalancing"

  constructor(readonly logs?: string[]) {
    super("6106: Deposit is not allowed as pool is rebalancing")
  }
}

export class PermissionlessRebalancingDisabled extends Error {
  static readonly code = 6107
  readonly code = 6107
  readonly name = "PermissionlessRebalancingDisabled"
  readonly msg = "Permissionless rebalancing is disabled"

  constructor(readonly logs?: string[]) {
    super("6107: Permissionless rebalancing is disabled")
  }
}

export class ManualRebalanceInvalidOwner extends Error {
  static readonly code = 6108
  readonly code = 6108
  readonly name = "ManualRebalanceInvalidOwner"
  readonly msg = "Only the owner of the strategy can manually rebalance it"

  constructor(readonly logs?: string[]) {
    super("6108: Only the owner of the strategy can manually rebalance it")
  }
}

export class InvalidRebalanceType extends Error {
  static readonly code = 6109
  readonly code = 6109
  readonly name = "InvalidRebalanceType"
  readonly msg = "Invalid rebalance type for the strategy"

  constructor(readonly logs?: string[]) {
    super("6109: Invalid rebalance type for the strategy")
  }
}

export class NoRebalanceNecessary extends Error {
  static readonly code = 6110
  readonly code = 6110
  readonly name = "NoRebalanceNecessary"
  readonly msg =
    "No rebalance necessary based on current rebalance type/parameters"

  constructor(readonly logs?: string[]) {
    super(
      "6110: No rebalance necessary based on current rebalance type/parameters"
    )
  }
}

export class TickArraysDoNotMatchRebalance extends Error {
  static readonly code = 6111
  readonly code = 6111
  readonly name = "TickArraysDoNotMatchRebalance"
  readonly msg = "The given tick arrays do not match the rebalance result"

  constructor(readonly logs?: string[]) {
    super("6111: The given tick arrays do not match the rebalance result")
  }
}

export class StrategyPositionNotValid extends Error {
  static readonly code = 6112
  readonly code = 6112
  readonly name = "StrategyPositionNotValid"
  readonly msg = "Expected strategy position to be initialized"

  constructor(readonly logs?: string[]) {
    super("6112: Expected strategy position to be initialized")
  }
}

export class CouldNotDeserializeRebalanceState extends Error {
  static readonly code = 6113
  readonly code = 6113
  readonly name = "CouldNotDeserializeRebalanceState"
  readonly msg = "Rebalance state could not be deserialized"

  constructor(readonly logs?: string[]) {
    super("6113: Rebalance state could not be deserialized")
  }
}

export class CouldNotSerializeRebalanceState extends Error {
  static readonly code = 6114
  readonly code = 6114
  readonly name = "CouldNotSerializeRebalanceState"
  readonly msg = "Rebalance state could not be serialized"

  constructor(readonly logs?: string[]) {
    super("6114: Rebalance state could not be serialized")
  }
}

export class CouldNotDeserializeRebalanceParams extends Error {
  static readonly code = 6115
  readonly code = 6115
  readonly name = "CouldNotDeserializeRebalanceParams"
  readonly msg = "Rebalance params could not be deserialized"

  constructor(readonly logs?: string[]) {
    super("6115: Rebalance params could not be deserialized")
  }
}

export class NotEnoughTokensForRatio extends Error {
  static readonly code = 6116
  readonly code = 6116
  readonly name = "NotEnoughTokensForRatio"
  readonly msg =
    "Deposit is not allowed as token amounts are not enough to match our holdings ratio"

  constructor(readonly logs?: string[]) {
    super(
      "6116: Deposit is not allowed as token amounts are not enough to match our holdings ratio"
    )
  }
}

export class AmountsRepresentZeroShares extends Error {
  static readonly code = 6117
  readonly code = 6117
  readonly name = "AmountsRepresentZeroShares"
  readonly msg = "The provided amounts are too small"

  constructor(readonly logs?: string[]) {
    super("6117: The provided amounts are too small")
  }
}

export class MaxLossExceeded extends Error {
  static readonly code = 6118
  readonly code = 6118
  readonly name = "MaxLossExceeded"
  readonly msg = "Rouding errors exceed the maximal loss tolerance"

  constructor(readonly logs?: string[]) {
    super("6118: Rouding errors exceed the maximal loss tolerance")
  }
}

export class RewardNotStrategyToken extends Error {
  static readonly code = 6119
  readonly code = 6119
  readonly name = "RewardNotStrategyToken"
  readonly msg = "Reward does not match strategy token"

  constructor(readonly logs?: string[]) {
    super("6119: Reward does not match strategy token")
  }
}

export class DecimalToU64ConversionFailed extends Error {
  static readonly code = 6120
  readonly code = 6120
  readonly name = "DecimalToU64ConversionFailed"
  readonly msg = "Decimal to u64 conversion failed"

  constructor(readonly logs?: string[]) {
    super("6120: Decimal to u64 conversion failed")
  }
}

export class DecimalOperationFailed extends Error {
  static readonly code = 6121
  readonly code = 6121
  readonly name = "DecimalOperationFailed"
  readonly msg = "Decimal operation failed"

  constructor(readonly logs?: string[]) {
    super("6121: Decimal operation failed")
  }
}

export class VaultBalancesCausesWrongSharesIssuance extends Error {
  static readonly code = 6122
  readonly code = 6122
  readonly name = "VaultBalancesCausesWrongSharesIssuance"
  readonly msg =
    "Deposit is not allowed as the strategy is not fully invested in the pool "

  constructor(readonly logs?: string[]) {
    super(
      "6122: Deposit is not allowed as the strategy is not fully invested in the pool "
    )
  }
}

export class TokenDisabled extends Error {
  static readonly code = 6123
  readonly code = 6123
  readonly name = "TokenDisabled"
  readonly msg = "Token cannot be used in strategy creation"

  constructor(readonly logs?: string[]) {
    super("6123: Token cannot be used in strategy creation")
  }
}

export class InvalidReferencePriceType extends Error {
  static readonly code = 6124
  readonly code = 6124
  readonly name = "InvalidReferencePriceType"
  readonly msg = "Invalid reference price type"

  constructor(readonly logs?: string[]) {
    super("6124: Invalid reference price type")
  }
}

export class TokenToSwapNotEnough extends Error {
  static readonly code = 6125
  readonly code = 6125
  readonly name = "TokenToSwapNotEnough"
  readonly msg = "Token amount to be swapped is not enough"

  constructor(readonly logs?: string[]) {
    super("6125: Token amount to be swapped is not enough")
  }
}

export class TokenAccountBalanceMismatch extends Error {
  static readonly code = 6126
  readonly code = 6126
  readonly name = "TokenAccountBalanceMismatch"
  readonly msg = "Token amount in ata is different than the expected amount"

  constructor(readonly logs?: string[]) {
    super("6126: Token amount in ata is different than the expected amount")
  }
}

export class UnexpectedProgramIdForPrerequisiteIx extends Error {
  static readonly code = 6127
  readonly code = 6127
  readonly name = "UnexpectedProgramIdForPrerequisiteIx"
  readonly msg = "Unexpected programID for prerequisite ix"

  constructor(readonly logs?: string[]) {
    super("6127: Unexpected programID for prerequisite ix")
  }
}

export class ComputeFeesAndRewardsUpdateError extends Error {
  static readonly code = 6128
  readonly code = 6128
  readonly name = "ComputeFeesAndRewardsUpdateError"
  readonly msg =
    "Got an error from the dex specific function while computing the fees/rewards update"

  constructor(readonly logs?: string[]) {
    super(
      "6128: Got an error from the dex specific function while computing the fees/rewards update"
    )
  }
}

export class SharesNotZero extends Error {
  static readonly code = 6129
  readonly code = 6129
  readonly name = "SharesNotZero"
  readonly msg = "There must be no shares issued when closing a strategy"

  constructor(readonly logs?: string[]) {
    super("6129: There must be no shares issued when closing a strategy")
  }
}

export class InvalidScopeStakingRateChain extends Error {
  static readonly code = 6130
  readonly code = 6130
  readonly name = "InvalidScopeStakingRateChain"
  readonly msg = "Invalid Scope staking rate Chain"

  constructor(readonly logs?: string[]) {
    super("6130: Invalid Scope staking rate Chain")
  }
}

export class StakingRateNotValid extends Error {
  static readonly code = 6131
  readonly code = 6131
  readonly name = "StakingRateNotValid"
  readonly msg = "Staking rate (provided by Scope) is not valid"

  constructor(readonly logs?: string[]) {
    super("6131: Staking rate (provided by Scope) is not valid")
  }
}

export class DecimalToU128ConversionFailed extends Error {
  static readonly code = 6132
  readonly code = 6132
  readonly name = "DecimalToU128ConversionFailed"
  readonly msg = "Decimal to u128 conversion failed"

  constructor(readonly logs?: string[]) {
    super("6132: Decimal to u128 conversion failed")
  }
}

export class DecimalNegativeSqrtRoot extends Error {
  static readonly code = 6133
  readonly code = 6133
  readonly name = "DecimalNegativeSqrtRoot"
  readonly msg = "Decimal sqrt on negative number"

  constructor(readonly logs?: string[]) {
    super("6133: Decimal sqrt on negative number")
  }
}

export class DriftingOppositeDirection extends Error {
  static readonly code = 6134
  readonly code = 6134
  readonly name = "DriftingOppositeDirection"
  readonly msg = "Drifting strategy is moving in the opposite direction"

  constructor(readonly logs?: string[]) {
    super("6134: Drifting strategy is moving in the opposite direction")
  }
}

export class WrongRewardCollateralId extends Error {
  static readonly code = 6135
  readonly code = 6135
  readonly name = "WrongRewardCollateralId"
  readonly msg = "Wrong reward collateral_id"

  constructor(readonly logs?: string[]) {
    super("6135: Wrong reward collateral_id")
  }
}

export class CollateralInfoAlreadyExists extends Error {
  static readonly code = 6136
  readonly code = 6136
  readonly name = "CollateralInfoAlreadyExists"
  readonly msg = "Collateral info already exists for given index"

  constructor(readonly logs?: string[]) {
    super("6136: Collateral info already exists for given index")
  }
}

export class InvestTooEarly extends Error {
  static readonly code = 6137
  readonly code = 6137
  readonly name = "InvestTooEarly"
  readonly msg = "Invest is too early after the position was opened"

  constructor(readonly logs?: string[]) {
    super("6137: Invest is too early after the position was opened")
  }
}

export class SwapUnevenTooEarly extends Error {
  static readonly code = 6138
  readonly code = 6138
  readonly name = "SwapUnevenTooEarly"
  readonly msg = "Swap uneven is too early after the position was opened"

  constructor(readonly logs?: string[]) {
    super("6138: Swap uneven is too early after the position was opened")
  }
}

export class FlashSwapTooEarly extends Error {
  static readonly code = 6139
  readonly code = 6139
  readonly name = "FlashSwapTooEarly"
  readonly msg = "Flash swap is too early after the position was opened"

  constructor(readonly logs?: string[]) {
    super("6139: Flash swap is too early after the position was opened")
  }
}

export class RebalancesCapReached extends Error {
  static readonly code = 6140
  readonly code = 6140
  readonly name = "RebalancesCapReached"
  readonly msg =
    "Rebalance caps reached, no rebalances are allowed until the end of the current interval"

  constructor(readonly logs?: string[]) {
    super(
      "6140: Rebalance caps reached, no rebalances are allowed until the end of the current interval"
    )
  }
}

export class SwapUnevenInvalidAuthority extends Error {
  static readonly code = 6141
  readonly code = 6141
  readonly name = "SwapUnevenInvalidAuthority"
  readonly msg =
    "Cannot swap uneven because authority is set and the given signer does not correspond"

  constructor(readonly logs?: string[]) {
    super(
      "6141: Cannot swap uneven because authority is set and the given signer does not correspond"
    )
  }
}

export class InvalidTick extends Error {
  static readonly code = 6142
  readonly code = 6142
  readonly name = "InvalidTick"
  readonly msg = "Invalid tick requested"

  constructor(readonly logs?: string[]) {
    super("6142: Invalid tick requested")
  }
}

export class MeteoraMathOverflow extends Error {
  static readonly code = 6143
  readonly code = 6143
  readonly name = "MeteoraMathOverflow"
  readonly msg = "Meteora math overflowed"

  constructor(readonly logs?: string[]) {
    super("6143: Meteora math overflowed")
  }
}

export class StrategyTickArrayNotValid extends Error {
  static readonly code = 6144
  readonly code = 6144
  readonly name = "StrategyTickArrayNotValid"
  readonly msg = "Expected strategy tick arrays to be initialized"

  constructor(readonly logs?: string[]) {
    super("6144: Expected strategy tick arrays to be initialized")
  }
}

export class WrongEventAuthority extends Error {
  static readonly code = 6145
  readonly code = 6145
  readonly name = "WrongEventAuthority"
  readonly msg = "Wrong event authority"

  constructor(readonly logs?: string[]) {
    super("6145: Wrong event authority")
  }
}

export class StrategyFieldUpdateNotAllowed extends Error {
  static readonly code = 6146
  readonly code = 6146
  readonly name = "StrategyFieldUpdateNotAllowed"
  readonly msg = "Strategy field update is not allowed"

  constructor(readonly logs?: string[]) {
    super("6146: Strategy field update is not allowed")
  }
}

export class UnsupportedDex extends Error {
  static readonly code = 6147
  readonly code = 6147
  readonly name = "UnsupportedDex"
  readonly msg = "DEX is not supported for this operation"

  constructor(readonly logs?: string[]) {
    super("6147: DEX is not supported for this operation")
  }
}

export class InvalidBPSValue extends Error {
  static readonly code = 6148
  readonly code = 6148
  readonly name = "InvalidBPSValue"
  readonly msg = "Invalid BPS value provided"

  constructor(readonly logs?: string[]) {
    super("6148: Invalid BPS value provided")
  }
}

export class RewardVaultOverrideNotAllowed extends Error {
  static readonly code = 6149
  readonly code = 6149
  readonly name = "RewardVaultOverrideNotAllowed"
  readonly msg = "Reward vault override not allowed"

  constructor(readonly logs?: string[]) {
    super("6149: Reward vault override not allowed")
  }
}

export class ComputeFeesAndRewardsInvalidReward extends Error {
  static readonly code = 6150
  readonly code = 6150
  readonly name = "ComputeFeesAndRewardsInvalidReward"
  readonly msg =
    "Got invalid reward from the dex specific function while computing the fees/rewards update"

  constructor(readonly logs?: string[]) {
    super(
      "6150: Got invalid reward from the dex specific function while computing the fees/rewards update"
    )
  }
}

export class EmptyTreasury extends Error {
  static readonly code = 6151
  readonly code = 6151
  readonly name = "EmptyTreasury"
  readonly msg = "No tokens to withdraw from treasury fee vault"

  constructor(readonly logs?: string[]) {
    super("6151: No tokens to withdraw from treasury fee vault")
  }
}

export class ChangingPoolRewardMintMismatch extends Error {
  static readonly code = 6152
  readonly code = 6152
  readonly name = "ChangingPoolRewardMintMismatch"
  readonly msg = "New pool reward mint does not match the old pool reward mint"

  constructor(readonly logs?: string[]) {
    super("6152: New pool reward mint does not match the old pool reward mint")
  }
}

export class ProvidedRewardVaultMismatch extends Error {
  static readonly code = 6153
  readonly code = 6153
  readonly name = "ProvidedRewardVaultMismatch"
  readonly msg = "The provided reward vault does not match the strategy state"

  constructor(readonly logs?: string[]) {
    super("6153: The provided reward vault does not match the strategy state")
  }
}

export class CannotMutateMeteoraPosition extends Error {
  static readonly code = 6154
  readonly code = 6154
  readonly name = "CannotMutateMeteoraPosition"
  readonly msg =
    "Called a function where meteora position must be mutable but cannot do it"

  constructor(readonly logs?: string[]) {
    super(
      "6154: Called a function where meteora position must be mutable but cannot do it"
    )
  }
}

export class MigrateOnlyMeteoraStrategies extends Error {
  static readonly code = 6155
  readonly code = 6155
  readonly name = "MigrateOnlyMeteoraStrategies"
  readonly msg = "Can only migrate meteora position"

  constructor(readonly logs?: string[]) {
    super("6155: Can only migrate meteora position")
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
      return new GlobalDepositBlocked(logs)
    case 6010:
      return new GlobalWithdrawBlocked(logs)
    case 6011:
      return new GlobalInvestBlocked(logs)
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
    case 6069:
      return new ExistingRewardOverride(logs)
    case 6070:
      return new WrongKaminoRewardId(logs)
    case 6071:
      return new KaminoRewardNotExist(logs)
    case 6072:
      return new KaminoRewardAlreadyExists(logs)
    case 6073:
      return new KaminoCollateralNotValid(logs)
    case 6074:
      return new KaminoRewardExceedsAvailableAmount(logs)
    case 6075:
      return new SwapUnevenVaultsOvershoot(logs)
    case 6076:
      return new BpsNotInRange(logs)
    case 6077:
      return new EmergencySwapBlocked(logs)
    case 6078:
      return new StrategyNotFrozen(logs)
    case 6079:
      return new UnexpectedTokenAmountsPostSwap(logs)
    case 6080:
      return new AccountNotBelongToDEX(logs)
    case 6081:
      return new WrongDEXProgramID(logs)
    case 6082:
      return new OrcaRewardUninitialized(logs)
    case 6083:
      return new InvalidAdminAuthority(logs)
    case 6084:
      return new PriceIsBiggerThanHeuristic(logs)
    case 6085:
      return new PriceIsLowerThanHeuristic(logs)
    case 6086:
      return new AccountDifferentThanExpected(logs)
    case 6087:
      return new SwapAmountsTooSmall(logs)
    case 6088:
      return new InvalidDexProgramId(logs)
    case 6089:
      return new StrategyDepositBlocked(logs)
    case 6090:
      return new StrategyInvestBlocked(logs)
    case 6091:
      return new StrategyWithdrawBlocked(logs)
    case 6092:
      return new WrongSwapVaultDirection(logs)
    case 6093:
      return new SwapVaultsTooBig(logs)
    case 6094:
      return new SwapVaultsCashOutputBelowMinimum(logs)
    case 6095:
      return new FlashIxsNotEnded(logs)
    case 6096:
      return new FlashTxWithUnexpectedIxs(logs)
    case 6097:
      return new FlashIxsAccountMismatch(logs)
    case 6098:
      return new FlashIxsIncludeScope(logs)
    case 6099:
      return new FlashVaultSwapBlocked(logs)
    case 6100:
      return new FlashVaultSwapWrongAmountToLeave(logs)
    case 6101:
      return new DepositLessThanMinimum(logs)
    case 6102:
      return new DepositWithoutInvestDisallowed(logs)
    case 6103:
      return new InvalidScopeChain(logs)
    case 6104:
      return new InvalidScopeTWAPChain(logs)
    case 6105:
      return new PositionHasRemainingLiquidity(logs)
    case 6106:
      return new PoolRebalancing(logs)
    case 6107:
      return new PermissionlessRebalancingDisabled(logs)
    case 6108:
      return new ManualRebalanceInvalidOwner(logs)
    case 6109:
      return new InvalidRebalanceType(logs)
    case 6110:
      return new NoRebalanceNecessary(logs)
    case 6111:
      return new TickArraysDoNotMatchRebalance(logs)
    case 6112:
      return new StrategyPositionNotValid(logs)
    case 6113:
      return new CouldNotDeserializeRebalanceState(logs)
    case 6114:
      return new CouldNotSerializeRebalanceState(logs)
    case 6115:
      return new CouldNotDeserializeRebalanceParams(logs)
    case 6116:
      return new NotEnoughTokensForRatio(logs)
    case 6117:
      return new AmountsRepresentZeroShares(logs)
    case 6118:
      return new MaxLossExceeded(logs)
    case 6119:
      return new RewardNotStrategyToken(logs)
    case 6120:
      return new DecimalToU64ConversionFailed(logs)
    case 6121:
      return new DecimalOperationFailed(logs)
    case 6122:
      return new VaultBalancesCausesWrongSharesIssuance(logs)
    case 6123:
      return new TokenDisabled(logs)
    case 6124:
      return new InvalidReferencePriceType(logs)
    case 6125:
      return new TokenToSwapNotEnough(logs)
    case 6126:
      return new TokenAccountBalanceMismatch(logs)
    case 6127:
      return new UnexpectedProgramIdForPrerequisiteIx(logs)
    case 6128:
      return new ComputeFeesAndRewardsUpdateError(logs)
    case 6129:
      return new SharesNotZero(logs)
    case 6130:
      return new InvalidScopeStakingRateChain(logs)
    case 6131:
      return new StakingRateNotValid(logs)
    case 6132:
      return new DecimalToU128ConversionFailed(logs)
    case 6133:
      return new DecimalNegativeSqrtRoot(logs)
    case 6134:
      return new DriftingOppositeDirection(logs)
    case 6135:
      return new WrongRewardCollateralId(logs)
    case 6136:
      return new CollateralInfoAlreadyExists(logs)
    case 6137:
      return new InvestTooEarly(logs)
    case 6138:
      return new SwapUnevenTooEarly(logs)
    case 6139:
      return new FlashSwapTooEarly(logs)
    case 6140:
      return new RebalancesCapReached(logs)
    case 6141:
      return new SwapUnevenInvalidAuthority(logs)
    case 6142:
      return new InvalidTick(logs)
    case 6143:
      return new MeteoraMathOverflow(logs)
    case 6144:
      return new StrategyTickArrayNotValid(logs)
    case 6145:
      return new WrongEventAuthority(logs)
    case 6146:
      return new StrategyFieldUpdateNotAllowed(logs)
    case 6147:
      return new UnsupportedDex(logs)
    case 6148:
      return new InvalidBPSValue(logs)
    case 6149:
      return new RewardVaultOverrideNotAllowed(logs)
    case 6150:
      return new ComputeFeesAndRewardsInvalidReward(logs)
    case 6151:
      return new EmptyTreasury(logs)
    case 6152:
      return new ChangingPoolRewardMintMismatch(logs)
    case 6153:
      return new ProvidedRewardVaultMismatch(logs)
    case 6154:
      return new CannotMutateMeteoraPosition(logs)
    case 6155:
      return new MigrateOnlyMeteoraStrategies(logs)
  }

  return null
}
