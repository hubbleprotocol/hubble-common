export type PointsStrategiesEntity = {
  id: bigint;
  strategy_id: number;
  owner_id: number;
  points_source_id: number;
  created_on: Date;
  updated_on: Date;
  points_earned: string;
  current_points_per_second: string;
  current_boost: string;
  current_points_usd_rate_per_second: string;
  sum_points_per_second: string;
  num_points_per_second: string;
  avg_points_per_second: string;
};
export default PointsStrategiesEntity;
