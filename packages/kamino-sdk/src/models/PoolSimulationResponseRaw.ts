export interface PoolSimulationResponseRaw {
  ts: {
    [key: string]: number;
  };
  fees_apy: {
    [key: string]: number;
  };
  il_apy: {
    [key: string]: number;
  };
  pnl_apy: {
    [key: string]: number;
  };
  fees_return_pct: {
    [key: string]: number;
  };
  il_return_pct: {
    [key: string]: number;
  };
  pnl_return_pct: {
    [key: string]: number;
  };
  price_lower: {
    [key: string]: number;
  };
  price_upper: {
    [key: string]: number;
  };
  price_curr: {
    [key: string]: number;
  };
  price_curr_twap: {
    [key: string]: number;
  };
  pnl_vs_usd_apy: {
    [key: string]: number;
  };
  pnl_vs_usd_return_pct: {
    [key: string]: number;
  };
  investment_value_usd: {
    [key: string]: number;
  };
  hodl_value_usd: {
    [key: string]: number;
  };
  hodl_tokena_value_usd: {
    [key: string]: number;
  };
  hodl_tokenb_value_usd: {
    [key: string]: number;
  };
}

export interface PoolSimulationResponseFormatted {
  timestamp: number;
  feesApy: number;
  ilApy: number;
  pnlApy: number;
  feesReturnPct: number;
  ilReturnPct: number;
  pnlReturnPct: number;
  priceLower: number;
  priceUpper: number;
  priceCurr: number;
  priceCurrTwap: number;
  pnlVsUsdApy: number;
  pnlVsUsdReturnPct: number;
  investmentValueUsd: number;
  hodlValueUsd: number;
  hodlTokenaValueUsd: number;
  hodlTokenbValueUsd: number;
}
