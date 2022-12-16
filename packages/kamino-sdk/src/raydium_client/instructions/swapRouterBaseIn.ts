import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SwapRouterBaseInArgs {
  amountIn: BN
  amountOutMinimum: BN
}

export interface SwapRouterBaseInAccounts {
  /** The user performing the swap */
  payer: PublicKey
  /** The token account that pays input tokens for the swap */
  inputTokenAccount: PublicKey
  /** SPL program for token transfers */
  tokenProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("amountIn"),
  borsh.u64("amountOutMinimum"),
])

/**
 * Swap token for as much as possible of another token across the path provided, base input
 *
 * # Arguments
 *
 * * `ctx` - The context of accounts
 * * `amount_in` - Token amount to be swapped in
 * * `amount_out_minimum` - Panic if output amount is below minimum amount. For slippage.
 *
 */
export function swapRouterBaseIn(
  args: SwapRouterBaseInArgs,
  accounts: SwapRouterBaseInAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: false },
    { pubkey: accounts.inputTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([69, 125, 115, 218, 245, 186, 242, 196])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      amountIn: args.amountIn,
      amountOutMinimum: args.amountOutMinimum,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
