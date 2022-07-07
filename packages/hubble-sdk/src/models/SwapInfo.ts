import Decimal from 'decimal.js';

export type SwapInfo = {
  inAmount: Decimal;
  outAmount: Decimal;
  slippage: Decimal;
  fees: Decimal;
};
