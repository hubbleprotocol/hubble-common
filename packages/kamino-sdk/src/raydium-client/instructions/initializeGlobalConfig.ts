import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeGlobalConfigAccounts {
  adminAuthority: PublicKey
  globalConfig: PublicKey
  systemProgram: PublicKey
}

export function initializeGlobalConfig(
  accounts: InitializeGlobalConfigAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([113, 216, 122, 131, 225, 209, 22, 55])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
