import { PublicKey } from '@solana/web3.js';

// Program ID passed with the cli --program-id flag when running the code generator. Do not edit, it will get overwritten.
export const PROGRAM_ID_CLI = new PublicKey('whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc');

// This constant will not get overwritten on subsequent code generations and it's safe to modify it's value.
export let PROGRAM_ID: PublicKey = PROGRAM_ID_CLI;

export const setWhirlpoolsProgramId = (programId: PublicKey) => {
  PROGRAM_ID = programId;
};
