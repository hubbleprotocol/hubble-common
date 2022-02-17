import { SupportedToken } from '../constants';

type CollateralTotals = {
  deposited: number;
  inactive: number;
  price: number;
  token: SupportedToken;
};

export default CollateralTotals;
