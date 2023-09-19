import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface CollectFundFeeArgs {
  amount0Requested: BN;
  amount1Requested: BN;
}

export interface CollectFundFeeAccounts {
  /** Only admin or fund_owner can collect fee now */
  owner: PublicKey;
  /** Pool state stores accumulated protocol fee amount */
  poolState: PublicKey;
  /** Amm config account stores fund_owner */
  ammConfig: PublicKey;
  /** The address that holds pool tokens for token_0 */
  tokenVault0: PublicKey;
  /** The address that holds pool tokens for token_1 */
  tokenVault1: PublicKey;
  /** The address that receives the collected token_0 protocol fees */
  recipientTokenAccount0: PublicKey;
  /** The address that receives the collected token_1 protocol fees */
  recipientTokenAccount1: PublicKey;
  /** The SPL program to perform token transfers */
  tokenProgram: PublicKey;
}

export const layout = borsh.struct([borsh.u64('amount0Requested'), borsh.u64('amount1Requested')]);

/**
 * Collect the fund fee accrued to the pool
 *
 * # Arguments
 *
 * * `ctx` - The context of accounts
 * * `amount_0_requested` - The maximum amount of token_0 to send, can be 0 to collect fees in only token_1
 * * `amount_1_requested` - The maximum amount of token_1 to send, can be 0 to collect fees in only token_0
 *
 */
export function collectFundFee(args: CollectFundFeeArgs, accounts: CollectFundFeeAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.owner, isSigner: true, isWritable: false },
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
    { pubkey: accounts.ammConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenVault0, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVault1, isSigner: false, isWritable: true },
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
  ];
  const identifier = Buffer.from([167, 138, 78, 149, 223, 194, 6, 126]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      amount0Requested: args.amount0Requested,
      amount1Requested: args.amount1Requested,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data });
  return ix;
}
