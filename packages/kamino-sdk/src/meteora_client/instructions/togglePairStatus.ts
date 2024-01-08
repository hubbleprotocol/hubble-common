import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface TogglePairStatusAccounts {
  lbPair: PublicKey
  admin: PublicKey
}

export function togglePairStatus(accounts: TogglePairStatusAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    { pubkey: accounts.admin, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([61, 115, 52, 23, 46, 13, 31, 144])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
