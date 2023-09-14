import Decimal from 'decimal.js';
import { PositionRange, RebalanceFieldInfo } from '../utils/types';
import {
  DefaultLowerPercentageBPSDecimal,
  DefaultUpperPercentageBPSDecimal,
  FullBPSDecimal,
} from '../utils/CreationParameters';
import { RebalanceRaw } from '../kamino-client/types';

export const PricePercentageRebalanceTypeName = 'pricePercentage';

export function getPricePercentageRebalanceFieldInfos(
  poolPrice: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
  let rebalanceType: RebalanceFieldInfo = {
    label: 'rebalanceType',
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
    label: 'priceLower',
    type: 'number',
    value: lowerPrice!,
    enabled: false,
  };
  let upperRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'priceUpper',
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

export function deserializePricePercentageRebalanceFromOnchainParams(
  price: Decimal,
  rebalanceRaw: RebalanceRaw
): RebalanceFieldInfo[] {
  let paramsBuffer = Buffer.from(rebalanceRaw.params);

  let lowerRangeBPS = new Decimal(paramsBuffer.readUint16LE(0));
  let upperRangeBPS = new Decimal(paramsBuffer.readUint16LE(2));

  return getPricePercentageRebalanceFieldInfos(price, lowerRangeBPS, upperRangeBPS);
}
