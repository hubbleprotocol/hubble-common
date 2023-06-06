import Decimal from 'decimal.js';

export type PriceData = {
  aPrice: Decimal;
  bPrice: Decimal;
  reward0Price: Decimal;
  reward1Price: Decimal;
  reward2Price: Decimal;
  lowerPrice: Decimal;
  upperPrice: Decimal;
  poolPrice: Decimal;
};

export default PriceData;
