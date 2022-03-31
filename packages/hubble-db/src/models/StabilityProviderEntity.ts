export interface StabilityProviderEntity {
  id: number;
  version: string;
  stability_pool_state_pubkey: string;
  owner_id: number;
  user_id: string;
  deposited_stablecoin: string;
  created_on: Date;
  raw_json: string;
}

export default StabilityProviderEntity;
