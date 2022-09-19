import Decimal from 'decimal.js';

export type WithdrawalCaps = {
  configCapacity: Decimal;
  currentTotal: Decimal;
  lastIntervalStartTimestamp: number;
  configIntervalLengthSeconds: number;
};

export default WithdrawalCaps;
