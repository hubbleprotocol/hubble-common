import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface OpenPositionArgs {
  bumps: types.OpenPositionBumpsFields
  tickLowerIndex: number
  tickUpperIndex: number
}

export interface OpenPositionAccounts {
  funder: PublicKey
  owner: PublicKey
  position: PublicKey
  positionMint: PublicKey
  positionTokenAccount: PublicKey
  whirlpool: PublicKey
  tokenProgram: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
  associatedTokenProgram: PublicKey
}

export const layout = borsh.struct([
  types.OpenPositionBumps.layout("bumps"),
  borsh.i32("tickLowerIndex"),
  borsh.i32("tickUpperIndex"),
])

export function openPosition(
  args: OpenPositionArgs,
  accounts: OpenPositionAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.owner, isSigner: false, isWritable: false },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.positionMint, isSigner: true, isWritable: true },
    {
      pubkey: accounts.positionTokenAccount,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([135, 128, 47, 77, 15, 152, 240, 49])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      bumps: types.OpenPositionBumps.toEncodable(args.bumps),
      tickLowerIndex: args.tickLowerIndex,
      tickUpperIndex: args.tickUpperIndex,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
