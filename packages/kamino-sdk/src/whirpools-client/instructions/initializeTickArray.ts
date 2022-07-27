import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeTickArrayArgs {
  startTickIndex: number
}

export interface InitializeTickArrayAccounts {
  whirlpool: PublicKey
  funder: PublicKey
  tickArray: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.i32("startTickIndex")])

export function initializeTickArray(
  args: InitializeTickArrayArgs,
  accounts: InitializeTickArrayAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: false },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.tickArray, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([11, 188, 193, 214, 141, 91, 149, 184])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      startTickIndex: args.startTickIndex,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
