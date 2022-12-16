export type CustomError =
  | LOK
  | NotApproved
  | InvalidUpdateConfigFlag
  | AccountLack
  | ClosePositionErr
  | ZeroMintAmount
  | InvaildTickIndex
  | TickInvaildOrder
  | TickLowerOverflow
  | TickUpperOverflow
  | TickAndSpacingNotMatch
  | InvalidTickArray
  | SqrtPriceLimitOverflow
  | SqrtPriceX64
  | LiquiditySubValueErr
  | LiquidityAddValueErr
  | InvaildLiquidity
  | ForbidBothZeroForSupplyLiquidity
  | TransactionTooOld
  | PriceSlippageCheck
  | TooLittleOutputReceived
  | TooMuchInputPaid
  | InvaildSwapAmountSpecified
  | InvalidInputPoolVault
  | TooSmallInputOrOutputAmount
  | InvalidRewardIndex
  | FullRewardInfo
  | RewardTokenAlreadyInUse
  | ExceptPoolVaultMint
  | InvalidRewardInitParam
  | InvalidRewardDesiredAmount
  | InvalidRewardInputAccountNumber
  | InvalidRewardPeriod
  | NotApproveUpdateRewardEmissiones
  | UnInitializedRewardInfo

export class LOK extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "LOK"
  readonly msg = "LOK"

  constructor(readonly logs?: string[]) {
    super("6000: LOK")
  }
}

export class NotApproved extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "NotApproved"
  readonly msg = "Not approved"

  constructor(readonly logs?: string[]) {
    super("6001: Not approved")
  }
}

export class InvalidUpdateConfigFlag extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = "InvalidUpdateConfigFlag"
  readonly msg = "invalid update amm config flag"

  constructor(readonly logs?: string[]) {
    super("6002: invalid update amm config flag")
  }
}

export class AccountLack extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = "AccountLack"
  readonly msg = "Account lack"

  constructor(readonly logs?: string[]) {
    super("6003: Account lack")
  }
}

export class ClosePositionErr extends Error {
  static readonly code = 6004
  readonly code = 6004
  readonly name = "ClosePositionErr"
  readonly msg =
    "Remove liquitity, collect fees owed and reward then you can close position account"

  constructor(readonly logs?: string[]) {
    super(
      "6004: Remove liquitity, collect fees owed and reward then you can close position account"
    )
  }
}

export class ZeroMintAmount extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = "ZeroMintAmount"
  readonly msg = "Minting amount should be greater than 0"

  constructor(readonly logs?: string[]) {
    super("6005: Minting amount should be greater than 0")
  }
}

export class InvaildTickIndex extends Error {
  static readonly code = 6006
  readonly code = 6006
  readonly name = "InvaildTickIndex"
  readonly msg = "Tick index of lower must be smaller than upper"

  constructor(readonly logs?: string[]) {
    super("6006: Tick index of lower must be smaller than upper")
  }
}

export class TickInvaildOrder extends Error {
  static readonly code = 6007
  readonly code = 6007
  readonly name = "TickInvaildOrder"
  readonly msg = "The lower tick must be below the upper tick"

  constructor(readonly logs?: string[]) {
    super("6007: The lower tick must be below the upper tick")
  }
}

export class TickLowerOverflow extends Error {
  static readonly code = 6008
  readonly code = 6008
  readonly name = "TickLowerOverflow"
  readonly msg =
    "The tick must be greater, or equal to the minimum tick(-221818)"

  constructor(readonly logs?: string[]) {
    super(
      "6008: The tick must be greater, or equal to the minimum tick(-221818)"
    )
  }
}

export class TickUpperOverflow extends Error {
  static readonly code = 6009
  readonly code = 6009
  readonly name = "TickUpperOverflow"
  readonly msg =
    "The tick must be lesser than, or equal to the maximum tick(221818)"

  constructor(readonly logs?: string[]) {
    super(
      "6009: The tick must be lesser than, or equal to the maximum tick(221818)"
    )
  }
}

export class TickAndSpacingNotMatch extends Error {
  static readonly code = 6010
  readonly code = 6010
  readonly name = "TickAndSpacingNotMatch"
  readonly msg = "tick % tick_spacing must be zero"

  constructor(readonly logs?: string[]) {
    super("6010: tick % tick_spacing must be zero")
  }
}

export class InvalidTickArray extends Error {
  static readonly code = 6011
  readonly code = 6011
  readonly name = "InvalidTickArray"
  readonly msg = "Invaild tick array account"

  constructor(readonly logs?: string[]) {
    super("6011: Invaild tick array account")
  }
}

export class SqrtPriceLimitOverflow extends Error {
  static readonly code = 6012
  readonly code = 6012
  readonly name = "SqrtPriceLimitOverflow"
  readonly msg = "Square root price limit overflow"

