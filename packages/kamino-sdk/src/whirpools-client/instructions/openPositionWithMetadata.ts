import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface OpenPositionWithMetadataArgs {
  bumps: types.OpenPositionWithMetadataBumpsFields
  tickLowerIndex: number
  tickUpperIndex: number
}

export interface OpenPositionWithMetadataAccounts {
  funder: PublicKey
  owner: PublicKey
  position: PublicKey
  positionMint: PublicKey
  positionMetadataAccount: PublicKey
  positionTokenAccount: PublicKey
  whirlpool: PublicKey
  tokenProgram: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
  associatedTokenProgram: PublicKey
  metadataProgram: PublicKey
  metadataUpdateAuth: PublicKey
}

export const layout = borsh.struct([
  types.OpenPositionWithMetadataBumps.layout("bumps"),
  borsh.i32("tickLowerIndex"),
  borsh.i32("tickUpperIndex"),
])

export function openPositionWithMetadata(
  args: OpenPositionWithMetadataArgs,
  accounts: OpenPositionWithMetadataAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.owner, isSigner: false, isWritable: false },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.positionMint, isSigner: true, isWritable: true },
    {
      pubkey: accounts.positionMetadataAccount,
      isSigner: false,
      isWritable: true,
    },
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
    { pubkey: accounts.metadataProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.metadataUpdateAuth, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([242, 29, 134, 48, 58, 110, 14, 60])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      bumps: types.OpenPositionWithMetadataBumps.toEncodable(args.bumps),
      tickLowerIndex: args.tickLowerIndex,
      tickUpperIndex: args.tickUpperIndex,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
