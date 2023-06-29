export interface KlendReserveStateEntity {
  id: number;
  klend_reserve_id: number;
  metrics: string;
  raw_json: string;
  created_on: Date;
}

export default KlendReserveStateEntity;
