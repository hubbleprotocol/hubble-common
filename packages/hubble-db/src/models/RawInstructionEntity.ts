export interface RawInstructionEntity {
  id: bigint;
  transaction_signature: string;
  ordinal: number;
  created_on: Date;
  raw_json: string;
  instruction_id: number;
}

export default RawInstructionEntity;
