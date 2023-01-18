import * as WithdrawalCapAction from "./WithdrawalCapAction"
import * as WithdrawalCapOverflowAction from "./WithdrawalCapOverflowAction"
import * as WithdrawalCapAccumulatorAction from "./WithdrawalCapAccumulatorAction"
import * as SwapLimit from "./SwapLimit"
import * as CollateralToken from "./CollateralToken"
import * as GlobalConfigOption from "./GlobalConfigOption"
import * as StrategyConfigOption from "./StrategyConfigOption"
import * as StrategyStatus from "./StrategyStatus"
import * as StrategyType from "./StrategyType"
import * as ExecutiveWithdrawAction from "./ExecutiveWithdrawAction"
import * as LiquidityCalculationMode from "./LiquidityCalculationMode"
import * as UpdateCollateralInfoMode from "./UpdateCollateralInfoMode"
import * as ScopePriceId from "./ScopePriceId"
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
export { Tick } from "./Tick"
export type { TickFields, TickJSON } from "./Tick"
export { RewardInfo } from "./RewardInfo"
export type { RewardInfoFields, RewardInfoJSON } from "./RewardInfo"
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
export { WithdrawalCapAction }

export type WithdrawalCapActionKind =
  | WithdrawalCapAction.Add
  | WithdrawalCapAction.Remove
export type WithdrawalCapActionJSON =
  | WithdrawalCapAction.AddJSON
  | WithdrawalCapAction.RemoveJSON

export { WithdrawalCapOverflowAction }

export type WithdrawalCapOverflowActionKind =
  | WithdrawalCapOverflowAction.SaturatingOverflow
  | WithdrawalCapOverflowAction.ErrorOnOverflow
export type WithdrawalCapOverflowActionJSON =
  | WithdrawalCapOverflowAction.SaturatingOverflowJSON
  | WithdrawalCapOverflowAction.ErrorOnOverflowJSON

export { WithdrawalCapAccumulatorAction }

export type WithdrawalCapAccumulatorActionKind =
  | WithdrawalCapAccumulatorAction.KeepAccumulator
  | WithdrawalCapAccumulatorAction.ResetAccumulator
export type WithdrawalCapAccumulatorActionJSON =
  | WithdrawalCapAccumulatorAction.KeepAccumulatorJSON
  | WithdrawalCapAccumulatorAction.ResetAccumulatorJSON

export { SwapLimit }

export type SwapLimitKind = SwapLimit.Bps | SwapLimit.Absolute
export type SwapLimitJSON = SwapLimit.BpsJSON | SwapLimit.AbsoluteJSON

export { CollateralToken }

export type CollateralTokenKind =
  | CollateralToken.USDC
  | CollateralToken.USDH
  | CollateralToken.SOL
  | CollateralToken.ETH
  | CollateralToken.BTC
  | CollateralToken.MSOL
  | CollateralToken.STSOL
  | CollateralToken.USDT
  | CollateralToken.ORCA
  | CollateralToken.MNDE
  | CollateralToken.HBB
  | CollateralToken.JSOL
  | CollateralToken.USH
  | CollateralToken.DAI
  | CollateralToken.LDO
  | CollateralToken.SCNSOL
  | CollateralToken.UXD
  | CollateralToken.HDG
  | CollateralToken.DUST
  | CollateralToken.USDR
  | CollateralToken.RATIO
  | CollateralToken.UXP
  | CollateralToken.JITOSOL
  | CollateralToken.RAY
  | CollateralToken.BONK
  | CollateralToken.SAMO
  | CollateralToken.LaineSOL
  | CollateralToken.BSOL
export type CollateralTokenJSON =
  | CollateralToken.USDCJSON
  | CollateralToken.USDHJSON
  | CollateralToken.SOLJSON
  | CollateralToken.ETHJSON
  | CollateralToken.BTCJSON
  | CollateralToken.MSOLJSON
  | CollateralToken.STSOLJSON
  | CollateralToken.USDTJSON
  | CollateralToken.ORCAJSON
  | CollateralToken.MNDEJSON
  | CollateralToken.HBBJSON
  | CollateralToken.JSOLJSON
  | CollateralToken.USHJSON
  | CollateralToken.DAIJSON
  | CollateralToken.LDOJSON
  | CollateralToken.SCNSOLJSON
  | CollateralToken.UXDJSON
  | CollateralToken.HDGJSON
  | CollateralToken.DUSTJSON
  | CollateralToken.USDRJSON
  | CollateralToken.RATIOJSON
  | CollateralToken.UXPJSON
  | CollateralToken.JITOSOLJSON
  | CollateralToken.RAYJSON
  | CollateralToken.BONKJSON
  | CollateralToken.SAMOJSON
  | CollateralToken.LaineSOLJSON
  | CollateralToken.BSOLJSON

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

