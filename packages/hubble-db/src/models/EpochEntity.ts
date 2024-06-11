export interface EpochEntity {
  id: bigint;
  epoch: string;
  first_slot: string;
  last_slot: string;
  start_block_time: Date;
  end_block_time: Date;
}
export default EpochEntity;
