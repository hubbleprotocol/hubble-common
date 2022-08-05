export interface WhirlpoolStateEntity {
  id: number;
  created_on: Date;
  raw_json: string;
  liquidity: string;
  sqrt_price: string;
  tick_spacing: string;
  fee_rate: string;
  protocol_fee_rate: string;
  tick_current_index: string;
  protocol_fee_owed_a: string;
  protocol_fee_owed_b: string;
  fee_growth_global_a: string;
  fee_growth_global_b: string;
  whirlpool_id: number;
}

export default WhirlpoolStateEntity;
