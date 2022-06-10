import Decimal from 'decimal.js';
import ExtraCollateralAmount from './ExtraCollateralAmount';

export type CollateralAmounts = {
  sol: Decimal;
  eth: Decimal;
  btc: Decimal;
  srm: Decimal;
  ray: Decimal;
  ftt: Decimal;
  msol: Decimal;
  extraCollaterals: ExtraCollateralAmount[];
};

export default CollateralAmounts;
