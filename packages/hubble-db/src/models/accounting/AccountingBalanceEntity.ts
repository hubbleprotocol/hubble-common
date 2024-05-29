import AccountingConfigEntity from './AccountingConfigEntity';

export interface AccountingBalanceEntity {
  id: string;
  accounting_transaction_id: string;
  token_mint_id: number;
  quantity: string;
  price: string;
  usd_value: string;
}

export default AccountingBalanceEntity;
