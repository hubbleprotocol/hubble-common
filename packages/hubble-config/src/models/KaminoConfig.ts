import { PublicKey } from '@solana/web3.js';

export type KaminoConfig = {
  mints: CollateralMint[];
  strategies: PublicKey[];
  whirlpoolsToSnapshot: WhirlpoolToSnapshot[];
  programId: PublicKey;
};

export type CollateralMint = {
  address: PublicKey;
  scopeToken: string;
};
export type WhirlpoolToSnapshot = {
  address: PublicKey;
  collateralA: string;
  collateralB: string;
  mintA: PublicKey;
  mintB: PublicKey;
};
