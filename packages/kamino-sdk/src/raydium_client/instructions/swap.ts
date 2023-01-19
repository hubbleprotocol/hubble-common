import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface SwapArgs {
  amount: BN;
  otherAmountThreshold: BN;
  sqrtPriceLimitX64: BN;
  isBaseInput: boolean;
}

export interface SwapAccounts {
  /** The user performing the swap */
  payer: PublicKey;
  /** The factory state to read protocol fees */
  ammConfig: PublicKey;
  /** The program account of the pool in which the swap will be performed */
  poolState: PublicKey;
  /** The user token account for input token */
  inputTokenAccount: PublicKey;
  /** The user token account for output token */
  outputTokenAccount: PublicKey;
  /** The vault token account for input token */
  inputVault: PublicKey;
  /** The vault token account for output token */
  outputVault: PublicKey;
  /** The program account for the most recent oracle observation */
  observationState: PublicKey;
  /** SPL program for token transfers */
  tokenProgram: PublicKey;
  tickArray: PublicKey;
}

export const layout = borsh.struct([
  borsh.u64('amount'),
  borsh.u64('otherAmountThreshold'),
  borsh.u128('sqrtPriceLimitX64'),
  borsh.bool('isBaseInput'),
]);

/**
 * Swaps one token for as much as possible of another token across a single pool
 *
 * # Arguments
 *
 * * `ctx` - The context of accounts
 * * `amount` - Arranged in pairs with other_amount_threshold. (amount_in, amount_out_minimum) or (amount_out, amount_in_maximum)
 * * `other_amount_threshold` - For slippage check
 * * `sqrt_price_limit` - The Q64.64 sqrt price √P limit. If zero for one, the price cannot
 * * `is_base_input` - swap base input or swap base output
 *
 */
export function swap(args: SwapArgs, accounts: SwapAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: false },
    { pubkey: accounts.ammConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
    { pubkey: accounts.inputTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.outputTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.inputVault, isSigner: false, isWritable: true },
    { pubkey: accounts.outputVault, isSigner: false, isWritable: true },
    { pubkey: accounts.observationState, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tickArray, isSigner: false, isWritable: true },
  ];
  const identifier = Buffer.from([248, 198, 158, 145, 225, 117, 135, 200]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      amount: args.amount,
      otherAmountThreshold: args.otherAmountThreshold,
      sqrtPriceLimitX64: args.sqrtPriceLimitX64,
      isBaseInput: args.isBaseInput,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data });
  return ix;
}
