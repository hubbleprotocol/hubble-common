import { PublicKey } from '@solana/web3.js';
import { PoolState } from '../raydium_client/accounts';

export interface RaydiumPoollWithAddress {
  poolState: PoolState;
  address: PublicKey;
}

export default RaydiumPoollWithAddress;
