import Decimal from 'decimal.js';

export function aprToApy(apr: Decimal) {
  return apr.dividedBy(365).plus(1).pow(365).minus(1);
}
