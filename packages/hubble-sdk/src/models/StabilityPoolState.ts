import { PublicKey } from '@solana/web3.js';
import StabilityTokenMap from './StabilityTokenMap';
import Decimal from 'decimal.js';

type StabilityPoolState = {
  borrowingMarketState: PublicKey;

  epochToScaleToSum: PublicKey;
  liquidationsQueue: PublicKey;

  version: Decimal;
  numUsers: Decimal;
  totalUsersProvidingStability: Decimal;
  stablecoinDeposited: Decimal;
  hbbEmissionsStartTs: Decimal;

  cumulativeGainsTotal: StabilityTokenMap;
  pendingCollateralGains: StabilityTokenMap;
  currentEpoch: Decimal;
  currentScale: Decimal;
  p: Decimal;

  lastStablecoinLossErrorOffset: Decimal;
  lastCollLossErrorOffset: StabilityTokenMap;
  lastIssuanceTimestamp: Decimal;
};

export default StabilityPoolState;
