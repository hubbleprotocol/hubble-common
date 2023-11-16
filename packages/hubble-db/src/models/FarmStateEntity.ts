import Decimal from 'decimal.js';

export interface FarmStateEntity {
  id: Decimal;
  raw_json: string;
  created_on: Date;
  farm_id: number;
}

export default FarmStateEntity;
