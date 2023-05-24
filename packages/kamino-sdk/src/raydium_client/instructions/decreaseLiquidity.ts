import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface DecreaseLiquidityArgs {
  liquidity: BN
  amount0Min: BN
  amount1Min: BN
}

export interface DecreaseLiquidityAccounts {
  /** The position owner or delegated authority */
  nftOwner: PublicKey
  /** The token account for the tokenized position */
  nftAccount: PublicKey
  /** Decrease liquidity for this position */
  personalPosition: PublicKey
  poolState: PublicKey
  protocolPosition: PublicKey
  /** Token_0 vault */
  tokenVault0: PublicKey
  /** Token_1 vault */
  tokenVault1: PublicKey
  /** Stores init state for the lower tick */
  tickArrayLower: PublicKey
  /** Stores init state for the upper tick */
  tickArrayUpper: PublicKey
  /** The destination token account for receive amount_0 */
  recipientTokenAccount0: PublicKey
  /** The destination token account for receive amount_1 */
  recipientTokenAccount1: PublicKey
  /** SPL program to transfer out tokens */
  tokenProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u128("liquidity"),
  borsh.u64("amount0Min"),
  borsh.u64("amount1Min"),
])

/**
 * Decreases liquidity with a exist position
 *
 * # Arguments
 *
 * * `ctx` -  The context of accounts
 * * `liquidity` - The amount by which liquidity will be decreased
 * * `amount_0_min` - The minimum amount of token_0 that should be accounted for the burned liquidity
 * * `amount_1_min` - The minimum amount of token_1 that should be accounted for the burned liquidity
 *
 */
export function decreaseLiquidity(
  args: DecreaseLiquidityArgs,
  accounts: DecreaseLiquidityAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.nftOwner, isSigner: true, isWritable: false },
    { pubkey: accounts.nftAccount, isSigner: false, isWritable: false },
    { pubkey: accounts.personalPosition, isSigner: false, isWritable: true },
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
    { pubkey: accounts.protocolPosition, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVault0, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVault1, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: true },
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
  const identifier = Buffer.from([160, 38, 208, 111, 104, 91, 44, 1])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      liquidity: args.liquidity,
      amount0Min: args.amount0Min,
      amount1Min: args.amount1Min,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
