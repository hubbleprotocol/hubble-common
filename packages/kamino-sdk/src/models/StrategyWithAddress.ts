import { WhirlpoolStrategy } from '../kamino-client/accounts';
import { PublicKey } from '@solana/web3.js';

export interface StrategyWithAddress {
  strategy: WhirlpoolStrategy;
  address: PublicKey;
}

export default StrategyWithAddress;
