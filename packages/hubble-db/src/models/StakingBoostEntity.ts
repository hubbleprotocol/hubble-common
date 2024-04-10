export interface StakingBoostEntity {
  id: bigint;
  boost: string;
  staked_amount: string;
  valid_from: Date;
  valid_to: Date;
  updated_on: Date;
  owner_id: number;
  points_source_id: number;
  farm_id: number;
}
export default StakingBoostEntity;
