import Decimal from 'decimal.js';
import { TokenAmounts } from './TokenAmounts';

export type Holdings = {
  available: TokenAmounts;
  availableUsd: Decimal;
  invested: TokenAmounts;
  investedUsd: Decimal;
  totalSum: Decimal;
};

export type TokenHoldings = {
  available: TokenAmounts;
  invested: TokenAmounts;
};
