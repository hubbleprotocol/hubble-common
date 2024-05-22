import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CollectFeesAndRewardsAccounts {
  user: PublicKey
  strategy: PublicKey
  globalConfig: PublicKey
  baseVaultAuthority: PublicKey
  pool: PublicKey
  tickArrayLower: PublicKey
  tickArrayUpper: PublicKey
  position: PublicKey
  raydiumProtocolPositionOrBaseVaultAuthority: PublicKey
  positionTokenAccount: PublicKey
  tokenAVault: PublicKey
  poolTokenVaultA: PublicKey
  tokenBVault: PublicKey
  poolTokenVaultB: PublicKey
  treasuryFeeTokenAVault: PublicKey
  treasuryFeeTokenBVault: PublicKey
  treasuryFeeVaultAuthority: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  reward0Vault: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  reward1Vault: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  reward2Vault: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  poolRewardVault0: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  poolRewardVault1: PublicKey
  /** If rewards are uninitialized, pass this as strategy. */
  poolRewardVault2: PublicKey
  reward0Mint: PublicKey
  reward1Mint: PublicKey
  reward2Mint: PublicKey
  tokenAMint: PublicKey
  tokenBMint: PublicKey
  tokenProgram: PublicKey
  poolProgram: PublicKey
  instructionSysvarAccount: PublicKey
  eventAuthority: PublicKey
}

export function collectFeesAndRewards(
  accounts: CollectFeesAndRewardsAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.pool, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: true },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    {
      pubkey: accounts.raydiumProtocolPositionOrBaseVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.positionTokenAccount,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.tokenAVault, isSigner: false, isWritable: true },
    { pubkey: accounts.poolTokenVaultA, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBVault, isSigner: false, isWritable: true },
    { pubkey: accounts.poolTokenVaultB, isSigner: false, isWritable: true },
    {
      pubkey: accounts.treasuryFeeTokenAVault,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.treasuryFeeTokenBVault,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.treasuryFeeVaultAuthority,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.reward0Vault, isSigner: false, isWritable: true },
    { pubkey: accounts.reward1Vault, isSigner: false, isWritable: true },
    { pubkey: accounts.reward2Vault, isSigner: false, isWritable: true },
    { pubkey: accounts.poolRewardVault0, isSigner: false, isWritable: true },
    { pubkey: accounts.poolRewardVault1, isSigner: false, isWritable: true },
    { pubkey: accounts.poolRewardVault2, isSigner: false, isWritable: true },
    { pubkey: accounts.reward0Mint, isSigner: false, isWritable: false },
    { pubkey: accounts.reward1Mint, isSigner: false, isWritable: false },
    { pubkey: accounts.reward2Mint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenAMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.poolProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.instructionSysvarAccount,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([113, 18, 75, 8, 182, 31, 105, 186])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
