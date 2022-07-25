import { BorrowingConfig } from './BorrowingConfig';
import { SolanaCluster } from './SolanaCluster';
import { ScopeConfig } from './ScopeConfig';
import { KaminoConfig } from './KaminoConfig';

export type HubbleConfig = {
  cluster: SolanaCluster;
  borrowing: BorrowingConfig;
  scope: ScopeConfig;
  kamino: KaminoConfig;
};
