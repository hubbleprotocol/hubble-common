import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface EmergencySwapArgs {
  aToB: boolean
  targetLimitBps: BN
}

export interface EmergencySwapAccounts {
  adminAuthority: PublicKey
  strategy: PublicKey
  globalConfig: PublicKey
  tokenAVault: PublicKey
  tokenBVault: PublicKey
  baseVaultAuthority: PublicKey
  pool: PublicKey
  position: PublicKey
  poolTokenVaultA: PublicKey
  poolTokenVaultB: PublicKey
  /** Payer must send this correctly. */
  tickArray0: PublicKey
  /** Payer must send this correctly. */
  tickArray1: PublicKey
  /** Payer must send this correctly. */
  tickArray2: PublicKey
  oracle: PublicKey
  poolProgram: PublicKey
  scopePrices: PublicKey
  tokenInfos: PublicKey
  tokenATokenProgram: PublicKey
  tokenBTokenProgram: PublicKey
  memoProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.bool("aToB"),
  borsh.u64("targetLimitBps"),
])

export function emergencySwap(
  args: EmergencySwapArgs,
  accounts: EmergencySwapAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenAVault, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBVault, isSigner: false, isWritable: true },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.pool, isSigner: false, isWritable: true },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.poolTokenVaultA, isSigner: false, isWritable: true },
    { pubkey: accounts.poolTokenVaultB, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArray0, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArray1, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArray2, isSigner: false, isWritable: true },
    { pubkey: accounts.oracle, isSigner: false, isWritable: false },
    { pubkey: accounts.poolProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.scopePrices, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenInfos, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenATokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBTokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([73, 226, 248, 215, 5, 197, 211, 229])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      aToB: args.aToB,
      targetLimitBps: args.targetLimitBps,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
