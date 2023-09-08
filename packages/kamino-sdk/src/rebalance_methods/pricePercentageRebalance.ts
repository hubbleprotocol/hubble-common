import Decimal from 'decimal.js';
import { PositionRange, RebalanceFieldInfo } from '../utils/types';
import {
  DefaultLowerPercentageBPSDecimal,
  DefaultUpperPercentageBPSDecimal,
  FullBPSDecimal,
} from '../utils/CreationParameters';
import { getManualRebalanceFieldInfos } from './manualRebalance';

export function getPricePercentageRebalanceFieldInfos(
  poolPrice: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal,
  enabled: boolean = true
): RebalanceFieldInfo[] {
  let lowerBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'lowerThresholdBps',
    type: 'number',
    value: lowerPercentageBPS,
    enabled,
  };
  let upperBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'upperThresholdBps',
    type: 'number',
    value: upperPercentageBPS,
    enabled,
  };

  let { lowerPrice, upperPrice } = getPositionRangeForPricePercentageRebalanceParams(
    poolPrice,
    lowerPercentageBPS,
    upperPercentageBPS
  );
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
    lowerBpsRebalanceFieldInfo,
    upperBpsRebalanceFieldInfo,
    lowerRangeRebalanceFieldInfo,
    upperRangeRebalanceFieldInfo,
  ];
}

export function getPositionRangeForPricePercentageRebalanceParams(
  price: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal
): PositionRange {
  let lowerPrice = price.mul(FullBPSDecimal.sub(lowerPercentageBPS)).div(FullBPSDecimal);
  let upperPrice = price.mul(FullBPSDecimal.add(upperPercentageBPS)).div(FullBPSDecimal);
  return { lowerPrice, upperPrice };
}

export function getDefaultPricePercentageRebalanceFieldInfos(price: Decimal): RebalanceFieldInfo[] {
  let { lowerPrice, upperPrice } = getPositionRangeForPricePercentageRebalanceParams(
    price,
    DefaultLowerPercentageBPSDecimal,
    DefaultUpperPercentageBPSDecimal
  );
  let fieldInfos = getPricePercentageRebalanceFieldInfos(
    price,
    DefaultLowerPercentageBPSDecimal,
    DefaultUpperPercentageBPSDecimal
  ).concat(getManualRebalanceFieldInfos(lowerPrice, upperPrice, false));
  return fieldInfos;
}
