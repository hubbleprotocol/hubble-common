import { PublicKey } from '@solana/web3.js';

export type KaminoConfig = {
  mints: {
    usdt: PublicKey;
    usdh: PublicKey;
    usdc: PublicKey;
    stsol: PublicKey;
    msol: PublicKey;
    sol: PublicKey;
    solMsol: PublicKey;
    solStsol: PublicKey;
    usdcUsdt: PublicKey;
    usdhUsdc: PublicKey;
    usdhUsdt: PublicKey;
  };
};
