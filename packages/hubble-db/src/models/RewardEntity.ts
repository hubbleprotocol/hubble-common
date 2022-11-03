export interface RewardEntity {
  id: number;
  token_id: number;
  is_option: boolean;
  strike_price: string | null;
}

export default RewardEntity;
