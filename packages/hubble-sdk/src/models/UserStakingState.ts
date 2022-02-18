import { PublicKey } from '@solana/web3.js';
import { BN } from '@project-serum/anchor';

type UserStakingState = {
  version: number;
  userId: BN;
  stakingPoolState: PublicKey;
  owner: PublicKey;
  userStake: BN;
  rewardsTally: BN;
};

export default UserStakingState;
