import { PublicKey } from '@solana/web3.js';
import { Manual, PricePercentage } from '../kamino-client/types/RebalanceType';
import Decimal from 'decimal.js';
import { Dex } from './utils';

export const FullBPS = 10_000;

export const DefaultLowerPercentageBPS: number = 1000;
export const DefaultUpperPercentageBPS: number = 1000;

// the default parameters for the manual rebalance, 5% above and below the current price
export const DefaultLowerPriceDifferenceBPS: number = 500;
export const DefaultUpperPriceDifferenceBPS: number = 500;

export const DefaultMintTokenA: PublicKey = new PublicKey('USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX');
export const DefaultMintTokenB: PublicKey = new PublicKey('HBB111SCo9jkCejsZfz8Ec8nH7T6THF8KEKSnvwT6XK6');
export const DefaultFeeTierOrca: Decimal = new Decimal(0.003);
export const DefaultDex: Dex = 'ORCA';

export interface RebalanceMethod {
  label: String;
  value: number;
}

export const ManualRebalanceMethod: RebalanceMethod = {
  label: 'Manual',
  value: Manual.discriminator,
};
export const PricePercentageRebalanceMethod: RebalanceMethod = {
  label: 'Price Percentage',
  value: PricePercentage.discriminator,
};
