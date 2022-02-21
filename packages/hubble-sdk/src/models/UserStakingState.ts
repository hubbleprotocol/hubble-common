import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';

type UserStakingState = {
  version: number;
  userId: Decimal;
  stakingPoolState: PublicKey;
  owner: PublicKey;
  userStake: Decimal;
  rewardsTally: Decimal;
};

export default UserStakingState;
