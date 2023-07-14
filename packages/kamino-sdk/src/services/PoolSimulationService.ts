import axios, { AxiosResponse } from 'axios';
import { PoolSimulationResponseFormatted, PoolSimulationResponseRaw } from '../models/PoolSimulationResponseRaw';
import Decimal from 'decimal.js';
import { PublicKey } from '@solana/web3.js';

export type SimulationParameters = {
  poolAddress: PublicKey;
  depositDate: string;
  endDate: string;
};

export type SimulationManualPoolParameters = SimulationParameters & {
  priceLower: Decimal;
  priceUpper: Decimal;
};

export type SimulationPercentagePoolParameters = SimulationParameters & {
  rangeWidthPriceLower: number;
  rangeWidthPriceUpper: number;
  resetRangeWidthPercUpper?: number;
  resetRangeWidthPercLower?: number;
};

function formatSimulationResponse(response: PoolSimulationResponseRaw): PoolSimulationResponseFormatted[] {
  return Object.keys(response.ts).map((key) => {
    return {
      timestamp: response.ts[key],
      feesApy: response.fees_apy[key],
      ilApy: response.il_apy[key],
      pnlApy: response.pnl_apy[key],
      feesReturnPct: response.fees_return_pct[key],
      ilReturnPct: response.il_return_pct[key],
      pnlReturnPct: response.pnl_return_pct[key],
      priceLower: response.price_lower[key],
      priceUpper: response.price_upper[key],
      priceCurr: response.price_curr[key],
      priceCurrTwap: response.price_curr_twap[key],
      pnlVsUsdApy: response.pnl_vs_usd_apy[key],
      pnlVsUsdReturnPct: response.pnl_vs_usd_return_pct[key],
      investmentValueUsd: response.investment_value_usd[key],
      hodlValueUsd: response.hodl_value_usd[key],
      hodlTokenaValueUsd: response.hodl_tokenb_value_usd[key],
      hodlTokenbValueUsd: response.hodl_tokenb_value_usd[key],
    };
  });
}

export async function simulateManualPool(
  params: SimulationManualPoolParameters
): Promise<PoolSimulationResponseFormatted[]> {
  const response: AxiosResponse<PoolSimulationResponseRaw> = await axios.get(
    `https://api.kamino.finance/simulate/${params.poolAddress}?strategy_type=Fixed&deposit_date=${
      params.depositDate
    }&end_date=${
      params.endDate
    }&price_lower=${params.priceLower.toString()}&price_upper=${params.priceUpper.toString()}`
  );
  return formatSimulationResponse(response.data);
}

export async function simulatePercentagePool(
  params: SimulationPercentagePoolParameters
): Promise<PoolSimulationResponseFormatted[]> {
  const response: AxiosResponse<PoolSimulationResponseRaw> = await axios.get(
    `https://api.kamino.finance/simulate/${params.poolAddress}?strategy_type=Tracker&deposit_date=${params.depositDate}&end_date=${params.endDate}&range_width_perc_lower=${params.rangeWidthPriceLower}&range_width_perc_upper=${params.rangeWidthPriceUpper}&reset_range_width_perc_upper=${params.resetRangeWidthPercUpper}&reset_range_width_perc_lower=${params.resetRangeWidthPercLower}`
  );
  return formatSimulationResponse(response.data);
}
