export interface StrategyStateEntity {
  id: number;
  created_on: Date;
  fees_collected_cumulative_a: string;
  fees_collected_cumulative_b: string;
  rewards_collected_cumulative_0: string;
  rewards_collected_cumulative_1: string;
  rewards_collected_cumulative_2: string;
  share_price: string;
  raw_json: string;
  strategy_id: number;
  share_mint_id: number;
}

export default StrategyStateEntity;
