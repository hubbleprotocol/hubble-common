import Decimal from 'decimal.js';

export type ExtraCollateralAmount = {
  tokenId: Decimal;
  amount: Decimal;
};

export default ExtraCollateralAmount;
