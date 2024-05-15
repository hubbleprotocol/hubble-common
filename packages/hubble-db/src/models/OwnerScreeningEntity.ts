export interface OwnerScreeningEntity {
  id: bigint;
  owner_id: number;
  created_on: Date;
  updated_on: Date;
  has_risk: boolean;
  risk_indicators: string | null;
}
export default OwnerScreeningEntity;
