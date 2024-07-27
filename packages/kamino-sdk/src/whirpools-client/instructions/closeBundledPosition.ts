import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface CloseBundledPositionArgs {
  bundleIndex: number
}

export interface CloseBundledPositionAccounts {
  bundledPosition: PublicKey
  positionBundle: PublicKey
  positionBundleTokenAccount: PublicKey
  positionBundleAuthority: PublicKey
  receiver: PublicKey
}

export const layout = borsh.struct([borsh.u16("bundleIndex")])

export function closeBundledPosition(
  args: CloseBundledPositionArgs,
  accounts: CloseBundledPositionAccounts,
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
    { pubkey: accounts.receiver, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([41, 36, 216, 245, 27, 85, 103, 67])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      bundleIndex: args.bundleIndex,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
