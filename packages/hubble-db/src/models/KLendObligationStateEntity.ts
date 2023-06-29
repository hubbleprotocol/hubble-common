export interface KlendObligationStateEntity {
  id: number;
  klend_obligation_id: number;
  metrics: string;
  raw_json: string;
  created_on: Date;
}

export default KlendObligationStateEntity;
