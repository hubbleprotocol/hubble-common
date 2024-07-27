import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SetLockReleaseSlotArgs {
  newLockReleaseSlot: BN
}

export interface SetLockReleaseSlotAccounts {
  position: PublicKey
  lbPair: PublicKey
  sender: PublicKey
  eventAuthority: PublicKey
  program: PublicKey
}

export const layout = borsh.struct([borsh.u64("newLockReleaseSlot")])

export function setLockReleaseSlot(
  args: SetLockReleaseSlotArgs,
  accounts: SetLockReleaseSlotAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.lbPair, isSigner: false, isWritable: false },
    { pubkey: accounts.sender, isSigner: true, isWritable: false },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([207, 224, 170, 143, 189, 159, 46, 150])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      newLockReleaseSlot: args.newLockReleaseSlot,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
