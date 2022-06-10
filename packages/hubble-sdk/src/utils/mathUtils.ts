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
  EPOCH_TO_SCALE_TO_SUM_TOKENS,
  HBB_DECIMALS,
} from '../constants';
import { BN } from '@project-serum/anchor';
import Decimal from 'decimal.js';
import StabilityPoolState from '../models/StabilityPoolState';
import StabilityProviderState from '../models/StabilityProviderState';
import UserMetadata from '../models/UserMetadata';
import BorrowingMarketState from '../models/BorrowingMarketState';
import { StabilityTokenMap } from '../models';

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
    extraCollaterals: [], //todo
  };
};

/**
 * Divide all token map big amounts to convert from lamports to decimals
 */
export const lamportsTokenToDecimal = (collateral: TokenMapBig): TokenMapBig => {
  return {
    sol: collateral.sol.div(LAMPORTS_PER_SOL),
    btc: collateral.btc.div(DECIMALS_BTC),
    msol: collateral.msol.div(LAMPORTS_PER_MSOL),
    ray: collateral.ray.div(DECIMALS_RAY),
    ftt: collateral.ftt.div(DECIMALS_FTT),
    eth: collateral.eth.div(DECIMALS_ETH),
    srm: collateral.srm.div(DECIMALS_SRM),
    hbb: collateral.hbb.div(HBB_DECIMALS),
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
    extraCollaterals: [],
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
    extraCollaterals: [],
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
    extraCollaterals: [],
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
    extraCollaterals: [],
  };
}

export type TokenMapBig = {
  sol: Decimal;
  eth: Decimal;
  btc: Decimal;
  srm: Decimal;
  ray: Decimal;
  ftt: Decimal;
  hbb: Decimal;
  msol: Decimal;
};

export type EpochToScaleToSum = TokenMapBig[][];

function deserializeEpoch(data: Decimal[]): TokenMapBig[][] {
  const hmap = [];
  const numEpochs = data[1].toNumber();
  let currentCursor = 1;
  for (let i = 0; i < numEpochs; i++) {
    const scale = [];
    currentCursor += 1;
    const scaleLength = data[currentCursor].toNumber();
    for (let j = 0; j < scaleLength; j++) {
      const tokenMap: TokenMapBig = {
        sol: new Decimal(data[currentCursor + 1]),
        eth: new Decimal(data[currentCursor + 2]),
        btc: new Decimal(data[currentCursor + 3]),
        srm: new Decimal(data[currentCursor + 4]),
        ray: new Decimal(data[currentCursor + 5]),
        ftt: new Decimal(data[currentCursor + 6]),
        hbb: new Decimal(data[currentCursor + 7]),
        msol: new Decimal(data[currentCursor + 8]),
      };
      scale.push(tokenMap);
      currentCursor += EPOCH_TO_SCALE_TO_SUM_TOKENS;
    }

    hmap.push(scale);
  }
  return hmap;
}

export function calculatePendingGains(
  stabilityPoolState: StabilityPoolState,
  stabilityProviderState: StabilityProviderState,
  epochToScaleToSum: Decimal[]
): StabilityTokenMap {
  const deserializedEpochToScaleToSum = deserializeEpoch(epochToScaleToSum);
  const pendingGains = getPendingGains(stabilityProviderState, deserializedEpochToScaleToSum);
  return lamportsTokenToDecimal(pendingGains);
}

function getPendingGains(
  stabilityProviderState: StabilityProviderState,
  epochToScaleToSum: TokenMapBig[][]
): TokenMapBig {
  const oldPendingGain = stabilityProviderState.pendingGainsPerUser;
  const oldPendingGainBig: TokenMapBig = {
    sol: new Decimal(oldPendingGain.sol),
    eth: new Decimal(oldPendingGain.eth),
    btc: new Decimal(oldPendingGain.btc),
    ftt: new Decimal(oldPendingGain.ftt),
    ray: new Decimal(oldPendingGain.ray),
    srm: new Decimal(oldPendingGain.srm),
    hbb: new Decimal(oldPendingGain.hbb),
    msol: new Decimal(oldPendingGain.msol),
  };
  const newPendingGains = getDepositorPendingGain(stabilityProviderState, epochToScaleToSum);
  return add(oldPendingGainBig, newPendingGains);
}

