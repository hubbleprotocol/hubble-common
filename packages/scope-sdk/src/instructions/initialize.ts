import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeArgs {
  feedName: string
}

export interface InitializeAccounts {
  admin: PublicKey
  systemProgram: PublicKey
  configuration: PublicKey
  tokenMetadatas: PublicKey
  oracleTwaps: PublicKey
  oraclePrices: PublicKey
  oracleMappings: PublicKey
}

export const layout = borsh.struct([borsh.str("feedName")])

export function initialize(args: InitializeArgs, accounts: InitializeAccounts, programId: PublicKey) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.admin, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.configuration, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenMetadatas, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleTwaps, isSigner: false, isWritable: true },
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
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
