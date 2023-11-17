export interface FarmStateEntity {
  id: BigInt;
  raw_json: string;
  created_on: Date;
  farm_id: number;
}

export default FarmStateEntity;
