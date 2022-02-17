import { PublicKey } from '@solana/web3.js';
import CollateralAmounts from './CollateralAmounts';

type UserMetadata = {
  status: number;
  depositedCollateral: CollateralAmounts;
  inactiveCollateral: CollateralAmounts;
  version: number;
  userId: number;
  owner: PublicKey;
  borrowingMarketState: PublicKey;
  metadataPk: PublicKey;
  stablecoinAta: PublicKey;
  borrowedStablecoin: number;
  userCollateralRewardPerToken: CollateralAmounts;
  userStablecoinRewardPerToken: number;
  userStake: number;

  collateralRatio: number;
  collateralValue: number;
};
export default UserMetadata;
