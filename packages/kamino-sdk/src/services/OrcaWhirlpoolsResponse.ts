export interface OrcaWhirlpoolsResponse {
  whirlpools: Whirlpool[];
  hasMore: boolean;
}

export interface Whirlpool {
  address: string;
  tokenA: TokenA;
  tokenB: TokenB;
  whitelisted: boolean;
  tickSpacing: number;
  price: number;
  lpFeeRate: number;
  protocolFeeRate: number;
  whirlpoolsConfig: string;
  modifiedTimeMs?: number;
  tvl?: number;
  volume?: Volume;
  volumeDenominatedA?: VolumeDenominatedA;
  volumeDenominatedB?: VolumeDenominatedB;
  priceRange?: PriceRange;
  feeApr?: FeeApr;
  reward0Apr?: Reward0Apr;
  reward1Apr?: Reward1Apr;
  reward2Apr?: Reward2Apr;
  totalApr?: TotalApr;
}

export interface TokenA {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  coingeckoId?: string;
  whitelisted: boolean;
  poolToken: boolean;
  wrapper?: string;
}

export interface TokenB {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
  coingeckoId?: string;
  whitelisted: boolean;
  poolToken: boolean;
  wrapper?: string;
}

export interface Volume {
  day: number;
  week: number;
  month: number;
}

export interface VolumeDenominatedA {
  day: number;
  week: number;
  month: number;
}

export interface VolumeDenominatedB {
  day: number;
  week: number;
  month: number;
}

export interface PriceRange {
  day: Day;
  week: Week;
  month: Month;
}

export interface Day {
  min: number;
  max: number;
}

export interface Week {
  min: number;
  max: number;
}

export interface Month {
  min: number;
  max: number;
}

export interface FeeApr {
  day: number;
  week: number;
  month: number;
}

export interface Reward0Apr {
  day: number;
  week?: number;
  month?: number;
}

export interface Reward1Apr {
  day: number;
  week: number;
  month: number;
}

export interface Reward2Apr {
  day: number;
  week: number;
  month: number;
}

export interface TotalApr {
  day: number;
  week?: number;
  month?: number;
}
