export interface StrategyYieldEntity {
  id: number;
  day_apr: string;
  day_apy: string;
  week_apr: string;
  week_apy: string;
  created_on: Date;
  strategy_id: number;
  cluster_id: number;
}

export default StrategyYieldEntity;
