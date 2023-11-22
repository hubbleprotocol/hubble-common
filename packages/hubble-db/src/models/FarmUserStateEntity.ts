export interface FarmUserStateEntity {
  id: BigInt;
  raw_json: string;
  created_on: Date;
  owner_id: number;
  farm_id: number;
  farm_user_id: number;
}
