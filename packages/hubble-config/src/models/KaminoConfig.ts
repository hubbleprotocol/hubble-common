import { PublicKey } from '@solana/web3.js';

export type KaminoConfig = {
  mints: CollateralMint[];
  strategies: KaminoStrategy[];
  programId: PublicKey;
};

export type CollateralMint = {
  address: PublicKey;
  scopeToken: string;
};

export type KaminoStrategy = {
  address: PublicKey;
  collateralA: string;
  collateralB: string;
};
