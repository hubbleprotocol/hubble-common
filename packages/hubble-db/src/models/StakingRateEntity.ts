export interface StakingRateEntity {
  id: string;
  created_on: Date;
  rate: string;
  theoretical_price: string;
  token_mint_id: number;
}

export default StakingRateEntity;
