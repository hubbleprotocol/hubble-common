import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CollectRewardsAccounts {
  user: PublicKey
  strategy: PublicKey
  globalConfig: PublicKey
  baseVaultAuthority: PublicKey
  whirlpool: PublicKey
  position: PublicKey
  positionTokenAccount: PublicKey
  reward0Vault: PublicKey
  reward1Vault: PublicKey
  reward2Vault: PublicKey
  whirlpoolRewardVault0: PublicKey
  whirlpoolRewardVault1: PublicKey
  whirlpoolRewardVault2: PublicKey
  tickArrayLower: PublicKey
  tickArrayUpper: PublicKey
  tokenProgram: PublicKey
  whirlpoolProgram: PublicKey
}

export function collectRewards(accounts: CollectRewardsAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    {
      pubkey: accounts.positionTokenAccount,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.reward0Vault, isSigner: false, isWritable: true },
    { pubkey: accounts.reward1Vault, isSigner: false, isWritable: true },
    { pubkey: accounts.reward2Vault, isSigner: false, isWritable: true },
    {
      pubkey: accounts.whirlpoolRewardVault0,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.whirlpoolRewardVault1,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.whirlpoolRewardVault2,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: false },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.whirlpoolProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([63, 130, 90, 197, 39, 16, 143, 176])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