  constructor(readonly logs?: string[]) {
    super("6012: Square root price limit overflow")
  }
}

export class SqrtPriceX64 extends Error {
  static readonly code = 6013
  readonly code = 6013
  readonly name = "SqrtPriceX64"
  readonly msg = "sqrt_price_x64 out of range"

  constructor(readonly logs?: string[]) {
    super("6013: sqrt_price_x64 out of range")
  }
}

export class LiquiditySubValueErr extends Error {
  static readonly code = 6014
  readonly code = 6014
  readonly name = "LiquiditySubValueErr"
  readonly msg = "Liquidity sub delta L must be smaller than before"

  constructor(readonly logs?: string[]) {
    super("6014: Liquidity sub delta L must be smaller than before")
  }
}

export class LiquidityAddValueErr extends Error {
  static readonly code = 6015
  readonly code = 6015
  readonly name = "LiquidityAddValueErr"
  readonly msg = "Liquidity add delta L must be greater, or equal to before"

  constructor(readonly logs?: string[]) {
    super("6015: Liquidity add delta L must be greater, or equal to before")
  }
}

export class InvaildLiquidity extends Error {
  static readonly code = 6016
  readonly code = 6016
  readonly name = "InvaildLiquidity"
  readonly msg = "Invaild liquidity when update position"

  constructor(readonly logs?: string[]) {
    super("6016: Invaild liquidity when update position")
  }
}

export class ForbidBothZeroForSupplyLiquidity extends Error {
  static readonly code = 6017
  readonly code = 6017
  readonly name = "ForbidBothZeroForSupplyLiquidity"
  readonly msg = "Both token amount must not be zero while supply liquidity"

  constructor(readonly logs?: string[]) {
    super("6017: Both token amount must not be zero while supply liquidity")
  }
}

export class TransactionTooOld extends Error {
  static readonly code = 6018
  readonly code = 6018
  readonly name = "TransactionTooOld"
  readonly msg = "Transaction too old"

  constructor(readonly logs?: string[]) {
    super("6018: Transaction too old")
  }
}

export class PriceSlippageCheck extends Error {
  static readonly code = 6019
  readonly code = 6019
  readonly name = "PriceSlippageCheck"
  readonly msg = "Price slippage check"

  constructor(readonly logs?: string[]) {
    super("6019: Price slippage check")
  }
}

export class TooLittleOutputReceived extends Error {
  static readonly code = 6020
  readonly code = 6020
  readonly name = "TooLittleOutputReceived"
  readonly msg = "Too little output received"

  constructor(readonly logs?: string[]) {
    super("6020: Too little output received")
  }
}

export class TooMuchInputPaid extends Error {
  static readonly code = 6021
  readonly code = 6021
  readonly name = "TooMuchInputPaid"
  readonly msg = "Too much input paid"

  constructor(readonly logs?: string[]) {
    super("6021: Too much input paid")
  }
}

export class InvaildSwapAmountSpecified extends Error {
  static readonly code = 6022
  readonly code = 6022
  readonly name = "InvaildSwapAmountSpecified"
  readonly msg = "Swap special amount can not be zero"

  constructor(readonly logs?: string[]) {
    super("6022: Swap special amount can not be zero")
  }
}

export class InvalidInputPoolVault extends Error {
  static readonly code = 6023
  readonly code = 6023
  readonly name = "InvalidInputPoolVault"
  readonly msg = "Input pool vault is invalid"

  constructor(readonly logs?: string[]) {
    super("6023: Input pool vault is invalid")
  }
}

export class TooSmallInputOrOutputAmount extends Error {
  static readonly code = 6024
  readonly code = 6024
  readonly name = "TooSmallInputOrOutputAmount"
  readonly msg = "Swap input or output amount is too small"

  constructor(readonly logs?: string[]) {
    super("6024: Swap input or output amount is too small")
  }
}

export class InvalidRewardIndex extends Error {
  static readonly code = 6025
  readonly code = 6025
  readonly name = "InvalidRewardIndex"
  readonly msg = "Invalid reward index"

  constructor(readonly logs?: string[]) {
    super("6025: Invalid reward index")
  }
}

export class FullRewardInfo extends Error {
  static readonly code = 6026
  readonly code = 6026
  readonly name = "FullRewardInfo"
  readonly msg = "The init reward token reach to the max"

  constructor(readonly logs?: string[]) {
    super("6026: The init reward token reach to the max")
  }
}

export class RewardTokenAlreadyInUse extends Error {
  static readonly code = 6027
  readonly code = 6027
  readonly name = "RewardTokenAlreadyInUse"
  readonly msg = "The init reward token already in use"

