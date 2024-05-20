import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SetMaxSwappedAmountArgs {
  swapCapDeactivateSlot: BN
  maxSwappedAmount: BN
}

export interface SetMaxSwappedAmountAccounts {
  lbPair: PublicKey
  admin: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("swapCapDeactivateSlot"),
  borsh.u64("maxSwappedAmount"),
])

export function setMaxSwappedAmount(
  args: SetMaxSwappedAmountArgs,
  accounts: SetMaxSwappedAmountAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    { pubkey: accounts.admin, isSigner: true, isWritable: true },
  ]
  const identifier = Buffer.from([181, 76, 219, 75, 16, 232, 212, 213])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      swapCapDeactivateSlot: args.swapCapDeactivateSlot,
      maxSwappedAmount: args.maxSwappedAmount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
