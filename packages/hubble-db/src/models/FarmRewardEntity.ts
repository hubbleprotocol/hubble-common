export interface FarmRewardEntity {
  id: BigInt;
  raw_json: string;
  created_on: Date;
  farm_state_id: BigInt;
  token_mint_id: number;
}

export default FarmRewardEntity;
