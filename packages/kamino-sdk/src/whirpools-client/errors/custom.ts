export type CustomError =
  | InvalidEnum
  | InvalidStartTick
  | TickArrayExistInPool
  | TickArrayIndexOutofBounds
  | InvalidTickSpacing
  | ClosePositionNotEmpty
  | DivideByZero
  | NumberCastError
  | NumberDownCastError
  | TickNotFound
  | InvalidTickIndex
  | SqrtPriceOutOfBounds
  | LiquidityZero
  | LiquidityTooHigh
  | LiquidityOverflow
  | LiquidityUnderflow
  | LiquidityNetError
  | TokenMaxExceeded
  | TokenMinSubceeded
  | MissingOrInvalidDelegate
  | InvalidPositionTokenAmount
  | InvalidTimestampConversion
  | InvalidTimestamp
  | InvalidTickArraySequence
  | InvalidTokenMintOrder
  | RewardNotInitialized
  | InvalidRewardIndex
  | RewardVaultAmountInsufficient
  | FeeRateMaxExceeded
  | ProtocolFeeRateMaxExceeded
  | MultiplicationShiftRightOverflow
  | MulDivOverflow
  | MulDivInvalidInput
  | MultiplicationOverflow
  | InvalidSqrtPriceLimitDirection
  | ZeroTradableAmount
  | AmountOutBelowMinimum
  | AmountInAboveMaximum
  | TickArraySequenceInvalidIndex
  | AmountCalcOverflow
  | AmountRemainingOverflow
  | InvalidIntermediaryMint
  | DuplicateTwoHopPool
  | InvalidBundleIndex
  | BundledPositionAlreadyOpened
  | BundledPositionAlreadyClosed
  | PositionBundleNotDeletable
  | UnsupportedTokenMint
  | RemainingAccountsInvalidSlice
  | RemainingAccountsInsufficient
  | NoExtraAccountsForTransferHook
  | IntermediateTokenAmountMismatch
  | TransferFeeCalculationError
  | RemainingAccountsDuplicatedAccountsType

export class InvalidEnum extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "InvalidEnum"
  readonly msg = "Enum value could not be converted"

  constructor(readonly logs?: string[]) {
    super("6000: Enum value could not be converted")
  }
}

export class InvalidStartTick extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "InvalidStartTick"
  readonly msg = "Invalid start tick index provided."

  constructor(readonly logs?: string[]) {
    super("6001: Invalid start tick index provided.")
  }
}

export class TickArrayExistInPool extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = "TickArrayExistInPool"
  readonly msg = "Tick-array already exists in this whirlpool"

  constructor(readonly logs?: string[]) {
    super("6002: Tick-array already exists in this whirlpool")
  }
}

export class TickArrayIndexOutofBounds extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = "TickArrayIndexOutofBounds"
  readonly msg = "Attempt to search for a tick-array failed"

  constructor(readonly logs?: string[]) {
    super("6003: Attempt to search for a tick-array failed")
  }
}

export class InvalidTickSpacing extends Error {
  static readonly code = 6004
  readonly code = 6004
  readonly name = "InvalidTickSpacing"
  readonly msg = "Tick-spacing is not supported"

  constructor(readonly logs?: string[]) {
    super("6004: Tick-spacing is not supported")
  }
}

export class ClosePositionNotEmpty extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = "ClosePositionNotEmpty"
  readonly msg = "Position is not empty It cannot be closed"

  constructor(readonly logs?: string[]) {
    super("6005: Position is not empty It cannot be closed")
  }
}

export class DivideByZero extends Error {
  static readonly code = 6006
  readonly code = 6006
  readonly name = "DivideByZero"
  readonly msg = "Unable to divide by zero"

  constructor(readonly logs?: string[]) {
    super("6006: Unable to divide by zero")
  }
}

export class NumberCastError extends Error {
  static readonly code = 6007
  readonly code = 6007
  readonly name = "NumberCastError"
  readonly msg = "Unable to cast number into BigInt"

  constructor(readonly logs?: string[]) {
    super("6007: Unable to cast number into BigInt")
  }
}

export class NumberDownCastError extends Error {
  static readonly code = 6008
  readonly code = 6008
  readonly name = "NumberDownCastError"
  readonly msg = "Unable to down cast number"

  constructor(readonly logs?: string[]) {
    super("6008: Unable to down cast number")
  }
}

