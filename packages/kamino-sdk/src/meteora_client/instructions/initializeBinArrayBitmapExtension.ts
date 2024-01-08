import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeBinArrayBitmapExtensionAccounts {
  lbPair: PublicKey
  /** Initialize an account to store if a bin array is initialized. */
  binArrayBitmapExtension: PublicKey
  funder: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
}

export function initializeBinArrayBitmapExtension(
  accounts: InitializeBinArrayBitmapExtensionAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.lbPair, isSigner: false, isWritable: false },
    {
      pubkey: accounts.binArrayBitmapExtension,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([47, 157, 226, 180, 12, 240, 33, 71])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
