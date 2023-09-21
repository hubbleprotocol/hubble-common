import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CloseStrategyAccounts {
  adminAuthority: PublicKey
  strategy: PublicKey
  oldPositionOrBaseVaultAuthority: PublicKey
  oldPositionMintOrBaseVaultAuthority: PublicKey
  oldPositionTokenAccountOrBaseVaultAuthority: PublicKey
  tokenAVault: PublicKey
  tokenBVault: PublicKey
  userTokenAAta: PublicKey
  userTokenBAta: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  reward0Vault: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  reward1Vault: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  reward2Vault: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  kaminoReward0Vault: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  kaminoReward1Vault: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  kaminoReward2Vault: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  userReward0Ata: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  userReward1Ata: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  userReward2Ata: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  userKaminoReward0Ata: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  userKaminoReward1Ata: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  userKaminoReward2Ata: PublicKey
  baseVaultAuthority: PublicKey
  poolProgram: PublicKey
  tokenProgram: PublicKey
  system: PublicKey
}

export function closeStrategy(accounts: CloseStrategyAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    {
      pubkey: accounts.oldPositionOrBaseVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.oldPositionMintOrBaseVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.oldPositionTokenAccountOrBaseVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenAVault, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBVault, isSigner: false, isWritable: true },
    { pubkey: accounts.userTokenAAta, isSigner: false, isWritable: true },
    { pubkey: accounts.userTokenBAta, isSigner: false, isWritable: true },
    { pubkey: accounts.reward0Vault, isSigner: false, isWritable: true },
    { pubkey: accounts.reward1Vault, isSigner: false, isWritable: true },
    { pubkey: accounts.reward2Vault, isSigner: false, isWritable: true },
    { pubkey: accounts.kaminoReward0Vault, isSigner: false, isWritable: true },
    { pubkey: accounts.kaminoReward1Vault, isSigner: false, isWritable: true },
    { pubkey: accounts.kaminoReward2Vault, isSigner: false, isWritable: true },
    { pubkey: accounts.userReward0Ata, isSigner: false, isWritable: true },
    { pubkey: accounts.userReward1Ata, isSigner: false, isWritable: true },
    { pubkey: accounts.userReward2Ata, isSigner: false, isWritable: true },
    {
      pubkey: accounts.userKaminoReward0Ata,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.userKaminoReward1Ata,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.userKaminoReward2Ata,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.poolProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.system, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([56, 247, 170, 246, 89, 221, 134, 200])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