export class TickNotFound extends Error {
  static readonly code = 6009
  readonly code = 6009
  readonly name = "TickNotFound"
  readonly msg = "Tick not found within tick array"

  constructor(readonly logs?: string[]) {
    super("6009: Tick not found within tick array")
  }
}

export class InvalidTickIndex extends Error {
  static readonly code = 6010
  readonly code = 6010
  readonly name = "InvalidTickIndex"
  readonly msg =
    "Provided tick index is either out of bounds or uninitializable"

  constructor(readonly logs?: string[]) {
    super(
      "6010: Provided tick index is either out of bounds or uninitializable"
    )
  }
}

export class SqrtPriceOutOfBounds extends Error {
  static readonly code = 6011
  readonly code = 6011
  readonly name = "SqrtPriceOutOfBounds"
  readonly msg = "Provided sqrt price out of bounds"

  constructor(readonly logs?: string[]) {
    super("6011: Provided sqrt price out of bounds")
  }
}

export class LiquidityZero extends Error {
  static readonly code = 6012
  readonly code = 6012
  readonly name = "LiquidityZero"
  readonly msg = "Liquidity amount must be greater than zero"

  constructor(readonly logs?: string[]) {
    super("6012: Liquidity amount must be greater than zero")
  }
}

export class LiquidityTooHigh extends Error {
  static readonly code = 6013
  readonly code = 6013
  readonly name = "LiquidityTooHigh"
  readonly msg = "Liquidity amount must be less than i64::MAX"

  constructor(readonly logs?: string[]) {
    super("6013: Liquidity amount must be less than i64::MAX")
  }
}

export class LiquidityOverflow extends Error {
  static readonly code = 6014
  readonly code = 6014
  readonly name = "LiquidityOverflow"
  readonly msg = "Liquidity overflow"

  constructor(readonly logs?: string[]) {
    super("6014: Liquidity overflow")
  }
}

export class LiquidityUnderflow extends Error {
  static readonly code = 6015
  readonly code = 6015
  readonly name = "LiquidityUnderflow"
  readonly msg = "Liquidity underflow"

  constructor(readonly logs?: string[]) {
    super("6015: Liquidity underflow")
  }
}

export class LiquidityNetError extends Error {
  static readonly code = 6016
  readonly code = 6016
  readonly name = "LiquidityNetError"
  readonly msg = "Tick liquidity net underflowed or overflowed"

  constructor(readonly logs?: string[]) {
    super("6016: Tick liquidity net underflowed or overflowed")
  }
}

export class TokenMaxExceeded extends Error {
  static readonly code = 6017
  readonly code = 6017
  readonly name = "TokenMaxExceeded"
  readonly msg = "Exceeded token max"

  constructor(readonly logs?: string[]) {
    super("6017: Exceeded token max")
  }
}

export class TokenMinSubceeded extends Error {
  static readonly code = 6018
  readonly code = 6018
  readonly name = "TokenMinSubceeded"
  readonly msg = "Did not meet token min"

  constructor(readonly logs?: string[]) {
    super("6018: Did not meet token min")
  }
}

export class MissingOrInvalidDelegate extends Error {
  static readonly code = 6019
  readonly code = 6019
  readonly name = "MissingOrInvalidDelegate"
  readonly msg = "Position token account has a missing or invalid delegate"

  constructor(readonly logs?: string[]) {
    super("6019: Position token account has a missing or invalid delegate")
  }
}

export class InvalidPositionTokenAmount extends Error {
  static readonly code = 6020
  readonly code = 6020
  readonly name = "InvalidPositionTokenAmount"
  readonly msg = "Position token amount must be 1"

  constructor(readonly logs?: string[]) {
    super("6020: Position token amount must be 1")
  }
}

export class InvalidTimestampConversion extends Error {
  static readonly code = 6021
  readonly code = 6021
  readonly name = "InvalidTimestampConversion"
  readonly msg = "Timestamp should be convertible from i64 to u64"

  constructor(readonly logs?: string[]) {
    super("6021: Timestamp should be convertible from i64 to u64")
  }
}

export class InvalidTimestamp extends Error {
  static readonly code = 6022
  readonly code = 6022
  readonly name = "InvalidTimestamp"
  readonly msg = "Timestamp should be greater than the last updated timestamp"

  constructor(readonly logs?: string[]) {
    super("6022: Timestamp should be greater than the last updated timestamp")
  }
}

export class InvalidTickArraySequence extends Error {
  static readonly code = 6023
  readonly code = 6023
  readonly name = "InvalidTickArraySequence"
  readonly msg = "Invalid tick array sequence provided for instruction."

