export interface RewardEarnedEntity {
  id: number;
  owner_id: number;
  strategy_id: number;
  reward_id: number;
  amount: string;
  month: number;
  year: number;
  created_on: Date;
  updated_on: Date;
}

export default RewardEarnedEntity;
