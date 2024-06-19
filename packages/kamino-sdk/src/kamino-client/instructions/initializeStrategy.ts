import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeStrategyArgs {
  strategyType: BN
  tokenACollateralId: BN
  tokenBCollateralId: BN
}

export interface InitializeStrategyAccounts {
  adminAuthority: PublicKey
  globalConfig: PublicKey
  /** Program owner also checked. */
  pool: PublicKey
  tokenAMint: PublicKey
  tokenBMint: PublicKey
  tokenAVault: PublicKey
  tokenBVault: PublicKey
  baseVaultAuthority: PublicKey
  sharesMint: PublicKey
  sharesMintAuthority: PublicKey
  scopePriceId: PublicKey
  scopeProgramId: PublicKey
  tokenInfos: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
  tokenProgram: PublicKey
  tokenATokenProgram: PublicKey
  tokenBTokenProgram: PublicKey
  strategy: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("strategyType"),
  borsh.u64("tokenACollateralId"),
  borsh.u64("tokenBCollateralId"),
])

export function initializeStrategy(
  args: InitializeStrategyArgs,
  accounts: InitializeStrategyAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.pool, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenAMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenAVault, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBVault, isSigner: false, isWritable: true },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.sharesMint, isSigner: false, isWritable: true },
    { pubkey: accounts.sharesMintAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.scopePriceId, isSigner: false, isWritable: false },
    { pubkey: accounts.scopeProgramId, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenInfos, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenATokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBTokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([208, 119, 144, 145, 178, 57, 105, 252])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      strategyType: args.strategyType,
      tokenACollateralId: args.tokenACollateralId,
      tokenBCollateralId: args.tokenBCollateralId,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
