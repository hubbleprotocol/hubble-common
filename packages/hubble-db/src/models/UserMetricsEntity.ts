export interface UserMetricsEntity {
  id: number;
  metrics: string;
  created_on: Date;
  owner_id: number;
  metrics_source_id: number;
}

export default UserMetricsEntity;
