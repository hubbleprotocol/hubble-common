import Decimal from 'decimal.js';
import { PositionRange, RebalanceFieldInfo } from '../utils/types';
import {
  DefaultLowerPercentageBPSDecimal,
  DefaultUpperPercentageBPSDecimal,
  FullBPSDecimal,
} from '../utils/CreationParameters';
import { getManualRebalanceFieldInfos } from './manualRebalance';
import { Dex, readBigUint128LE } from '../utils';
import { sqrtPriceX64ToPrice } from '@orca-so/whirlpool-sdk';
import BN from 'bn.js';
import { RebalanceRaw } from '../kamino-client/types';
import { SqrtPriceMath } from '@raydium-io/raydium-sdk';

export const DEFAULT_LOWER_RANGE_PRICE_DIFF_BPS = new Decimal(500);
export const DEFAULT_UPPER_RANGE_PRICE_DIFF_BPS = new Decimal(500);
export const DEFAULT_DESTINATION_TOKEN = new Decimal(1);
export const TakeProfitRebalanceTypeName = 'takeProfit';

export function getTakeProfitRebalanceFieldsInfos(
  lowerRangePrice: Decimal,
  upperRangePrice: Decimal,
  destinationToken: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
  let rebalanceType: RebalanceFieldInfo = {
    label: 'rebalanceType',
    type: 'string',
    value: TakeProfitRebalanceTypeName,
    enabled,
  };
  let lowerRangePriceRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'priceLower',
    type: 'number',
    value: lowerRangePrice,
    enabled,
  };
  let upperRangePriceRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'priceUpper',
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

  return [rebalanceType, lowerRangePriceRebalanceFieldInfo, upperRangePriceRebalanceFieldInfo, destinationTokenRebalanceFieldInfo];
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

export function deserializeTakeProfitRebalanceFromOnchainParams(
  tokenADecimals: number,
  tokenBDecimals: number,
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  let paramsBuffer = Buffer.from(rebalanceRaw.params);

  let rawLowerRangePrice = new BN(readBigUint128LE(paramsBuffer, 0).toString());
  let rawUpperRangePrice = new BN(readBigUint128LE(paramsBuffer, 16).toString());
  let destinationToken = new Decimal(paramsBuffer.readUint8(32));

  let lowerPrice = SqrtPriceMath.sqrtPriceX64ToPrice(rawLowerRangePrice, tokenADecimals, tokenBDecimals);
  let upperPrice = SqrtPriceMath.sqrtPriceX64ToPrice(rawUpperRangePrice, tokenADecimals, tokenBDecimals);

  return getTakeProfitRebalanceFieldsInfos(lowerPrice, upperPrice, destinationToken);
}
