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
const getPendingDebt = (market: BorrowingMarketState, user: UserMetadata): Decimal => {
  const diffStableRpt = market.stablecoinRewardPerToken.minus(user.userStablecoinRewardPerToken);
  return user.status !== 1 || diffStableRpt.isZero()
    ? new Decimal(0)
    : diffStableRpt.mul(user.userStake).div(DECIMAL_FACTOR);
};

/**
 * Calculate pending rewards debt
 * @param market
 * @param user
 */
const getPendingCollateral = (market: BorrowingMarketState, user: UserMetadata): CollateralAmounts => {
  const diffCollRpt = sub(market.collateralRewardPerToken, user.userCollateralRewardPerToken);
  return user.status !== 1 || isZero(diffCollRpt)
    ? zeroCollateral()
    : mulFrac(diffCollRpt, user.userStake, DECIMAL_FACTOR);
};

/**
 * Calculate the user's total USDH debt (borrowed stablecoin + pending rewards)
 * @param user
 * @param market
 */
export function calculateTotalDebt(user: UserMetadata, market: BorrowingMarketState) {
  const pendingDebt = getPendingDebt(market, user);
  return user.borrowedStablecoin.add(pendingDebt).dividedBy(STABLECOIN_DECIMALS);
}

/**
 * Calculate the user's total collateral debt (collateral + pending rewards)
 * @param user
 * @param market
 */
export function calculateTotalCollateral(user: UserMetadata, market: BorrowingMarketState) {
  const pendingCollateral = getPendingCollateral(market, user);
  const collateral = addCollateralAmounts(
    lamportsToDecimal(user.depositedCollateral),
    lamportsToDecimal(user.inactiveCollateral)
  );
  return addCollateralAmounts(pendingCollateral, collateral);
}

/**
 * Subtract collateral amounts
 * @param left
 * @param right
 */
export function sub(left: CollateralAmounts, right: CollateralAmounts): CollateralAmounts {
  return {
    sol: left.sol.minus(right.sol),
    btc: left.btc.minus(right.btc),
    eth: left.eth.minus(right.eth),
    ftt: left.ftt.minus(right.ftt),
    ray: left.ray.minus(right.ray),
    srm: left.srm.minus(right.srm),
    msol: left.msol.minus(right.msol),
  };
}

/**
 * Returns true if all collateral amounts equal zero
 * @param coll
 */
export function isZero(coll: CollateralAmounts): boolean {
  return (
    coll.sol.isZero() &&
    coll.btc.isZero() &&
    coll.eth.isZero() &&
    coll.ftt.isZero() &&
    coll.ray.isZero() &&
    coll.srm.isZero() &&
    coll.msol.isZero()
  );
}

/**
 * Create new collateral amounts with 0 collateral
 */
export function zeroCollateral(): CollateralAmounts {
  return {
    sol: new Decimal(0),
    btc: new Decimal(0),
    eth: new Decimal(0),
    ftt: new Decimal(0),
    ray: new Decimal(0),
    srm: new Decimal(0),
    msol: new Decimal(0),
  };
}

/**
 Transforms collateral amounts multiplying by the fraction
 * @param coll
 * @param numerator
 * @param denominator
 */
export function mulFrac(coll: CollateralAmounts, numerator: Decimal, denominator: Decimal): CollateralAmounts {
  return {
    sol: new Decimal(coll.sol).div(denominator).mul(numerator),
    btc: new Decimal(coll.btc).div(denominator).mul(numerator),
    eth: new Decimal(coll.eth).div(denominator).mul(numerator),
    ftt: new Decimal(coll.ftt).div(denominator).mul(numerator),
    ray: new Decimal(coll.ray).div(denominator).mul(numerator),
    srm: new Decimal(coll.srm).div(denominator).mul(numerator),
    msol: new Decimal(coll.msol).div(denominator).mul(numerator),
  };
}
