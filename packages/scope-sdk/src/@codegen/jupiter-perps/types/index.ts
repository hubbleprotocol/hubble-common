import * as OracleType from "./OracleType"

export { Assets } from "./Assets"
export type { AssetsFields, AssetsJSON } from "./Assets"
export { PricingParams } from "./PricingParams"
export type { PricingParamsFields, PricingParamsJSON } from "./PricingParams"
export { FundingRateState } from "./FundingRateState"
export type {
  FundingRateStateFields,
  FundingRateStateJSON,
} from "./FundingRateState"
export { OracleParams } from "./OracleParams"
export type { OracleParamsFields, OracleParamsJSON } from "./OracleParams"
export { Permissions } from "./Permissions"
export type { PermissionsFields, PermissionsJSON } from "./Permissions"
export { Fees } from "./Fees"
export type { FeesFields, FeesJSON } from "./Fees"
export { PoolApr } from "./PoolApr"
export type { PoolAprFields, PoolAprJSON } from "./PoolApr"
export { Limit } from "./Limit"
export type { LimitFields, LimitJSON } from "./Limit"
export { OracleType }

export type OracleTypeKind = OracleType.None | OracleType.Test | OracleType.Pyth
export type OracleTypeJSON =
  | OracleType.NoneJSON
  | OracleType.TestJSON
  | OracleType.PythJSON

