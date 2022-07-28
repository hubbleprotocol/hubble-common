import * as VaultError from "./VaultError"
import * as LiquidityCalculationMode from "./LiquidityCalculationMode"
import * as ScopePriceId from "./ScopePriceId"
import * as CollateralToken from "./CollateralToken"
import * as GlobalConfigOption from "./GlobalConfigOption"
import * as StrategyStatus from "./StrategyStatus"
import * as ExecutiveWithdrawAction from "./ExecutiveWithdrawAction"

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
export { Price } from "./Price"
export type { PriceFields, PriceJSON } from "./Price"
export { VaultError }

export type VaultErrorKind =
  | VaultError.IntegerOverflow
  | VaultError.OperationForbidden
  | VaultError.ZeroAmount
  | VaultError.UnableToDeserializeAccount
  | VaultError.VaultBalanceDoesNotMatchTokenA
  | VaultError.VaultBalanceDoesNotMatchTokenB
  | VaultError.SharesIssuedAmountDoesNotMatch
  | VaultError.GlobalConfigKeyError
  | VaultError.SystemInEmergencyMode
  | VaultError.DepositBlocked
  | VaultError.WithdrawBlocked
  | VaultError.InvestBlocked
  | VaultError.OutOfRangeIntegralConversion
  | VaultError.MathOverflow
  | VaultError.TooMuchLiquidityToWithdraw
  | VaultError.DepositAmountsZero
  | VaultError.SharesZero
  | VaultError.StrategyNotActive
  | VaultError.UnharvestedAmounts
  | VaultError.InvalidRewardMapping
  | VaultError.InvalidRewardIndex
  | VaultError.OwnRewardUninitialized
  | VaultError.PriceNotValid
  | VaultError.SwapRewardImbalanced
  | VaultError.SwapRewardTooSmall
  | VaultError.SwapRewardLessThanRequested
  | VaultError.SwapRewardLessThanMinimum
  | VaultError.WrongDiscriminator
  | VaultError.WrongMint
  | VaultError.WrongVault
  | VaultError.SwapAmountsZero
  | VaultError.PriceTooOld
  | VaultError.CannotInvestZeroAmount
  | VaultError.MaxInvestableZero
  | VaultError.CollectFeesBlocked
  | VaultError.CollectRewardsBlocked
  | VaultError.SwapRewardsBlocked
  | VaultError.WrongRewardCollateralID
  | VaultError.InvalidPositionAccount
  | VaultError.CouldNotDeserializeScope
  | VaultError.WrongCollateralID
  | VaultError.CollateralTokensExceedDepositCap
  | VaultError.SwapUnevenVaultsBlocked
  | VaultError.VaultsAreAlreadyBalanced
export type VaultErrorJSON =
  | VaultError.IntegerOverflowJSON
  | VaultError.OperationForbiddenJSON
  | VaultError.ZeroAmountJSON
  | VaultError.UnableToDeserializeAccountJSON
  | VaultError.VaultBalanceDoesNotMatchTokenAJSON
  | VaultError.VaultBalanceDoesNotMatchTokenBJSON
  | VaultError.SharesIssuedAmountDoesNotMatchJSON
  | VaultError.GlobalConfigKeyErrorJSON
  | VaultError.SystemInEmergencyModeJSON
  | VaultError.DepositBlockedJSON
  | VaultError.WithdrawBlockedJSON
  | VaultError.InvestBlockedJSON
  | VaultError.OutOfRangeIntegralConversionJSON
  | VaultError.MathOverflowJSON
  | VaultError.TooMuchLiquidityToWithdrawJSON
  | VaultError.DepositAmountsZeroJSON
  | VaultError.SharesZeroJSON
  | VaultError.StrategyNotActiveJSON
  | VaultError.UnharvestedAmountsJSON
  | VaultError.InvalidRewardMappingJSON
  | VaultError.InvalidRewardIndexJSON
  | VaultError.OwnRewardUninitializedJSON
  | VaultError.PriceNotValidJSON
  | VaultError.SwapRewardImbalancedJSON
  | VaultError.SwapRewardTooSmallJSON
  | VaultError.SwapRewardLessThanRequestedJSON
  | VaultError.SwapRewardLessThanMinimumJSON
  | VaultError.WrongDiscriminatorJSON
  | VaultError.WrongMintJSON
  | VaultError.WrongVaultJSON
  | VaultError.SwapAmountsZeroJSON
  | VaultError.PriceTooOldJSON
  | VaultError.CannotInvestZeroAmountJSON
  | VaultError.MaxInvestableZeroJSON
  | VaultError.CollectFeesBlockedJSON
  | VaultError.CollectRewardsBlockedJSON
  | VaultError.SwapRewardsBlockedJSON
  | VaultError.WrongRewardCollateralIDJSON
  | VaultError.InvalidPositionAccountJSON
  | VaultError.CouldNotDeserializeScopeJSON
  | VaultError.WrongCollateralIDJSON
  | VaultError.CollateralTokensExceedDepositCapJSON
  | VaultError.SwapUnevenVaultsBlockedJSON
  | VaultError.VaultsAreAlreadyBalancedJSON

export { LiquidityCalculationMode }

export type LiquidityCalculationModeKind =
  | LiquidityCalculationMode.Deposit
  | LiquidityCalculationMode.Withdraw
export type LiquidityCalculationModeJSON =
  | LiquidityCalculationMode.DepositJSON
  | LiquidityCalculationMode.WithdrawJSON

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
  | GlobalConfigOption.ScopeProgramIdJSON
  | GlobalConfigOption.ScopePriceIdJSON

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

export { ExecutiveWithdrawAction }

export type ExecutiveWithdrawActionKind =
  | ExecutiveWithdrawAction.Freeze
  | ExecutiveWithdrawAction.Unfreeze
  | ExecutiveWithdrawAction.Rebalance
export type ExecutiveWithdrawActionJSON =
  | ExecutiveWithdrawAction.FreezeJSON
  | ExecutiveWithdrawAction.UnfreezeJSON
  | ExecutiveWithdrawAction.RebalanceJSON
