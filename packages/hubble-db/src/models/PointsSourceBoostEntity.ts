export type PointsSourceBoostEntity = {
  id: number;
  points_source_id: number;
  boosted_by_points_source_id: number;
  boost: string;
  valid_from: Date | null;
  valid_to: Date | null;
};
export default PointsSourceBoostEntity;
