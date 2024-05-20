import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SetActivationSlotArgs {
  activationSlot: BN
}

export interface SetActivationSlotAccounts {
  lbPair: PublicKey
  admin: PublicKey
}

export const layout = borsh.struct([borsh.u64("activationSlot")])

export function setActivationSlot(
  args: SetActivationSlotArgs,
  accounts: SetActivationSlotAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    { pubkey: accounts.admin, isSigner: true, isWritable: true },
  ]
  const identifier = Buffer.from([200, 227, 90, 83, 27, 79, 191, 88])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      activationSlot: args.activationSlot,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
