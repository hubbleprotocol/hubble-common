import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ExtendMappingArgs {
  feedName: string
}

export interface ExtendMappingAccounts {
  admin: PublicKey
  configuration: PublicKey
  oracleMappings: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.str("feedName")])

export function extendMapping(
  args: ExtendMappingArgs,
  accounts: ExtendMappingAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.admin, isSigner: true, isWritable: true },
    { pubkey: accounts.configuration, isSigner: false, isWritable: false },
    { pubkey: accounts.oracleMappings, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([49, 138, 121, 76, 150, 134, 170, 9])
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
