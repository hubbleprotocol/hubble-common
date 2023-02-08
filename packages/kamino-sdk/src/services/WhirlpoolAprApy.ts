import Decimal from 'decimal.js';

export interface WhirlpoolAprApy {
  totalApr: Decimal;
  totalApy: Decimal;
  feeApr: Decimal;
  feeApy: Decimal;
  rewardsApr: Decimal[];
  rewardsApy: Decimal[];
  priceLower: Decimal;
  priceUpper: Decimal;
  poolPrice: Decimal;
  strategyOutOfRange: boolean;
}
