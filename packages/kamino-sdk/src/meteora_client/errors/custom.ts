export type CustomError =
  | InvalidStartBinIndex
  | InvalidBinId
  | InvalidInput
  | ExceededAmountSlippageTolerance
  | ExceededBinSlippageTolerance
  | CompositionFactorFlawed
  | NonPresetBinStep
  | ZeroLiquidity
  | InvalidPosition
  | BinArrayNotFound
  | InvalidTokenMint
  | InvalidAccountForSingleDeposit
  | PairInsufficientLiquidity
  | InvalidFeeOwner
  | InvalidFeeWithdrawAmount
  | InvalidAdmin
  | IdenticalFeeOwner
  | InvalidBps
  | MathOverflow
  | TypeCastFailed
  | InvalidRewardIndex
  | InvalidRewardDuration
  | RewardInitialized
  | RewardUninitialized
  | IdenticalFunder
  | RewardCampaignInProgress
  | IdenticalRewardDuration
  | InvalidBinArray
  | NonContinuousBinArrays
  | InvalidRewardVault
  | NonEmptyPosition
  | UnauthorizedAccess
  | InvalidFeeParameter
  | MissingOracle
  | InsufficientSample
  | InvalidLookupTimestamp
  | BitmapExtensionAccountIsNotProvided
  | CannotFindNonZeroLiquidityBinArrayId
  | BinIdOutOfBound
  | InsufficientOutAmount
  | InvalidPositionWidth
  | ExcessiveFeeUpdate
  | PoolDisabled
  | InvalidPoolType
  | ExceedMaxWhitelist
  | InvalidIndex
  | RewardNotEnded
  | MustWithdrawnIneligibleReward
  | UnauthorizedAddress
  | OperatorsAreTheSame
  | WithdrawToWrongTokenAccount
  | WrongRentReceiver
  | AlreadyPassActivationSlot
  | LastSlotCannotBeSmallerThanActivateSlot
  | ExceedMaxSwappedAmount
  | InvalidStrategyParameters
  | LiquidityLocked
  | InvalidLockReleaseSlot
  | BinRangeIsNotEmpty
  | InvalidSide
  | InvalidResizeLength

export class InvalidStartBinIndex extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "InvalidStartBinIndex"
  readonly msg = "Invalid start bin index"

  constructor(readonly logs?: string[]) {
    super("6000: Invalid start bin index")
  }
}

export class InvalidBinId extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "InvalidBinId"
  readonly msg = "Invalid bin id"

  constructor(readonly logs?: string[]) {
    super("6001: Invalid bin id")
  }
}

export class InvalidInput extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = "InvalidInput"
  readonly msg = "Invalid input data"

  constructor(readonly logs?: string[]) {
    super("6002: Invalid input data")
  }
}

export class ExceededAmountSlippageTolerance extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = "ExceededAmountSlippageTolerance"
  readonly msg = "Exceeded amount slippage tolerance"

  constructor(readonly logs?: string[]) {
    super("6003: Exceeded amount slippage tolerance")
  }
}

export class ExceededBinSlippageTolerance extends Error {
  static readonly code = 6004
  readonly code = 6004
  readonly name = "ExceededBinSlippageTolerance"
  readonly msg = "Exceeded bin slippage tolerance"

  constructor(readonly logs?: string[]) {
    super("6004: Exceeded bin slippage tolerance")
  }
}

export class CompositionFactorFlawed extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = "CompositionFactorFlawed"
  readonly msg = "Composition factor flawed"

  constructor(readonly logs?: string[]) {
    super("6005: Composition factor flawed")
  }
}

export class NonPresetBinStep extends Error {
  static readonly code = 6006
  readonly code = 6006
  readonly name = "NonPresetBinStep"
  readonly msg = "Non preset bin step"

  constructor(readonly logs?: string[]) {
    super("6006: Non preset bin step")
  }
}

