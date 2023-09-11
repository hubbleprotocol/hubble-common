import Decimal from 'decimal.js';
import { PositionRange, RebalanceFieldInfo } from '../utils/types';
import {
  DefaultLowerPercentageBPSDecimal,
  DefaultUpperPercentageBPSDecimal,
  FullBPS,
  FullBPSDecimal,
} from '../utils/CreationParameters';
import { getManualRebalanceFieldInfos } from './manualRebalance';
import { PublicKey } from '@solana/web3.js';
import { StrategyWithAddress } from '../models';
import { RebalanceRaw } from '../kamino-client/types';

export const DefaultMaxNumberOfExpansions = new Decimal(10);
export const DefaultExpansionSizeBPS = new Decimal(100);
export const ExpanderRebalanceTypeName = 'expander';

export function getExpanderRebalanceFieldInfos(
  price: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal,
  resetLowerPercentageBPS: Decimal,
  resetUpperPercentageBPS: Decimal,
  expansionBPS: Decimal,
  maxNumberOfExpansions: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
  let rebalanceType: RebalanceFieldInfo = {
    label: 'rebalanceType',
    type: 'string',
    value: ExpanderRebalanceTypeName,
    enabled,
  };
  let lowerBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'lowerRangeBps',
    type: 'number',
    value: lowerPercentageBPS,
    enabled,
  };
  let upperBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'upperRangeBps',
    type: 'number',
    value: upperPercentageBPS,
    enabled,
  };
  let resetLowerBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetLowerRangeBps',
    type: 'number',
    value: resetLowerPercentageBPS,
    enabled,
  };
  let resetUpperBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetUpperRangeBps',
    type: 'number',
    value: resetUpperPercentageBPS,
    enabled,
  };
  let expansionBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'expansionBps',
    type: 'number',
    value: expansionBPS,
    enabled,
  };
  let maxNumberOfExpansionsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'maxNumberOfExpansions',
    type: 'number',
    value: maxNumberOfExpansions,
    enabled,
  };

  let { lowerPrice, upperPrice } = getPositionRangeFromExpanderParams(price, lowerPercentageBPS, upperPercentageBPS);
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

  let { lowerPrice: resetLowerPrice, upperPrice: resetUpperPrice } = getPositionResetRangeFromExpanderParams(
    price,
    lowerPercentageBPS,
    upperPercentageBPS,
    resetLowerPercentageBPS,
    resetUpperPercentageBPS
  );
  let resetLowerRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetPriceLower',
    type: 'number',
    value: resetLowerPrice,
    enabled: false,
  };
  let resetUpperRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetPriceUpper',
    type: 'number',
    value: resetUpperPrice,
    enabled: false,
  };

  return [
    rebalanceType,
    lowerBpsRebalanceFieldInfo,
    upperBpsRebalanceFieldInfo,
    resetLowerBpsRebalanceFieldInfo,
    resetUpperBpsRebalanceFieldInfo,
    expansionBpsRebalanceFieldInfo,
    maxNumberOfExpansionsRebalanceFieldInfo,
    lowerRangeRebalanceFieldInfo,
    upperRangeRebalanceFieldInfo,
    resetLowerRangeRebalanceFieldInfo,
    resetUpperRangeRebalanceFieldInfo,
  ];
}

export function getPositionRangeFromExpanderParams(
  price: Decimal,
  lowerPriceDifferenceBPS: Decimal,
  upperPriceDifferenceBPS: Decimal
): PositionRange {
  let fullBPSDecimal = new Decimal(FullBPS);
  let lowerPrice = price.mul(fullBPSDecimal.sub(lowerPriceDifferenceBPS)).div(fullBPSDecimal);
  let upperPrice = price.mul(fullBPSDecimal.add(upperPriceDifferenceBPS)).div(fullBPSDecimal);

  return { lowerPrice, upperPrice };
}

export function getPositionResetRangeFromExpanderParams(
  price: Decimal,
  lowerPriceDifferenceBPS: Decimal,
  upperPriceDifferenceBPS: Decimal,
  resetLowerPriceDifferenceBPS: Decimal,
  resetUpperPriceDifferenceBPS: Decimal
): PositionRange {
  let resetLowerPrice = price
    .mul(FullBPSDecimal.sub(resetLowerPriceDifferenceBPS.mul(lowerPriceDifferenceBPS).div(FullBPSDecimal)))
    .div(FullBPSDecimal);
  let resetUpperPrice = price
    .mul(FullBPSDecimal.add(resetUpperPriceDifferenceBPS.mul(upperPriceDifferenceBPS).div(FullBPSDecimal)))
    .div(FullBPSDecimal);
  return { lowerPrice: resetLowerPrice, upperPrice: resetUpperPrice };
}

export function getDefaultExpanderRebalanceFieldInfos(price: Decimal): RebalanceFieldInfo[] {
  let { lowerPrice, upperPrice } = getPositionRangeFromExpanderParams(
    price,
    DefaultLowerPercentageBPSDecimal,
    DefaultUpperPercentageBPSDecimal
  );
  let fieldInfos = getExpanderRebalanceFieldInfos(
    price,
    DefaultLowerPercentageBPSDecimal,
    DefaultUpperPercentageBPSDecimal,
    DefaultLowerPercentageBPSDecimal,
    DefaultUpperPercentageBPSDecimal,
    DefaultLowerPercentageBPSDecimal,
    DefaultMaxNumberOfExpansions
  ).concat(getManualRebalanceFieldInfos(lowerPrice, upperPrice, false));
  return fieldInfos;
}

export function readExpanderRebalanceFieldInfosFromStrategy(price: Decimal, rebalanceRaw: RebalanceRaw) {
  let paramsBuffer = Buffer.from(rebalanceRaw.params);

  let lowerRangeBps = new Decimal(paramsBuffer.readUInt16LE(0));
  let upperRangeBps = new Decimal(paramsBuffer.readUInt16LE(2));
  let lowerResetRatioBps = new Decimal(paramsBuffer.readUInt16LE(4));
  let upperResetRatioBps = new Decimal(paramsBuffer.readUInt16LE(6));
  let expansionBps = new Decimal(paramsBuffer.readUInt16LE(8));
  let maxNumberOfExpansions = new Decimal(paramsBuffer.readUInt16LE(10));
  let _swapUnevenAllowed = new Decimal(paramsBuffer.readUInt8(12));

  return getExpanderRebalanceFieldInfos(
    price,
    lowerRangeBps,
    upperRangeBps,
    lowerResetRatioBps,
    upperResetRatioBps,
    expansionBps,
    maxNumberOfExpansions
  );
}
