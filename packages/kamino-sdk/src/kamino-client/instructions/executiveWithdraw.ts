import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ExecutiveWithdrawArgs {
  action: number
}

export interface ExecutiveWithdrawAccounts {
  adminAuthority: PublicKey
  strategy: PublicKey
  globalConfig: PublicKey
  pool: PublicKey
  position: PublicKey
  raydiumProtocolPositionOrBaseVaultAuthority: PublicKey
  positionTokenAccount: PublicKey
  tickArrayLower: PublicKey
  tickArrayUpper: PublicKey
  tokenAVault: PublicKey
  tokenBVault: PublicKey
  baseVaultAuthority: PublicKey
  poolTokenVaultA: PublicKey
  poolTokenVaultB: PublicKey
  tokenAMint: PublicKey
  tokenBMint: PublicKey
  scopePrices: PublicKey
  tokenInfos: PublicKey
  tokenATokenProgram: PublicKey
  tokenBTokenProgram: PublicKey
  memoProgram: PublicKey
  tokenProgram: PublicKey
  tokenProgram2022: PublicKey
  poolProgram: PublicKey
  eventAuthority: PublicKey
}

export const layout = borsh.struct([borsh.u8("action")])

export function executiveWithdraw(
  args: ExecutiveWithdrawArgs,
  accounts: ExecutiveWithdrawAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
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
      isWritable: false,
    },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenAVault, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBVault, isSigner: false, isWritable: true },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.poolTokenVaultA, isSigner: false, isWritable: true },
    { pubkey: accounts.poolTokenVaultB, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenAMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBMint, isSigner: false, isWritable: false },
    { pubkey: accounts.scopePrices, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenInfos, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenATokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBTokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram2022, isSigner: false, isWritable: false },
    { pubkey: accounts.poolProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([159, 39, 110, 137, 100, 234, 204, 141])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      action: args.action,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
