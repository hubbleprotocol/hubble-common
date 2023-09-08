import Decimal from 'decimal.js';
import { PositionRange, RebalanceFieldInfo } from '../utils/types';
import {
  DefaultLowerPercentageBPSDecimal,
  DefaultUpperPercentageBPSDecimal,
  FullBPSDecimal,
} from '../utils/CreationParameters';
import { getManualRebalanceFieldInfos } from './manualRebalance';
import { Dex } from '../utils';
import { sqrtPriceX64ToPrice } from '@orca-so/whirlpool-sdk';
import BN from 'bn.js';

export const DEFAULT_LOWER_RANGE_PRICE_DIFF_BPS = new Decimal(500);
export const DEFAULT_UPPER_RANGE_PRICE_DIFF_BPS = new Decimal(500);
export const DEFAULT_DESTINATION_TOKEN = new Decimal(1);

export function getTakeProfitRebalanceFieldsInfos(
  lowerRangePrice: Decimal,
  upperRangePrice: Decimal,
  destinationToken: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
  let lowerRangePriceRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'lowerRangePrice',
    type: 'number',
    value: lowerRangePrice,
    enabled,
  };
  let upperRangePriceRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'upperRangePrice',
    type: 'number',
    value: upperRangePrice,
    enabled,
  };
  let destinationTokenRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'destinationToken',
    type: 'number',
    value: destinationToken,
    enabled,
  };

  return [lowerRangePriceRebalanceFieldInfo, upperRangePriceRebalanceFieldInfo, destinationTokenRebalanceFieldInfo];
}

export function getPositionRangeFromTakeProfitParams(
  dex: Dex,
  tokenADecimals: number,
  tokenBDecimals: number,
  lowerSqrtPriceX64: Decimal,
  upperSqrtPriceX64: Decimal
): PositionRange {
  if (dex == 'ORCA') {
    let lowerPrice = sqrtPriceX64ToPrice(new BN(lowerSqrtPriceX64.toString()), tokenADecimals, tokenBDecimals);
    let upperPrice = sqrtPriceX64ToPrice(new BN(upperSqrtPriceX64.toString()), tokenADecimals, tokenBDecimals);
    return { lowerPrice, upperPrice };
  } else if (dex == 'RAYDIUM') {
    let lowerPrice = sqrtPriceX64ToPrice(new BN(lowerSqrtPriceX64.toString()), tokenADecimals, tokenBDecimals);
    let upperPrice = sqrtPriceX64ToPrice(new BN(upperSqrtPriceX64.toString()), tokenADecimals, tokenBDecimals);
    return { lowerPrice, upperPrice };
  } else {
    throw new Error(`Unknown DEX ${dex}`);
  }
}

export function getDefaultTakeProfitRebalanceFieldsInfos(price: Decimal): RebalanceFieldInfo[] {
  let lowerPrice = price.mul(FullBPSDecimal.sub(DEFAULT_LOWER_RANGE_PRICE_DIFF_BPS)).div(FullBPSDecimal);
  let upperPrice = price.mul(FullBPSDecimal.add(DEFAULT_UPPER_RANGE_PRICE_DIFF_BPS)).div(FullBPSDecimal);

  return getTakeProfitRebalanceFieldsInfos(lowerPrice, upperPrice, price);
}
