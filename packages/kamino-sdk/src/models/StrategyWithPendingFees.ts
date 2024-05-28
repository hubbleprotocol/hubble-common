import { TokenAmounts } from './TokenAmounts';
import StrategyWithAddress from './StrategyWithAddress';

export type StrategyWithPendingFees = {
  strategy: StrategyWithAddress;
  pendingFees: TokenAmounts;
};