export { StrategyStatus }

export type StrategyStatusKind =
  | StrategyStatus.Uninitialized
  | StrategyStatus.Active
  | StrategyStatus.Frozen
  | StrategyStatus.Rebalancing
export type StrategyStatusJSON =
  | StrategyStatus.UninitializedJSON
  | StrategyStatus.ActiveJSON
  | StrategyStatus.FrozenJSON
  | StrategyStatus.RebalancingJSON

export { StrategyType }

export type StrategyTypeKind =
  | StrategyType.Stable
  | StrategyType.Pegged
  | StrategyType.Volatile
export type StrategyTypeJSON =
  | StrategyType.StableJSON
  | StrategyType.PeggedJSON
  | StrategyType.VolatileJSON

export { ExecutiveWithdrawAction }

export type ExecutiveWithdrawActionKind =
  | ExecutiveWithdrawAction.Freeze
  | ExecutiveWithdrawAction.Unfreeze
  | ExecutiveWithdrawAction.Rebalance
export type ExecutiveWithdrawActionJSON =
  | ExecutiveWithdrawAction.FreezeJSON
  | ExecutiveWithdrawAction.UnfreezeJSON
  | ExecutiveWithdrawAction.RebalanceJSON

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
export type UpdateCollateralInfoModeJSON =
  | UpdateCollateralInfoMode.CollateralIdJSON
  | UpdateCollateralInfoMode.LowerHeuristicJSON
  | UpdateCollateralInfoMode.UpperHeuristicJSON
  | UpdateCollateralInfoMode.ExpHeuristicJSON
  | UpdateCollateralInfoMode.TwapDivergenceJSON

export { ScopePriceId }

export type ScopePriceIdKind =
  | ScopePriceId.SOL
  | ScopePriceId.ETH
  | ScopePriceId.BTC
  | ScopePriceId.SRM
  | ScopePriceId.RAY
  | ScopePriceId.FTT
  | ScopePriceId.MSOL
  | ScopePriceId.scnSOL_SOL
  | ScopePriceId.BNB
  | ScopePriceId.AVAX
  | ScopePriceId.DaoSOL_SOL
  | ScopePriceId.SaberMSOL_SOL
  | ScopePriceId.USDH
  | ScopePriceId.StSOL
  | ScopePriceId.CSOL_SOL
  | ScopePriceId.CETH_ETH
  | ScopePriceId.CBTC_BTC
  | ScopePriceId.CMSOL_SOL
  | ScopePriceId.wstETH
  | ScopePriceId.LDO
  | ScopePriceId.USDC
  | ScopePriceId.CUSDC_USDC
  | ScopePriceId.USDT
  | ScopePriceId.ORCA
  | ScopePriceId.MNDE
  | ScopePriceId.HBB
  | ScopePriceId.CORCA_ORCA
  | ScopePriceId.CSLND_SLND
  | ScopePriceId.CSRM_SRM
  | ScopePriceId.CRAY_RAY
  | ScopePriceId.CFTT_FTT
  | ScopePriceId.CSTSOL_STSOL
  | ScopePriceId.SLND
  | ScopePriceId.DAI
  | ScopePriceId.JSOL_SOL
  | ScopePriceId.USH
  | ScopePriceId.UXD
  | ScopePriceId.USDH_TWAP
  | ScopePriceId.USH_TWAP
  | ScopePriceId.UXD_TWAP
  | ScopePriceId.HDG
  | ScopePriceId.DUST
  | ScopePriceId.USDR
  | ScopePriceId.USDR_TWAP
  | ScopePriceId.RATIO
  | ScopePriceId.UXP
  | ScopePriceId.KUXDUSDCORCA
  | ScopePriceId.JITOSOL_SOL
  | ScopePriceId.SOL_EMA
  | ScopePriceId.ETH_EMA
  | ScopePriceId.BTC_EMA
  | ScopePriceId.SRM_EMA
  | ScopePriceId.RAY_EMA
  | ScopePriceId.FTT_EMA
  | ScopePriceId.MSOL_EMA
  | ScopePriceId.BNB_EMA
  | ScopePriceId.AVAX_EMA
  | ScopePriceId.STSOL_EMA
  | ScopePriceId.USDC_EMA
  | ScopePriceId.USDT_EMA
  | ScopePriceId.SLND_EMA
  | ScopePriceId.DAI_EMA
  | ScopePriceId.wstETH_TWAP
  | ScopePriceId.DUST_TWAP
  | ScopePriceId.BONK
  | ScopePriceId.BONK_TWAP
  | ScopePriceId.SAMO
  | ScopePriceId.SAMO_TWAP
  | ScopePriceId.BSOL
  | ScopePriceId.LaineSOL
