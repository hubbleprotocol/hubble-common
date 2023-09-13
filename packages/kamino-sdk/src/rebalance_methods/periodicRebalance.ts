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
import { RebalanceRaw } from '../kamino-client/types';

export const DEFAULT_LOWER_RANGE_PRICE_DIFF_BPS_PERIODIC_REBALANCE = new Decimal(500);
export const DEFAULT_UPPER_RANGE_PRICE_DIFF_BPS_PERIODIC_REBALANCE = new Decimal(500);
export const DEFAULT_REBALANCE_PERIOD = new Decimal(3600 * 24 * 3); // 3 days
export const PeriodicRebalanceTypeName = 'periodicRebalance';

export function getPeriodicRebalanceRebalanceFieldInfos(
  price: Decimal,
  period: Decimal, // seconds
  lowerRangeBps: Decimal,
  upperRangeBps: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
  let rebalanceType: RebalanceFieldInfo = {
    label: 'rebalanceType',
    type: 'string',
    value: PeriodicRebalanceTypeName,
    enabled,
  };
  let periodRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'period',
    type: 'number',
    value: period,
    enabled,
  };
  let lowerRangeBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'lowerRangeBps',
    type: 'number',
    value: lowerRangeBps,
    enabled,
  };
  let upperRangeBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'upperRangeBps',
    type: 'number',
    value: upperRangeBps,
    enabled,
  };

  let { lowerPrice, upperPrice } = getPositionRangeFromPeriodicRebalanceParams(price, lowerRangeBps, upperRangeBps);

  let lowerRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'priceLower',
    type: 'number',
    value: lowerPrice,
    enabled: false,
  };
  let upperRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'priceUpper',
    type: 'number',
    value: upperPrice,
    enabled: false,
  };

  return [
    rebalanceType,
    periodRebalanceFieldInfo,
    lowerRangeBpsRebalanceFieldInfo,
    upperRangeBpsRebalanceFieldInfo,
    lowerRangeRebalanceFieldInfo,
    upperRangeRebalanceFieldInfo,
  ];
}

export function getPositionRangeFromPeriodicRebalanceParams(
  price: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal
): PositionRange {
  let lowerPrice = price.mul(FullBPSDecimal.sub(lowerPercentageBPS)).div(FullBPSDecimal);
  let upperPrice = price.mul(FullBPSDecimal.add(upperPercentageBPS)).div(FullBPSDecimal);
  return { lowerPrice, upperPrice };
}

export function getDefaultPeriodicRebalanceFieldInfos(price: Decimal): RebalanceFieldInfo[] {
  let { lowerPrice, upperPrice } = getPositionRangeFromPeriodicRebalanceParams(
    price,
    DEFAULT_LOWER_RANGE_PRICE_DIFF_BPS_PERIODIC_REBALANCE,
    DEFAULT_UPPER_RANGE_PRICE_DIFF_BPS_PERIODIC_REBALANCE
  );
  return getPeriodicRebalanceRebalanceFieldInfos(
    price,
    DEFAULT_REBALANCE_PERIOD,
    DEFAULT_LOWER_RANGE_PRICE_DIFF_BPS_PERIODIC_REBALANCE,
    DEFAULT_UPPER_RANGE_PRICE_DIFF_BPS_PERIODIC_REBALANCE
  ).concat(getManualRebalanceFieldInfos(lowerPrice, upperPrice, false));
}

export function deserializePeriodicRebalanceFromOnchainParams(price: Decimal, rebalanceRaw: RebalanceRaw) {
  let paramsBuffer = Buffer.from(rebalanceRaw.params);

  let period = new Decimal(paramsBuffer.readBigUint64LE(0).toString());
  let lowerRangeBps = new Decimal(paramsBuffer.readUInt16LE(8));
  let upperRangeBps = new Decimal(paramsBuffer.readUInt16LE(10));

  return getPeriodicRebalanceRebalanceFieldInfos(price, period, lowerRangeBps, upperRangeBps);
}
