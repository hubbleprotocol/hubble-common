import Decimal from 'decimal.js';

// Number of lamports per SOL
export const LAMPORTS_PER_SOL = 1_000_000_000;
// Number of lamports per mSOL
export const LAMPORTS_PER_MSOL = 1_000_000_000;
// Number of decimals for ETH
export const DECIMALS_ETH = 1_000_000_00;
// Number of decimals for BTC
export const DECIMALS_BTC = 1_000_000;
// Number of decimals for FTT
export const DECIMALS_FTT = 1_000_000;
// Number of decimals for RAY
export const DECIMALS_RAY = 1_000_000;
// Number of decimals for SRM
export const DECIMALS_SRM = 1_000_000;
// Number of decimals for USDC
export const DECIMALS_USDC = 1_000_000;
// Number of decimals for HBB
export const HBB_DECIMALS = 1_000_000;
// Number of decimals for USDH (stablecoin)
export const STABLECOIN_DECIMALS = 1_000_000;
// Stability provider scale factor
export const SCALE_FACTOR = 1_000_000_000;
// Decimal factor used with debt
export const DECIMAL_FACTOR = new Decimal('1000000000000000');
// Number of epoch to scale to sum tokens
export const EPOCH_TO_SCALE_TO_SUM_TOKENS = 24;
