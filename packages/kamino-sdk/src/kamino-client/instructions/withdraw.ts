import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface WithdrawArgs {
  sharesAmount: BN
}

export interface WithdrawAccounts {
  user: PublicKey
  strategy: PublicKey
  globalConfig: PublicKey
  whirlpool: PublicKey
  position: PublicKey
  tickArrayLower: PublicKey
  tickArrayUpper: PublicKey
  tokenAVault: PublicKey
  tokenBVault: PublicKey
  baseVaultAuthority: PublicKey
  whirlpoolTokenVaultA: PublicKey
  whirlpoolTokenVaultB: PublicKey
  tokenAAta: PublicKey
  tokenBAta: PublicKey
  tokenAMint: PublicKey
  tokenBMint: PublicKey
  userSharesAta: PublicKey
  sharesMint: PublicKey
  sharesMintAuthority: PublicKey
  tokenProgram: PublicKey
  positionTokenAccount: PublicKey
  whirlpoolProgram: PublicKey
}

export const layout = borsh.struct([borsh.u64("sharesAmount")])

export function withdraw(args: WithdrawArgs, accounts: WithdrawAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
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
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.positionTokenAccount,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.whirlpoolProgram, isSigner: false, isWritable: false },
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
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
