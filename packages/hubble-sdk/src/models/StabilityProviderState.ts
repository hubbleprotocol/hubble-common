import { PublicKey } from '@solana/web3.js';
import StabilityTokenMap from './StabilityTokenMap';
import DepositSnapshot from './DepositSnapshot';
import Decimal from 'decimal.js';

export type StabilityProviderState = {
  version: number;
  stabilityPoolState: PublicKey;
  owner: PublicKey;

  userId: Decimal;
  depositedStablecoin: Decimal;
  userDepositSnapshot: DepositSnapshot;
  cumulativeGainsPerUser: StabilityTokenMap;
  pendingGainsPerUser: StabilityTokenMap;
};
export default StabilityProviderState;
