import Decimal from 'decimal.js';
import { PositionRange, RebalanceFieldInfo, RebalanceFieldsDict } from '../utils/types';
import {
  DefaultLowerPercentageBPSDecimal,
  DefaultUpperPercentageBPSDecimal,
  FullBPS,
  FullBPSDecimal,
} from '../utils/CreationParameters';
import { getManualRebalanceFieldInfos } from './manualRebalance';
import { RebalanceRaw } from '../kamino-client/types';
import { RebalanceTypeLabelName } from './consts';
import { Dex, readBigUint128LE } from '../utils';
import { sqrtPriceX64ToPrice } from '@orca-so/whirlpool-sdk';
import BN from 'bn.js';
import { upsertManyRebalanceFieldInfos } from './utils';

export const DefaultMaxNumberOfExpansions = new Decimal(10);
export const DefaultExpansionSizeBPS = new Decimal(100);
export const DefaultSwapUnevenAllowed = new Decimal(1);
export const ExpanderRebalanceTypeName = 'expander';

export function getExpanderRebalanceFieldInfos(
  price: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal,
  resetLowerPercentageBPS: Decimal,
  resetUpperPercentageBPS: Decimal,
  expansionBPS: Decimal,
  maxNumberOfExpansions: Decimal,
  swapUnevenAllowed: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
  let rebalanceType: RebalanceFieldInfo = {
    label: RebalanceTypeLabelName,
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
  let swapUnevenAllowedFieldInfo: RebalanceFieldInfo = {
    label: 'swapUnevenAllowed',
    type: 'number',
    value: swapUnevenAllowed,
    enabled,
  };

  let { lowerPrice, upperPrice } = getPositionRangeFromExpanderParams(price, lowerPercentageBPS, upperPercentageBPS);
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
    swapUnevenAllowedFieldInfo,
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
    DefaultMaxNumberOfExpansions,
    DefaultSwapUnevenAllowed
  ).concat(getManualRebalanceFieldInfos(lowerPrice, upperPrice, false));
  return fieldInfos;
}

export function readRawExpanderRebalanceParamsFromStrategy(rebalanceRaw: RebalanceRaw) {
  let paramsBuffer = Buffer.from(rebalanceRaw.params);
  let params: RebalanceFieldsDict = {};

  params['lowerRangeBps'] = new Decimal(paramsBuffer.readUInt16LE(0));
  params['upperRangeBps'] = new Decimal(paramsBuffer.readUInt16LE(2));
  params['lowerResetRatioBps'] = new Decimal(paramsBuffer.readUInt16LE(4));
  params['upperResetRatioBps'] = new Decimal(paramsBuffer.readUInt16LE(6));
  params['expansionBps'] = new Decimal(paramsBuffer.readUInt16LE(8));
  params['maxNumberOfExpansions'] = new Decimal(paramsBuffer.readUInt16LE(10));
  params['swapUnevenAllowed'] = new Decimal(paramsBuffer.readUInt8(12));

  return params;
}

