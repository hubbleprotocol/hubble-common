export interface KaminoInstructionEntity {
  id: bigint;
  enriched: string;
  latest_position: boolean;
  strategy_id: number;
  owner_id: number;
  raw_instruction_id: bigint;
}

export default KaminoInstructionEntity;
