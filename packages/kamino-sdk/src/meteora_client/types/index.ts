import * as StrategyType from "./StrategyType"
import * as Rounding from "./Rounding"
import * as LayoutVersion from "./LayoutVersion"
import * as PairType from "./PairType"
import * as PairStatus from "./PairStatus"

export { LiquidityParameterByStrategyOneSide } from "./LiquidityParameterByStrategyOneSide"
export type {
  LiquidityParameterByStrategyOneSideFields,
  LiquidityParameterByStrategyOneSideJSON,
} from "./LiquidityParameterByStrategyOneSide"
export { LiquidityParameterByStrategy } from "./LiquidityParameterByStrategy"
export type {
  LiquidityParameterByStrategyFields,
  LiquidityParameterByStrategyJSON,
} from "./LiquidityParameterByStrategy"
export { StrategyParameters } from "./StrategyParameters"
export type {
  StrategyParametersFields,
  StrategyParametersJSON,
} from "./StrategyParameters"
export { ParabolicParameter } from "./ParabolicParameter"
export type {
  ParabolicParameterFields,
  ParabolicParameterJSON,
} from "./ParabolicParameter"
export { BinLiquidityDistributionByWeight } from "./BinLiquidityDistributionByWeight"
export type {
  BinLiquidityDistributionByWeightFields,
  BinLiquidityDistributionByWeightJSON,
} from "./BinLiquidityDistributionByWeight"
export { LiquidityParameterByWeight } from "./LiquidityParameterByWeight"
export type {
  LiquidityParameterByWeightFields,
  LiquidityParameterByWeightJSON,
} from "./LiquidityParameterByWeight"
export { LiquidityOneSideParameter } from "./LiquidityOneSideParameter"
export type {
  LiquidityOneSideParameterFields,
  LiquidityOneSideParameterJSON,
} from "./LiquidityOneSideParameter"
export { BinLiquidityDistribution } from "./BinLiquidityDistribution"
export type {
  BinLiquidityDistributionFields,
  BinLiquidityDistributionJSON,
} from "./BinLiquidityDistribution"
export { LiquidityParameter } from "./LiquidityParameter"
export type {
  LiquidityParameterFields,
  LiquidityParameterJSON,
} from "./LiquidityParameter"
export { InitPresetParametersIx } from "./InitPresetParametersIx"
export type {
  InitPresetParametersIxFields,
  InitPresetParametersIxJSON,
} from "./InitPresetParametersIx"
export { BinLiquidityReduction } from "./BinLiquidityReduction"
export type {
  BinLiquidityReductionFields,
  BinLiquidityReductionJSON,
} from "./BinLiquidityReduction"
export { FeeParameter } from "./FeeParameter"
export type { FeeParameterFields, FeeParameterJSON } from "./FeeParameter"
export { Bin } from "./Bin"
export type { BinFields, BinJSON } from "./Bin"
export { ProtocolFee } from "./ProtocolFee"
export type { ProtocolFeeFields, ProtocolFeeJSON } from "./ProtocolFee"
export { RewardInfo } from "./RewardInfo"
export type { RewardInfoFields, RewardInfoJSON } from "./RewardInfo"
export { Observation } from "./Observation"
export type { ObservationFields, ObservationJSON } from "./Observation"
export { StaticParameters } from "./StaticParameters"
export type {
  StaticParametersFields,
  StaticParametersJSON,
} from "./StaticParameters"
export { VariableParameters } from "./VariableParameters"
export type {
  VariableParametersFields,
  VariableParametersJSON,
} from "./VariableParameters"
export { FeeInfo } from "./FeeInfo"
export type { FeeInfoFields, FeeInfoJSON } from "./FeeInfo"
export { UserRewardInfo } from "./UserRewardInfo"
export type { UserRewardInfoFields, UserRewardInfoJSON } from "./UserRewardInfo"
export { StrategyType }

export type StrategyTypeKind =
  | StrategyType.Spot
  | StrategyType.Curve
  | StrategyType.BidAsk
export type StrategyTypeJSON =
  | StrategyType.SpotJSON
  | StrategyType.CurveJSON
  | StrategyType.BidAskJSON

export { Rounding }

export type RoundingKind = Rounding.Up | Rounding.Down
export type RoundingJSON = Rounding.UpJSON | Rounding.DownJSON

export { LayoutVersion }

/** Layout version */
export type LayoutVersionKind = LayoutVersion.V0 | LayoutVersion.V1
export type LayoutVersionJSON = LayoutVersion.V0JSON | LayoutVersion.V1JSON

export { PairType }

/** Type of the Pair. 0 = Permissionless, 1 = Permission. Putting 0 as permissionless for backward compatibility. */
export type PairTypeKind = PairType.Permissionless | PairType.Permission
export type PairTypeJSON = PairType.PermissionlessJSON | PairType.PermissionJSON

export { PairStatus }

/** Pair status. 0 = Enabled, 1 = Disabled. Putting 0 as enabled for backward compatibility. */
export type PairStatusKind = PairStatus.Enabled | PairStatus.Disabled
export type PairStatusJSON = PairStatus.EnabledJSON | PairStatus.DisabledJSON
