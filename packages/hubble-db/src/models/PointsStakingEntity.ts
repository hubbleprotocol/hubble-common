export type PointsStakingEntity = {
  id: bigint;
  farm_id: number;
  owner_id: number;
  points_source_id: number;
  created_on: Date;
  updated_on: Date;
  points_earned: string;
  current_points_per_second: string;
  current_boost: string;
};
export default PointsStakingEntity;
