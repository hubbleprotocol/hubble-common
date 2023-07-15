export interface PoolSimulationResponse {
  data: PoolSimulationResponseData[];
  backtest_end_date: string;
  backtest_num_days: number;
  backtest_start_date: string;
}

export interface PoolSimulationResponseData {
  ts: number;
  fees_apy: number;
  il_apy: number;
  pnl_apy: number;
  fees_return_pct: number;
  il_return_pct: number;
  pnl_return_pct: number;
  price_lower: number;
  price_upper: number;
  price_curr: number;
  price_curr_twap: number;
  pnl_vs_usd_apy: number;
  pnl_vs_usd_return_pct: number;
  investment_value_usd: number;
  hodl_value_usd: number;
  hodl_tokena_value_usd: number;
  hodl_tokenb_value_usd: number;
}

export interface PoolSimulationResponseDataFormatted {
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
