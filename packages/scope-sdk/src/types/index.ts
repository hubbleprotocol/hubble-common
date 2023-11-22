import * as TokenTypes from "./TokenTypes"
import * as OracleType from "./OracleType"
import * as ScopeChainError from "./ScopeChainError"
import * as UpdateTokenMetadataMode from "./UpdateTokenMetadataMode"

export { Limit } from "./Limit"
export type { LimitFields, LimitJSON } from "./Limit"
export { Fees } from "./Fees"
export type { FeesFields, FeesJSON } from "./Fees"
export { PoolApr } from "./PoolApr"
export type { PoolAprFields, PoolAprJSON } from "./PoolApr"
export { Fee } from "./Fee"
export type { FeeFields, FeeJSON } from "./Fee"
export { LiqPool } from "./LiqPool"
export type { LiqPoolFields, LiqPoolJSON } from "./LiqPool"
export { List } from "./List"
export type { ListFields, ListJSON } from "./List"
export { StakeSystem } from "./StakeSystem"
export type { StakeSystemFields, StakeSystemJSON } from "./StakeSystem"
export { ValidatorSystem } from "./ValidatorSystem"
export type {
  ValidatorSystemFields,
  ValidatorSystemJSON,
} from "./ValidatorSystem"
export { State } from "./State"
export type { StateFields, StateJSON } from "./State"
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
export { EmaTwap } from "./EmaTwap"
export type { EmaTwapFields, EmaTwapJSON } from "./EmaTwap"
export { TokenMetadata } from "./TokenMetadata"
export type { TokenMetadataFields, TokenMetadataJSON } from "./TokenMetadata"
export { TokenTypes }

export type TokenTypesKind = TokenTypes.TokenA | TokenTypes.TokenB
export type TokenTypesJSON = TokenTypes.TokenAJSON | TokenTypes.TokenBJSON

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
  | OracleType.MsolStake
  | OracleType.KTokenToTokenA
  | OracleType.KTokenToTokenB
  | OracleType.JupiterLP
  | OracleType.ScopeTwap
export type OracleTypeJSON =
  | OracleType.PythJSON
  | OracleType.SwitchboardV1JSON
  | OracleType.SwitchboardV2JSON
  | OracleType.DeprecatedPlaceholderJSON
  | OracleType.CTokenJSON
  | OracleType.SplStakeJSON
  | OracleType.KTokenJSON
  | OracleType.PythEMAJSON
  | OracleType.MsolStakeJSON
  | OracleType.KTokenToTokenAJSON
  | OracleType.KTokenToTokenBJSON
  | OracleType.JupiterLPJSON
  | OracleType.ScopeTwapJSON

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

export { UpdateTokenMetadataMode }

export type UpdateTokenMetadataModeKind =
  | UpdateTokenMetadataMode.Name
  | UpdateTokenMetadataMode.MaxPriceAgeSeconds
export type UpdateTokenMetadataModeJSON =
  | UpdateTokenMetadataMode.NameJSON
  | UpdateTokenMetadataMode.MaxPriceAgeSecondsJSON
