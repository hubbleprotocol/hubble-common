import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializePermissionLbPairArgs {
  ixData: types.InitPermissionPairIxFields
}

export interface InitializePermissionLbPairAccounts {
  base: PublicKey
  lbPair: PublicKey
  binArrayBitmapExtension: PublicKey
  tokenMintX: PublicKey
  tokenMintY: PublicKey
  reserveX: PublicKey
  reserveY: PublicKey
  oracle: PublicKey
  admin: PublicKey
  tokenProgram: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
  eventAuthority: PublicKey
  program: PublicKey
}

export const layout = borsh.struct([
  types.InitPermissionPairIx.layout("ixData"),
])

export function initializePermissionLbPair(
  args: InitializePermissionLbPairArgs,
  accounts: InitializePermissionLbPairAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.base, isSigner: true, isWritable: false },
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    {
      pubkey: accounts.binArrayBitmapExtension,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenMintX, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenMintY, isSigner: false, isWritable: false },
    { pubkey: accounts.reserveX, isSigner: false, isWritable: true },
    { pubkey: accounts.reserveY, isSigner: false, isWritable: true },
    { pubkey: accounts.oracle, isSigner: false, isWritable: true },
    { pubkey: accounts.admin, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([108, 102, 213, 85, 251, 3, 53, 21])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      ixData: types.InitPermissionPairIx.toEncodable(args.ixData),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
