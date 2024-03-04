export * from './ClusterEntity';
export * from './CollateralEntity';
export * from './LoanEntity';
export * from './OwnerEntity';
export * from './TokenEntity';
export * from './StabilityProviderEntity';
export * from './BorrowingMarketStateEntity';
export * from './StabilityPoolStateEntity';
export * from './StakingPoolStateEntity';
export * from './MetricsEntity';
export * from './UsdhEntity';
export * from './StrategyEntity';
export * from './ShareMintEntity';
export * from './ShareHolderEntity';
export * from './StrategyStateEntity';
export * from './WhirlpoolEntity';
export * from './WhirlpoolStateEntity';
export * from './DexTypeEntity';
export * from './VaultEntity';
export * from './RewardEntity';
export * from './RewardEarnedEntity';
export * from './PriceEntity';
export * from './TokenHistoryEntity';
export * from './TokenHistorySourceEntity';
export * from './TokenHistoryFieldEntity';
export * from './ProgramAccountEntity';
export * from './TokenMintEntity';
export * from './TradeAggregatorEntity';
export * from './TradeEntity';
export * from './TradeSourceEntity';
export * from './StrategyMetricsEntity';
export * from './TradePoolEntity';
export * from './SimulatorPoolEntity';
export * from './MetricsSourceEntity';
export * from './KlendMarketEntity';
export * from './KlendMarketStateEntity';
export * from './KlendObligationEntity';
export * from './KLendObligationStateEntity';
export * from './KlendReserveEntity';
export * from './KlendReserveStateEntity';
export * from './KaminoInstructionEntity';
export * from './InstructionEntity';
export * from './UserMetricsEntity';
export * from './PriceTypeEntity';
export * from './FarmEntity';
export * from './FarmStateEntity';
export * from './FarmUserEntity';
export * from './FarmUserStateEntity';
export * from './FarmRewardEntity';
export * from './KlendLeverageMetricsEntity';
export * from './PointsTotalEntity';
export * from './PointsKlendEntity';
export * from './PointsStrategiesEntity';
export * from './PointsSourceEntity';
export * from './KlendObligationTypeEntity';
export * from './StakedSolTokenEntity';
export * from './StablecoinTokenEntity';
export * from './PointsLeaderboardBlacklistEntity';
export * from './KlendInstructionEntity';
export * from './RawInstructionEntity';
export * from './YieldEntity';

export const CLUSTER_TABLE: string = 'cluster';
export const COLLATERAL_TABLE: string = 'collateral';
export const DEX_TYPE: string = 'dex_type';
export const LOAN_TABLE: string = 'loan';
export const OWNER_TABLE: string = 'owner';
export const VAULT_TABLE: string = 'vault';
export const TOKEN_TABLE: string = 'token';
export const METRICS_TABLE: string = 'metrics';
export const BORROWING_MARKET_STATE_TABLE: string = 'borrowing_market_state';
export const STABILITY_POOL_STATE_TABLE: string = 'stability_pool_state';
export const STAKING_POOL_STATE_TABLE: string = 'staking_pool_state';
export const STABILITY_PROVIDER_TABLE: string = 'stability_provider';
export const USDH_TABLE: string = 'usdh';
export const LIDO_USDH_DEBT_FUNCTION = 'get_lido_usdh_debt';
export const STRATEGY_TABLE: string = 'strategy';
export const SHARE_MINT_TABLE: string = 'share_mint';
export const STRATEGY_STATE_TABLE: string = 'strategy_state';
export const SHARE_HOLDER_TABLE: string = 'share_holder';
export const WHIRLPOOL_TABLE: string = 'whirlpool';
export const WHIRLPOOL_STATE_TABLE: string = 'whirlpool_state';
export const REWARD_TABLE = 'reward';
export const REWARD_EARNED_TABLE = 'reward_earned';
export const PRICE_TABLE = 'price';
export const TOKEN_HISTORY_TABLE = 'token_history';
export const TOKEN_HISTORY_FIELD_TABLE = 'token_history_field';
export const TOKEN_HISTORY_SOURCE_TABLE = 'token_history_source';
export const TRADE_TABLE = 'trade';
export const TOKEN_MINT_TABLE = 'token_mint';
export const PROGRAM_ACCOUNT_TABLE = 'program_account';
export const TRADE_AGGREGATOR_TABLE = 'trade_aggregator';
export const TRADE_SOURCE_TABLE = 'trade_source';
export const TRADE_POOL_TABLE = 'trade_pool';
export const STRATEGY_METRICS_TABLE = 'strategy_metrics';
export const SIMULATOR_POOL_TABLE = 'simulator_pool';
export const METRICS_SOURCE_TABLE = 'metrics_source';
export const KLEND_MARKET_TABLE = 'klend_market';
export const KLEND_RESERVE_TABLE = 'klend_reserve';
export const KLEND_OBLIGATION_TABLE = 'klend_obligation';
export const KLEND_MARKET_STATE_TABLE = 'klend_market_state';
export const KLEND_RESERVE_STATE_TABLE = 'klend_reserve_state';
export const KLEND_OBLIGATION_STATE_TABLE = 'klend_obligation_state';
export const INSTRUCTION_TABLE = 'instruction';
export const USER_METRICS_TABLE = 'user_metrics';
export const PRICE_TYPE_TABLE = 'price_type';
export const FARM_TABLE = 'farm';
export const FARM_STATE_TABLE = 'farm_state';
export const FARM_USER_TABLE = 'farm_user';
export const FARM_USER_STATE_TABLE = 'farm_user_state';
export const FARM_REWARD_TABLE = 'farm_reward_state';
export const KLEND_LEVERAGE_METRICS_TABLE = 'klend_leverage_metrics';
export const POINTS_SOURCE_TABLE = 'points_source';
export const KLEND_OBLIGATION_TYPE_TABLE = 'klend_obligation_type';
export const POINTS_STRATEGIES_TABLE = 'points_strategies';
export const POINTS_KLEND_TABLE = 'points_klend';
export const POINTS_TOTAL_TABLE = 'points_total';
export const POINTS_LEADERBOARD_TABLE = 'points_leaderboard';
export const STAKED_SOL_TOKEN_TABLE = 'staked_sol_token';
export const POINTS_LEADERBOARD_BLACKLIST_TABLE = 'points_leaderboard_blacklist';
export const STABLECOIN_TOKEN_TABLE = 'stablecoin_token';
export const RAW_INSTRUCTION_TABLE = 'raw_instruction';
export const KAMINO_INSTRUCTION_TABLE = 'kamino_instruction';
export const KLEND_INSTRUCTION_TABLE = 'klend_instruction';
export const YIELD_TABLE = 'yield';

export type RESAMPLE_FREQUENCY = 'hour' | 'day';
export const HOURLY_FREQUENCY = 'hour';
export const DAILY_FREQUENCY = 'day';
export const GET_OBLIGATION_STATE_RESAMPLED_TABLE = (frequency: RESAMPLE_FREQUENCY) => {
  if (frequency !== HOURLY_FREQUENCY && frequency !== DAILY_FREQUENCY) {
    throw Error(`Frequency ${frequency} not supported`);
  }
  return `klend_obligation_state_resampled_${frequency}`;
};

export const API_SCHEMA: string = 'api';
