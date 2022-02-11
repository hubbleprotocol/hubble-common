import { PublicKey } from '@solana/web3.js';

export type VaultConfig = {
  pool: PublicKey;
  authority: PublicKey;
};