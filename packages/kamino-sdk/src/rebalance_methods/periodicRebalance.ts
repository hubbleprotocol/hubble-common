import Decimal from 'decimal.js';
import { PositionRange, RebalanceFieldInfo, RebalanceFieldsDict } from '../utils/types';
import { FullBPSDecimal } from '../utils/CreationParameters';
import { getManualRebalanceFieldInfos } from './manualRebalance';
import { RebalanceRaw } from '../kamino-client/types';
import { RebalanceTypeLabelName } from './consts';

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
    label: RebalanceTypeLabelName,
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
    label: 'rangePriceLower',
    type: 'number',
    value: lowerPrice,
    enabled: false,
  };
  let upperRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'rangePriceUpper',
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

export function readPeriodicRebalanceRebalanceParamsFromStrategy(rebalanceRaw: RebalanceRaw) {
  let paramsBuffer = Buffer.from(rebalanceRaw.params);
  let params: RebalanceFieldsDict = {};

  params['period'] = new Decimal(paramsBuffer.readBigUint64LE(0).toString());
  params['lowerRangeBps'] = new Decimal(paramsBuffer.readUInt16LE(8));
  params['upperRangeBps'] = new Decimal(paramsBuffer.readUInt16LE(10));

  return params;
}

export function readPeriodicRebalanceRebalanceStateFromStrategy(rebalanceRaw: RebalanceRaw) {
  let stateBuffer = Buffer.from(rebalanceRaw.state);
  let state: RebalanceFieldsDict = {};

  state['lastRebalanceTimestamp'] = new Decimal(stateBuffer.readBigUint64LE(0).toString());

  return state;
}

export function deserializePeriodicRebalanceFromOnchainParams(price: Decimal, rebalanceRaw: RebalanceRaw) {
  let params = readPeriodicRebalanceRebalanceParamsFromStrategy(rebalanceRaw);

  return getPeriodicRebalanceRebalanceFieldInfos(
    price,
    params['period'],
    params['lowerRangeBps'],
    params['upperRangeBps']
  );
}
