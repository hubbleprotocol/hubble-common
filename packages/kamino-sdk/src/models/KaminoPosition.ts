import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { Dex } from "../utils";

export interface KaminoPosition {
  strategy: PublicKey;
  shareMint: PublicKey;
  sharesAmount: Decimal;
  strategyDex: Dex;
}

export default KaminoPosition;
