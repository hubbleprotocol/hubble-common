import * as WithdrawalCapAccumulatorAction from "./WithdrawalCapAccumulatorAction"
import * as RebalanceEffects from "./RebalanceEffects"
import * as SwapLimit from "./SwapLimit"
import * as MintingMethod from "./MintingMethod"
import * as GlobalConfigOption from "./GlobalConfigOption"
import * as StrategyConfigOption from "./StrategyConfigOption"
import * as StrategyStatus from "./StrategyStatus"
import * as StrategyType from "./StrategyType"
import * as CreationStatus from "./CreationStatus"
import * as ExecutiveWithdrawAction from "./ExecutiveWithdrawAction"
import * as ReferencePriceType from "./ReferencePriceType"
import * as LiquidityCalculationMode from "./LiquidityCalculationMode"
import * as UpdateCollateralInfoMode from "./UpdateCollateralInfoMode"
import * as BalanceStatus from "./BalanceStatus"
import * as DriftDirection from "./DriftDirection"
import * as RebalanceDriftStep from "./RebalanceDriftStep"
import * as RebalanceTakeProfitToken from "./RebalanceTakeProfitToken"
import * as RebalanceTakeProfitStep from "./RebalanceTakeProfitStep"
import * as RebalanceAction from "./RebalanceAction"
import * as RebalanceType from "./RebalanceType"
import * as CollateralTestToken from "./CollateralTestToken"
import * as ScopePriceIdTest from "./ScopePriceIdTest"
import * as DEX from "./DEX"

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
export { RewardInfo } from "./RewardInfo"
export type { RewardInfoFields, RewardInfoJSON } from "./RewardInfo"
export { RebalanceRaw } from "./RebalanceRaw"
export type { RebalanceRawFields, RebalanceRawJSON } from "./RebalanceRaw"
export { CollateralInfo } from "./CollateralInfo"
export type { CollateralInfoFields, CollateralInfoJSON } from "./CollateralInfo"
export { KaminoRewardInfo } from "./KaminoRewardInfo"
export type {
  KaminoRewardInfoFields,
  KaminoRewardInfoJSON,
} from "./KaminoRewardInfo"
export { WithdrawalCaps } from "./WithdrawalCaps"
export type { WithdrawalCapsFields, WithdrawalCapsJSON } from "./WithdrawalCaps"
export { Price } from "./Price"
export type { PriceFields, PriceJSON } from "./Price"
export { WithdrawalCapAccumulatorAction }

export type WithdrawalCapAccumulatorActionKind =
  | WithdrawalCapAccumulatorAction.KeepAccumulator
  | WithdrawalCapAccumulatorAction.ResetAccumulator
export type WithdrawalCapAccumulatorActionJSON =
  | WithdrawalCapAccumulatorAction.KeepAccumulatorJSON
  | WithdrawalCapAccumulatorAction.ResetAccumulatorJSON

export { RebalanceEffects }

export type RebalanceEffectsKind =
  | RebalanceEffects.NewRange
  | RebalanceEffects.WithdrawAndFreeze
export type RebalanceEffectsJSON =
  | RebalanceEffects.NewRangeJSON
  | RebalanceEffects.WithdrawAndFreezeJSON

export { SwapLimit }

export type SwapLimitKind = SwapLimit.Bps | SwapLimit.Absolute
export type SwapLimitJSON = SwapLimit.BpsJSON | SwapLimit.AbsoluteJSON

export { MintingMethod }

export type MintingMethodKind =
  | MintingMethod.PriceBased
  | MintingMethod.Proportional
export type MintingMethodJSON =
  | MintingMethod.PriceBasedJSON
  | MintingMethod.ProportionalJSON

export { GlobalConfigOption }

export type GlobalConfigOptionKind =
  | GlobalConfigOption.EmergencyMode
  | GlobalConfigOption.BlockDeposit
  | GlobalConfigOption.BlockInvest
  | GlobalConfigOption.BlockWithdraw
  | GlobalConfigOption.BlockCollectFees
  | GlobalConfigOption.BlockCollectRewards
  | GlobalConfigOption.BlockSwapRewards
  | GlobalConfigOption.BlockSwapUnevenVaults
  | GlobalConfigOption.FeesBps
  | GlobalConfigOption.SwapDiscountBps
  | GlobalConfigOption.ActionsAuthority
  | GlobalConfigOption.TreasuryFeeVaults
  | GlobalConfigOption.AdminAuthority
  | GlobalConfigOption.BlockEmergencySwap
  | GlobalConfigOption.BlockLocalAdmin
  | GlobalConfigOption.UpdateTokenInfos
  | GlobalConfigOption.ScopeProgramId
  | GlobalConfigOption.ScopePriceId
  | GlobalConfigOption.MinPerformanceFeeBps
