import { PublicKey } from '@solana/web3.js';
import {
  Autodrift,
  Drift,
  Expander,
  Manual,
  PeriodicRebalance,
  PricePercentage,
  PricePercentageWithReset,
  TakeProfit,
} from '../kamino-client/types/RebalanceType';
import Decimal from 'decimal.js';
import { Dex } from './utils';

export const FullBPS = 10_000;
export const FullBPSDecimal = new Decimal(FullBPS);
export const FullPercentage = 100;

export const DefaultLowerPercentageBPS: number = 1000;
export const DefaultLowerPercentageBPSDecimal: Decimal = new Decimal(DefaultLowerPercentageBPS);
export const DefaultUpperPercentageBPS: number = 1000;
export const DefaultUpperPercentageBPSDecimal: Decimal = new Decimal(DefaultUpperPercentageBPS);

// the default parameters for the manual rebalance, 5% above and below the current price
export const DefaultLowerPriceDifferenceBPS: number = 500;
export const DefaultUpperPriceDifferenceBPS: number = 500;

export const DefaultMintTokenA: PublicKey = new PublicKey('So11111111111111111111111111111111111111112');
export const DefaultMintTokenB: PublicKey = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
export const DefaultFeeTierOrca: Decimal = new Decimal(0.0005);
export const DefaultTickSpacing: number = 1;
export const DefaultDex: Dex = 'ORCA';

export interface RebalanceMethod {
  label: String;
  value: number;
  enabled: boolean; // represents if the strategy should be displayed in the UI and it is currently supported or not
  descriptionShort?: string;
  description?: string;
}

export const ManualRebalanceMethod: RebalanceMethod = {
  label: 'Fixed Range',
  value: Manual.discriminator,
  enabled: true,
  descriptionShort: 'Market make with no rebalancing',
  description:
    'Liquidity is provided to a specified range width, with no rebalancing performed in any price scenario, thus no impermanent loss is realized via range adjustment. Asymmetric range widths are supported eg. 50% below price, and 500% above',
};
export const PricePercentageRebalanceMethod: RebalanceMethod = {
  label: 'Tracker',
  value: PricePercentage.discriminator,
  enabled: true,
  descriptionShort: 'Maximize trading fee capture',
  description:
    'Liquidity is provided to a specified range width, with rebalancing performed to the initial token ratio should the price move beyond a specified percentage in either direction. Asymmetric range widths are supported eg. 50% below price, and 500% above',
};
export const PricePercentageWithResetRangeRebalanceMethod: RebalanceMethod = {
  label: 'Price Percentage With Reset Range',
  value: PricePercentageWithReset.discriminator,
  enabled: false,
  // todo: provide a better description
  description:
    'Optimize your portfolio for maximum returns with Kamino’s Automated Percentage Rebalancing strategy. Automatically adjust your allocation based on predetermined percentages for a balanced and risk-minimized portfolio.',
};
export const DriftRebalanceMethod: RebalanceMethod = {
  label: 'Drift',
  value: Drift.discriminator,
  enabled: false,
  // todo: ask for a description
  description: 'Optimize your portfolio for maximum returns with Kamino’s Drift strategy.',
};
export const TakeProfitMethod: RebalanceMethod = {
  label: 'Take Profit',
  value: TakeProfit.discriminator,
  enabled: false,
  // todo: ask for a description
  description: 'Optimize your portfolio for maximum returns with Kamino’s Take Profit strategy.',
};
export const PeriodicRebalanceMethod: RebalanceMethod = {
  label: 'Periodic Rebalance',
  value: PeriodicRebalance.discriminator,
  enabled: false,
  // todo: ask for a description
  description: 'Optimize your portfolio for maximum returns with Kamino’s Periodic Rebalance strategy.',
};
export const ExpanderMethod: RebalanceMethod = {
  label: 'Expander',
  value: Expander.discriminator,
  enabled: false,
  // todo: ask for a description
  description: 'Optimize your portfolio for maximum returns with Kamino’s Expander strategy.',
};
export const AutodriftMethod: RebalanceMethod = {
  label: 'Autodrift',
  value: Autodrift.discriminator,
  enabled: false,
  // todo: ask for a description
  description: 'Optimize your portfolio for maximum returns with Kamino’s Drift strategy.',
};
