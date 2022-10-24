import { PublicKey } from '@solana/web3.js';

export type KaminoConfig = {
  mints: CollateralMint[];
  // kamino strategies that we snapshot
  strategies: PublicKey[];
  // orca whirlpools that we snapshot
  whirlpoolsToSnapshot: WhirlpoolToSnapshot[];
  // live kamino strategies that are enabled on the frontend
  liveStrategies: StrategyInfo[];
  programId: PublicKey;
  globalConfig: PublicKey;
};

export type KaminoLendingConfig = {
  programId: PublicKey;
  lendingMarket: PublicKey;
  lendingMarketAuthority: PublicKey;
  reserves: ReserveInfo[];
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

export type StrategyInfo = {
  address: PublicKey;
  type: 'NON_PEGGED' | 'PEGGED' | 'STABLE';
};

export type ReserveInfo = {
  address: PublicKey;
  liquidityMint: PublicKey;
  collateralMint: PublicKey;
  collateralSupply: PublicKey;
  liquiditySupply: PublicKey;
};
