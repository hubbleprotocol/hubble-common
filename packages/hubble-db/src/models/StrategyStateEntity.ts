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
  shares_issued: string;
  token_a_amounts: string;
  token_b_amounts: string;
  token_a_price: string;
  token_b_price: string;
  reward_0_price: string;
  reward_1_price: string;
  reward_2_price: string;
  kamino_rewards_issued_cumulative_0: string;
  kamino_rewards_issued_cumulative_1: string;
  kamino_rewards_issued_cumulative_2: string;
  kamino_reward_0_price: string;
  kamino_reward_1_price: string;
  kamino_reward_2_price: string;
}

export default StrategyStateEntity;
