import * as UpdateTokenMetadataMode from "./UpdateTokenMetadataMode"
import * as TokenTypes from "./TokenTypes"
import * as OracleType from "./OracleType"
import * as EmaType from "./EmaType"
import * as ScopeChainError from "./ScopeChainError"

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
export { MintToScopeChain } from "./MintToScopeChain"
export type {
  MintToScopeChainFields,
  MintToScopeChainJSON,
} from "./MintToScopeChain"
export { UpdateTokenMetadataMode }

export type UpdateTokenMetadataModeKind =
  | UpdateTokenMetadataMode.Name
  | UpdateTokenMetadataMode.MaxPriceAgeSlots
export type UpdateTokenMetadataModeJSON =
  | UpdateTokenMetadataMode.NameJSON
  | UpdateTokenMetadataMode.MaxPriceAgeSlotsJSON

export { TokenTypes }

export type TokenTypesKind = TokenTypes.TokenA | TokenTypes.TokenB
export type TokenTypesJSON = TokenTypes.TokenAJSON | TokenTypes.TokenBJSON

export { OracleType }

export type OracleTypeKind =
  | OracleType.Pyth
  | OracleType.DeprecatedPlaceholder1
  | OracleType.SwitchboardV2
  | OracleType.DeprecatedPlaceholder2
  | OracleType.CToken
  | OracleType.SplStake
  | OracleType.KToken
  | OracleType.PythEMA
  | OracleType.MsolStake
  | OracleType.KTokenToTokenA
  | OracleType.KTokenToTokenB
  | OracleType.JupiterLpFetch
  | OracleType.ScopeTwap
  | OracleType.OrcaWhirlpoolAtoB
  | OracleType.OrcaWhirlpoolBtoA
  | OracleType.RaydiumAmmV3AtoB
  | OracleType.RaydiumAmmV3BtoA
  | OracleType.JupiterLpCompute
  | OracleType.MeteoraDlmmAtoB
  | OracleType.MeteoraDlmmBtoA
  | OracleType.JupiterLpScope
  | OracleType.PythPullBased
export type OracleTypeJSON =
  | OracleType.PythJSON
  | OracleType.DeprecatedPlaceholder1JSON
  | OracleType.SwitchboardV2JSON
  | OracleType.DeprecatedPlaceholder2JSON
  | OracleType.CTokenJSON
  | OracleType.SplStakeJSON
  | OracleType.KTokenJSON
  | OracleType.PythEMAJSON
  | OracleType.MsolStakeJSON
  | OracleType.KTokenToTokenAJSON
  | OracleType.KTokenToTokenBJSON
  | OracleType.JupiterLpFetchJSON
  | OracleType.ScopeTwapJSON
  | OracleType.OrcaWhirlpoolAtoBJSON
  | OracleType.OrcaWhirlpoolBtoAJSON
  | OracleType.RaydiumAmmV3AtoBJSON
  | OracleType.RaydiumAmmV3BtoAJSON
  | OracleType.JupiterLpComputeJSON
  | OracleType.MeteoraDlmmAtoBJSON
  | OracleType.MeteoraDlmmBtoAJSON
  | OracleType.JupiterLpScopeJSON
  | OracleType.PythPullBasedJSON

export { EmaType }

export type EmaTypeKind = EmaType.Ema1h
export type EmaTypeJSON = EmaType.Ema1hJSON

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
