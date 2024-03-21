export type PointsOwnerBoostEntity = {
  id: bigint;
  owner_id: number;
  points_owner_boost_source_id: number;
  boost: string;
  valid_from: Date;
  valid_to: Date;
};

export default PointsOwnerBoostEntity;
