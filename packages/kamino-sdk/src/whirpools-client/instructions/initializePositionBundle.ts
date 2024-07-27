import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface InitializePositionBundleAccounts {
  positionBundle: PublicKey
  positionBundleMint: PublicKey
  positionBundleTokenAccount: PublicKey
  positionBundleOwner: PublicKey
  funder: PublicKey
  tokenProgram: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
  associatedTokenProgram: PublicKey
}

export function initializePositionBundle(
  accounts: InitializePositionBundleAccounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.positionBundle, isSigner: false, isWritable: true },
    { pubkey: accounts.positionBundleMint, isSigner: true, isWritable: true },
    {
      pubkey: accounts.positionBundleTokenAccount,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.positionBundleOwner,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([117, 45, 241, 149, 24, 18, 194, 65])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
