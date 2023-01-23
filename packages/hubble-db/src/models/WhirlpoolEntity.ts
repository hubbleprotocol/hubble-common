export interface WhirlpoolEntity {
  id: number;
  token_a_id: number;
  token_b_id: number;
  pubkey: string;
  cluster_id: number;
  whirlpool_type_id: number | null;
}

export default WhirlpoolEntity;
