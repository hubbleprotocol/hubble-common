import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface InitializeTokenBadgeAccounts {
  whirlpoolsConfig: PublicKey
  whirlpoolsConfigExtension: PublicKey
  tokenBadgeAuthority: PublicKey
  tokenMint: PublicKey
  tokenBadge: PublicKey
  funder: PublicKey
  systemProgram: PublicKey
}

export function initializeTokenBadge(
  accounts: InitializeTokenBadgeAccounts,
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
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([253, 77, 205, 95, 27, 224, 89, 223])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
