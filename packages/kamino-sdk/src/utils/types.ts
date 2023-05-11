import { PublicKey } from '@solana/web3.js';
import { WhirlpoolStrategy } from '../kamino-client/accounts';
import { Dex } from './utils';
import Decimal from 'decimal.js';

export type StrategyType = 'NON_PEGGED' | 'PEGGED' | 'STABLE';
export type StrategyCreationStatus = 'IGNORED' | 'SHADOW' | 'LIVE' | 'DEPRECATED' | 'STAGING';

export type StrategiesFilters = {
  strategyType?: StrategyType;
  strategyCreationStatus?: StrategyCreationStatus;
};

export function strategyTypeToBase58(strategyType: StrategyType): string {
  switch (strategyType) {
    case 'NON_PEGGED':
      return '1';
    case 'PEGGED':
      return '2';
    case 'STABLE':
      return '3';
    default:
      throw new Error(`Invalid strategyType ${strategyType}`);
  }
}

export function strategyTypeToNumber(strategyType: StrategyType): number {
  switch (strategyType) {
    case 'NON_PEGGED':
      return 0;
    case 'PEGGED':
      return 1;
    case 'STABLE':
      return 2;
    default:
      throw new Error(`Invalid strategyType ${strategyType}`);
  }
}

export function getStrategyTypeFromStrategy(strategy: WhirlpoolStrategy): StrategyType {
  switch (strategy.strategyType.toNumber()) {
    case 0:
      return 'NON_PEGGED';
    case 1:
      return 'PEGGED';
    case 2:
      return 'STABLE';
    default:
      throw new Error(`Unknown strategyType value ${strategy.strategyType.toNumber()}`);
  }
}

export function strategyCreationStatusToBase58(strategyCreationStatus: StrategyCreationStatus): string {
  switch (strategyCreationStatus) {
    case 'IGNORED':
      return '1';
    case 'SHADOW':
      return '2';
    case 'LIVE':
      return '3';
    case 'DEPRECATED':
      return '4';
    case 'STAGING':
      return '5';
    default:
      throw new Error(`Invalid strategyCreationStatus ${strategyCreationStatus}`);
  }
}

export function strategyCreationStatusToNumber(strategyCreationStatus: StrategyCreationStatus): number {
  switch (strategyCreationStatus) {
    case 'IGNORED':
      return 0;
    case 'SHADOW':
      return 1;
    case 'LIVE':
      return 2;
    case 'DEPRECATED':
      return 3;
    case 'STAGING':
      return 4;
    default:
      throw new Error(`Invalid strategyCreationStatus ${strategyCreationStatus}`);
  }
}

export function getStrategyCreationStatusFromStrategy(strategy: WhirlpoolStrategy): StrategyCreationStatus {
  switch (strategy.creationStatus) {
    case 0:
      return 'IGNORED';
    case 1:
      return 'SHADOW';
    case 2:
      return 'LIVE';
    case 3:
      return 'DEPRECATED';
    case 4:
      return 'STAGING';
    default:
      throw new Error(`Invalid strategyCreationStatus ${strategy.creationStatus}`);
  }
}

export interface RebalanceFieldInfo {
  label: string;
  type: string;
  value: number;
  enabled: boolean;
}

export function getManualRebalanceFieldInfos(lowerPrice: number, upperPrice: number, enabled: boolean = true) {
  let lowerRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'priceLower',
    type: 'number',
    value: lowerPrice,
    enabled,
  };
  let upperRangeRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'priceUpper',
    type: 'number',
    value: upperPrice,
    enabled,
  };
  return [lowerRangeRebalanceFieldInfo, upperRangeRebalanceFieldInfo];
}

export function getPricePercentageRebalanceFieldInfos(
  lowerPercentageBPS: number,
  upperPercentageBPS: number,
  enabled: boolean = true
) {
  let lowerBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'lowerThresholdBps',
    type: 'number',
    value: lowerPercentageBPS,
    enabled,
  };
  let upperBpsRebalanceFieldInfo: RebalanceFieldInfo = {
    label: 'upperThresholdBps',
    type: 'number',
    value: upperPercentageBPS,
    enabled,
  };

  return [lowerBpsRebalanceFieldInfo, upperBpsRebalanceFieldInfo];
}

export interface GenericPoolInfo {
  dex: Dex;
  address: PublicKey;
  tokenMintA: PublicKey;
  tokenMintB: PublicKey;
  price: number;
  feeRate: number;
  volumeOnLast7d: number | undefined;
  tvl: number | undefined;
  tickSpacing: number;
}

export interface VaultParameters {
  tokenMintA: PublicKey;
  tokenMintB: PublicKey;
  dex: Dex;
  feeTier: Decimal;
  rebalancingParameters: RebalanceFieldInfo[];
}
