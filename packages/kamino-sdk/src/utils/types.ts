type StrategyType = 'NON_PEGGED' | 'PEGGED' | 'STABLE' | undefined;
type StrategyCreationStatus = 'SHADOW' | 'LIVE' | 'DEPRECATED' | 'TEST' | undefined;

export type StrategiesFilters = {
  strategyType: StrategyType;
  strategyCreationStatus: StrategyCreationStatus;
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

export function strategyCreationStatusToBase58(strategyCreationStatus: StrategyCreationStatus): string {
  switch (strategyCreationStatus) {
    case 'SHADOW':
      return '1';
    case 'LIVE':
      return '2';
    case 'DEPRECATED':
      return '3';
    case 'TEST':
      return '4';
    default:
      throw new Error(`Invalid strategyCreationStatus ${strategyCreationStatus}`);
  }
}

export function strategyCreationStatusToNumber(strategyCreationStatus: StrategyCreationStatus): number {
  switch (strategyCreationStatus) {
    case 'SHADOW':
      return 0;
    case 'LIVE':
      return 1;
    case 'DEPRECATED':
      return 2;
    case 'TEST':
      return 3;
    default:
      throw new Error(`Invalid strategyCreationStatus ${strategyCreationStatus}`);
  }
}
