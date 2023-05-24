import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface IncreaseLiquidityArgs {
  liquidity: BN
  amount0Max: BN
  amount1Max: BN
}

export interface IncreaseLiquidityAccounts {
  /** Pays to mint the position */
  nftOwner: PublicKey
  /** The token account for nft */
  nftAccount: PublicKey
  poolState: PublicKey
  protocolPosition: PublicKey
  /** Increase liquidity for this position */
  personalPosition: PublicKey
  /** Stores init state for the lower tick */
  tickArrayLower: PublicKey
  /** Stores init state for the upper tick */
  tickArrayUpper: PublicKey
  /** The payer's token account for token_0 */
  tokenAccount0: PublicKey
  /** The token account spending token_1 to mint the position */
  tokenAccount1: PublicKey
  /** The address that holds pool tokens for token_0 */
  tokenVault0: PublicKey
  /** The address that holds pool tokens for token_1 */
  tokenVault1: PublicKey
  /** Program to create mint account and mint tokens */
  tokenProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u128("liquidity"),
  borsh.u64("amount0Max"),
  borsh.u64("amount1Max"),
])

/**
 * Increases liquidity with a exist position, with amount paid by `payer`
 *
 * # Arguments
 *
 * * `ctx` - The context of accounts
 * * `liquidity` - The desired liquidity to be added
 * * `amount_0_max` - The max amount of token_0 to spend, which serves as a slippage check
 * * `amount_1_max` - The max amount of token_1 to spend, which serves as a slippage check
 *
 */
export function increaseLiquidity(
  args: IncreaseLiquidityArgs,
  accounts: IncreaseLiquidityAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.nftOwner, isSigner: true, isWritable: false },
    { pubkey: accounts.nftAccount, isSigner: false, isWritable: false },
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
    { pubkey: accounts.protocolPosition, isSigner: false, isWritable: true },
    { pubkey: accounts.personalPosition, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenAccount0, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenAccount1, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVault0, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVault1, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([46, 156, 243, 118, 13, 205, 251, 178])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      liquidity: args.liquidity,
      amount0Max: args.amount0Max,
      amount1Max: args.amount1Max,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
