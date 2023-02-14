type StrategyType = 'NON_PEGGED' | 'PEGGED' | 'STABLE' | undefined;
type StrategyCreationStatus = 'SHADOW' | 'LIVE' | 'DEPRECATED' | 'TEST' | undefined;

export type StrategiesFilters = {
  strategyType: StrategyType;
  strategyCreationStatus: StrategyCreationStatus;
};

export function strategyTypeToNumber(strategyType: StrategyType): number {
  switch (strategyType) {
    case 'NON_PEGGED':
      return 0;
    case 'PEGGED':
      return 1;
    case 'NON_PEGGED':
      return 2;
    default:
      throw new Error(`Invalid strategyType ${strategyType}`);
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
