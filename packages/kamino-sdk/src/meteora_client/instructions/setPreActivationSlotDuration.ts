import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SetPreActivationSlotDurationArgs {
  preActivationSlotDuration: number
}

export interface SetPreActivationSlotDurationAccounts {
  lbPair: PublicKey
  creator: PublicKey
}

export const layout = borsh.struct([borsh.u16("preActivationSlotDuration")])

export function setPreActivationSlotDuration(
  args: SetPreActivationSlotDurationArgs,
  accounts: SetPreActivationSlotDurationAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    { pubkey: accounts.creator, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([24, 213, 73, 145, 1, 149, 127, 37])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      preActivationSlotDuration: args.preActivationSlotDuration,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
