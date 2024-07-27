import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface OpenBundledPositionArgs {
  bundleIndex: number
  tickLowerIndex: number
  tickUpperIndex: number
}

export interface OpenBundledPositionAccounts {
  bundledPosition: PublicKey
  positionBundle: PublicKey
  positionBundleTokenAccount: PublicKey
  positionBundleAuthority: PublicKey
  whirlpool: PublicKey
  funder: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([
  borsh.u16("bundleIndex"),
  borsh.i32("tickLowerIndex"),
  borsh.i32("tickUpperIndex"),
])

export function openBundledPosition(
  args: OpenBundledPositionArgs,
  accounts: OpenBundledPositionAccounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.bundledPosition, isSigner: false, isWritable: true },
    { pubkey: accounts.positionBundle, isSigner: false, isWritable: true },
    {
      pubkey: accounts.positionBundleTokenAccount,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: accounts.positionBundleAuthority,
      isSigner: true,
      isWritable: false,
    },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: false },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([169, 113, 126, 171, 213, 172, 212, 49])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      bundleIndex: args.bundleIndex,
      tickLowerIndex: args.tickLowerIndex,
      tickUpperIndex: args.tickUpperIndex,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
