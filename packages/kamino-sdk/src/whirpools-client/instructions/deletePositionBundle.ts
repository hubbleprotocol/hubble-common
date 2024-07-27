import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface DeletePositionBundleAccounts {
  positionBundle: PublicKey
  positionBundleMint: PublicKey
  positionBundleTokenAccount: PublicKey
  positionBundleOwner: PublicKey
  receiver: PublicKey
  tokenProgram: PublicKey
}

export function deletePositionBundle(
  accounts: DeletePositionBundleAccounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.positionBundle, isSigner: false, isWritable: true },
    { pubkey: accounts.positionBundleMint, isSigner: false, isWritable: true },
    {
      pubkey: accounts.positionBundleTokenAccount,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.positionBundleOwner, isSigner: true, isWritable: false },
    { pubkey: accounts.receiver, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([100, 25, 99, 2, 217, 239, 124, 173])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
