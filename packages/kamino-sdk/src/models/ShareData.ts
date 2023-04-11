import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { StrategyBalances } from './StrategyBalances';
import { WhirlpoolStrategy } from '../kamino-client/accounts';
import PriceData from './PriceData';

export type ShareData = {
  balance: StrategyBalances;
  price: Decimal;
};

export type ShareDataWithAddress = {
  shareData: ShareData;
  address: PublicKey;
  strategy: WhirlpoolStrategy;
};

export function getEmptyShareData(prices: PriceData): ShareData {
  return {
    price: new Decimal(1),
    balance: {
      prices,
      tokenAAmounts: new Decimal(0),
      tokenBAmounts: new Decimal(0),
      computedHoldings: {
        available: { a: new Decimal(0), b: new Decimal(0) },
        availableUsd: new Decimal(0),
        investedUsd: new Decimal(0),
        invested: { a: new Decimal(0), b: new Decimal(0) },
        totalSum: new Decimal(0),
      },
    },
  };
}
