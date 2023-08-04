import { LiquidityForPrice } from './types';

/**
 * Used for swapping liquidity value of LD elements
 * @param data
 */
export const reverseLiquidityDistribution = (data: LiquidityForPrice[]) => {
  const result: LiquidityForPrice[] = [];
  for (let i = 0; i < data.length; i++) {
    const obj = data[i];
    const pairedObj = data[data.length - 1 - i];
    result[i] = {
      ...obj,
      liquidity: pairedObj.liquidity,
    };
  }
  return result;
};
