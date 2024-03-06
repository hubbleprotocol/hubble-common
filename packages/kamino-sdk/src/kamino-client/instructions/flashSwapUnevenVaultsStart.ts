import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface FlashSwapUnevenVaultsStartArgs {
  amount: BN
  aToB: boolean
}

export interface FlashSwapUnevenVaultsStartAccounts {
  swapper: PublicKey
  strategy: PublicKey
  globalConfig: PublicKey
  tokenAVault: PublicKey
  tokenBVault: PublicKey
  tokenAAta: PublicKey
  tokenBAta: PublicKey
  baseVaultAuthority: PublicKey
  pool: PublicKey
  position: PublicKey
  scopePrices: PublicKey
  tokenInfos: PublicKey
  tickArrayLower: PublicKey
  tickArrayUpper: PublicKey
  tokenProgram: PublicKey
  instructionSysvarAccount: PublicKey
  consensusAccount: PublicKey
}

export const layout = borsh.struct([borsh.u64("amount"), borsh.bool("aToB")])

/**
 * Start of a Flash swap uneven vaults.
 *
 * This needs to be the first instruction of the transaction or preceded only by a
 * ComputeBudget.
 *
 * This ix has to be paired with a `flash_swap_uneven_vaults_end` (`FlashSwapUnevenVaultsEnd`)
 * as the last instruction of the transaction. No other instruction targeted the program is
 * allowed.
 * The instructions between the start and end instructions are expected to perform the swap.
 */
export function flashSwapUnevenVaultsStart(
  args: FlashSwapUnevenVaultsStartArgs,
  accounts: FlashSwapUnevenVaultsStartAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.swapper, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenAVault, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBVault, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenAAta, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBAta, isSigner: false, isWritable: true },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.pool, isSigner: false, isWritable: true },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.scopePrices, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenInfos, isSigner: false, isWritable: false },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: false },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.instructionSysvarAccount,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.consensusAccount, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([129, 111, 174, 12, 10, 60, 149, 193])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      amount: args.amount,
      aToB: args.aToB,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
