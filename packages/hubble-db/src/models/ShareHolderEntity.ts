export interface ShareHolderEntity {
  id: number;
  created_on: Date;
  shares_amount: string;
  usd_amount: string;
  owner_id: number;
  share_price_id: number;
}

export default ShareHolderEntity;
