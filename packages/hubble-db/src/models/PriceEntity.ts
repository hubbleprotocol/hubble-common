export interface PriceEntity {
  id: number;
  created_on: Date;
  price: string;
  cluster_id: number;
  token_id: number;
  token_mint_id: number | null;
}

export default PriceEntity;