export type GlobalConfigOptionJSON =
  | GlobalConfigOption.EmergencyModeJSON
  | GlobalConfigOption.BlockDepositJSON
  | GlobalConfigOption.BlockInvestJSON
  | GlobalConfigOption.BlockWithdrawJSON
  | GlobalConfigOption.BlockCollectFeesJSON
  | GlobalConfigOption.BlockCollectRewardsJSON
  | GlobalConfigOption.BlockSwapRewardsJSON
  | GlobalConfigOption.BlockSwapUnevenVaultsJSON
  | GlobalConfigOption.FeesBpsJSON
  | GlobalConfigOption.SwapDiscountBpsJSON
  | GlobalConfigOption.ActionsAuthorityJSON
  | GlobalConfigOption.TreasuryFeeVaultsJSON
  | GlobalConfigOption.AdminAuthorityJSON
  | GlobalConfigOption.BlockEmergencySwapJSON
  | GlobalConfigOption.BlockLocalAdminJSON
  | GlobalConfigOption.UpdateTokenInfosJSON
  | GlobalConfigOption.ScopeProgramIdJSON
  | GlobalConfigOption.ScopePriceIdJSON
  | GlobalConfigOption.MinPerformanceFeeBpsJSON

export { StrategyConfigOption }

export type StrategyConfigOptionKind =
  | StrategyConfigOption.UpdateDepositCap
  | StrategyConfigOption.UpdateDepositCapIxn
  | StrategyConfigOption.UpdateWithdrawalCapACapacity
  | StrategyConfigOption.UpdateWithdrawalCapAInterval
  | StrategyConfigOption.UpdateWithdrawalCapACurrentTotal
  | StrategyConfigOption.UpdateWithdrawalCapBCapacity
  | StrategyConfigOption.UpdateWithdrawalCapBInterval
  | StrategyConfigOption.UpdateWithdrawalCapBCurrentTotal
  | StrategyConfigOption.UpdateMaxDeviationBps
  | StrategyConfigOption.UpdateSwapVaultMaxSlippage
  | StrategyConfigOption.UpdateStrategyType
  | StrategyConfigOption.UpdateDepositFee
  | StrategyConfigOption.UpdateWithdrawFee
  | StrategyConfigOption.UpdateCollectFeesFee
  | StrategyConfigOption.UpdateReward0Fee
  | StrategyConfigOption.UpdateReward1Fee
  | StrategyConfigOption.UpdateReward2Fee
  | StrategyConfigOption.UpdateAdminAuthority
  | StrategyConfigOption.KaminoRewardIndex0TS
  | StrategyConfigOption.KaminoRewardIndex1TS
  | StrategyConfigOption.KaminoRewardIndex2TS
  | StrategyConfigOption.KaminoRewardIndex0RewardPerSecond
  | StrategyConfigOption.KaminoRewardIndex1RewardPerSecond
  | StrategyConfigOption.KaminoRewardIndex2RewardPerSecond
  | StrategyConfigOption.UpdateDepositBlocked
  | StrategyConfigOption.UpdateRaydiumProtocolPositionOrBaseVaultAuthority
  | StrategyConfigOption.UpdateRaydiumPoolConfigOrBaseVaultAuthority
  | StrategyConfigOption.UpdateInvestBlocked
  | StrategyConfigOption.UpdateWithdrawBlocked
  | StrategyConfigOption.UpdateLocalAdminBlocked
  | StrategyConfigOption.UpdateCollateralIdA
  | StrategyConfigOption.UpdateCollateralIdB
  | StrategyConfigOption.UpdateFlashVaultSwap
  | StrategyConfigOption.AllowDepositWithoutInvest
  | StrategyConfigOption.UpdateSwapVaultMaxSlippageFromRef
  | StrategyConfigOption.ResetReferencePrices
  | StrategyConfigOption.UpdateStrategyCreationState
  | StrategyConfigOption.UpdateIsCommunity
  | StrategyConfigOption.UpdateRebalanceType
  | StrategyConfigOption.UpdateRebalanceParams
  | StrategyConfigOption.UpdateDepositMintingMethod
  | StrategyConfigOption.UpdateLookupTable
  | StrategyConfigOption.UpdateReferencePriceType
  | StrategyConfigOption.UpdateReward0Amount
  | StrategyConfigOption.UpdateReward1Amount
  | StrategyConfigOption.UpdateReward2Amount
