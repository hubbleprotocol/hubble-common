import { SupportedToken } from '../constants';
import Decimal from 'decimal.js';

type CollateralTotals = {
  deposited: Decimal;
  inactive: Decimal;
  price: Decimal;
  token: SupportedToken;
};

export default CollateralTotals;
