import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CollectFeesAccounts {
  user: PublicKey
  strategy: PublicKey
  globalConfig: PublicKey
  baseVaultAuthority: PublicKey
  whirlpool: PublicKey
  tickArrayLower: PublicKey
  tickArrayUpper: PublicKey
  position: PublicKey
  positionTokenAccount: PublicKey
  tokenAVault: PublicKey
  whirlpoolTokenVaultA: PublicKey
  tokenBVault: PublicKey
  whirlpoolTokenVaultB: PublicKey
  tokenProgram: PublicKey
  whirlpoolProgram: PublicKey
}

export function collectFees(accounts: CollectFeesAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: false },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: false },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    {
      pubkey: accounts.positionTokenAccount,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.tokenAVault, isSigner: false, isWritable: true },
    {
      pubkey: accounts.whirlpoolTokenVaultA,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenBVault, isSigner: false, isWritable: true },
    {
      pubkey: accounts.whirlpoolTokenVaultB,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.whirlpoolProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([164, 152, 207, 99, 30, 186, 19, 182])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
