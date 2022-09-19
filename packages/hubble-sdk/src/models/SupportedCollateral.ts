import Decimal from 'decimal.js';

export type SupportedCollateral = {
  token: number;
  tokenCap: Decimal;
};

export default SupportedCollateral;
