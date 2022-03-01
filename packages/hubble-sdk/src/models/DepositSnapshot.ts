import StabilityTokenMap from './StabilityTokenMap';
import Decimal from 'decimal.js';

export type DepositSnapshot = {
  sum: StabilityTokenMap;
  product: Decimal;
  scale: Decimal;
  epoch: Decimal;
  enabled: boolean;
};
export default DepositSnapshot;
