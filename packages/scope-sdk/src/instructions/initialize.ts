import { TransactionInstruction, PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeArgs {
  feedName: string
}

export interface InitializeAccounts {
  admin: PublicKey
  program: PublicKey
  programData: PublicKey
  systemProgram: PublicKey
  configuration: PublicKey
  oraclePrices: PublicKey
  oracleMappings: PublicKey
}

export const layout = borsh.struct([borsh.str("feedName")])

export function initialize(args: InitializeArgs, accounts: InitializeAccounts) {
  const keys = [
    { pubkey: accounts.admin, isSigner: true, isWritable: true },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
    { pubkey: accounts.programData, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.configuration, isSigner: false, isWritable: true },
    { pubkey: accounts.oraclePrices, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleMappings, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([175, 175, 109, 31, 13, 152, 155, 237])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      feedName: args.feedName,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
