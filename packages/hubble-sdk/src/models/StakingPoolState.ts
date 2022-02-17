import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';

type StakingPoolState = {
  // Borrowing market the pool belongs to
  borrowingMarketState: PublicKey;
  // Metadata used for analytics
  totalDistributedRewards: number;
  rewardsNotYetClaimed: number;
  // Data used to calculate the rewards of the user
  version: number;
  numUsers: BN;
  totalUsersProvidingStability: number;
  totalStake: number;
  rewardPerToken: number;
  prevRewardLoss: number;

  stakingVault: PublicKey;
  stakingVaultAuthority: PublicKey;
  stakingVaultSeed: number;

  treasuryVault: PublicKey;
};
export default StakingPoolState;
