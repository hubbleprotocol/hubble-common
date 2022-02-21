import { PublicKey } from '@solana/web3.js';
import CollateralAmounts from './CollateralAmounts';
import Decimal from 'decimal.js';

type BorrowingMarketState = {
  version: number;
  initialMarketOwner: PublicKey;
  redemptionsQueue: PublicKey;
  redemption_candidates_queue: PublicKey;
  stablecoinMint: PublicKey;
  stablecoinMintAuthority: PublicKey;
  stablecoinMintSeed: number;
  hbbMint: PublicKey;
  hbbMintAuthority: PublicKey;
  hbbMintSeed: number;
  numUsers: Decimal;
  numActiveUsers: Decimal;
  stablecoinBorrowed: Decimal;
  depositedCollateral: CollateralAmounts;
  inactiveCollateral: CollateralAmounts;
  baseRateBps: number;
  lastFeeEvent: Decimal;
  redistributedStablecoin: Decimal;
  totalStake: Decimal;
  collateralRewardPerToken: CollateralAmounts;
  stablecoinRewardPerToken: Decimal;
  totalStakeSnapshot: Decimal;
  borrowedStablecoinSnapshot: Decimal;
};

export default BorrowingMarketState;
