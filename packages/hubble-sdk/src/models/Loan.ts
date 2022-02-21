import Decimal from 'decimal.js';
import CollateralAmounts from './CollateralAmounts';

type Loan = {
  usdhDebt: Decimal;
  collateral: CollateralAmounts;
};

export default Loan;
