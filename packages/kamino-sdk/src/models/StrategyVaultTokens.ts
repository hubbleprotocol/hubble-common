import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';

export type StrategyVaultTokens = {
  address: PublicKey;
  frontendUrl: string;
  amount: Decimal;
};

export type TotalStrategyVaultTokens = {
  totalTokenAmount: Decimal;
  vaults: StrategyVaultTokens[];
  timestamp: Date;
};
