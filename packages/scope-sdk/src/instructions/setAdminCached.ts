import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SetAdminCachedArgs {
  newAdmin: PublicKey
  feedName: string
}

export interface SetAdminCachedAccounts {
  admin: PublicKey
  configuration: PublicKey
}

export const layout = borsh.struct([
  borsh.publicKey("newAdmin"),
  borsh.str("feedName"),
])

export function setAdminCached(
  args: SetAdminCachedArgs,
  accounts: SetAdminCachedAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.admin, isSigner: true, isWritable: false },
    { pubkey: accounts.configuration, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([114, 14, 105, 205, 216, 148, 30, 75])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      newAdmin: args.newAdmin,
      feedName: args.feedName,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
