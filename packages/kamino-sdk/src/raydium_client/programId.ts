import { PublicKey } from '@solana/web3.js';

// Program ID passed with the cli --program-id flag when running the code generator. Do not edit, it will get overwritten.
export const PROGRAM_ID_CLI = new PublicKey('CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK');

// This constant will not get overwritten on subsequent code generations and it's safe to modify it's value.
export let PROGRAM_ID: PublicKey = PROGRAM_ID_CLI;
export const setRaydiumProgramId = (programId: PublicKey) => {
  PROGRAM_ID = programId;
};
