import { BorrowingConfig } from './BorrowingConfig';
import { SolanaCluster } from './SolanaCluster';
import { ScopeConfig } from './ScopeConfig';

export type HubbleConfig = {
  cluster: SolanaCluster;
  borrowing: BorrowingConfig;
  scope: ScopeConfig;
};
