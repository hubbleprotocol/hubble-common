import Decimal from 'decimal.js';
import { StrategyBalances } from './StrategyBalances';

export type ShareData = {
  balance?: StrategyBalances;
  price: Decimal;
};

export default ShareData;
