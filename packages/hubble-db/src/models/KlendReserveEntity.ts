export interface KlendReserveEntity {
  id: number;
  pubkey: string;
  metrics: string;
  raw_json: string;
  created_on: Date;
  klend_market_id: number;
}

export default KlendReserveEntity;
