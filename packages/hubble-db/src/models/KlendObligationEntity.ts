export interface KlendObligationEntity {
  id: number;
  pubkey: string;
  raw_json: string;
  klend_market_id: number;
  created_on: Date;
  owner_id: number;
}

export default KlendObligationEntity;