export class ZeroLiquidity extends Error {
  static readonly code = 6007
  readonly code = 6007
  readonly name = "ZeroLiquidity"
  readonly msg = "Zero liquidity"

  constructor(readonly logs?: string[]) {
    super("6007: Zero liquidity")
  }
}

export class InvalidPosition extends Error {
  static readonly code = 6008
  readonly code = 6008
  readonly name = "InvalidPosition"
  readonly msg = "Invalid position"

  constructor(readonly logs?: string[]) {
    super("6008: Invalid position")
  }
}

export class BinArrayNotFound extends Error {
  static readonly code = 6009
  readonly code = 6009
  readonly name = "BinArrayNotFound"
  readonly msg = "Bin array not found"

  constructor(readonly logs?: string[]) {
    super("6009: Bin array not found")
  }
}

export class InvalidTokenMint extends Error {
  static readonly code = 6010
  readonly code = 6010
  readonly name = "InvalidTokenMint"
  readonly msg = "Invalid token mint"

  constructor(readonly logs?: string[]) {
    super("6010: Invalid token mint")
  }
}

export class InvalidAccountForSingleDeposit extends Error {
  static readonly code = 6011
  readonly code = 6011
  readonly name = "InvalidAccountForSingleDeposit"
  readonly msg = "Invalid account for single deposit"

  constructor(readonly logs?: string[]) {
    super("6011: Invalid account for single deposit")
  }
}

export class PairInsufficientLiquidity extends Error {
  static readonly code = 6012
  readonly code = 6012
  readonly name = "PairInsufficientLiquidity"
  readonly msg = "Pair insufficient liquidity"

  constructor(readonly logs?: string[]) {
    super("6012: Pair insufficient liquidity")
  }
}

export class InvalidFeeOwner extends Error {
  static readonly code = 6013
  readonly code = 6013
  readonly name = "InvalidFeeOwner"
  readonly msg = "Invalid fee owner"

  constructor(readonly logs?: string[]) {
    super("6013: Invalid fee owner")
  }
}

export class InvalidFeeWithdrawAmount extends Error {
  static readonly code = 6014
  readonly code = 6014
  readonly name = "InvalidFeeWithdrawAmount"
  readonly msg = "Invalid fee withdraw amount"

  constructor(readonly logs?: string[]) {
    super("6014: Invalid fee withdraw amount")
  }
}

export class InvalidAdmin extends Error {
  static readonly code = 6015
  readonly code = 6015
  readonly name = "InvalidAdmin"
  readonly msg = "Invalid admin"

  constructor(readonly logs?: string[]) {
    super("6015: Invalid admin")
  }
}

export class IdenticalFeeOwner extends Error {
  static readonly code = 6016
  readonly code = 6016
  readonly name = "IdenticalFeeOwner"
  readonly msg = "Identical fee owner"

  constructor(readonly logs?: string[]) {
    super("6016: Identical fee owner")
  }
}

export class InvalidBps extends Error {
  static readonly code = 6017
  readonly code = 6017
  readonly name = "InvalidBps"
  readonly msg = "Invalid basis point"

  constructor(readonly logs?: string[]) {
    super("6017: Invalid basis point")
  }
}

export class MathOverflow extends Error {
  static readonly code = 6018
  readonly code = 6018
  readonly name = "MathOverflow"
  readonly msg = "Math operation overflow"

  constructor(readonly logs?: string[]) {
    super("6018: Math operation overflow")
  }
}

export class TypeCastFailed extends Error {
  static readonly code = 6019
  readonly code = 6019
  readonly name = "TypeCastFailed"
  readonly msg = "Type cast error"

  constructor(readonly logs?: string[]) {
    super("6019: Type cast error")
  }
}

export class InvalidRewardIndex extends Error {
  static readonly code = 6020
  readonly code = 6020
  readonly name = "InvalidRewardIndex"
  readonly msg = "Invalid reward index"

  constructor(readonly logs?: string[]) {
    super("6020: Invalid reward index")
  }
}

