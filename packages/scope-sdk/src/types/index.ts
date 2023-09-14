import * as OracleType from "./OracleType"
import * as ScopeChainError from "./ScopeChainError"

export { RebalanceRaw } from "./RebalanceRaw"
export type { RebalanceRawFields, RebalanceRawJSON } from "./RebalanceRaw"
export { KaminoRewardInfo } from "./KaminoRewardInfo"
export type {
  KaminoRewardInfoFields,
  KaminoRewardInfoJSON,
} from "./KaminoRewardInfo"
export { CollateralInfo } from "./CollateralInfo"
export type { CollateralInfoFields, CollateralInfoJSON } from "./CollateralInfo"
export { KaminoPrice } from "./KaminoPrice"
export type { KaminoPriceFields, KaminoPriceJSON } from "./KaminoPrice"
export { WithdrawalCaps } from "./WithdrawalCaps"
export type { WithdrawalCapsFields, WithdrawalCapsJSON } from "./WithdrawalCaps"
export { PositionRewardInfo } from "./PositionRewardInfo"
export type {
  PositionRewardInfoFields,
  PositionRewardInfoJSON,
} from "./PositionRewardInfo"
export { WhirlpoolRewardInfo } from "./WhirlpoolRewardInfo"
export type {
  WhirlpoolRewardInfoFields,
  WhirlpoolRewardInfoJSON,
} from "./WhirlpoolRewardInfo"
export { Tick } from "./Tick"
export type { TickFields, TickJSON } from "./Tick"
export { SwitchboardDecimal } from "./SwitchboardDecimal"
export type {
  SwitchboardDecimalFields,
  SwitchboardDecimalJSON,
} from "./SwitchboardDecimal"
export { AggregatorAccountData } from "./AggregatorAccountData"
export type {
  AggregatorAccountDataFields,
  AggregatorAccountDataJSON,
} from "./AggregatorAccountData"
export { AggregatorRound } from "./AggregatorRound"
export type {
  AggregatorRoundFields,
  AggregatorRoundJSON,
} from "./AggregatorRound"
export { Hash } from "./Hash"
export type { HashFields, HashJSON } from "./Hash"
export { Price } from "./Price"
export type { PriceFields, PriceJSON } from "./Price"
export { DatedPrice } from "./DatedPrice"
export type { DatedPriceFields, DatedPriceJSON } from "./DatedPrice"
export { OracleType }

export type OracleTypeKind =
  | OracleType.Pyth
  | OracleType.SwitchboardV1
  | OracleType.SwitchboardV2
  | OracleType.DeprecatedPlaceholder
  | OracleType.CToken
  | OracleType.SplStake
  | OracleType.KToken
  | OracleType.PythEMA
export type OracleTypeJSON =
  | OracleType.PythJSON
  | OracleType.SwitchboardV1JSON
  | OracleType.SwitchboardV2JSON
  | OracleType.DeprecatedPlaceholderJSON
  | OracleType.CTokenJSON
  | OracleType.SplStakeJSON
  | OracleType.KTokenJSON
  | OracleType.PythEMAJSON

export { ScopeChainError }

/** Errors that can be raised while creating or manipulating a scope chain */
export type ScopeChainErrorKind =
  | ScopeChainError.PriceChainTooLong
  | ScopeChainError.PriceChainConversionFailure
  | ScopeChainError.NoChainForToken
  | ScopeChainError.InvalidPricesInChain
  | ScopeChainError.MathOverflow
  | ScopeChainError.IntegerConversionOverflow
export type ScopeChainErrorJSON =
  | ScopeChainError.PriceChainTooLongJSON
  | ScopeChainError.PriceChainConversionFailureJSON
  | ScopeChainError.NoChainForTokenJSON
  | ScopeChainError.InvalidPricesInChainJSON
  | ScopeChainError.MathOverflowJSON
  | ScopeChainError.IntegerConversionOverflowJSON
