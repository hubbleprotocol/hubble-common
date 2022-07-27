import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateDepositCapArgs {
  capInUsd: BN
}

export interface UpdateDepositCapAccounts {
  adminAuthority: PublicKey
  strategy: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([borsh.u64("capInUsd")])

export function updateDepositCap(
  args: UpdateDepositCapArgs,
  accounts: UpdateDepositCapAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([175, 41, 137, 203, 27, 184, 245, 164])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      capInUsd: args.capInUsd,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
