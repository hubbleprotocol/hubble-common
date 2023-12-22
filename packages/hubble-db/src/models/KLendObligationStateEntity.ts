export interface KlendObligationStateEntity {
  id: number;
  klend_obligation_id: number;
  metrics: string;
  raw_json: string;
  created_on: Date;
}

export interface ResampledObligationStateEntity {
  id: BigInt;
  klend_obligation_id: number;
  klend_obligation_state_id: number;
  raw_json: string;
  metrics: string;
  created_on: Date;
  resampled_on: Date;
}

export default KlendObligationStateEntity;
