import { BorrowingConfig } from './BorrowingConfig';
import { SolanaCluster } from './SolanaCluster';

export type HubbleConfig = {
  cluster: SolanaCluster;
  borrowing: BorrowingConfig;
};
