import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeLbPairArgs {
  activeId: number
  binStep: number
}

export interface InitializeLbPairAccounts {
  lbPair: PublicKey
  binArrayBitmapExtension: PublicKey
  tokenMintX: PublicKey
  tokenMintY: PublicKey
  reserveX: PublicKey
  reserveY: PublicKey
  oracle: PublicKey
  presetParameter: PublicKey
  funder: PublicKey
  tokenProgram: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
  eventAuthority: PublicKey
  program: PublicKey
}

export const layout = borsh.struct([
  borsh.i32("activeId"),
  borsh.u16("binStep"),
])

export function initializeLbPair(
  args: InitializeLbPairArgs,
  accounts: InitializeLbPairAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    {
      pubkey: accounts.binArrayBitmapExtension,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenMintX, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenMintY, isSigner: false, isWritable: false },
    { pubkey: accounts.reserveX, isSigner: false, isWritable: true },
    { pubkey: accounts.reserveY, isSigner: false, isWritable: true },
    { pubkey: accounts.oracle, isSigner: false, isWritable: true },
    { pubkey: accounts.presetParameter, isSigner: false, isWritable: false },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([45, 154, 237, 210, 221, 15, 166, 92])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      activeId: args.activeId,
      binStep: args.binStep,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
