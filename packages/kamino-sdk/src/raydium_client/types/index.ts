import * as PoolStatusBitIndex from "./PoolStatusBitIndex"
import * as PoolStatusBitFlag from "./PoolStatusBitFlag"
import * as RewardState from "./RewardState"

export { InitializeRewardParam } from "./InitializeRewardParam"
export type {
  InitializeRewardParamFields,
  InitializeRewardParamJSON,
} from "./InitializeRewardParam"
export { Observation } from "./Observation"
export type { ObservationFields, ObservationJSON } from "./Observation"
export { PositionRewardInfo } from "./PositionRewardInfo"
export type {
  PositionRewardInfoFields,
  PositionRewardInfoJSON,
} from "./PositionRewardInfo"
export { RewardInfo } from "./RewardInfo"
export type { RewardInfoFields, RewardInfoJSON } from "./RewardInfo"
export { TickState } from "./TickState"
export type { TickStateFields, TickStateJSON } from "./TickState"
export { PoolStatusBitIndex }

export type PoolStatusBitIndexKind =
  | PoolStatusBitIndex.OpenPositionOrIncreaseLiquidity
  | PoolStatusBitIndex.DecreaseLiquidity
  | PoolStatusBitIndex.CollectFee
  | PoolStatusBitIndex.CollectReward
  | PoolStatusBitIndex.Swap
export type PoolStatusBitIndexJSON =
  | PoolStatusBitIndex.OpenPositionOrIncreaseLiquidityJSON
  | PoolStatusBitIndex.DecreaseLiquidityJSON
  | PoolStatusBitIndex.CollectFeeJSON
  | PoolStatusBitIndex.CollectRewardJSON
  | PoolStatusBitIndex.SwapJSON

export { PoolStatusBitFlag }

export type PoolStatusBitFlagKind =
  | PoolStatusBitFlag.Enable
  | PoolStatusBitFlag.Disable
export type PoolStatusBitFlagJSON =
  | PoolStatusBitFlag.EnableJSON
  | PoolStatusBitFlag.DisableJSON

export { RewardState }

/** State of reward */
export type RewardStateKind =
  | RewardState.Uninitialized
  | RewardState.Initialized
  | RewardState.Opening
  | RewardState.Ended
export type RewardStateJSON =
  | RewardState.UninitializedJSON
  | RewardState.InitializedJSON
  | RewardState.OpeningJSON
  | RewardState.EndedJSON
