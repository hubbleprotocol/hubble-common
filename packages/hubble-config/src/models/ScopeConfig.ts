import { PublicKey } from '@solana/web3.js';

export type ScopeConfig = {
  programId: PublicKey;
  oraclePrices: PublicKey;
  oracleMappings: PublicKey;
  configurationAccount: PublicKey;
};
