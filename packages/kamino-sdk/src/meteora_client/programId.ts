import { PublicKey } from "@solana/web3.js"

// Program ID passed with the cli --program-id flag when running the code generator. Do not edit, it will get overwritten.
export const PROGRAM_ID_CLI = new PublicKey(
  "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo"
)

// This constant will not get overwritten on subsequent code generations and it's safe to modify it's value.
export let METEORA_PROGRAM_ID: PublicKey = PROGRAM_ID_CLI;
export let PROGRAM_ID: PublicKey = PROGRAM_ID_CLI;
export const setMeteoraProgramId = (programId: PublicKey) => {
  METEORA_PROGRAM_ID = programId;
  PROGRAM_ID = programId;
};
