export interface TokenEntity {
  id: number;
  name: string;
  mint: string | null;
  price_type_id: number | null;
}

export default TokenEntity;
