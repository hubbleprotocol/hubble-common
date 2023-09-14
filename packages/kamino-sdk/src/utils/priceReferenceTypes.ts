import { PriceReferenceType } from './types';

export const PoolPriceReferenceType: PriceReferenceType = {
  name: 'Pool',
  description: "Use the pool's current price as the reference price for rebalancing",
};

export const TwapPriceReferenceType: PriceReferenceType = {
  name: 'TWAP price',
  description: 'Use the time weighted average price as the reference price for rebalancing',
};
