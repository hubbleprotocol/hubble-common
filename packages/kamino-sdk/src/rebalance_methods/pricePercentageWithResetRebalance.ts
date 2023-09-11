import Decimal from 'decimal.js';
import { PositionRange, RebalanceFieldInfo } from '../utils/types';
import {
  DefaultLowerPercentageBPSDecimal,
  DefaultUpperPercentageBPSDecimal,
  FullBPSDecimal,
} from '../utils/CreationParameters';

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
    label: 'rebalanceType',
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

  let { lowerPrice, upperPrice } = getPositionRangeForPricePercentageWithResetRebalanceParams(
    price,
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

  let { lowerPrice: resetLowerPrice, upperPrice: resetUpperPrice } =
    getPositionResetRangeForPricePercentageWithResetRebalanceParams(
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

export function getPositionRangeForPricePercentageWithResetRebalanceParams(
  price: Decimal,
  lowerPercentageBPS: Decimal,
  upperPercentageBPS: Decimal
): PositionRange {
  let lowerPrice = price.mul(FullBPSDecimal.sub(lowerPercentageBPS)).div(FullBPSDecimal);
  let upperPrice = price.mul(FullBPSDecimal.add(upperPercentageBPS)).div(FullBPSDecimal);
  return { lowerPrice, upperPrice };
}

export function getPositionResetRangeForPricePercentageWithResetRebalanceParams(
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
