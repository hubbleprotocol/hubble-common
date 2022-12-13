import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InvestAccounts {
  payer: PublicKey
  strategy: PublicKey
  globalConfig: PublicKey
  tokenAVault: PublicKey
  tokenBVault: PublicKey
  baseVaultAuthority: PublicKey
  pool: PublicKey
  tokenProgram: PublicKey
  position: PublicKey
  raydiumProtocolPositionOrBaseVaultAuthority: PublicKey
  positionTokenAccount: PublicKey
  poolTokenVaultA: PublicKey
  poolTokenVaultB: PublicKey
  tickArrayLower: PublicKey
  tickArrayUpper: PublicKey
  scopePrices: PublicKey
  poolProgram: PublicKey
  instructionSysvarAccount: PublicKey
}

export function invest(accounts: InvestAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenAVault, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBVault, isSigner: false, isWritable: true },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.pool, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    {
      pubkey: accounts.raydiumProtocolPositionOrBaseVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.positionTokenAccount,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.poolTokenVaultA, isSigner: false, isWritable: true },
    { pubkey: accounts.poolTokenVaultB, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: true },
    { pubkey: accounts.scopePrices, isSigner: false, isWritable: false },
    { pubkey: accounts.poolProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.instructionSysvarAccount,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([13, 245, 180, 103, 254, 182, 121, 4])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