export type StrategyConfigOptionJSON =
  | StrategyConfigOption.UpdateDepositCapJSON
  | StrategyConfigOption.UpdateDepositCapIxnJSON
  | StrategyConfigOption.UpdateWithdrawalCapACapacityJSON
  | StrategyConfigOption.UpdateWithdrawalCapAIntervalJSON
  | StrategyConfigOption.UpdateWithdrawalCapACurrentTotalJSON
  | StrategyConfigOption.UpdateWithdrawalCapBCapacityJSON
  | StrategyConfigOption.UpdateWithdrawalCapBIntervalJSON
  | StrategyConfigOption.UpdateWithdrawalCapBCurrentTotalJSON
  | StrategyConfigOption.UpdateMaxDeviationBpsJSON
  | StrategyConfigOption.UpdateSwapVaultMaxSlippageJSON
  | StrategyConfigOption.UpdateStrategyTypeJSON
  | StrategyConfigOption.UpdateDepositFeeJSON
  | StrategyConfigOption.UpdateWithdrawFeeJSON
  | StrategyConfigOption.UpdateCollectFeesFeeJSON
  | StrategyConfigOption.UpdateReward0FeeJSON
  | StrategyConfigOption.UpdateReward1FeeJSON
  | StrategyConfigOption.UpdateReward2FeeJSON
  | StrategyConfigOption.UpdateAdminAuthorityJSON
  | StrategyConfigOption.KaminoRewardIndex0TSJSON
  | StrategyConfigOption.KaminoRewardIndex1TSJSON
  | StrategyConfigOption.KaminoRewardIndex2TSJSON
  | StrategyConfigOption.KaminoRewardIndex0RewardPerSecondJSON
  | StrategyConfigOption.KaminoRewardIndex1RewardPerSecondJSON
  | StrategyConfigOption.KaminoRewardIndex2RewardPerSecondJSON
  | StrategyConfigOption.UpdateDepositBlockedJSON
  | StrategyConfigOption.UpdateRaydiumProtocolPositionOrBaseVaultAuthorityJSON
  | StrategyConfigOption.UpdateRaydiumPoolConfigOrBaseVaultAuthorityJSON
  | StrategyConfigOption.UpdateInvestBlockedJSON
  | StrategyConfigOption.UpdateWithdrawBlockedJSON
  | StrategyConfigOption.UpdateLocalAdminBlockedJSON
  | StrategyConfigOption.UpdateCollateralIdAJSON
  | StrategyConfigOption.UpdateCollateralIdBJSON
  | StrategyConfigOption.UpdateFlashVaultSwapJSON
  | StrategyConfigOption.AllowDepositWithoutInvestJSON
  | StrategyConfigOption.UpdateSwapVaultMaxSlippageFromRefJSON
  | StrategyConfigOption.ResetReferencePricesJSON
  | StrategyConfigOption.UpdateStrategyCreationStateJSON
  | StrategyConfigOption.UpdateIsCommunityJSON
  | StrategyConfigOption.UpdateRebalanceTypeJSON
  | StrategyConfigOption.UpdateRebalanceParamsJSON
  | StrategyConfigOption.UpdateDepositMintingMethodJSON
  | StrategyConfigOption.UpdateLookupTableJSON
  | StrategyConfigOption.UpdateReferencePriceTypeJSON
  | StrategyConfigOption.UpdateReward0AmountJSON
  | StrategyConfigOption.UpdateReward1AmountJSON
  | StrategyConfigOption.UpdateReward2AmountJSON

export { StrategyStatus }

export type StrategyStatusKind =
  | StrategyStatus.Uninitialized
  | StrategyStatus.Active
  | StrategyStatus.Frozen
  | StrategyStatus.Rebalancing
  | StrategyStatus.NoPosition
