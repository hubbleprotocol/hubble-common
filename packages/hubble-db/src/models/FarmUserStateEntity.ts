import Decimal from 'decimal.js';

export interface FarmUserStateEntity {
  id: Decimal;
  raw_json: string;
  created_on: Date;
  owner_id: number;
  farm_id: number;
  farm_user_id: number;
}
