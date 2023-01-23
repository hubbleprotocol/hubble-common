export interface WhirlpoolEntity {
  id: number;
  token_a_id: number;
  token_b_id: number;
  pubkey: string;
  cluster_id: number;
  // representing if the pool is a Raydium or an Orca pool
  dex_type: number;
}

export default WhirlpoolEntity;