export type StrategyStatusJSON =
  | StrategyStatus.UninitializedJSON
  | StrategyStatus.ActiveJSON
  | StrategyStatus.FrozenJSON
  | StrategyStatus.RebalancingJSON
  | StrategyStatus.NoPositionJSON

export { StrategyType }

export type StrategyTypeKind =
  | StrategyType.Stable
  | StrategyType.Pegged
  | StrategyType.Volatile
export type StrategyTypeJSON =
  | StrategyType.StableJSON
  | StrategyType.PeggedJSON
  | StrategyType.VolatileJSON

export { CreationStatus }

export type CreationStatusKind =
  | CreationStatus.IGNORED
  | CreationStatus.SHADOW
  | CreationStatus.LIVE
  | CreationStatus.DEPRECATED
  | CreationStatus.STAGING
export type CreationStatusJSON =
  | CreationStatus.IGNOREDJSON
  | CreationStatus.SHADOWJSON
  | CreationStatus.LIVEJSON
  | CreationStatus.DEPRECATEDJSON
  | CreationStatus.STAGINGJSON

export { ExecutiveWithdrawAction }

export type ExecutiveWithdrawActionKind =
  | ExecutiveWithdrawAction.Freeze
  | ExecutiveWithdrawAction.Unfreeze
  | ExecutiveWithdrawAction.Rebalance
export type ExecutiveWithdrawActionJSON =
  | ExecutiveWithdrawAction.FreezeJSON
  | ExecutiveWithdrawAction.UnfreezeJSON
  | ExecutiveWithdrawAction.RebalanceJSON

export { ReferencePriceType }

export type ReferencePriceTypeKind =
  | ReferencePriceType.POOL
  | ReferencePriceType.TWAP
export type ReferencePriceTypeJSON =
  | ReferencePriceType.POOLJSON
  | ReferencePriceType.TWAPJSON

export { LiquidityCalculationMode }

export type LiquidityCalculationModeKind =
  | LiquidityCalculationMode.Deposit
  | LiquidityCalculationMode.Withdraw
export type LiquidityCalculationModeJSON =
  | LiquidityCalculationMode.DepositJSON
  | LiquidityCalculationMode.WithdrawJSON

export { UpdateCollateralInfoMode }

export type UpdateCollateralInfoModeKind =
  | UpdateCollateralInfoMode.CollateralId
  | UpdateCollateralInfoMode.LowerHeuristic
  | UpdateCollateralInfoMode.UpperHeuristic
  | UpdateCollateralInfoMode.ExpHeuristic
  | UpdateCollateralInfoMode.TwapDivergence
  | UpdateCollateralInfoMode.UpdateScopeTwap
  | UpdateCollateralInfoMode.UpdateScopeChain
  | UpdateCollateralInfoMode.UpdateName
  | UpdateCollateralInfoMode.UpdatePriceMaxAge
  | UpdateCollateralInfoMode.UpdateTwapMaxAge
  | UpdateCollateralInfoMode.UpdateDisabled
export type UpdateCollateralInfoModeJSON =
  | UpdateCollateralInfoMode.CollateralIdJSON
  | UpdateCollateralInfoMode.LowerHeuristicJSON
  | UpdateCollateralInfoMode.UpperHeuristicJSON
  | UpdateCollateralInfoMode.ExpHeuristicJSON
  | UpdateCollateralInfoMode.TwapDivergenceJSON
  | UpdateCollateralInfoMode.UpdateScopeTwapJSON
  | UpdateCollateralInfoMode.UpdateScopeChainJSON
  | UpdateCollateralInfoMode.UpdateNameJSON
  | UpdateCollateralInfoMode.UpdatePriceMaxAgeJSON
  | UpdateCollateralInfoMode.UpdateTwapMaxAgeJSON
  | UpdateCollateralInfoMode.UpdateDisabledJSON

export { BalanceStatus }

export type BalanceStatusKind =
  | BalanceStatus.Balanced
  | BalanceStatus.Unbalanced
export type BalanceStatusJSON =
  | BalanceStatus.BalancedJSON
  | BalanceStatus.UnbalancedJSON

export { DriftDirection }

export type DriftDirectionKind =
  | DriftDirection.Increasing
  | DriftDirection.Decreasing
