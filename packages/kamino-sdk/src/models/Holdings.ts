import Decimal from 'decimal.js';
import { TokenAmounts } from '../Kamino';

export type Holdings = {
  available: TokenAmounts;
  availableUsd: Decimal;
  invested: TokenAmounts;
  investedUsd: Decimal;
  total_sum: Decimal;
};