  constructor(readonly logs?: string[]) {
    super("6023: Invalid tick array sequence provided for instruction.")
  }
}

export class InvalidTokenMintOrder extends Error {
  static readonly code = 6024
  readonly code = 6024
  readonly name = "InvalidTokenMintOrder"
  readonly msg = "Token Mint in wrong order"

  constructor(readonly logs?: string[]) {
    super("6024: Token Mint in wrong order")
  }
}

export class RewardNotInitialized extends Error {
  static readonly code = 6025
  readonly code = 6025
  readonly name = "RewardNotInitialized"
  readonly msg = "Reward not initialized"

  constructor(readonly logs?: string[]) {
    super("6025: Reward not initialized")
  }
}

export class InvalidRewardIndex extends Error {
  static readonly code = 6026
  readonly code = 6026
  readonly name = "InvalidRewardIndex"
  readonly msg = "Invalid reward index"

  constructor(readonly logs?: string[]) {
    super("6026: Invalid reward index")
  }
}

export class RewardVaultAmountInsufficient extends Error {
  static readonly code = 6027
  readonly code = 6027
  readonly name = "RewardVaultAmountInsufficient"
  readonly msg =
    "Reward vault requires amount to support emissions for at least one day"

  constructor(readonly logs?: string[]) {
    super(
      "6027: Reward vault requires amount to support emissions for at least one day"
    )
  }
}

export class FeeRateMaxExceeded extends Error {
  static readonly code = 6028
  readonly code = 6028
  readonly name = "FeeRateMaxExceeded"
  readonly msg = "Exceeded max fee rate"

  constructor(readonly logs?: string[]) {
    super("6028: Exceeded max fee rate")
  }
}

export class ProtocolFeeRateMaxExceeded extends Error {
  static readonly code = 6029
  readonly code = 6029
  readonly name = "ProtocolFeeRateMaxExceeded"
  readonly msg = "Exceeded max protocol fee rate"

  constructor(readonly logs?: string[]) {
    super("6029: Exceeded max protocol fee rate")
  }
}

export class MultiplicationShiftRightOverflow extends Error {
  static readonly code = 6030
  readonly code = 6030
  readonly name = "MultiplicationShiftRightOverflow"
  readonly msg = "Multiplication with shift right overflow"

  constructor(readonly logs?: string[]) {
    super("6030: Multiplication with shift right overflow")
  }
}

export class MulDivOverflow extends Error {
  static readonly code = 6031
  readonly code = 6031
  readonly name = "MulDivOverflow"
  readonly msg = "Muldiv overflow"

  constructor(readonly logs?: string[]) {
    super("6031: Muldiv overflow")
  }
}

export class MulDivInvalidInput extends Error {
  static readonly code = 6032
  readonly code = 6032
  readonly name = "MulDivInvalidInput"
  readonly msg = "Invalid div_u256 input"

  constructor(readonly logs?: string[]) {
    super("6032: Invalid div_u256 input")
  }
}

export class MultiplicationOverflow extends Error {
  static readonly code = 6033
  readonly code = 6033
  readonly name = "MultiplicationOverflow"
  readonly msg = "Multiplication overflow"

  constructor(readonly logs?: string[]) {
    super("6033: Multiplication overflow")
  }
}

export class InvalidSqrtPriceLimitDirection extends Error {
  static readonly code = 6034
  readonly code = 6034
  readonly name = "InvalidSqrtPriceLimitDirection"
  readonly msg =
    "Provided SqrtPriceLimit not in the same direction as the swap."

  constructor(readonly logs?: string[]) {
    super(
      "6034: Provided SqrtPriceLimit not in the same direction as the swap."
    )
  }
}

export class ZeroTradableAmount extends Error {
  static readonly code = 6035
  readonly code = 6035
  readonly name = "ZeroTradableAmount"
  readonly msg = "There are no tradable amount to swap."

  constructor(readonly logs?: string[]) {
    super("6035: There are no tradable amount to swap.")
  }
}

export class AmountOutBelowMinimum extends Error {
  static readonly code = 6036
  readonly code = 6036
  readonly name = "AmountOutBelowMinimum"
  readonly msg = "Amount out below minimum threshold"

  constructor(readonly logs?: string[]) {
    super("6036: Amount out below minimum threshold")
  }
}

