import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import DepositSnapshot from './DepositSnapshot';
import StabilityTokenMap from './StabilityTokenMap';

export type StabilityProviderStateWithJson = {
  version: number;
  stabilityPoolState: PublicKey;
  owner: PublicKey;

  userId: Decimal;
  depositedStablecoin: Decimal;
  userDepositSnapshot: DepositSnapshot;
  cumulativeGainsPerUser: StabilityTokenMap;
  pendingGainsPerUser: StabilityTokenMap;
  jsonResponse: string;
};
export default StabilityProviderStateWithJson;
