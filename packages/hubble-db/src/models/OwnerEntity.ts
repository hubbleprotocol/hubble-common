export interface OwnerEntity {
  id: number;
  pubkey: string;
  cluster_id: number;
  //TODO: uncomment when actually implemented
  // domain: string | null;
}

export default OwnerEntity;