export type DriftDirectionJSON =
  | DriftDirection.IncreasingJSON
  | DriftDirection.DecreasingJSON

export { RebalanceDriftStep }

export type RebalanceDriftStepKind =
  | RebalanceDriftStep.Uninitialized
  | RebalanceDriftStep.Drifting
export type RebalanceDriftStepJSON =
  | RebalanceDriftStep.UninitializedJSON
  | RebalanceDriftStep.DriftingJSON

export { RebalanceTakeProfitToken }

export type RebalanceTakeProfitTokenKind =
  | RebalanceTakeProfitToken.A
  | RebalanceTakeProfitToken.B
export type RebalanceTakeProfitTokenJSON =
  | RebalanceTakeProfitToken.AJSON
  | RebalanceTakeProfitToken.BJSON

export { RebalanceTakeProfitStep }

export type RebalanceTakeProfitStepKind =
  | RebalanceTakeProfitStep.Uninitialized
  | RebalanceTakeProfitStep.TakingProfit
  | RebalanceTakeProfitStep.Finished
export type RebalanceTakeProfitStepJSON =
  | RebalanceTakeProfitStep.UninitializedJSON
  | RebalanceTakeProfitStep.TakingProfitJSON
  | RebalanceTakeProfitStep.FinishedJSON

export { RebalanceAction }

export type RebalanceActionKind =
  | RebalanceAction.NewSqrtPriceRange
  | RebalanceAction.NewTickRange
  | RebalanceAction.WithdrawAndFreeze
export type RebalanceActionJSON =
  | RebalanceAction.NewSqrtPriceRangeJSON
  | RebalanceAction.NewTickRangeJSON
  | RebalanceAction.WithdrawAndFreezeJSON

export { RebalanceType }

export type RebalanceTypeKind =
  | RebalanceType.Manual
  | RebalanceType.PricePercentage
  | RebalanceType.PricePercentageWithReset
  | RebalanceType.Drift
  | RebalanceType.TakeProfit
  | RebalanceType.PeriodicRebalance
export type RebalanceTypeJSON =
  | RebalanceType.ManualJSON
  | RebalanceType.PricePercentageJSON
  | RebalanceType.PricePercentageWithResetJSON
  | RebalanceType.DriftJSON
  | RebalanceType.TakeProfitJSON
  | RebalanceType.PeriodicRebalanceJSON

export { CollateralTestToken }

export type CollateralTestTokenKind =
  | CollateralTestToken.USDC
  | CollateralTestToken.USDH
  | CollateralTestToken.SOL
  | CollateralTestToken.ETH
  | CollateralTestToken.BTC
  | CollateralTestToken.MSOL
  | CollateralTestToken.STSOL
  | CollateralTestToken.USDT
  | CollateralTestToken.ORCA
  | CollateralTestToken.MNDE
  | CollateralTestToken.HBB
  | CollateralTestToken.JSOL
  | CollateralTestToken.USH
  | CollateralTestToken.DAI
  | CollateralTestToken.LDO
  | CollateralTestToken.SCNSOL
  | CollateralTestToken.UXD
  | CollateralTestToken.HDG
  | CollateralTestToken.DUST
  | CollateralTestToken.USDR
  | CollateralTestToken.RATIO
  | CollateralTestToken.UXP
  | CollateralTestToken.JITOSOL
  | CollateralTestToken.RAY
  | CollateralTestToken.BONK
  | CollateralTestToken.SAMO
  | CollateralTestToken.LaineSOL
  | CollateralTestToken.BSOL
export type CollateralTestTokenJSON =
  | CollateralTestToken.USDCJSON
  | CollateralTestToken.USDHJSON
  | CollateralTestToken.SOLJSON
  | CollateralTestToken.ETHJSON
  | CollateralTestToken.BTCJSON
  | CollateralTestToken.MSOLJSON
  | CollateralTestToken.STSOLJSON
  | CollateralTestToken.USDTJSON
  | CollateralTestToken.ORCAJSON
  | CollateralTestToken.MNDEJSON
  | CollateralTestToken.HBBJSON
  | CollateralTestToken.JSOLJSON
  | CollateralTestToken.USHJSON
  | CollateralTestToken.DAIJSON
  | CollateralTestToken.LDOJSON
  | CollateralTestToken.SCNSOLJSON
  | CollateralTestToken.UXDJSON
  | CollateralTestToken.HDGJSON
  | CollateralTestToken.DUSTJSON
  | CollateralTestToken.USDRJSON
  | CollateralTestToken.RATIOJSON
  | CollateralTestToken.UXPJSON
  | CollateralTestToken.JITOSOLJSON
  | CollateralTestToken.RAYJSON
  | CollateralTestToken.BONKJSON
  | CollateralTestToken.SAMOJSON
  | CollateralTestToken.LaineSOLJSON
  | CollateralTestToken.BSOLJSON

