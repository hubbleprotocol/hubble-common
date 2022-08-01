import { PublicKey } from '@solana/web3.js';
import { SupportedToken } from '@hubbleprotocol/scope-sdk';

export type KaminoConfig = {
  mints: CollateralMint[];
  strategies: KaminoStrategy[];
  programId: PublicKey;
};

export type CollateralMint = {
  address: PublicKey;
  scopeToken: SupportedToken;
};

export type KaminoStrategy = {
  address: PublicKey;
  collateralA: string;
  collateralB: string;
};