export class InvalidRewardDuration extends Error {
  static readonly code = 6021
  readonly code = 6021
  readonly name = "InvalidRewardDuration"
  readonly msg = "Invalid reward duration"

  constructor(readonly logs?: string[]) {
    super("6021: Invalid reward duration")
  }
}

export class RewardInitialized extends Error {
  static readonly code = 6022
  readonly code = 6022
  readonly name = "RewardInitialized"
  readonly msg = "Reward already initialized"

  constructor(readonly logs?: string[]) {
    super("6022: Reward already initialized")
  }
}

export class RewardUninitialized extends Error {
  static readonly code = 6023
  readonly code = 6023
  readonly name = "RewardUninitialized"
  readonly msg = "Reward not initialized"

  constructor(readonly logs?: string[]) {
    super("6023: Reward not initialized")
  }
}

export class IdenticalFunder extends Error {
  static readonly code = 6024
  readonly code = 6024
  readonly name = "IdenticalFunder"
  readonly msg = "Identical funder"

  constructor(readonly logs?: string[]) {
    super("6024: Identical funder")
  }
}

export class RewardCampaignInProgress extends Error {
  static readonly code = 6025
  readonly code = 6025
  readonly name = "RewardCampaignInProgress"
  readonly msg = "Reward campaign in progress"

  constructor(readonly logs?: string[]) {
    super("6025: Reward campaign in progress")
  }
}

export class IdenticalRewardDuration extends Error {
  static readonly code = 6026
  readonly code = 6026
  readonly name = "IdenticalRewardDuration"
  readonly msg = "Reward duration is the same"

  constructor(readonly logs?: string[]) {
    super("6026: Reward duration is the same")
  }
}

export class InvalidBinArray extends Error {
  static readonly code = 6027
  readonly code = 6027
  readonly name = "InvalidBinArray"
  readonly msg = "Invalid bin array"

  constructor(readonly logs?: string[]) {
    super("6027: Invalid bin array")
  }
}

export class NonContinuousBinArrays extends Error {
  static readonly code = 6028
  readonly code = 6028
  readonly name = "NonContinuousBinArrays"
  readonly msg = "Bin arrays must be continuous"

  constructor(readonly logs?: string[]) {
    super("6028: Bin arrays must be continuous")
  }
}

export class InvalidRewardVault extends Error {
  static readonly code = 6029
  readonly code = 6029
  readonly name = "InvalidRewardVault"
  readonly msg = "Invalid reward vault"

  constructor(readonly logs?: string[]) {
    super("6029: Invalid reward vault")
  }
}

export class NonEmptyPosition extends Error {
  static readonly code = 6030
  readonly code = 6030
  readonly name = "NonEmptyPosition"
  readonly msg = "Position is not empty"

  constructor(readonly logs?: string[]) {
    super("6030: Position is not empty")
  }
}

export class UnauthorizedAccess extends Error {
  static readonly code = 6031
  readonly code = 6031
  readonly name = "UnauthorizedAccess"
  readonly msg = "Unauthorized access"

  constructor(readonly logs?: string[]) {
    super("6031: Unauthorized access")
  }
}

export class InvalidFeeParameter extends Error {
  static readonly code = 6032
  readonly code = 6032
  readonly name = "InvalidFeeParameter"
  readonly msg = "Invalid fee parameter"

  constructor(readonly logs?: string[]) {
    super("6032: Invalid fee parameter")
  }
}

export class MissingOracle extends Error {
  static readonly code = 6033
  readonly code = 6033
  readonly name = "MissingOracle"
  readonly msg = "Missing oracle account"

  constructor(readonly logs?: string[]) {
    super("6033: Missing oracle account")
  }
}

export class InsufficientSample extends Error {
  static readonly code = 6034
  readonly code = 6034
  readonly name = "InsufficientSample"
  readonly msg = "Insufficient observation sample"

  constructor(readonly logs?: string[]) {
    super("6034: Insufficient observation sample")
  }
}

