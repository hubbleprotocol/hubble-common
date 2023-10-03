import Decimal from 'decimal.js';

export type PriceData = {
  aPrice: Decimal;
  bPrice: Decimal;
  reward0Price: Decimal | null;
  reward1Price: Decimal | null;
  reward2Price: Decimal | null;
  lowerPrice: Decimal;
  upperPrice: Decimal;
  poolPrice: Decimal;
  twapPrice: Decimal | null;
  lowerResetPrice: Decimal | null;
  upperResetPrice: Decimal | null;
};

export default PriceData;
