export interface StakingRateEntity {
  id: string;
  created_on: Date;
  rate: string;
  token_mint_id: number;
}

export default StakingRateEntity;
