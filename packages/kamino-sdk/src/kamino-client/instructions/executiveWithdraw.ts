import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ExecutiveWithdrawArgs {
  action: number
}

export interface ExecutiveWithdrawAccounts {
  adminAuthority: PublicKey
  strategy: PublicKey
  globalConfig: PublicKey
  whirlpool: PublicKey
  position: PublicKey
  positionTokenAccount: PublicKey
  tickArrayLower: PublicKey
  tickArrayUpper: PublicKey
  tokenAVault: PublicKey
  tokenBVault: PublicKey
  baseVaultAuthority: PublicKey
  whirlpoolTokenVaultA: PublicKey
  whirlpoolTokenVaultB: PublicKey
  tokenAMint: PublicKey
  tokenBMint: PublicKey
  tokenProgram: PublicKey
  whirlpoolProgram: PublicKey
}

export const layout = borsh.struct([borsh.u8("action")])

export function executiveWithdraw(
  args: ExecutiveWithdrawArgs,
  accounts: ExecutiveWithdrawAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
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
    {
      pubkey: accounts.whirlpoolTokenVaultA,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.whirlpoolTokenVaultB,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenAMint, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBMint, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.whirlpoolProgram, isSigner: false, isWritable: false },
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
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
