import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface DepositArgs {
  tokenMaxA: BN
  tokenMaxB: BN
}

export interface DepositAccounts {
  user: PublicKey
  strategy: PublicKey
  globalConfig: PublicKey
  pool: PublicKey
  position: PublicKey
  tokenAVault: PublicKey
  tokenBVault: PublicKey
  baseVaultAuthority: PublicKey
  treasuryFeeTokenAVault: PublicKey
  treasuryFeeTokenBVault: PublicKey
  tokenAAta: PublicKey
  tokenBAta: PublicKey
  tokenAMint: PublicKey
  tokenBMint: PublicKey
  userSharesAta: PublicKey
  sharesMint: PublicKey
  sharesMintAuthority: PublicKey
  scopePrices: PublicKey
  tokenInfos: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
  associatedTokenProgram: PublicKey
  tokenProgram: PublicKey
  instructionSysvarAccount: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("tokenMaxA"),
  borsh.u64("tokenMaxB"),
])

export function deposit(args: DepositArgs, accounts: DepositAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.pool, isSigner: false, isWritable: false },
    { pubkey: accounts.position, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenAVault, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBVault, isSigner: false, isWritable: true },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: false },
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
    { pubkey: accounts.tokenAAta, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBAta, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenAMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBMint, isSigner: false, isWritable: false },
    { pubkey: accounts.userSharesAta, isSigner: false, isWritable: true },
    { pubkey: accounts.sharesMint, isSigner: false, isWritable: true },
    {
      pubkey: accounts.sharesMintAuthority,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.scopePrices, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenInfos, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.instructionSysvarAccount,
      isSigner: false,
      isWritable: false,
    },
  ]

  console.log("in IX accounts tokenAAta", accounts.tokenAAta.toString());
  console.log("in IX accounts tokenBAta", accounts.tokenBAta.toString());
  const identifier = Buffer.from([242, 35, 198, 137, 82, 225, 242, 182])
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
