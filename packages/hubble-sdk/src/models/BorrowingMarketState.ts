import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';
import CollateralAmounts from './CollateralAmounts';

type BorrowingMarketState = {
  version: number;
  initialMarketOwner: PublicKey;
  redemptionsQueue: PublicKey;
  stablecoinMint: PublicKey;
  stablecoinMintAuthority: PublicKey;
  stablecoinMintSeed: number;
  hbbMint: PublicKey;
  hbbMintAuthority: PublicKey;
  hbbMintSeed: number;
  numUsers: BN;
  numActiveUsers: BN;
  stablecoinBorrowed: number;
  depositedCollateral: CollateralAmounts;
  inactiveCollateral: CollateralAmounts;
  bootstrapPeriodTimestamp: number;
  baseRateBps: number;
  lastFeeEvent: number;
  redistributedStablecoin: number;
  totalStake: number;
  collateralRewardPerToken: CollateralAmounts;
  stablecoinRewardPerToken: number;
  totalStakeSnapshot: number;
  borrowedStablecoinSnapshot: number;
};

export default BorrowingMarketState;
