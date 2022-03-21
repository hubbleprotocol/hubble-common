export interface CollateralEntity {
  id: number;
  deposited_quantity: string;
  inactive_quantity: string;
  price: string;
  token_id: number;
  loan_id: number;
}
export default CollateralEntity;
