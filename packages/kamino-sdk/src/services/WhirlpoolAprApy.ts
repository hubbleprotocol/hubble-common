import Decimal from 'decimal.js';

export interface WhirlpoolAprApy {
  totalApr: Decimal;
  totalApy: Decimal;
  feeApr: Decimal;
  feeApy: Decimal;
  rewardsApr: Decimal[];
  rewardsApy: Decimal[];
}

export function getEmptyWhirlpoolAprApy(): WhirlpoolAprApy {
  const zero = new Decimal(0);
  return {
    totalApr: zero,
    feeApr: zero,
    feeApy: zero,
    totalApy: zero,
    rewardsApr: [],
    rewardsApy: [],
  };
}
