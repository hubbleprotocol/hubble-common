// Source: https://raw.githubusercontent.com/orca-so/whirlpool-sdk/main/src/position/quotes/remove-liquidity.ts
/**
 * Added roundUp flag to accurately estimate token holdings for deposits
 */
import { tickIndexToSqrtPriceX64 } from "@orca-so/whirlpool-client-sdk";
import { BN } from "@project-serum/anchor";
import { u64 } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { Percentage, ZERO } from "@orca-so/sdk";
import { adjustForSlippage, getTokenAFromLiquidity,
  getTokenBFromLiquidity, PositionStatus, PositionUtil, RemoveLiquidityQuote } from "@orca-so/whirlpool-sdk";

export type InternalRemoveLiquidityQuoteParam = {
  positionAddress: PublicKey;
  tickCurrentIndex: number;
  sqrtPrice: BN;
  tickLowerIndex: number;
  tickUpperIndex: number;
  liquidity: u64;
  slippageTolerance: Percentage;
};

export function getRemoveLiquidityQuote(
  param: InternalRemoveLiquidityQuoteParam,
  roundUp: boolean = false,
): RemoveLiquidityQuote {
  const positionStatus = PositionUtil.getPositionStatus(
    param.tickCurrentIndex,
    param.tickLowerIndex,
    param.tickUpperIndex
  );

  switch (positionStatus) {
    case PositionStatus.BelowRange:
      return getRemoveLiquidityQuoteWhenPositionIsBelowRange(param, roundUp);
    case PositionStatus.InRange:
      return getRemoveLiquidityQuoteWhenPositionIsInRange(param, roundUp);
    case PositionStatus.AboveRange:
      return getRemoveLiquidityQuoteWhenPositionIsAboveRange(param, roundUp);
    default:
      throw new Error(`type ${positionStatus} is an unknown PositionStatus`);
  }
}

function getRemoveLiquidityQuoteWhenPositionIsBelowRange(
  param: InternalRemoveLiquidityQuoteParam,
  roundUp: boolean = false,
): RemoveLiquidityQuote {
  const { positionAddress, tickLowerIndex, tickUpperIndex, liquidity, slippageTolerance } = param;

  const sqrtPriceLowerX64 = tickIndexToSqrtPriceX64(tickLowerIndex);
  const sqrtPriceUpperX64 = tickIndexToSqrtPriceX64(tickUpperIndex);

  const estTokenA = getTokenAFromLiquidity(liquidity, sqrtPriceLowerX64, sqrtPriceUpperX64, roundUp);
  const minTokenA = adjustForSlippage(estTokenA, slippageTolerance, roundUp);

  return {
    positionAddress,
    minTokenA,
    minTokenB: ZERO,
    estTokenA,
    estTokenB: ZERO,
    liquidity,
  };
}

function getRemoveLiquidityQuoteWhenPositionIsInRange(
  param: InternalRemoveLiquidityQuoteParam,
  roundUp: boolean = false,
): RemoveLiquidityQuote {
  const {
    positionAddress,
    sqrtPrice,
    tickLowerIndex,
    tickUpperIndex,
    liquidity,
    slippageTolerance,
  } = param;

  const sqrtPriceX64 = sqrtPrice;
  const sqrtPriceLowerX64 = tickIndexToSqrtPriceX64(tickLowerIndex);
  const sqrtPriceUpperX64 = tickIndexToSqrtPriceX64(tickUpperIndex);

  const estTokenA = getTokenAFromLiquidity(liquidity, sqrtPriceX64, sqrtPriceUpperX64, roundUp);
  const minTokenA = adjustForSlippage(estTokenA, slippageTolerance, roundUp);

  const estTokenB = getTokenBFromLiquidity(liquidity, sqrtPriceLowerX64, sqrtPriceX64, roundUp);
  const minTokenB = adjustForSlippage(estTokenB, slippageTolerance, roundUp);

  return {
    positionAddress,
    minTokenA,
    minTokenB,
    estTokenA,
    estTokenB,
    liquidity,
  };
}

function getRemoveLiquidityQuoteWhenPositionIsAboveRange(
  param: InternalRemoveLiquidityQuoteParam,
  roundUp: boolean = false,

): RemoveLiquidityQuote {
  const {
    positionAddress,
    tickLowerIndex,
    tickUpperIndex,
    liquidity,
    slippageTolerance: slippageTolerance,
  } = param;

  const sqrtPriceLowerX64 = tickIndexToSqrtPriceX64(tickLowerIndex);
  const sqrtPriceUpperX64 = tickIndexToSqrtPriceX64(tickUpperIndex);

  const estTokenB = getTokenBFromLiquidity(liquidity, sqrtPriceLowerX64, sqrtPriceUpperX64, roundUp);
  const minTokenB = adjustForSlippage(estTokenB, slippageTolerance, roundUp);

  return {
    positionAddress,
    minTokenA: ZERO,
    minTokenB,
    estTokenA: ZERO,
    estTokenB,
    liquidity,
  };
}