export { ScopePriceIdTest }

export type ScopePriceIdTestKind =
  | ScopePriceIdTest.SOL
  | ScopePriceIdTest.ETH
  | ScopePriceIdTest.BTC
  | ScopePriceIdTest.SRM
  | ScopePriceIdTest.RAY
  | ScopePriceIdTest.FTT
  | ScopePriceIdTest.MSOL
  | ScopePriceIdTest.scnSOL_SOL
  | ScopePriceIdTest.BNB
  | ScopePriceIdTest.AVAX
  | ScopePriceIdTest.DaoSOL_SOL
  | ScopePriceIdTest.SaberMSOL_SOL
  | ScopePriceIdTest.USDH
  | ScopePriceIdTest.StSOL
  | ScopePriceIdTest.CSOL_SOL
  | ScopePriceIdTest.CETH_ETH
  | ScopePriceIdTest.CBTC_BTC
  | ScopePriceIdTest.CMSOL_SOL
  | ScopePriceIdTest.wstETH
  | ScopePriceIdTest.LDO
  | ScopePriceIdTest.USDC
  | ScopePriceIdTest.CUSDC_USDC
  | ScopePriceIdTest.USDT
  | ScopePriceIdTest.ORCA
  | ScopePriceIdTest.MNDE
  | ScopePriceIdTest.HBB
  | ScopePriceIdTest.CORCA_ORCA
  | ScopePriceIdTest.CSLND_SLND
  | ScopePriceIdTest.CSRM_SRM
  | ScopePriceIdTest.CRAY_RAY
  | ScopePriceIdTest.CFTT_FTT
  | ScopePriceIdTest.CSTSOL_STSOL
  | ScopePriceIdTest.SLND
  | ScopePriceIdTest.DAI
  | ScopePriceIdTest.JSOL_SOL
  | ScopePriceIdTest.USH
  | ScopePriceIdTest.UXD
  | ScopePriceIdTest.USDH_TWAP
  | ScopePriceIdTest.USH_TWAP
  | ScopePriceIdTest.UXD_TWAP
  | ScopePriceIdTest.HDG
  | ScopePriceIdTest.DUST
  | ScopePriceIdTest.USDR
  | ScopePriceIdTest.USDR_TWAP
  | ScopePriceIdTest.RATIO
  | ScopePriceIdTest.UXP
  | ScopePriceIdTest.KUXDUSDCORCA
  | ScopePriceIdTest.JITOSOL_SOL
  | ScopePriceIdTest.SOL_EMA
  | ScopePriceIdTest.ETH_EMA
  | ScopePriceIdTest.BTC_EMA
  | ScopePriceIdTest.SRM_EMA
  | ScopePriceIdTest.RAY_EMA
  | ScopePriceIdTest.FTT_EMA
  | ScopePriceIdTest.MSOL_EMA
  | ScopePriceIdTest.BNB_EMA
  | ScopePriceIdTest.AVAX_EMA
  | ScopePriceIdTest.STSOL_EMA
  | ScopePriceIdTest.USDC_EMA
  | ScopePriceIdTest.USDT_EMA
  | ScopePriceIdTest.SLND_EMA
  | ScopePriceIdTest.DAI_EMA
  | ScopePriceIdTest.wstETH_TWAP
  | ScopePriceIdTest.DUST_TWAP
  | ScopePriceIdTest.BONK
  | ScopePriceIdTest.BONK_TWAP
  | ScopePriceIdTest.SAMO
  | ScopePriceIdTest.SAMO_TWAP
  | ScopePriceIdTest.BSOL
  | ScopePriceIdTest.LaineSOL
