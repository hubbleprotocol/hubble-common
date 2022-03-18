export interface LoanEntity {
  id: number;
  user_metadata_pubkey: string;
  usdh_debt: string;
  created_on: Date;
  total_collateral_value: string;
  collateral_ratio: string;
  loan_to_value: string;
  version: string;
  status: string;
  user_id: string;
  borrowing_market_state_pubkey: string;
  owner_id: number;
}
export default LoanEntity;
