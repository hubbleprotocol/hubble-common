import Decimal from 'decimal.js';
import { PositionRange, RebalanceFieldInfo, RebalanceFieldsDict } from '../utils/types';
import { FullBPSDecimal } from '../utils/CreationParameters';
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
    label: 'rangePriceLower',
    type: 'number',
    value: lowerRangePrice,
    enabled,
  };
  let upperRangePriceRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'rangePriceUpper',
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

  return [
    rebalanceType,
    lowerRangePriceRebalanceFieldInfo,
    upperRangePriceRebalanceFieldInfo,
    destinationTokenRebalanceFieldInfo,
  ];
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

export function readTakeProfitRebalanceParamsFromStrategy(
  tokenADecimals: number,
  tokenBDecimals: number,
  rebalanceRaw: RebalanceRaw
) {
  let paramsBuffer = Buffer.from(rebalanceRaw.params);
  let params: RebalanceFieldsDict = {};

  params['lowerRangePrice'] = SqrtPriceMath.sqrtPriceX64ToPrice(
    new BN(readBigUint128LE(paramsBuffer, 0).toString()),
    tokenADecimals,
    tokenBDecimals
  );
  params['upperRangePrice'] = SqrtPriceMath.sqrtPriceX64ToPrice(
    new BN(readBigUint128LE(paramsBuffer, 16).toString()),
    tokenADecimals,
    tokenBDecimals
  );
  params['destinationToken'] = new Decimal(paramsBuffer.readUint8(32));

  return params;
}

export function readTakeProfitRebalanceStateFromStrategy(rebalanceRaw: RebalanceRaw) {
  let stateBuffer = Buffer.from(rebalanceRaw.state);
  let state: RebalanceFieldsDict = {};

  state['step'] = new Decimal(stateBuffer.readUInt8(0));

  return state;
}

export function deserializeTakeProfitRebalanceFromOnchainParams(
  tokenADecimals: number,
  tokenBDecimals: number,
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  let params = readTakeProfitRebalanceParamsFromStrategy(tokenADecimals, tokenBDecimals, rebalanceRaw);

  return getTakeProfitRebalanceFieldsInfos(
    params['lowerRangePrice'],
    params['upperRangePrice'],
    params['destinationToken']
  );
}
