export type PointsTotalEntity = {
  id: bigint;
  owner_id: number;
  points_source_id: number;
  created_on: Date;
  updated_on_strategies: Date | null;
  updated_on_borrow_lend: Date | null;
  updated_on_multiply: Date | null;
  updated_on_leverage: Date | null;
  points_earned_strategies: string;
  points_earned_borrow_lend: string;
  points_earned_multiply: string;
  points_earned_leverage: string;
  total_points_earned: string;
  current_points_per_second_strategies: string;
  current_points_per_second_borrow_lend: string;
  current_points_per_second_multiply: string;
  current_points_per_second_leverage: string;
  total_current_points_per_second: string;
};

export default PointsTotalEntity;
