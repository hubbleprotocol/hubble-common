import StabilityTokenMap from './StabilityTokenMap';
import Decimal from 'decimal.js';

type DepositSnapshot = {
  sum: StabilityTokenMap;
  product: Decimal;
  scale: Decimal;
  epoch: Decimal;
  enabled: boolean;
};
export default DepositSnapshot;
