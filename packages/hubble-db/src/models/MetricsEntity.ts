export interface MetricsEntity {
  id: number;
  created_on: Date;
  raw_json: string;
  cluster_id: number;
}

export default MetricsEntity;