export type ScopePriceIdJSON =
  | ScopePriceId.SOLJSON
  | ScopePriceId.ETHJSON
  | ScopePriceId.BTCJSON
  | ScopePriceId.SRMJSON
  | ScopePriceId.RAYJSON
  | ScopePriceId.FTTJSON
  | ScopePriceId.MSOLJSON
  | ScopePriceId.scnSOL_SOLJSON
  | ScopePriceId.BNBJSON
  | ScopePriceId.AVAXJSON
  | ScopePriceId.DaoSOL_SOLJSON
  | ScopePriceId.SaberMSOL_SOLJSON
  | ScopePriceId.USDHJSON
  | ScopePriceId.StSOLJSON
  | ScopePriceId.CSOL_SOLJSON
  | ScopePriceId.CETH_ETHJSON
  | ScopePriceId.CBTC_BTCJSON
  | ScopePriceId.CMSOL_SOLJSON
  | ScopePriceId.wstETHJSON
  | ScopePriceId.LDOJSON
  | ScopePriceId.USDCJSON
  | ScopePriceId.CUSDC_USDCJSON
  | ScopePriceId.USDTJSON
  | ScopePriceId.ORCAJSON
  | ScopePriceId.MNDEJSON
  | ScopePriceId.HBBJSON
  | ScopePriceId.CORCA_ORCAJSON
  | ScopePriceId.CSLND_SLNDJSON
  | ScopePriceId.CSRM_SRMJSON
  | ScopePriceId.CRAY_RAYJSON
  | ScopePriceId.CFTT_FTTJSON
  | ScopePriceId.CSTSOL_STSOLJSON
  | ScopePriceId.SLNDJSON
  | ScopePriceId.DAIJSON
  | ScopePriceId.JSOL_SOLJSON
  | ScopePriceId.USHJSON
  | ScopePriceId.UXDJSON
  | ScopePriceId.USDH_TWAPJSON
  | ScopePriceId.USH_TWAPJSON
  | ScopePriceId.UXD_TWAPJSON
  | ScopePriceId.HDGJSON
  | ScopePriceId.DUSTJSON
  | ScopePriceId.USDRJSON
  | ScopePriceId.USDR_TWAPJSON
  | ScopePriceId.RATIOJSON
  | ScopePriceId.UXPJSON
  | ScopePriceId.KUXDUSDCORCAJSON
  | ScopePriceId.JITOSOL_SOLJSON
  | ScopePriceId.SOL_EMAJSON
  | ScopePriceId.ETH_EMAJSON
  | ScopePriceId.BTC_EMAJSON
  | ScopePriceId.SRM_EMAJSON
  | ScopePriceId.RAY_EMAJSON
  | ScopePriceId.FTT_EMAJSON
  | ScopePriceId.MSOL_EMAJSON
  | ScopePriceId.BNB_EMAJSON
  | ScopePriceId.AVAX_EMAJSON
  | ScopePriceId.STSOL_EMAJSON
  | ScopePriceId.USDC_EMAJSON
  | ScopePriceId.USDT_EMAJSON
  | ScopePriceId.SLND_EMAJSON
  | ScopePriceId.DAI_EMAJSON
  | ScopePriceId.wstETH_TWAPJSON
  | ScopePriceId.DUST_TWAPJSON
  | ScopePriceId.BONKJSON
  | ScopePriceId.BONK_TWAPJSON
  | ScopePriceId.SAMOJSON
  | ScopePriceId.SAMO_TWAPJSON
  | ScopePriceId.BSOLJSON
  | ScopePriceId.LaineSOLJSON

export { DEX }

export type DEXKind = DEX.Orca | DEX.Raydium | DEX.Crema
export type DEXJSON = DEX.OrcaJSON | DEX.RaydiumJSON | DEX.CremaJSON
