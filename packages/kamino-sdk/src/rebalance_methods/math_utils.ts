import Decimal from 'decimal.js';
import { FullBPSDecimal } from '../utils/CreationParameters';
import { PositionRange } from '../utils';

export function getPriceRangeFromPriceAndDiffBPS(
  price: Decimal,
  lowerDiffBPS: Decimal,
  upperDiffBPS: Decimal
): PositionRange {
  let lowerPrice = price.mul(FullBPSDecimal.sub(lowerDiffBPS)).div(FullBPSDecimal);
  let upperPrice = price.mul(FullBPSDecimal.add(upperDiffBPS)).div(FullBPSDecimal);

  return { lowerPrice, upperPrice };
}

export function getResetRangeFromPriceAndDiffBPS(
  price: Decimal,
  lowerDiffBPS: Decimal,
  upperDiffBPS: Decimal,
  resetLowerDiffBPS: Decimal,
  resetUpperDiffBPS: Decimal
): PositionRange {
  let { lowerPrice, upperPrice } = getPriceRangeFromPriceAndDiffBPS(price, lowerDiffBPS, upperDiffBPS);

  let lowerPriceBPSPercentage = FullBPSDecimal.sub(lowerDiffBPS).div(FullBPSDecimal);
  let lowerResetPriceBPSPercentage = FullBPSDecimal.sub(resetLowerDiffBPS)
    .div(FullBPSDecimal)
    .mul(lowerPriceBPSPercentage);
  let resetLowerPrice = price.mul(FullBPSDecimal.sub(lowerResetPriceBPSPercentage)).div(FullBPSDecimal);

  let upperPriceBPSPercentage = FullBPSDecimal.add(upperDiffBPS);
  let upperResetPriceBPSPercentage = FullBPSDecimal.sub(resetUpperDiffBPS).mul(upperPriceBPSPercentage);
  let resetUpperPrice = lowerPrice.mul(FullBPSDecimal.sub(lowerResetPriceBPSPercentage)).div(FullBPSDecimal);

  return { lowerPrice: resetLowerPrice, upperPrice: resetUpperPrice };
}
