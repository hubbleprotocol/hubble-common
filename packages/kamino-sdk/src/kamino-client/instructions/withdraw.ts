import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface WithdrawArgs {
  sharesAmount: BN
}

export interface WithdrawAccounts {
  user: PublicKey
  strategy: PublicKey
  globalConfig: PublicKey
  pool: PublicKey
  position: PublicKey
  tickArrayLower: PublicKey
  tickArrayUpper: PublicKey
  tokenAVault: PublicKey
  tokenBVault: PublicKey
  baseVaultAuthority: PublicKey
  poolTokenVaultA: PublicKey
  poolTokenVaultB: PublicKey
  tokenAAta: PublicKey
  tokenBAta: PublicKey
  tokenAMint: PublicKey
  tokenBMint: PublicKey
  userSharesAta: PublicKey
  sharesMint: PublicKey
  treasuryFeeTokenAVault: PublicKey
  treasuryFeeTokenBVault: PublicKey
  tokenProgram: PublicKey
  tokenProgram2022: PublicKey
  tokenATokenProgram: PublicKey
  tokenBTokenProgram: PublicKey
  memoProgram: PublicKey
  positionTokenAccount: PublicKey
  poolProgram: PublicKey
  instructionSysvarAccount: PublicKey
  eventAuthority: PublicKey
}

export const layout = borsh.struct([borsh.u64("sharesAmount")])

export function withdraw(
  args: WithdrawArgs,
  accounts: WithdrawAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.pool, isSigner: false, isWritable: true },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenAVault, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBVault, isSigner: false, isWritable: true },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.poolTokenVaultA, isSigner: false, isWritable: true },
    { pubkey: accounts.poolTokenVaultB, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenAAta, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBAta, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenAMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBMint, isSigner: false, isWritable: false },
    { pubkey: accounts.userSharesAta, isSigner: false, isWritable: true },
    { pubkey: accounts.sharesMint, isSigner: false, isWritable: true },
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
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram2022, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenATokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBTokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.positionTokenAccount,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.poolProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.instructionSysvarAccount,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([183, 18, 70, 156, 148, 109, 161, 34])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      sharesAmount: args.sharesAmount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
