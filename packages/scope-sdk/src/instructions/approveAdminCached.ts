import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ApproveAdminCachedArgs {
  feedName: string
}

export interface ApproveAdminCachedAccounts {
  adminCached: PublicKey
  configuration: PublicKey
}

export const layout = borsh.struct([borsh.str("feedName")])

export function approveAdminCached(
  args: ApproveAdminCachedArgs,
  accounts: ApproveAdminCachedAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminCached, isSigner: true, isWritable: false },
    { pubkey: accounts.configuration, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([101, 149, 97, 58, 48, 79, 16, 105])
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
