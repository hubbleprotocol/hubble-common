export interface ShareHolderEntity {
  id: number;
  created_on: Date;
  shares_amount: string;
  usd_amount: string;
  owner_id: number;
  strategy_state_id: number;
  in_solend_vault: boolean;
}

export default ShareHolderEntity;
