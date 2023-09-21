import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface DepositAndInvestArgs {
  tokenMaxA: BN
  tokenMaxB: BN
}

export interface DepositAndInvestAccounts {
  user: PublicKey
  strategy: PublicKey
  globalConfig: PublicKey
  /** check that the pool is owned either by orca or by raydium */
  pool: PublicKey
  position: PublicKey
  raydiumProtocolPositionOrBaseVaultAuthority: PublicKey
  positionTokenAccount: PublicKey
  tokenAVault: PublicKey
  tokenBVault: PublicKey
  poolTokenVaultA: PublicKey
  poolTokenVaultB: PublicKey
  tickArrayLower: PublicKey
  tickArrayUpper: PublicKey
  baseVaultAuthority: PublicKey
  tokenAAta: PublicKey
  tokenBAta: PublicKey
  tokenAMint: PublicKey
  tokenBMint: PublicKey
  userSharesAta: PublicKey
  sharesMint: PublicKey
  sharesMintAuthority: PublicKey
  scopePrices: PublicKey
  tokenInfos: PublicKey
  tokenProgram: PublicKey
  poolProgram: PublicKey
  instructionSysvarAccount: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("tokenMaxA"),
  borsh.u64("tokenMaxB"),
])

export function depositAndInvest(
  args: DepositAndInvestArgs,
  accounts: DepositAndInvestAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.pool, isSigner: false, isWritable: true },
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
    { pubkey: accounts.tokenAVault, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBVault, isSigner: false, isWritable: true },
    { pubkey: accounts.poolTokenVaultA, isSigner: false, isWritable: true },
    { pubkey: accounts.poolTokenVaultB, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: true },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenAAta, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBAta, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenAMint, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBMint, isSigner: false, isWritable: true },
    { pubkey: accounts.userSharesAta, isSigner: false, isWritable: true },
    { pubkey: accounts.sharesMint, isSigner: false, isWritable: true },
    {
      pubkey: accounts.sharesMintAuthority,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.scopePrices, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenInfos, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.poolProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.instructionSysvarAccount,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([22, 157, 173, 6, 187, 25, 86, 109])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      tokenMaxA: args.tokenMaxA,
      tokenMaxB: args.tokenMaxB,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
