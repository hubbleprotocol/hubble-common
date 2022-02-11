import { BorrowingConfig } from './BorrowingConfig';
import { SolanaEnvironment } from './SolanaEnvironment';

export type HubbleConfig = {
  env: SolanaEnvironment;
  borrowing: BorrowingConfig;
};
