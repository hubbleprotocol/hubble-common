import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ResetSqrtPriceArgs {
  sqrtPriceX64: BN
}

export interface ResetSqrtPriceAccounts {
  /** Only admin has the authority to reset initial price */
  owner: PublicKey
  /** Initialize an account to store the pool state */
  poolState: PublicKey
  /** Token_0 vault */
  tokenVault0: PublicKey
  /** Token_1 vault */
  tokenVault1: PublicKey
  /** The program account for the most recent oracle observation */
  observationState: PublicKey
  /** The destination token account for receive amount_0 */
  recipientTokenAccount0: PublicKey
  /** The destination token account for receive amount_1 */
  recipientTokenAccount1: PublicKey
  /** SPL program to transfer out tokens */
  tokenProgram: PublicKey
}

export const layout = borsh.struct([borsh.u128("sqrtPriceX64")])

/**
 * Reset a pool sqrt price, only can be reset if the pool hasn't be used.
 *
 * # Arguments
 *
 * * `ctx`- The context of accounts
 * * `sqrt_price_x64` - the reset sqrt price of the pool as a Q64.64
 *
 */
export function resetSqrtPrice(
  args: ResetSqrtPriceArgs,
  accounts: ResetSqrtPriceAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.owner, isSigner: true, isWritable: false },
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVault0, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVault1, isSigner: false, isWritable: true },
    { pubkey: accounts.observationState, isSigner: false, isWritable: true },
    {
      pubkey: accounts.recipientTokenAccount0,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.recipientTokenAccount1,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([36, 83, 233, 182, 194, 87, 47, 31])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      sqrtPriceX64: args.sqrtPriceX64,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
