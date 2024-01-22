export interface OwnerEntity {
  id: number;
  pubkey: string;
  cluster_id: number;
  domain: string | null;
}

export default OwnerEntity;
