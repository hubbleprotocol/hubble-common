import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface DecreasePositionLengthArgs {
  lengthToRemove: number
  side: number
}

export interface DecreasePositionLengthAccounts {
  rentReceiver: PublicKey
  position: PublicKey
  owner: PublicKey
  systemProgram: PublicKey
  eventAuthority: PublicKey
  program: PublicKey
}

export const layout = borsh.struct([
  borsh.u16("lengthToRemove"),
  borsh.u8("side"),
])

export function decreasePositionLength(
  args: DecreasePositionLengthArgs,
  accounts: DecreasePositionLengthAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.rentReceiver, isSigner: false, isWritable: true },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([194, 219, 136, 32, 25, 96, 105, 37])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      lengthToRemove: args.lengthToRemove,
      side: args.side,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
