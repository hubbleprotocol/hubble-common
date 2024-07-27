import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface MigrateBinArrayAccounts {
  lbPair: PublicKey
}

export function migrateBinArray(
  accounts: MigrateBinArrayAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.lbPair, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([17, 23, 159, 211, 101, 184, 41, 241])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
