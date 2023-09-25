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
  let resetLowerFactor = resetLowerDiffBPS.mul(lowerDiffBPS).div(FullBPSDecimal);
  let resetUpperFactor = resetUpperDiffBPS.mul(upperDiffBPS).div(FullBPSDecimal);
  let resetLowerPrice = price.mul(FullBPSDecimal.sub(resetLowerFactor)).div(FullBPSDecimal);
  let resetUpperPrice = price.mul(FullBPSDecimal.add(resetUpperFactor)).div(FullBPSDecimal);
  return { lowerPrice: resetLowerPrice, upperPrice: resetUpperPrice };
}
