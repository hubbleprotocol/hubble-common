export interface StakingYieldEntity {
  id: bigint;
  epoch_id: string;
  apy: string;
  apr: string;
  token_mint_id: number;
}
export default StakingYieldEntity;
