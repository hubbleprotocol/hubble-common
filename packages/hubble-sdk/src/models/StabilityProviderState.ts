import { PublicKey } from '@solana/web3.js';
import StabilityTokenMap from './StabilityTokenMap';
import DepositSnapshot from './DepositSnapshot';

type StabilityProviderState = {
  version: number;
  stabilityPoolState: PublicKey;
  owner: PublicKey;
  userId: number;
  depositedStablecoin: number;
  userDepositSnapshot: DepositSnapshot;
  cumulativeGainsPerUser: StabilityTokenMap;
  pendingGainsPerUser: StabilityTokenMap;
};
export default StabilityProviderState;