export class InvalidLookupTimestamp extends Error {
  static readonly code = 6035
  readonly code = 6035
  readonly name = "InvalidLookupTimestamp"
  readonly msg = "Invalid lookup timestamp"

  constructor(readonly logs?: string[]) {
    super("6035: Invalid lookup timestamp")
  }
}

export class BitmapExtensionAccountIsNotProvided extends Error {
  static readonly code = 6036
  readonly code = 6036
  readonly name = "BitmapExtensionAccountIsNotProvided"
  readonly msg = "Bitmap extension account is not provided"

  constructor(readonly logs?: string[]) {
    super("6036: Bitmap extension account is not provided")
  }
}

export class CannotFindNonZeroLiquidityBinArrayId extends Error {
  static readonly code = 6037
  readonly code = 6037
  readonly name = "CannotFindNonZeroLiquidityBinArrayId"
  readonly msg = "Cannot find non-zero liquidity binArrayId"

  constructor(readonly logs?: string[]) {
    super("6037: Cannot find non-zero liquidity binArrayId")
  }
}

export class BinIdOutOfBound extends Error {
  static readonly code = 6038
  readonly code = 6038
  readonly name = "BinIdOutOfBound"
  readonly msg = "Bin id out of bound"

  constructor(readonly logs?: string[]) {
    super("6038: Bin id out of bound")
  }
}

export class InsufficientOutAmount extends Error {
  static readonly code = 6039
  readonly code = 6039
  readonly name = "InsufficientOutAmount"
  readonly msg = "Insufficient amount in for minimum out"

  constructor(readonly logs?: string[]) {
    super("6039: Insufficient amount in for minimum out")
  }
}

export class InvalidPositionWidth extends Error {
  static readonly code = 6040
  readonly code = 6040
  readonly name = "InvalidPositionWidth"
  readonly msg = "Invalid position width"

  constructor(readonly logs?: string[]) {
    super("6040: Invalid position width")
  }
}

export class ExcessiveFeeUpdate extends Error {
  static readonly code = 6041
  readonly code = 6041
  readonly name = "ExcessiveFeeUpdate"
  readonly msg = "Excessive fee update"

  constructor(readonly logs?: string[]) {
    super("6041: Excessive fee update")
  }
}

export class PoolDisabled extends Error {
  static readonly code = 6042
  readonly code = 6042
  readonly name = "PoolDisabled"
  readonly msg = "Pool disabled"

  constructor(readonly logs?: string[]) {
    super("6042: Pool disabled")
  }
}

export class InvalidPoolType extends Error {
  static readonly code = 6043
  readonly code = 6043
  readonly name = "InvalidPoolType"
  readonly msg = "Invalid pool type"

  constructor(readonly logs?: string[]) {
    super("6043: Invalid pool type")
  }
}

export class ExceedMaxWhitelist extends Error {
  static readonly code = 6044
  readonly code = 6044
  readonly name = "ExceedMaxWhitelist"
  readonly msg = "Whitelist for wallet is full"

  constructor(readonly logs?: string[]) {
    super("6044: Whitelist for wallet is full")
  }
}

export class InvalidIndex extends Error {
  static readonly code = 6045
  readonly code = 6045
  readonly name = "InvalidIndex"
  readonly msg = "Invalid index"

  constructor(readonly logs?: string[]) {
    super("6045: Invalid index")
  }
}

export class RewardNotEnded extends Error {
  static readonly code = 6046
  readonly code = 6046
  readonly name = "RewardNotEnded"
  readonly msg = "Reward not ended"

  constructor(readonly logs?: string[]) {
    super("6046: Reward not ended")
  }
}

export class MustWithdrawnIneligibleReward extends Error {
  static readonly code = 6047
  readonly code = 6047
  readonly name = "MustWithdrawnIneligibleReward"
  readonly msg = "Must withdraw ineligible reward"

  constructor(readonly logs?: string[]) {
    super("6047: Must withdraw ineligible reward")
  }
}