export type ScopePriceIdTestJSON =
  | ScopePriceIdTest.SOLJSON
  | ScopePriceIdTest.ETHJSON
  | ScopePriceIdTest.BTCJSON
  | ScopePriceIdTest.SRMJSON
  | ScopePriceIdTest.RAYJSON
  | ScopePriceIdTest.FTTJSON
  | ScopePriceIdTest.MSOLJSON
  | ScopePriceIdTest.scnSOL_SOLJSON
  | ScopePriceIdTest.BNBJSON
  | ScopePriceIdTest.AVAXJSON
  | ScopePriceIdTest.DaoSOL_SOLJSON
  | ScopePriceIdTest.SaberMSOL_SOLJSON
  | ScopePriceIdTest.USDHJSON
  | ScopePriceIdTest.StSOLJSON
  | ScopePriceIdTest.CSOL_SOLJSON
  | ScopePriceIdTest.CETH_ETHJSON
  | ScopePriceIdTest.CBTC_BTCJSON
  | ScopePriceIdTest.CMSOL_SOLJSON
  | ScopePriceIdTest.wstETHJSON
  | ScopePriceIdTest.LDOJSON
  | ScopePriceIdTest.USDCJSON
  | ScopePriceIdTest.CUSDC_USDCJSON
  | ScopePriceIdTest.USDTJSON
  | ScopePriceIdTest.ORCAJSON
  | ScopePriceIdTest.MNDEJSON
  | ScopePriceIdTest.HBBJSON
  | ScopePriceIdTest.CORCA_ORCAJSON
  | ScopePriceIdTest.CSLND_SLNDJSON
  | ScopePriceIdTest.CSRM_SRMJSON
  | ScopePriceIdTest.CRAY_RAYJSON
  | ScopePriceIdTest.CFTT_FTTJSON
  | ScopePriceIdTest.CSTSOL_STSOLJSON
  | ScopePriceIdTest.SLNDJSON
  | ScopePriceIdTest.DAIJSON
  | ScopePriceIdTest.JSOL_SOLJSON
  | ScopePriceIdTest.USHJSON
  | ScopePriceIdTest.UXDJSON
  | ScopePriceIdTest.USDH_TWAPJSON
  | ScopePriceIdTest.USH_TWAPJSON
  | ScopePriceIdTest.UXD_TWAPJSON
  | ScopePriceIdTest.HDGJSON
  | ScopePriceIdTest.DUSTJSON
  | ScopePriceIdTest.USDRJSON
  | ScopePriceIdTest.USDR_TWAPJSON
  | ScopePriceIdTest.RATIOJSON
  | ScopePriceIdTest.UXPJSON
  | ScopePriceIdTest.KUXDUSDCORCAJSON
  | ScopePriceIdTest.JITOSOL_SOLJSON
  | ScopePriceIdTest.SOL_EMAJSON
  | ScopePriceIdTest.ETH_EMAJSON
  | ScopePriceIdTest.BTC_EMAJSON
  | ScopePriceIdTest.SRM_EMAJSON
  | ScopePriceIdTest.RAY_EMAJSON
  | ScopePriceIdTest.FTT_EMAJSON
  | ScopePriceIdTest.MSOL_EMAJSON
  | ScopePriceIdTest.BNB_EMAJSON
  | ScopePriceIdTest.AVAX_EMAJSON
  | ScopePriceIdTest.STSOL_EMAJSON
  | ScopePriceIdTest.USDC_EMAJSON
  | ScopePriceIdTest.USDT_EMAJSON
  | ScopePriceIdTest.SLND_EMAJSON
  | ScopePriceIdTest.DAI_EMAJSON
  | ScopePriceIdTest.wstETH_TWAPJSON
  | ScopePriceIdTest.DUST_TWAPJSON
  | ScopePriceIdTest.BONKJSON
  | ScopePriceIdTest.BONK_TWAPJSON
  | ScopePriceIdTest.SAMOJSON
  | ScopePriceIdTest.SAMO_TWAPJSON
  | ScopePriceIdTest.BSOLJSON
  | ScopePriceIdTest.LaineSOLJSON

export { DEX }

export type DEXKind = DEX.Orca | DEX.Raydium | DEX.Crema
export type DEXJSON = DEX.OrcaJSON | DEX.RaydiumJSON | DEX.CremaJSON