export class AmountInAboveMaximum extends Error {
  static readonly code = 6037
  readonly code = 6037
  readonly name = "AmountInAboveMaximum"
  readonly msg = "Amount in above maximum threshold"

  constructor(readonly logs?: string[]) {
    super("6037: Amount in above maximum threshold")
  }
}

export class TickArraySequenceInvalidIndex extends Error {
  static readonly code = 6038
  readonly code = 6038
  readonly name = "TickArraySequenceInvalidIndex"
  readonly msg = "Invalid index for tick array sequence"

  constructor(readonly logs?: string[]) {
    super("6038: Invalid index for tick array sequence")
  }
}

export class AmountCalcOverflow extends Error {
  static readonly code = 6039
  readonly code = 6039
  readonly name = "AmountCalcOverflow"
  readonly msg = "Amount calculated overflows"

  constructor(readonly logs?: string[]) {
    super("6039: Amount calculated overflows")
  }
}

export class AmountRemainingOverflow extends Error {
  static readonly code = 6040
  readonly code = 6040
  readonly name = "AmountRemainingOverflow"
  readonly msg = "Amount remaining overflows"

  constructor(readonly logs?: string[]) {
    super("6040: Amount remaining overflows")
  }
}

export class InvalidIntermediaryMint extends Error {
  static readonly code = 6041
  readonly code = 6041
  readonly name = "InvalidIntermediaryMint"
  readonly msg = "Invalid intermediary mint"

  constructor(readonly logs?: string[]) {
    super("6041: Invalid intermediary mint")
  }
}

export class DuplicateTwoHopPool extends Error {
  static readonly code = 6042
  readonly code = 6042
  readonly name = "DuplicateTwoHopPool"
  readonly msg = "Duplicate two hop pool"

  constructor(readonly logs?: string[]) {
    super("6042: Duplicate two hop pool")
  }
}

export class InvalidBundleIndex extends Error {
  static readonly code = 6043
  readonly code = 6043
  readonly name = "InvalidBundleIndex"
  readonly msg = "Bundle index is out of bounds"

  constructor(readonly logs?: string[]) {
    super("6043: Bundle index is out of bounds")
  }
}

export class BundledPositionAlreadyOpened extends Error {
  static readonly code = 6044
  readonly code = 6044
  readonly name = "BundledPositionAlreadyOpened"
  readonly msg = "Position has already been opened"

  constructor(readonly logs?: string[]) {
    super("6044: Position has already been opened")
  }
}

export class BundledPositionAlreadyClosed extends Error {
  static readonly code = 6045
  readonly code = 6045
  readonly name = "BundledPositionAlreadyClosed"
  readonly msg = "Position has already been closed"

  constructor(readonly logs?: string[]) {
    super("6045: Position has already been closed")
  }
}

export class PositionBundleNotDeletable extends Error {
  static readonly code = 6046
  readonly code = 6046
  readonly name = "PositionBundleNotDeletable"
  readonly msg = "Unable to delete PositionBundle with open positions"

  constructor(readonly logs?: string[]) {
    super("6046: Unable to delete PositionBundle with open positions")
  }
}

export class UnsupportedTokenMint extends Error {
  static readonly code = 6047
  readonly code = 6047
  readonly name = "UnsupportedTokenMint"
  readonly msg = "Token mint has unsupported attributes"

  constructor(readonly logs?: string[]) {
    super("6047: Token mint has unsupported attributes")
  }
}

export class RemainingAccountsInvalidSlice extends Error {
  static readonly code = 6048
  readonly code = 6048
  readonly name = "RemainingAccountsInvalidSlice"
  readonly msg = "Invalid remaining accounts"

  constructor(readonly logs?: string[]) {
    super("6048: Invalid remaining accounts")
  }
}

export class RemainingAccountsInsufficient extends Error {
  static readonly code = 6049
  readonly code = 6049
  readonly name = "RemainingAccountsInsufficient"
  readonly msg = "Insufficient remaining accounts"

  constructor(readonly logs?: string[]) {
    super("6049: Insufficient remaining accounts")
  }
}

export class NoExtraAccountsForTransferHook extends Error {
  static readonly code = 6050
  readonly code = 6050
  readonly name = "NoExtraAccountsForTransferHook"
  readonly msg = "Unable to call transfer hook without extra accounts"

  constructor(readonly logs?: string[]) {
    super("6050: Unable to call transfer hook without extra accounts")
  }
}

