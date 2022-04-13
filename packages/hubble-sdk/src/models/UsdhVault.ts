import Decimal from 'decimal.js';
import CollateralAmounts from './CollateralAmounts';

export type UsdhVault = {
  hbbRewards: Decimal;
  liquidationRewards: CollateralAmounts;
  usdhStaked: Decimal;
};

export default UsdhVault;