export function readExpanderRebalanceParamsFromStrategy(rebalanceRaw: RebalanceRaw): RebalanceFieldInfo[] {
  let paramsBuffer = Buffer.from(rebalanceRaw.params);

  let lowerRangeBps = new Decimal(paramsBuffer.readUInt16LE(0));
  let upperRangeBps = new Decimal(paramsBuffer.readUInt16LE(2));
  let lowerResetRatioBps = new Decimal(paramsBuffer.readUInt16LE(4));
  let upperResetRatioBps = new Decimal(paramsBuffer.readUInt16LE(6));
  let expansionBps = new Decimal(paramsBuffer.readUInt16LE(8));
  let maxNumberOfExpansions = new Decimal(paramsBuffer.readUInt16LE(10));
  let swapUnevenAllowed = new Decimal(paramsBuffer.readUInt8(12));

  let lowerBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'lowerRangeBps',
    type: 'number',
    value: lowerRangeBps,
    enabled: true,
  };
  let upperBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'upperRangeBps',
    type: 'number',
    value: upperRangeBps,
    enabled: true,
  };
  let resetLowerBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetLowerRangeBps',
    type: 'number',
    value: lowerResetRatioBps,
    enabled: true,
  };
  let resetUpperBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetUpperRangeBps',
    type: 'number',
    value: upperResetRatioBps,
    enabled: true,
  };
  let expansionBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'expansionBps',
    type: 'number',
    value: expansionBps,
    enabled: true,
  };
  let maxNumberOfExpansionsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'maxNumberOfExpansions',
    type: 'number',
    value: maxNumberOfExpansions,
    enabled: true,
  };
  let swapUnevenAllowedFieldInfo: RebalanceFieldInfo = {
    label: 'swapUnevenAllowed',
    type: 'number',
    value: swapUnevenAllowed,
    enabled: true,
  };

  return [
    lowerBpsRebalanceFieldInfo,
    upperBpsRebalanceFieldInfo,
    resetLowerBpsRebalanceFieldInfo,
    resetUpperBpsRebalanceFieldInfo,
    expansionBpsRebalanceFieldInfo,
    maxNumberOfExpansionsRebalanceFieldInfo,
    swapUnevenAllowedFieldInfo,
  ];
}

export function readRawExpanderRebalanceStateFromStrategy(rebalanceRaw: RebalanceRaw) {
  let stateBuffer = Buffer.from(rebalanceRaw.state);
  let state: RebalanceFieldsDict = {};

  state['initialPoolPrice'] = new Decimal(readBigUint128LE(stateBuffer, 0).toString());
  state['expansionCount'] = new Decimal(stateBuffer.readUInt16LE(16));

  return state;
}

export function readExpanderRebalanceStateFromStrategy(
  dex: Dex,
  tokenADecimals: number,
  tokenBDecimals: number,
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  let stateBuffer = Buffer.from(rebalanceRaw.state);

  let paramsBuffer = Buffer.from(rebalanceRaw.params);

  let lowerRangeBps = new Decimal(paramsBuffer.readUInt16LE(0));
  let upperRangeBps = new Decimal(paramsBuffer.readUInt16LE(2));
  let lowerResetRatioBps = new Decimal(paramsBuffer.readUInt16LE(4));
  let upperResetRatioBps = new Decimal(paramsBuffer.readUInt16LE(6));
  let expansionBps = new Decimal(paramsBuffer.readUInt16LE(8));


  let initialPriceX64 = new Decimal(readBigUint128LE(stateBuffer, 0).toString());
  let expansionCount = new Decimal(stateBuffer.readUInt16LE(16));

  let initialPrice: Decimal;
  if (dex == 'ORCA') {
    initialPrice = sqrtPriceX64ToPrice(new BN(initialPriceX64.toString()), tokenADecimals, tokenBDecimals);
  } else if (dex == 'RAYDIUM') {
    initialPrice = sqrtPriceX64ToPrice(new BN(initialPriceX64.toString()), tokenADecimals, tokenBDecimals);
  } else {
    throw new Error(`Unknown DEX ${dex}`);
  }

  // let lowerRangeFactorBPS = lowerRangeBps.add(expansionBps.mul(expansionCount));
  // let upperRangeFactorBPS = upperRangeBps.add(expansionBps.mul(expansionCount));
  // let lowerRangeExpandedBPS = FullBPSDecimal.sub(lowerRangeFactorBPS).div(FullBPSDecimal);
  // let upperRangeExpandedBPS = FullBPSDecimal.add(upperRangeFactorBPS).div(FullBPSDecimal);
  // let expandedLowerResetRatioBps = lowerResetRatioBps.add(expansionBps.mul(expansionCount));
  // let expandedUpperResetRatioBps = upperResetRatioBps.add(expansionBps.mul(expansionCount));
  // let lowerResetRangeExpanderBPS = lowerRangeFactorBPS.mul(expandedLowerResetRatioBps).div(FullBPSDecimal);
  // let upperResetRangeExpanderBPS = upperRangeFactorBPS.mul(expandedUpperResetRatioBps).div(FullBPSDecimal);

  // let lowerPrice = initialPrice.mul(lowerRangeExpandedBPS);
  // let upperPrice = initialPrice.mul(upperRangeExpandedBPS);

  // let lowerResetPrice = initialPrice.mul(lowerResetRangeExpanderBPS);
  // let upperResetPrice = initialPrice.mul(upperResetRangeExpanderBPS);

  let lowerRangeFactorBPS = lowerRangeBps.add(expansionBps.mul(expansionCount));
  let upperRangeFactorBPS = upperRangeBps.add(expansionBps.mul(expansionCount));
  let lowerRangeExpandedBPS = FullBPSDecimal.sub(lowerRangeFactorBPS).div(FullBPSDecimal);
  let upperRangeExpandedBPS = FullBPSDecimal.add(upperRangeFactorBPS).div(FullBPSDecimal);
  let lowerResetRangeExpanderBPS = lowerRangeFactorBPS.mul(lowerResetRatioBps).div(FullBPSDecimal);
  let upperResetRangeExpanderBPS = upperRangeFactorBPS.mul(upperResetRatioBps).div(FullBPSDecimal);
  let lowerResetRangeExpandedBPS = FullBPSDecimal.sub(lowerResetRangeExpanderBPS).div(FullBPSDecimal);
  let upperResetRangeExpandedBPS = FullBPSDecimal.add(upperResetRangeExpanderBPS).div(FullBPSDecimal);

  let lowerPrice = initialPrice.mul(lowerRangeExpandedBPS);
  let upperPrice = initialPrice.mul(upperRangeExpandedBPS);

  let lowerResetPrice = initialPrice.mul(lowerResetRangeExpandedBPS);
  let upperResetPrice = initialPrice.mul(upperResetRangeExpandedBPS);

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

  let resetLowerRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetPriceLower',
    type: 'number',
    value: lowerResetPrice,
    enabled: false,
  };
  let resetUpperRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'resetPriceUpper',
    type: 'number',
    value: upperResetPrice,
    enabled: false,
  };

  return [
    lowerRangeRebalanceFieldInfo,
    upperRangeRebalanceFieldInfo,
    resetLowerRangeRebalanceFieldInfo,
    resetUpperRangeRebalanceFieldInfo,
  ];
}

