import Decimal from 'decimal.js';
import { PositionRange, RebalanceFieldInfo, RebalanceFieldsDict } from '../utils/types';
import {
  DefaultLowerPercentageBPSDecimal,
  DefaultUpperPercentageBPSDecimal,
  FullBPSDecimal,
} from '../utils/CreationParameters';
import { RebalanceRaw } from '../kamino-client/types';
import { RebalanceTypeLabelName } from './consts';
import { readBigUint128LE } from '../utils';

export const PricePercentageWithResetRebalanceTypeName = 'pricePercentageWithReset';

export function getPricePercentageWithResetRebalanceFieldInfos(
  price: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal,
  resetLowerPercentageBPS: Decimal,
  resetUpperPercentageBPS: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
  let rebalanceType: RebalanceFieldInfo = {
    label: RebalanceTypeLabelName,
    type: 'string',
    value: PricePercentageWithResetRebalanceTypeName,
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

  let { lowerPrice, upperPrice } = getPositionRangeFromPricePercentageWithResetParams(
    price,
    lowerPercentageBPS,
    upperPercentageBPS
  );
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

  let { lowerPrice: resetLowerPrice, upperPrice: resetUpperPrice } =
    getPositionResetRangeFromPricePercentageWithResetParams(
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
    lowerRangeRebalanceFieldInfo,
    upperRangeRebalanceFieldInfo,
    resetLowerRangeRebalanceFieldInfo,
    resetUpperRangeRebalanceFieldInfo,
  ];
}

export function getPositionRangeFromPricePercentageWithResetParams(
  price: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal
): PositionRange {
  let lowerPrice = price.mul(FullBPSDecimal.sub(lowerPercentageBPS)).div(FullBPSDecimal);
  let upperPrice = price.mul(FullBPSDecimal.add(upperPercentageBPS)).div(FullBPSDecimal);
  return { lowerPrice, upperPrice };
}

export function getPositionResetRangeFromPricePercentageWithResetParams(
  price: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal,
  resetLowerPercentageBPS: Decimal,
  resetUpperPercentageBPS: Decimal
): PositionRange {
  let resetLowerPrice = price
    .mul(FullBPSDecimal.sub(resetLowerPercentageBPS.mul(lowerPercentageBPS).div(FullBPSDecimal)))
    .div(FullBPSDecimal);
  let resetUpperPrice = price
    .mul(FullBPSDecimal.add(resetUpperPercentageBPS.mul(upperPercentageBPS).div(FullBPSDecimal)))
    .div(FullBPSDecimal);
  return { lowerPrice: resetLowerPrice, upperPrice: resetUpperPrice };
}

export function getDefaultPricePercentageWithResetRebalanceFieldInfos(price: Decimal): RebalanceFieldInfo[] {
  let fieldInfos = getPricePercentageWithResetRebalanceFieldInfos(
    price,
    DefaultLowerPercentageBPSDecimal,
    DefaultUpperPercentageBPSDecimal,
    DefaultLowerPercentageBPSDecimal,
    DefaultUpperPercentageBPSDecimal
  );
  return fieldInfos;
}

export function readPricePercentageWithResetRebalanceParamsFromStrategy(rebalanceRaw: RebalanceRaw) {
  let paramsBuffer = Buffer.from(rebalanceRaw.params);
  let params: RebalanceFieldsDict = {};

  params['lowerRangeBPS'] = new Decimal(paramsBuffer.readUint16LE(0));
  params['upperRangeBPS'] = new Decimal(paramsBuffer.readUint16LE(2));
  params['lowerResetRangeBps'] = new Decimal(paramsBuffer.readUint16LE(4));
  params['upperResetRangeBps'] = new Decimal(paramsBuffer.readUint16LE(6));

  return params;
}

export function readPricePercentageWithResetRebalanceStateFromStrategy(rebalanceRaw: RebalanceRaw) {
  let stateBuffer = Buffer.from(rebalanceRaw.state);
  let state: RebalanceFieldsDict = {};

  state['lastRebalanceLowerResetPoolPrice'] = new Decimal(readBigUint128LE(stateBuffer, 0).toString());
  state['lastRebalanceUpperResetPoolPrice'] = new Decimal(readBigUint128LE(stateBuffer, 16).toString());

  return state;
}

export function deserializePricePercentageWithResetRebalanceFromOnchainParams(
  price: Decimal,
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  let params = readPricePercentageWithResetRebalanceParamsFromStrategy(rebalanceRaw);
  return getPricePercentageWithResetRebalanceFieldInfos(
    price,
    params['lowerRangeBPS'],
    params['upperRangeBPS'],
    params['lowerResetRangeBps'],
    params['upperResetRangeBps']
  );
}
