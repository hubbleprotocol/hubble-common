import CollateralAmounts from '../models/CollateralAmounts';
import {
  DECIMAL_FACTOR,
  DECIMALS_BTC,
  DECIMALS_ETH,
  DECIMALS_FTT,
  DECIMALS_RAY,
  DECIMALS_SRM,
  LAMPORTS_PER_MSOL,
  LAMPORTS_PER_SOL,
  SCALE_FACTOR,
  STABLECOIN_DECIMALS,
} from '../constants';
import { BN } from '@project-serum/anchor';
import Decimal from 'decimal.js';
import StabilityPoolState from '../models/StabilityPoolState';
import StabilityProviderState from '../models/StabilityProviderState';
import UserMetadata from '../models/UserMetadata';
import BorrowingMarketState from '../models/BorrowingMarketState';

/**
 * Divide all collateral amounts to convert from lamports to decimals
 */
export const lamportsToDecimal = (collateral: CollateralAmounts): CollateralAmounts => {
  return {
    sol: collateral.sol.div(LAMPORTS_PER_SOL),
    btc: collateral.btc.div(DECIMALS_BTC),
    msol: collateral.msol.div(LAMPORTS_PER_MSOL),
    ray: collateral.ray.div(DECIMALS_RAY),
    ftt: collateral.ftt.div(DECIMALS_FTT),
    eth: collateral.eth.div(DECIMALS_ETH),
    srm: collateral.srm.div(DECIMALS_SRM),
  };
};

/**
 * Replace all big numbers ({@link BN} with {@link Decimal}) of an object
 * We use this because Anchor deserializes everything to BN, but it doesn't support decimals.
 * @param obj Object of type T
 */
export const replaceBigNumberWithDecimal = <T>(obj: T): T => {
  for (let [key, value] of Object.entries(obj)) {
    if (value instanceof BN) {
      // @ts-ignore
      obj[key] = new Decimal(value.toString());
    }
  }
  return obj;
};

/**
 * Calculate stability provider's actual stability provided
 * @param stabilityPoolState
 * @param stabilityProviderState
 */
export const calculateStabilityProvided = (
  stabilityPoolState: StabilityPoolState,
  stabilityProviderState: StabilityProviderState
) => {
  if (stabilityProviderState.depositedStablecoin.isZero() || !stabilityProviderState.userDepositSnapshot.enabled) {
    return new Decimal(0);
  }
  if (stabilityProviderState.userDepositSnapshot.epoch < stabilityPoolState.currentEpoch) {
    return new Decimal(0);
  }
  const scaleDiff = stabilityPoolState.currentScale.minus(stabilityProviderState.userDepositSnapshot.scale);
  if (scaleDiff.isZero()) {
    return stabilityProviderState.depositedStablecoin
      .mul(stabilityPoolState.p)
      .dividedBy(stabilityProviderState.userDepositSnapshot.product);
  }
  return stabilityProviderState.depositedStablecoin
    .mul(stabilityPoolState.p)
    .dividedBy(stabilityProviderState.userDepositSnapshot.product.dividedBy(SCALE_FACTOR));
};

/**
 * Add all collateral amounts to the second one
 * @param first
 * @param second
 */
export const addCollateralAmounts = (first: CollateralAmounts, second: CollateralAmounts): CollateralAmounts => {
  return {
    sol: first.sol.add(second.sol),
    eth: first.eth.add(second.eth),
    ftt: first.ftt.add(second.ftt),
    ray: first.ray.add(second.ray),
    btc: first.btc.add(second.btc),
    srm: first.srm.add(second.srm),
    msol: first.msol.add(second.msol),
  };
};

/**
 * Calculate pending rewards debt
 * @param market
 * @param user
 */
const calculatePendingDebt = (market: BorrowingMarketState, user: UserMetadata): Decimal => {
  const diffStableRpt = market.stablecoinRewardPerToken.minus(user.userStablecoinRewardPerToken);
  return user.status !== 1 || diffStableRpt.isZero()
    ? new Decimal(0)
    : diffStableRpt.mul(user.userStake).div(DECIMAL_FACTOR);
};

/**
 * Calculate the user's total debt (borrowed stablecoin + pending rewards)
 * @param user
 * @param market
 */
export function calculateUserDebt(user: UserMetadata, market: BorrowingMarketState) {
  const pendingDebt = calculatePendingDebt(market, user);
  return user.borrowedStablecoin.add(pendingDebt).dividedBy(STABLECOIN_DECIMALS);
}
