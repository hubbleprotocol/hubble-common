export interface KlendInstructionEntity {
  id: bigint;
  enriched: string;
  latest_position: boolean;
  obligation_id: number;
  raw_instruction_id: bigint;
}

export default KlendInstructionEntity;
