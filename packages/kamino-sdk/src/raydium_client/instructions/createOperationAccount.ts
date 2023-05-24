import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateOperationAccountAccounts {
  /** Address to be set as operation account owner. */
  owner: PublicKey
  /** Initialize operation state account to store operation owner address and white list mint. */
  operationState: PublicKey
  systemProgram: PublicKey
}

/**
 * Creates an operation account for the program
 *
 * # Arguments
 *
 * * `ctx`- The context of accounts
 *
 */
export function createOperationAccount(
  accounts: CreateOperationAccountAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.operationState, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([63, 87, 148, 33, 109, 35, 8, 104])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
