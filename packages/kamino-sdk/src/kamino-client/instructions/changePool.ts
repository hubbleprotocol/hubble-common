import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ChangePoolAccounts {
  adminAuthority: PublicKey
  strategy: PublicKey
  oldPosition: PublicKey
  baseVaultAuthority: PublicKey
  newPool: PublicKey
  strategyRewardVault0OrBaseVaultAuthority: PublicKey
  strategyRewardVault1OrBaseVaultAuthority: PublicKey
  strategyRewardVault2OrBaseVaultAuthority: PublicKey
}

export function changePool(
  accounts: ChangePoolAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.oldPosition, isSigner: false, isWritable: false },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.newPool, isSigner: false, isWritable: false },
    {
      pubkey: accounts.strategyRewardVault0OrBaseVaultAuthority,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: accounts.strategyRewardVault1OrBaseVaultAuthority,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: accounts.strategyRewardVault2OrBaseVaultAuthority,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([141, 221, 123, 235, 35, 9, 145, 201])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
