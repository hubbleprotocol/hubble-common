import Decimal from 'decimal.js';

export type CollateralTotals = {
  deposited: Decimal;
  inactive: Decimal;
  price: Decimal;
  token: string;
};

export default CollateralTotals;
