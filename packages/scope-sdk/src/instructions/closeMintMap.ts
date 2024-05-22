import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CloseMintMapAccounts {
  admin: PublicKey
  configuration: PublicKey
  mappings: PublicKey
  systemProgram: PublicKey
}

export function closeMintMap(
  accounts: CloseMintMapAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.admin, isSigner: true, isWritable: true },
    { pubkey: accounts.configuration, isSigner: false, isWritable: false },
    { pubkey: accounts.mappings, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([146, 212, 203, 239, 191, 104, 38, 102])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
