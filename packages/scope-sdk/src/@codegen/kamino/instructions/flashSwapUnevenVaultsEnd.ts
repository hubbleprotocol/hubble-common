import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface FlashSwapUnevenVaultsEndArgs {
  minRepayAmount: BN
  amountToLeaveToUser: BN
  aToB: boolean
}

export interface FlashSwapUnevenVaultsEndAccounts {
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
  tokenProgram: PublicKey
  instructionSysvarAccount: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("minRepayAmount"),
  borsh.u64("amountToLeaveToUser"),
  borsh.bool("aToB"),
])

/**
 * End of Flash swap uneven vaults.
 *
 * See [`flash_swap_uneven_vaults_start`] for details.
 *
 * Warning: This instruction is allowed to be used independently from
 * `FlashSwapUnevenVaultsStart` and shall not perform any operation
 * that can be exploited when used alone.
 */
export function flashSwapUnevenVaultsEnd(
  args: FlashSwapUnevenVaultsEndArgs,
  accounts: FlashSwapUnevenVaultsEndAccounts,
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
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.instructionSysvarAccount,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([226, 2, 190, 101, 202, 132, 156, 20])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      minRepayAmount: args.minRepayAmount,
      amountToLeaveToUser: args.amountToLeaveToUser,
      aToB: args.aToB,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
