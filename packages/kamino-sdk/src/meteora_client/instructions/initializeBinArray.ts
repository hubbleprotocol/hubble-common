import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeBinArrayArgs {
  index: BN
}

export interface InitializeBinArrayAccounts {
  lbPair: PublicKey
  binArray: PublicKey
  funder: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.i64("index")])

export function initializeBinArray(
  args: InitializeBinArrayArgs,
  accounts: InitializeBinArrayAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.lbPair, isSigner: false, isWritable: false },
    { pubkey: accounts.binArray, isSigner: false, isWritable: true },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([35, 86, 19, 185, 78, 212, 75, 211])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      index: args.index,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
