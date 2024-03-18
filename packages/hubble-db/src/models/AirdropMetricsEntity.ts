export type AirdropMetricsEntity = {
  id: number;
  total_allocation: string;
  total_users: string;
  claim_date?: Date | null;
  points_source_id: number;
};
export default AirdropMetricsEntity;