  constructor(readonly logs?: string[]) {
    super("6027: The init reward token already in use")
  }
}

export class ExceptPoolVaultMint extends Error {
  static readonly code = 6028
  readonly code = 6028
  readonly name = "ExceptPoolVaultMint"
  readonly msg =
    "The reward tokens must contain one of pool vault mint except the last reward"

  constructor(readonly logs?: string[]) {
    super(
      "6028: The reward tokens must contain one of pool vault mint except the last reward"
    )
  }
}

export class InvalidRewardInitParam extends Error {
  static readonly code = 6029
  readonly code = 6029
  readonly name = "InvalidRewardInitParam"
  readonly msg = "Invalid reward init param"

  constructor(readonly logs?: string[]) {
    super("6029: Invalid reward init param")
  }
}

export class InvalidRewardDesiredAmount extends Error {
  static readonly code = 6030
  readonly code = 6030
  readonly name = "InvalidRewardDesiredAmount"
  readonly msg = "Invalid collect reward desired amount"

  constructor(readonly logs?: string[]) {
    super("6030: Invalid collect reward desired amount")
  }
}

export class InvalidRewardInputAccountNumber extends Error {
  static readonly code = 6031
  readonly code = 6031
  readonly name = "InvalidRewardInputAccountNumber"
  readonly msg = "Invalid collect reward input account number"

  constructor(readonly logs?: string[]) {
    super("6031: Invalid collect reward input account number")
  }
}

export class InvalidRewardPeriod extends Error {
  static readonly code = 6032
  readonly code = 6032
  readonly name = "InvalidRewardPeriod"
  readonly msg = "Invalid reward period"

  constructor(readonly logs?: string[]) {
    super("6032: Invalid reward period")
  }
}

export class NotApproveUpdateRewardEmissiones extends Error {
  static readonly code = 6033
  readonly code = 6033
  readonly name = "NotApproveUpdateRewardEmissiones"
  readonly msg =
    "Modification of emissiones is allowed within 72 hours from the end of the previous cycle"

  constructor(readonly logs?: string[]) {
    super(
      "6033: Modification of emissiones is allowed within 72 hours from the end of the previous cycle"
    )
  }
}

export class UnInitializedRewardInfo extends Error {
  static readonly code = 6034
  readonly code = 6034
  readonly name = "UnInitializedRewardInfo"
  readonly msg = "uninitialized reward info"

  constructor(readonly logs?: string[]) {
    super("6034: uninitialized reward info")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new LOK(logs)
    case 6001:
      return new NotApproved(logs)
    case 6002:
      return new InvalidUpdateConfigFlag(logs)
    case 6003:
      return new AccountLack(logs)
    case 6004:
      return new ClosePositionErr(logs)
    case 6005:
      return new ZeroMintAmount(logs)
    case 6006:
      return new InvaildTickIndex(logs)
    case 6007:
      return new TickInvaildOrder(logs)
    case 6008:
      return new TickLowerOverflow(logs)
    case 6009:
      return new TickUpperOverflow(logs)
    case 6010:
      return new TickAndSpacingNotMatch(logs)
    case 6011:
      return new InvalidTickArray(logs)
    case 6012:
      return new SqrtPriceLimitOverflow(logs)
    case 6013:
      return new SqrtPriceX64(logs)
    case 6014:
      return new LiquiditySubValueErr(logs)
    case 6015:
      return new LiquidityAddValueErr(logs)
    case 6016:
      return new InvaildLiquidity(logs)
    case 6017:
      return new ForbidBothZeroForSupplyLiquidity(logs)
    case 6018:
      return new TransactionTooOld(logs)
    case 6019:
      return new PriceSlippageCheck(logs)
    case 6020:
      return new TooLittleOutputReceived(logs)
    case 6021:
      return new TooMuchInputPaid(logs)
    case 6022:
      return new InvaildSwapAmountSpecified(logs)
    case 6023:
      return new InvalidInputPoolVault(logs)
    case 6024:
      return new TooSmallInputOrOutputAmount(logs)
    case 6025:
      return new InvalidRewardIndex(logs)
    case 6026:
      return new FullRewardInfo(logs)
    case 6027:
      return new RewardTokenAlreadyInUse(logs)
    case 6028:
      return new ExceptPoolVaultMint(logs)
    case 6029:
      return new InvalidRewardInitParam(logs)
    case 6030:
      return new InvalidRewardDesiredAmount(logs)
    case 6031:
      return new InvalidRewardInputAccountNumber(logs)
    case 6032:
      return new InvalidRewardPeriod(logs)
    case 6033:
      return new NotApproveUpdateRewardEmissiones(logs)
    case 6034:
      return new UnInitializedRewardInfo(logs)
  }

  return null
}
