export interface SharePriceEntity {
  id: number;
  price: string;
  created_on: Date;
  strategy_id: number;
  share_mint_id: number;
}

export default SharePriceEntity;
