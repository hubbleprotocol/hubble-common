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

export const PricePercentageRebalanceTypeName = 'pricePercentage';

export function getPricePercentageRebalanceFieldInfos(
  poolPrice: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
  let rebalanceType: RebalanceFieldInfo = {
    label: RebalanceTypeLabelName,
    type: 'string',
    value: PricePercentageRebalanceTypeName,
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

  let { lowerPrice, upperPrice } = getPositionRangeFromPercentageRebalanceParams(
    poolPrice,
    lowerPercentageBPS,
    upperPercentageBPS
  );
  let lowerRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'rangePriceLower',
    type: 'number',
    value: lowerPrice!,
    enabled: false,
  };
  let upperRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'rangePriceUpper',
    type: 'number',
    value: upperPrice!,
    enabled: false,
  };

  return [
    rebalanceType,
    lowerBpsRebalanceFieldInfo,
    upperBpsRebalanceFieldInfo,
    lowerRangeRebalanceFieldInfo,
    upperRangeRebalanceFieldInfo,
  ];
}

export function getPositionRangeFromPercentageRebalanceParams(
  price: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal
): PositionRange {
  let lowerPrice = price.mul(FullBPSDecimal.sub(lowerPercentageBPS)).div(FullBPSDecimal);
  let upperPrice = price.mul(FullBPSDecimal.add(upperPercentageBPS)).div(FullBPSDecimal);
  return { lowerPrice, upperPrice };
}

export function getDefaultPricePercentageRebalanceFieldInfos(price: Decimal): RebalanceFieldInfo[] {
  let fieldInfos = getPricePercentageRebalanceFieldInfos(
    price,
    DefaultLowerPercentageBPSDecimal,
    DefaultUpperPercentageBPSDecimal
  );
  return fieldInfos;
}

export function readPricePercentageRebalanceParamsFromStrategy(rebalanceRaw: RebalanceRaw) {
  let paramsBuffer = Buffer.from(rebalanceRaw.params);
  let params: RebalanceFieldsDict = {};

  params['lowerRangeBPS'] = new Decimal(paramsBuffer.readUint16LE(0));
  params['upperRangeBPS'] = new Decimal(paramsBuffer.readUint16LE(2));

  return params;
}

export function readPricePercentageRebalanceStateFromStrategy(rebalanceRaw: RebalanceRaw) {
  let stateBuffer = Buffer.from(rebalanceRaw.state);
  let state: RebalanceFieldsDict = {};

  state['lastRebalanceLowerPoolPrice'] = new Decimal(readBigUint128LE(stateBuffer, 0).toString());
  state['lastRebalanceUpperPoolPrice'] = new Decimal(readBigUint128LE(stateBuffer, 16).toString());

  return state;
}

export function deserializePricePercentageRebalanceFromOnchainParams(
  price: Decimal,
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  let params = readPricePercentageRebalanceParamsFromStrategy(rebalanceRaw);

  return getPricePercentageRebalanceFieldInfos(price, params['lowerRangeBPS'], params['upperRangeBPS']);
}
