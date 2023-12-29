export type KlendLeverageMetricsEntity = {
  id: BigInt;
  metrics_source_id: number;
  deposit_reserve_id: number;
  borrow_reserve_id: number;
  metrics: string;
  created_on: Date;
  updated_on: Date;
};

export default KlendLeverageMetricsEntity;
