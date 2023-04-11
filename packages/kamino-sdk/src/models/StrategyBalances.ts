import { Holdings } from './Holdings';
import { PriceData } from './PriceData';
import Decimal from 'decimal.js';
import StrategyWithAddress from './StrategyWithAddress';

export type StrategyBalances = {
  computedHoldings: Holdings;
  prices: PriceData;
  tokenAAmounts: Decimal;
  tokenBAmounts: Decimal;
};
export type StrategyBalanceWithAddress = {
  balance: StrategyBalances;
  strategyWithAddress: StrategyWithAddress;
};