export class UnauthorizedAddress extends Error {
  static readonly code = 6048
  readonly code = 6048
  readonly name = "UnauthorizedAddress"
  readonly msg = "Unauthorized address"

  constructor(readonly logs?: string[]) {
    super("6048: Unauthorized address")
  }
}

export class OperatorsAreTheSame extends Error {
  static readonly code = 6049
  readonly code = 6049
  readonly name = "OperatorsAreTheSame"
  readonly msg = "Cannot update because operators are the same"

  constructor(readonly logs?: string[]) {
    super("6049: Cannot update because operators are the same")
  }
}

export class WithdrawToWrongTokenAccount extends Error {
  static readonly code = 6050
  readonly code = 6050
  readonly name = "WithdrawToWrongTokenAccount"
  readonly msg = "Withdraw to wrong token account"

  constructor(readonly logs?: string[]) {
    super("6050: Withdraw to wrong token account")
  }
}

export class WrongRentReceiver extends Error {
  static readonly code = 6051
  readonly code = 6051
  readonly name = "WrongRentReceiver"
  readonly msg = "Wrong rent receiver"

  constructor(readonly logs?: string[]) {
    super("6051: Wrong rent receiver")
  }
}

export class AlreadyPassActivationSlot extends Error {
  static readonly code = 6052
  readonly code = 6052
  readonly name = "AlreadyPassActivationSlot"
  readonly msg = "Already activated"

  constructor(readonly logs?: string[]) {
    super("6052: Already activated")
  }
}

export class LastSlotCannotBeSmallerThanActivateSlot extends Error {
  static readonly code = 6053
  readonly code = 6053
  readonly name = "LastSlotCannotBeSmallerThanActivateSlot"
  readonly msg = "Last slot cannot be smaller than activate slot"

  constructor(readonly logs?: string[]) {
    super("6053: Last slot cannot be smaller than activate slot")
  }
}

export class ExceedMaxSwappedAmount extends Error {
  static readonly code = 6054
  readonly code = 6054
  readonly name = "ExceedMaxSwappedAmount"
  readonly msg = "Swapped amount is exceeded max swapped amount"

  constructor(readonly logs?: string[]) {
    super("6054: Swapped amount is exceeded max swapped amount")
  }
}

export class InvalidStrategyParameters extends Error {
  static readonly code = 6055
  readonly code = 6055
  readonly name = "InvalidStrategyParameters"
  readonly msg = "Invalid strategy parameters"

  constructor(readonly logs?: string[]) {
    super("6055: Invalid strategy parameters")
  }
}

export class LiquidityLocked extends Error {
  static readonly code = 6056
  readonly code = 6056
  readonly name = "LiquidityLocked"
  readonly msg = "Liquidity locked"

  constructor(readonly logs?: string[]) {
    super("6056: Liquidity locked")
  }
}

export class InvalidLockReleaseSlot extends Error {
  static readonly code = 6057
  readonly code = 6057
  readonly name = "InvalidLockReleaseSlot"
  readonly msg = "Invalid lock release slot"

  constructor(readonly logs?: string[]) {
    super("6057: Invalid lock release slot")
  }
}

export class BinRangeIsNotEmpty extends Error {
  static readonly code = 6058
  readonly code = 6058
  readonly name = "BinRangeIsNotEmpty"
  readonly msg = "Bin range is not empty"

  constructor(readonly logs?: string[]) {
    super("6058: Bin range is not empty")
  }
}

export class InvalidSide extends Error {
  static readonly code = 6059
  readonly code = 6059
  readonly name = "InvalidSide"
  readonly msg = "Invalid side"

  constructor(readonly logs?: string[]) {
    super("6059: Invalid side")
  }
}

export class InvalidResizeLength extends Error {
  static readonly code = 6060
  readonly code = 6060
  readonly name = "InvalidResizeLength"
  readonly msg = "Invalid resize length"

