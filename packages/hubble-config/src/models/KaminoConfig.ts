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

export type KaminoLendingConfig = Array<KaminoMarketConfig>;

export type KaminoMarketConfig = {
  lendingMarket: PublicKey;
  lendingMarketAuthority: PublicKey;
  isPrimary: boolean;
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
  shareMint: PublicKey;
  status: 'SHADOW' | 'LIVE' | 'DEPRECATED';
};

export type ReserveInfo = {
  liquidityToken: {
    decimals: number;
    symbol: string;
    mint: PublicKey;
  };
  address: PublicKey;
  collateralMint: PublicKey;
  collateralSupply: PublicKey;
  liquiditySupply: PublicKey;
  liquidityFeeReceiverAddress: PublicKey;
  pythOracle: PublicKey;
  switchboardOracle: PublicKey;
};
