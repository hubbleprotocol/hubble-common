import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface DeleteTokenBadgeAccounts {
  whirlpoolsConfig: PublicKey
  whirlpoolsConfigExtension: PublicKey
  tokenBadgeAuthority: PublicKey
  tokenMint: PublicKey
  tokenBadge: PublicKey
  receiver: PublicKey
}

export function deleteTokenBadge(
  accounts: DeleteTokenBadgeAccounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpoolsConfig, isSigner: false, isWritable: false },
    {
      pubkey: accounts.whirlpoolsConfigExtension,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.tokenBadgeAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBadge, isSigner: false, isWritable: true },
    { pubkey: accounts.receiver, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([53, 146, 68, 8, 18, 117, 17, 185])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
