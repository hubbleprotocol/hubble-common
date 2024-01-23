import { PublicKey } from '@solana/web3.js';
import { LbPair } from '../meteora_client/accounts';

export interface LbPairWithAddress {
  pool: LbPair;
  address: PublicKey;
}

export default LbPairWithAddress;
