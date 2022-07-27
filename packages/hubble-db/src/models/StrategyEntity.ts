export interface StrategyEntity {
  id: number;
  token_a_id: number;
  token_b_id: number;
  fees_collected_cumulative_a: string;
  fees_collected_cumulative_b: string;
  rewards_collected_cumulative_0: string;
  rewards_collected_cumulative_1: string;
  rewards_collected_cumulative_2: string;
  pubkey: string;
  raw_json: string;
}

export default StrategyEntity;
