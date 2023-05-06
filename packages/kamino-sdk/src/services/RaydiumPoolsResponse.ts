import { AmmV3ConfigInfo } from '@raydium-io/raydium-sdk';

export interface RaydiumPoolsResponse {
  data: Pool[];
}

export interface Pool {
  id: string;
  mintA: string;
  mintB: string;
  vaultA: string;
  vaultB: string;
  mintDecimalsA: number;
  mintDecimalsB: number;
  ammConfig: AmmV3ConfigInfo;
  tvl: number;
  day: Day;
  week: Week;
  month: Month;
  lookupTableAccount: string;
  price: number;
}

export interface AmmConfig {
  id: string;
  index: number;
  protocolFeeRate: number;
  tradeFeeRate: number;
  tickSpacing: number;
  fundFeeRate: number;
  fundOwner: string;
  description: string;
}

export interface Day {
  volume: number;
  volumeFee: number;
  feeA: number;
  feeB: number;
  feeApr: number;
  rewardApr: RewardApr;
  apr: number;
  priceMin: number;
  priceMax: number;
}

export interface RewardApr {
  A: number;
  B: number;
  C: number;
}

export interface Week {
  volume: number;
  volumeFee: number;
  feeA: number;
  feeB: number;
  feeApr: number;
  rewardApr: RewardApr2;
  apr: number;
  priceMin: number;
  priceMax: number;
}

export interface RewardApr2 {
  A: number;
  B: number;
  C: number;
}

export interface Month {
  volume: number;
  volumeFee: number;
  feeA: number;
  feeB: number;
  feeApr: number;
  rewardApr: RewardApr3;
  apr: number;
  priceMin: number;
  priceMax: number;
}

export interface RewardApr3 {
  A: number;
  B: number;
  C: number;
}
