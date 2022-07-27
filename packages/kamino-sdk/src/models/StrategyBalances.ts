import { Holdings } from './Holdings';
import { StrategyVaultBalances } from './StrategyVaultBalances';

export type StrategyBalances = {
  computedHoldings: Holdings;
  vaultBalances: StrategyVaultBalances;
};
