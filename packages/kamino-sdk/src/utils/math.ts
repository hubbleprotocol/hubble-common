import Decimal from 'decimal.js';

export function aprToApy(apr: Decimal, compoundPeriods: number) {
  // if periods = 365 => daily compound
  // periods = 1 => yearly compound
  // (1 + apr / periods) ** periods - 1;
  return new Decimal(1).add(apr.div(compoundPeriods)).pow(compoundPeriods).sub(1);
}

export const ZERO = new Decimal(0);
