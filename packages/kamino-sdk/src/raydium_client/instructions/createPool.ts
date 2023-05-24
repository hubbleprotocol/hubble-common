import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreatePoolArgs {
  sqrtPriceX64: BN
  openTime: BN
}

export interface CreatePoolAccounts {
  /** Address paying to create the pool. Can be anyone */
  poolCreator: PublicKey
  /** Which config the pool belongs to. */
  ammConfig: PublicKey
  /** Initialize an account to store the pool state */
  poolState: PublicKey
  /** Token_0 mint, the key must grater then token_1 mint. */
  tokenMint0: PublicKey
  /** Token_1 mint */
  tokenMint1: PublicKey
  /** Token_0 vault for the pool */
  tokenVault0: PublicKey
  /** Token_1 vault for the pool */
  tokenVault1: PublicKey
  observationState: PublicKey
  /** Spl token program */
  tokenProgram: PublicKey
  /** To create a new program account */
  systemProgram: PublicKey
  /** Sysvar for program account */
  rent: PublicKey
}

export const layout = borsh.struct([
  borsh.u128("sqrtPriceX64"),
  borsh.u64("openTime"),
])

/**
 * Creates a pool for the given token pair and the initial price
 *
 * # Arguments
 *
 * * `ctx`- The context of accounts
 * * `sqrt_price_x64` - the initial sqrt price (amount_token_1 / amount_token_0) of the pool as a Q64.64
 *
 */
export function createPool(args: CreatePoolArgs, accounts: CreatePoolAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.poolCreator, isSigner: true, isWritable: true },
    { pubkey: accounts.ammConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenMint0, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenMint1, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenVault0, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVault1, isSigner: false, isWritable: true },
    { pubkey: accounts.observationState, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([233, 146, 209, 142, 207, 104, 64, 188])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      sqrtPriceX64: args.sqrtPriceX64,
      openTime: args.openTime,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
