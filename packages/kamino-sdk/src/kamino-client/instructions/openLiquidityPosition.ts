import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface OpenLiquidityPositionArgs {
  tickLowerIndex: BN
  tickUpperIndex: BN
  bump: number
}

export interface OpenLiquidityPositionAccounts {
  adminAuthority: PublicKey
  strategy: PublicKey
  globalConfig: PublicKey
  pool: PublicKey
  tickArrayLower: PublicKey
  tickArrayUpper: PublicKey
  baseVaultAuthority: PublicKey
  position: PublicKey
  positionMint: PublicKey
  positionMetadataAccount: PublicKey
  positionTokenAccount: PublicKey
  rent: PublicKey
  system: PublicKey
  tokenProgram: PublicKey
  tokenATokenProgram: PublicKey
  tokenBTokenProgram: PublicKey
  memoProgram: PublicKey
  associatedTokenProgram: PublicKey
  poolProgram: PublicKey
  oldTickArrayLowerOrBaseVaultAuthority: PublicKey
  oldTickArrayUpperOrBaseVaultAuthority: PublicKey
  oldPositionOrBaseVaultAuthority: PublicKey
  oldPositionMintOrBaseVaultAuthority: PublicKey
  oldPositionTokenAccountOrBaseVaultAuthority: PublicKey
  tokenAVault: PublicKey
  tokenBVault: PublicKey
  tokenAMint: PublicKey
  tokenBMint: PublicKey
  poolTokenVaultA: PublicKey
  poolTokenVaultB: PublicKey
  scopePrices: PublicKey
  tokenInfos: PublicKey
  eventAuthority: PublicKey
  consensusAccount: PublicKey
}

export const layout = borsh.struct([
  borsh.i64("tickLowerIndex"),
  borsh.i64("tickUpperIndex"),
  borsh.u8("bump"),
])

export function openLiquidityPosition(
  args: OpenLiquidityPositionArgs,
  accounts: OpenLiquidityPositionAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.pool, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: true },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.positionMint, isSigner: false, isWritable: true },
    {
      pubkey: accounts.positionMetadataAccount,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.positionTokenAccount,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.system, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenATokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBTokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.poolProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.oldTickArrayLowerOrBaseVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.oldTickArrayUpperOrBaseVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
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
    { pubkey: accounts.tokenAMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBMint, isSigner: false, isWritable: false },
    { pubkey: accounts.poolTokenVaultA, isSigner: false, isWritable: true },
    { pubkey: accounts.poolTokenVaultB, isSigner: false, isWritable: true },
    { pubkey: accounts.scopePrices, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenInfos, isSigner: false, isWritable: false },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.consensusAccount, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([204, 234, 204, 219, 6, 91, 96, 241])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      tickLowerIndex: args.tickLowerIndex,
      tickUpperIndex: args.tickUpperIndex,
      bump: args.bump,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
