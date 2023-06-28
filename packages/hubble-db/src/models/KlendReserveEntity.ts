export interface KlendReserveEntity {
  id: number;
  pubkey: string;
  raw_json: string;
  created_on: Date;
  klend_market_id: number;
}

export default KlendReserveEntity;
