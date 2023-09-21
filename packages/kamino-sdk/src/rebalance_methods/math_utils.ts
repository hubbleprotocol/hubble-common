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
  let resetLowerPrice = price
    .mul(FullBPSDecimal.sub(resetLowerDiffBPS.mul(lowerDiffBPS).div(FullBPSDecimal)))
    .div(FullBPSDecimal);
  let resetUpperPrice = price
    .mul(FullBPSDecimal.add(resetUpperDiffBPS.mul(upperDiffBPS).div(FullBPSDecimal)))
    .div(FullBPSDecimal);
  return { lowerPrice: resetLowerPrice, upperPrice: resetUpperPrice };
}
