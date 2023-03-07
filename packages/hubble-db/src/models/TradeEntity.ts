export interface TradeEntity {
  id: number;
  transaction_id: string;
  instruction_ordinal: number;
  source_amount: string;
  destination_amount: string;
  raw_json: string;
  created_on: Date;
  updated_on: Date;
  traded_on: Date;
  source_token_mint_id: number;
  destination_token_mint_id: number;
  cluster_id: number;
  trade_source_id: number;
  trade_aggregator_id: number | null;
  program_account_id: number | null;
}

export default TradeEntity;
