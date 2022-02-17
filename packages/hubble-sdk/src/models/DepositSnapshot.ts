import StabilityTokenMap from './StabilityTokenMap';

type DepositSnapshot = {
  sum: StabilityTokenMap;
  product: number;
  scale: number;
  epoch: number;
  enabled: boolean;
};
export default DepositSnapshot;
