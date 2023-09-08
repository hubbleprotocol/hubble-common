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

export const DEFAULT_LOWER_RANGE_PRICE_DIFF_BPS_PERIODIC_REBALANCE = new Decimal(500);
export const DEFAULT_UPPER_RANGE_PRICE_DIFF_BPS_PERIODIC_REBALANCE = new Decimal(500);
export const DEFAULT_REBALANCE_PERIOD = new Decimal(3600 * 24 * 3); // 3 days

export function getPeriodicRebalanceRebalanceFieldInfos(
  period: Decimal, // seconds
  lowerRangeBps: Decimal,
  upperRangeBps: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
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

  return [periodRebalanceFieldInfo, lowerRangeBpsRebalanceFieldInfo, upperRangeBpsRebalanceFieldInfo];
}

export function getPositionRangeForPeriodicRebalanceParams(
  price: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal
): PositionRange {
  let lowerPrice = price.mul(FullBPSDecimal.sub(lowerPercentageBPS)).div(FullBPSDecimal);
  let upperPrice = price.mul(FullBPSDecimal.add(upperPercentageBPS)).div(FullBPSDecimal);
  return { lowerPrice, upperPrice };
}

export function getDefaultPeriodicRebalanceFieldInfos(price: Decimal): RebalanceFieldInfo[] {
  let { lowerPrice, upperPrice } = getPositionRangeForPeriodicRebalanceParams(
    price,
    DEFAULT_LOWER_RANGE_PRICE_DIFF_BPS_PERIODIC_REBALANCE,
    DEFAULT_UPPER_RANGE_PRICE_DIFF_BPS_PERIODIC_REBALANCE
  );
  return getPeriodicRebalanceRebalanceFieldInfos(
    DEFAULT_REBALANCE_PERIOD,
    DEFAULT_LOWER_RANGE_PRICE_DIFF_BPS_PERIODIC_REBALANCE,
    DEFAULT_UPPER_RANGE_PRICE_DIFF_BPS_PERIODIC_REBALANCE
  ).concat(getManualRebalanceFieldInfos(lowerPrice, upperPrice, false));
}