export class IntermediateTokenAmountMismatch extends Error {
  static readonly code = 6051
  readonly code = 6051
  readonly name = "IntermediateTokenAmountMismatch"
  readonly msg = "Output and input amount mismatch"

  constructor(readonly logs?: string[]) {
    super("6051: Output and input amount mismatch")
  }
}

export class TransferFeeCalculationError extends Error {
  static readonly code = 6052
  readonly code = 6052
  readonly name = "TransferFeeCalculationError"
  readonly msg = "Transfer fee calculation failed"

  constructor(readonly logs?: string[]) {
    super("6052: Transfer fee calculation failed")
  }
}

export class RemainingAccountsDuplicatedAccountsType extends Error {
  static readonly code = 6053
  readonly code = 6053
  readonly name = "RemainingAccountsDuplicatedAccountsType"
  readonly msg = "Same accounts type is provided more than once"

  constructor(readonly logs?: string[]) {
    super("6053: Same accounts type is provided more than once")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new InvalidEnum(logs)
    case 6001:
      return new InvalidStartTick(logs)
    case 6002:
      return new TickArrayExistInPool(logs)
    case 6003:
      return new TickArrayIndexOutofBounds(logs)
    case 6004:
      return new InvalidTickSpacing(logs)
    case 6005:
      return new ClosePositionNotEmpty(logs)
    case 6006:
      return new DivideByZero(logs)
    case 6007:
      return new NumberCastError(logs)
    case 6008:
      return new NumberDownCastError(logs)
    case 6009:
      return new TickNotFound(logs)
    case 6010:
      return new InvalidTickIndex(logs)
    case 6011:
      return new SqrtPriceOutOfBounds(logs)
    case 6012:
      return new LiquidityZero(logs)
    case 6013:
      return new LiquidityTooHigh(logs)
    case 6014:
      return new LiquidityOverflow(logs)
    case 6015:
      return new LiquidityUnderflow(logs)
    case 6016:
      return new LiquidityNetError(logs)
    case 6017:
      return new TokenMaxExceeded(logs)
    case 6018:
      return new TokenMinSubceeded(logs)
    case 6019:
      return new MissingOrInvalidDelegate(logs)
    case 6020:
      return new InvalidPositionTokenAmount(logs)
    case 6021:
      return new InvalidTimestampConversion(logs)
    case 6022:
      return new InvalidTimestamp(logs)
    case 6023:
      return new InvalidTickArraySequence(logs)
    case 6024:
      return new InvalidTokenMintOrder(logs)
    case 6025:
      return new RewardNotInitialized(logs)
    case 6026:
      return new InvalidRewardIndex(logs)
    case 6027:
      return new RewardVaultAmountInsufficient(logs)
    case 6028:
      return new FeeRateMaxExceeded(logs)
    case 6029:
      return new ProtocolFeeRateMaxExceeded(logs)
    case 6030:
      return new MultiplicationShiftRightOverflow(logs)
    case 6031:
      return new MulDivOverflow(logs)
    case 6032:
      return new MulDivInvalidInput(logs)
    case 6033:
      return new MultiplicationOverflow(logs)
    case 6034:
      return new InvalidSqrtPriceLimitDirection(logs)
    case 6035:
      return new ZeroTradableAmount(logs)
    case 6036:
      return new AmountOutBelowMinimum(logs)
    case 6037:
      return new AmountInAboveMaximum(logs)
    case 6038:
      return new TickArraySequenceInvalidIndex(logs)
    case 6039:
      return new AmountCalcOverflow(logs)
    case 6040:
      return new AmountRemainingOverflow(logs)
    case 6041:
      return new InvalidIntermediaryMint(logs)
    case 6042:
      return new DuplicateTwoHopPool(logs)
    case 6043:
      return new InvalidBundleIndex(logs)
    case 6044:
      return new BundledPositionAlreadyOpened(logs)
    case 6045:
      return new BundledPositionAlreadyClosed(logs)
    case 6046:
      return new PositionBundleNotDeletable(logs)
    case 6047:
      return new UnsupportedTokenMint(logs)
    case 6048:
      return new RemainingAccountsInvalidSlice(logs)
    case 6049:
      return new RemainingAccountsInsufficient(logs)
    case 6050:
      return new NoExtraAccountsForTransferHook(logs)
    case 6051:
      return new IntermediateTokenAmountMismatch(logs)
    case 6052:
      return new TransferFeeCalculationError(logs)
    case 6053:
      return new RemainingAccountsDuplicatedAccountsType(logs)
  }

  return null
}
