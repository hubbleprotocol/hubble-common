import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';

export interface KaminoPosition {
  strategy: PublicKey;
  shareMint: PublicKey;
  sharesAmount: Decimal;
}

export default KaminoPosition;
