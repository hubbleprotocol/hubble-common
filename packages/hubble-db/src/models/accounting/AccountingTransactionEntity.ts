export interface AccountingTransactionEntity {
  id: string;
  signature: string;
  owner_id: number;
  created_on: Date;
  slot: string;
}
export default AccountingTransactionEntity;