function add(left: TokenMapBig, right: TokenMapBig): TokenMapBig {
  return {
    sol: left.sol.add(right.sol),
    eth: left.eth.add(right.eth),
    btc: left.btc.add(right.btc),
    srm: left.srm.add(right.srm),
    ray: left.ray.add(right.ray),
    ftt: left.ftt.add(right.ftt),
    hbb: left.hbb.add(right.hbb),
    msol: left.msol.add(right.msol),
  };
}

function subBig(left: TokenMapBig, right: TokenMapBig): TokenMapBig {
  return {
    sol: left.sol.sub(right.sol),
    eth: left.eth.sub(right.eth),
    btc: left.btc.sub(right.btc),
    srm: left.srm.sub(right.srm),
    ray: left.ray.sub(right.ray),
    ftt: left.ftt.sub(right.ftt),
    hbb: left.hbb.sub(right.hbb),
    msol: left.msol.sub(right.msol),
  };
}

function getDepositorPendingGain(
  stabilityProviderState: StabilityProviderState,
  epochToScaleToSum: EpochToScaleToSum
): TokenMapBig {
  const initialDeposit = stabilityProviderState.depositedStablecoin;
  if (initialDeposit.isZero()) {
    return {
      sol: new Decimal(0),
      eth: new Decimal(0),
      btc: new Decimal(0),
      srm: new Decimal(0),
      ray: new Decimal(0),
      ftt: new Decimal(0),
      hbb: new Decimal(0),
      msol: new Decimal(0),
    };
  }
  const depositSnapshot = stabilityProviderState.userDepositSnapshot;

  const epochSnapshot = depositSnapshot.epoch;
  const scaleSnapshot = depositSnapshot.scale;

  const sumSnapshot = depositSnapshot.sum;
  const productSnapshot = depositSnapshot.product;

  const sSnapshotBig: TokenMapBig = {
    sol: new Decimal(sumSnapshot.sol),
    eth: new Decimal(sumSnapshot.eth),
    btc: new Decimal(sumSnapshot.btc),
    srm: new Decimal(sumSnapshot.srm),
    ray: new Decimal(sumSnapshot.ray),
    ftt: new Decimal(sumSnapshot.ftt),
    hbb: new Decimal(sumSnapshot.hbb),
    msol: new Decimal(sumSnapshot.msol),
  };

  const firstPortion = subBig(
    getSum(epochToScaleToSum, epochSnapshot.toNumber(), scaleSnapshot.toNumber()),
    sSnapshotBig
  );
  const secondPortion = div(
    getSum(epochToScaleToSum, epochSnapshot.toNumber(), scaleSnapshot.add(1).toNumber()),
    new Decimal(SCALE_FACTOR)
  );

  return divb(div(mul(add(firstPortion, secondPortion), initialDeposit), productSnapshot), DECIMAL_FACTOR);
}

function getSum(epochToScaletoSum: EpochToScaleToSum, epoch: number, scale: number): TokenMapBig {
  if (epoch < epochToScaletoSum.length) {
    if (scale < epochToScaletoSum[epoch].length) {
      return epochToScaletoSum[epoch][scale];
    }
  }

  return {
    sol: new Decimal(0),
    eth: new Decimal(0),
    btc: new Decimal(0),
    srm: new Decimal(0),
    ray: new Decimal(0),
    ftt: new Decimal(0),
    hbb: new Decimal(0),
    msol: new Decimal(0),
  };
}

function div(left: TokenMapBig, right: Decimal): TokenMapBig {
  return {
    sol: left.sol.div(right),
    eth: left.eth.div(right),
    btc: left.btc.div(right),
    srm: left.srm.div(right),
    ray: left.ray.div(right),
    ftt: left.ftt.div(right),
    hbb: left.hbb.div(right),
    msol: left.msol.div(right),
  };
}

function divb(left: TokenMapBig, right: Decimal): TokenMapBig {
  return {
    sol: left.sol.dividedBy(right),
    eth: left.eth.dividedBy(right),
    btc: left.btc.dividedBy(right),
    srm: left.srm.dividedBy(right),
    ray: left.ray.dividedBy(right),
    ftt: left.ftt.dividedBy(right),
    hbb: left.hbb.dividedBy(right),
    msol: left.msol.dividedBy(right),
  };
}

function mul(left: TokenMapBig, right: Decimal): TokenMapBig {
  return {
    sol: left.sol.mul(right),
    eth: left.eth.mul(right),
    btc: left.btc.mul(right),
    srm: left.srm.mul(right),
    ray: left.ray.mul(right),
    ftt: left.ftt.mul(right),
    hbb: left.hbb.mul(right),
    msol: left.msol.mul(right),
  };
}
