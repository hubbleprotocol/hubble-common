import Decimal from 'decimal.js';

export interface AprApyInfo {
  totalApr: Decimal;
  totalApy: Decimal;
  feeApr: Decimal;
  feeApy: Decimal;
  rewardsApr: Decimal[];
  rewardsApy: Decimal[];
}
