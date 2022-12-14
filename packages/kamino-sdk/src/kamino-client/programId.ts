import { PublicKey } from '@solana/web3.js';
import { ETH } from './types/CollateralToken';

// Program ID passed with the cli --program-id flag when running the code generator. Do not edit, it will get overwritten.
export const PROGRAM_ID_CLI = new PublicKey('6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc');

// This constant will not get overwritten on subsequent code generations and it's safe to modify it's value.
export let PROGRAM_ID: PublicKey = PROGRAM_ID_CLI;

export const setKaminoProgramId = (programId: PublicKey) => {
    PROGRAM_ID = programId;
  };
