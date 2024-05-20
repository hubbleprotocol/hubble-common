import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface IncreasePositionLengthArgs {
  lengthToAdd: number
  side: number
}

export interface IncreasePositionLengthAccounts {
  funder: PublicKey
  lbPair: PublicKey
  position: PublicKey
  owner: PublicKey
  systemProgram: PublicKey
  eventAuthority: PublicKey
  program: PublicKey
}

export const layout = borsh.struct([borsh.u16("lengthToAdd"), borsh.u8("side")])

export function increasePositionLength(
  args: IncreasePositionLengthArgs,
  accounts: IncreasePositionLengthAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.lbPair, isSigner: false, isWritable: false },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([80, 83, 117, 211, 66, 13, 33, 149])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      lengthToAdd: args.lengthToAdd,
      side: args.side,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
