import { PublicKey } from '@solana/web3.js';

export let PROGRAM_ID: PublicKey = new PublicKey('HFn8GnPADiny6XqUoWE8uRPPxb29ikn4yTuPa9MF2fWJ');

export function setProgramId(pubkey: PublicKey) {
  PROGRAM_ID = pubkey;
}
