import axios, { AxiosResponse } from 'axios';
import {
  PoolSimulationResponseDataFormatted,
  PoolSimulationResponseData,
  PoolSimulationResponse,
} from '../models/PoolSimulationResponseData';
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

function formatSimulationResponse(response: PoolSimulationResponse): PoolSimulationResponseDataFormatted[] {
  return response.data.map((item) => {
    return {
      timestamp: item.ts,
      feesApy: item.fees_apy,
      ilApy: item.il_apy,
      pnlApy: item.pnl_apy,
      feesReturnPct: item.fees_return_pct,
      ilReturnPct: item.il_return_pct,
      pnlReturnPct: item.pnl_return_pct,
      priceLower: item.price_lower,
      priceUpper: item.price_upper,
      priceCurr: item.price_curr,
      priceCurrTwap: item.price_curr_twap,
      pnlVsUsdApy: item.pnl_vs_usd_apy,
      pnlVsUsdReturnPct: item.pnl_vs_usd_return_pct,
      investmentValueUsd: item.investment_value_usd,
      hodlValueUsd: item.hodl_value_usd,
      hodlTokenaValueUsd: item.hodl_tokenb_value_usd,
      hodlTokenbValueUsd: item.hodl_tokenb_value_usd,
    };
  });
}

export async function simulateManualPool(
  params: SimulationManualPoolParameters
): Promise<PoolSimulationResponseDataFormatted[]> {
  const response: AxiosResponse<PoolSimulationResponse> = await axios.get(
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
): Promise<PoolSimulationResponseDataFormatted[]> {
  const response: AxiosResponse<PoolSimulationResponse> = await axios.get(
    `https://api.kamino.finance/simulate/${params.poolAddress}?strategy_type=Tracker&deposit_date=${params.depositDate}&end_date=${params.endDate}&range_width_perc_lower=${params.rangeWidthPriceLower}&range_width_perc_upper=${params.rangeWidthPriceUpper}&reset_range_width_perc_upper=${params.resetRangeWidthPercUpper}&reset_range_width_perc_lower=${params.resetRangeWidthPercLower}`
  );
  return formatSimulationResponse(response.data);
}
