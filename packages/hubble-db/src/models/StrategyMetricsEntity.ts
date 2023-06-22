export interface StrategyMetricsEntity {
  id: number;
  metrics: string;
  created_on: Date;
  strategy_id: number;
  cluster_id: number;
  metrics_source_id: number;
}

export default StrategyMetricsEntity;
