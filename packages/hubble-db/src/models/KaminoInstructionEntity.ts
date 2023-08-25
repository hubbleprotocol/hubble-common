export interface KaminoInstructionEntity {
  id: number;
  transaction_signature: string;
  ordinal: number;
  created_on: Date;
  enriched: string;
  raw_json: string;
  instruction_id: number;
  strategy_id: number;
  owner_id: number;
}

export default KaminoInstructionEntity;
