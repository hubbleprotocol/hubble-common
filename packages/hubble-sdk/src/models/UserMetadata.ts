import { PublicKey } from '@solana/web3.js';
import CollateralAmounts from './CollateralAmounts';
import Decimal from 'decimal.js';

export type UserMetadata = {
  version: number;
  status: number;
  userId: Decimal;
  metadataPk: PublicKey;
  owner: PublicKey;
  borrowingMarketState: PublicKey;

  inactiveCollateral: CollateralAmounts;
  depositedCollateral: CollateralAmounts;
  borrowedStablecoin: Decimal;

  userStake: Decimal;
  userCollateralRewardPerToken: CollateralAmounts;
  userStablecoinRewardPerToken: Decimal;

  marketType: Decimal;
};
export default UserMetadata;
