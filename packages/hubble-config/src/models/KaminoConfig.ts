import { PublicKey } from '@solana/web3.js';

export type KaminoConfig = {
  mints: {
    usdt: PublicKey;
    usdh: PublicKey;
    usdc: PublicKey;
    stsol: PublicKey;
    msol: PublicKey;
    sol: PublicKey;
  };
  strategies: KaminoStrategy[];
  programId: PublicKey;
};

export type KaminoStrategy = {
  address: PublicKey;
  collateralA: string;
  collateralB: string;
};
