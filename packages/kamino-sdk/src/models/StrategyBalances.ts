import { Holdings } from './Holdings';
import { StrategyVaultBalances } from './StrategyVaultBalances';
import { PriceData } from './PriceData';
import Decimal from 'decimal.js';

export type StrategyBalances = {
  computedHoldings: Holdings;
  vaultBalances: StrategyVaultBalances;
  prices: PriceData;
  tokenAAmounts: Decimal;
  tokenBAmounts: Decimal;
};
