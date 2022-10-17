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
  tags: StrategyTag[];
};

export type StrategyTag = {
  tag: string;
  displayName: string;
};
