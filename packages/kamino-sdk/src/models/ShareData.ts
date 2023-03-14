import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { StrategyBalances } from './StrategyBalances';

export type ShareData = {
  balance: StrategyBalances;
  price: Decimal;
};

export type ShareDataWithAddress = {
  shareData: ShareData;
  address: PublicKey;
};
