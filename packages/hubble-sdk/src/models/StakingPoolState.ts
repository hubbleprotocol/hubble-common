import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';

type StakingPoolState = {
  // Borrowing market the pool belongs to
  borrowingMarketState: PublicKey;

  // Metadata used for analytics
  totalDistributedRewards: Decimal;
  rewardsNotYetClaimed: Decimal;

  // Data used to calculate the rewards of the user
  version: number;
  numUsers: Decimal;
  totalUsersProvidingStability: Decimal;
  totalStake: Decimal;
  rewardPerToken: Decimal;
  prevRewardLoss: Decimal;

  stakingVault: PublicKey;
  stakingVaultAuthority: PublicKey;
  stakingVaultSeed: number;

  treasuryVault: PublicKey;
  treasuryVaultAuthority: PublicKey;
  treasuryVaultSeed: number;
};
export default StakingPoolState;
