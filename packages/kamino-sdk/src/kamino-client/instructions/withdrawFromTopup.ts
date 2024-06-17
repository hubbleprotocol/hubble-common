import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface WithdrawFromTopupArgs {
  amount: BN
}

export interface WithdrawFromTopupAccounts {
  adminAuthority: PublicKey
  topupVault: PublicKey
  system: PublicKey
}

export const layout = borsh.struct([borsh.u64("amount")])

export function withdrawFromTopup(
  args: WithdrawFromTopupArgs,
  accounts: WithdrawFromTopupAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.topupVault, isSigner: false, isWritable: true },
    { pubkey: accounts.system, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([95, 227, 138, 220, 240, 95, 150, 113])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      amount: args.amount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
