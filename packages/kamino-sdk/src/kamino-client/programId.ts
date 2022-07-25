import { PublicKey } from '@solana/web3.js';

// Program ID passed with the cli --program-id flag when running the code generator. Do not edit, it will get overwritten.
export const PROGRAM_ID_CLI = new PublicKey('E6qbhrt4pFmCotNUSSEh6E5cRQCEJpMcd79Z56EG9KY');

// This constant will not get overwritten on subsequent code generations and it's safe to modify it's value.
export let PROGRAM_ID: PublicKey = PROGRAM_ID_CLI;

export const setKaminoProgramId = (programId: PublicKey) => {
  PROGRAM_ID = programId;
};
