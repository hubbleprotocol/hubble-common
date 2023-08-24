import Decimal from 'decimal.js';

export type StrategyPrices = {
  aPrice: Decimal;
  bPrice: Decimal;
  reward0Price: Decimal | null;
  reward1Price: Decimal | null;
  reward2Price: Decimal | null;
};
