import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';

export type StrategyHolder = {
  holderPubkey: PublicKey;
  amount: Decimal;
};