  constructor(readonly logs?: string[]) {
    super("6060: Invalid resize length")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new InvalidStartBinIndex(logs)
    case 6001:
      return new InvalidBinId(logs)
    case 6002:
      return new InvalidInput(logs)
    case 6003:
      return new ExceededAmountSlippageTolerance(logs)
    case 6004:
      return new ExceededBinSlippageTolerance(logs)
    case 6005:
      return new CompositionFactorFlawed(logs)
    case 6006:
      return new NonPresetBinStep(logs)
    case 6007:
      return new ZeroLiquidity(logs)
    case 6008:
      return new InvalidPosition(logs)
    case 6009:
      return new BinArrayNotFound(logs)
    case 6010:
      return new InvalidTokenMint(logs)
    case 6011:
      return new InvalidAccountForSingleDeposit(logs)
    case 6012:
      return new PairInsufficientLiquidity(logs)
    case 6013:
      return new InvalidFeeOwner(logs)
    case 6014:
      return new InvalidFeeWithdrawAmount(logs)
    case 6015:
      return new InvalidAdmin(logs)
    case 6016:
      return new IdenticalFeeOwner(logs)
    case 6017:
      return new InvalidBps(logs)
    case 6018:
      return new MathOverflow(logs)
    case 6019:
      return new TypeCastFailed(logs)
    case 6020:
      return new InvalidRewardIndex(logs)
    case 6021:
      return new InvalidRewardDuration(logs)
    case 6022:
      return new RewardInitialized(logs)
    case 6023:
      return new RewardUninitialized(logs)
    case 6024:
      return new IdenticalFunder(logs)
    case 6025:
      return new RewardCampaignInProgress(logs)
    case 6026:
      return new IdenticalRewardDuration(logs)
    case 6027:
      return new InvalidBinArray(logs)
    case 6028:
      return new NonContinuousBinArrays(logs)
    case 6029:
      return new InvalidRewardVault(logs)
    case 6030:
      return new NonEmptyPosition(logs)
    case 6031:
      return new UnauthorizedAccess(logs)
    case 6032:
      return new InvalidFeeParameter(logs)
    case 6033:
      return new MissingOracle(logs)
    case 6034:
      return new InsufficientSample(logs)
    case 6035:
      return new InvalidLookupTimestamp(logs)
    case 6036:
      return new BitmapExtensionAccountIsNotProvided(logs)
    case 6037:
      return new CannotFindNonZeroLiquidityBinArrayId(logs)
    case 6038:
      return new BinIdOutOfBound(logs)
    case 6039:
      return new InsufficientOutAmount(logs)
    case 6040:
      return new InvalidPositionWidth(logs)
    case 6041:
      return new ExcessiveFeeUpdate(logs)
    case 6042:
      return new PoolDisabled(logs)
    case 6043:
      return new InvalidPoolType(logs)
    case 6044:
      return new ExceedMaxWhitelist(logs)
    case 6045:
      return new InvalidIndex(logs)
    case 6046:
      return new RewardNotEnded(logs)
    case 6047:
      return new MustWithdrawnIneligibleReward(logs)
    case 6048:
      return new UnauthorizedAddress(logs)
    case 6049:
      return new OperatorsAreTheSame(logs)
    case 6050:
      return new WithdrawToWrongTokenAccount(logs)
    case 6051:
      return new WrongRentReceiver(logs)
    case 6052:
      return new AlreadyPassActivationSlot(logs)
    case 6053:
      return new LastSlotCannotBeSmallerThanActivateSlot(logs)
    case 6054:
      return new ExceedMaxSwappedAmount(logs)
    case 6055:
      return new InvalidStrategyParameters(logs)
    case 6056:
      return new LiquidityLocked(logs)
    case 6057:
      return new InvalidLockReleaseSlot(logs)
    case 6058:
      return new BinRangeIsNotEmpty(logs)
    case 6059:
      return new InvalidSide(logs)
    case 6060:
      return new InvalidResizeLength(logs)
  }

  return null
}
