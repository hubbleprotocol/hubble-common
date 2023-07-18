import axios, { AxiosResponse } from 'axios';
import { PoolSimulationResponse } from '../models/PoolSimulationResponseData';
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

export async function simulateManualPool(params: SimulationManualPoolParameters): Promise<PoolSimulationResponse> {
  const response: AxiosResponse<PoolSimulationResponse> = await axios.get(
    `https://api.kamino.finance/simulate/${params.poolAddress}?strategy_type=Fixed&deposit_date=${
      params.depositDate
    }&end_date=${
      params.endDate
    }&price_lower=${params.priceLower.toString()}&price_upper=${params.priceUpper.toString()}`
  );
  return response.data;
}

export async function simulatePercentagePool(
  params: SimulationPercentagePoolParameters
): Promise<PoolSimulationResponse> {
  const response: AxiosResponse<PoolSimulationResponse> = await axios.get(
    `https://api.kamino.finance/simulate/${params.poolAddress}?strategy_type=Tracker&deposit_date=${params.depositDate}&end_date=${params.endDate}&range_width_perc_lower=${params.rangeWidthPriceLower}&range_width_perc_upper=${params.rangeWidthPriceUpper}&reset_range_width_perc_upper=${params.resetRangeWidthPercUpper}&reset_range_width_perc_lower=${params.resetRangeWidthPercLower}`
  );
  return response.data;
}