export function readExpanderRebalanceFieldInfosFromStrategy(price: Decimal, rebalanceRaw: RebalanceRaw) {
  const params = readExpanderRebalanceParamsFromStrategy(rebalanceRaw);

  let paramsBuffer = Buffer.from(rebalanceRaw.params);

  let lowerRangeBps = new Decimal(paramsBuffer.readUInt16LE(0));
  let upperRangeBps = new Decimal(paramsBuffer.readUInt16LE(2));
  let lowerResetRatioBps = new Decimal(paramsBuffer.readUInt16LE(4));
  let upperResetRatioBps = new Decimal(paramsBuffer.readUInt16LE(6));
  let expansionBps = new Decimal(paramsBuffer.readUInt16LE(8));
  let maxNumberOfExpansions = new Decimal(paramsBuffer.readUInt16LE(10));
  let swapUnevenAllowed = new Decimal(paramsBuffer.readUInt8(12));

  return getExpanderRebalanceFieldInfos(
    price,
    lowerRangeBps,
    upperRangeBps,
    lowerResetRatioBps,
    upperResetRatioBps,
    expansionBps,
    maxNumberOfExpansions,
    swapUnevenAllowed
  );
}

export function deserializeExpanderRebalanceWithStateOverride(
  dex: Dex,
  tokenADecimals: number,
  tokenBDecimals: number,
  price: Decimal,
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  const stateFields = readExpanderRebalanceStateFromStrategy(dex, tokenADecimals, tokenBDecimals, rebalanceRaw);

  let fields = readExpanderRebalanceFieldInfosFromStrategy(price, rebalanceRaw);

  return upsertManyRebalanceFieldInfos(fields, stateFields);
}
