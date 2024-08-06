export interface HubbleInstructionEntity {
  id: bigint;
  enriched: string;
  owner_id: number;
  raw_instruction_id: bigint;
}

export default HubbleInstructionEntity;
