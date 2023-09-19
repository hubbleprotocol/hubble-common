import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface IncreaseLiquidityV2Args {
  liquidity: BN;
  amount0Max: BN;
  amount1Max: BN;
  baseFlag: boolean | null;
}

export interface IncreaseLiquidityV2Accounts {
  /** Pays to mint the position */
  nftOwner: PublicKey;
  /** The token account for nft */
  nftAccount: PublicKey;
  poolState: PublicKey;
  protocolPosition: PublicKey;
  /** Increase liquidity for this position */
  personalPosition: PublicKey;
  /** Stores init state for the lower tick */
  tickArrayLower: PublicKey;
  /** Stores init state for the upper tick */
  tickArrayUpper: PublicKey;
  /** The payer's token account for token_0 */
  tokenAccount0: PublicKey;
  /** The token account spending token_1 to mint the position */
  tokenAccount1: PublicKey;
  /** The address that holds pool tokens for token_0 */
  tokenVault0: PublicKey;
  /** The address that holds pool tokens for token_1 */
  tokenVault1: PublicKey;
  /** Program to create mint account and mint tokens */
  tokenProgram: PublicKey;
  /** Token program 2022 */
  tokenProgram2022: PublicKey;
  /** The mint of token vault 0 */
  vault0Mint: PublicKey;
  /** The mint of token vault 1 */
  vault1Mint: PublicKey;
}

export const layout = borsh.struct([
  borsh.u128('liquidity'),
  borsh.u64('amount0Max'),
  borsh.u64('amount1Max'),
  borsh.option(borsh.bool(), 'baseFlag'),
]);

/**
 * Increases liquidity with a exist position, with amount paid by `payer`, support Token2022
 *
 * # Arguments
 *
 * * `ctx` - The context of accounts
 * * `liquidity` - The desired liquidity to be added, if zero, calculate liquidity base amount_0 or amount_1 according base_flag
 * * `amount_0_max` - The max amount of token_0 to spend, which serves as a slippage check
 * * `amount_1_max` - The max amount of token_1 to spend, which serves as a slippage check
 * * `base_flag` - active if liquidity is zero, 0: calculate liquidity base amount_0_max otherwise base amount_1_max
 *
 */
export function increaseLiquidityV2(args: IncreaseLiquidityV2Args, accounts: IncreaseLiquidityV2Accounts) {
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
    { pubkey: accounts.tokenProgram2022, isSigner: false, isWritable: false },
    { pubkey: accounts.vault0Mint, isSigner: false, isWritable: false },
    { pubkey: accounts.vault1Mint, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([133, 29, 89, 223, 69, 238, 176, 10]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      liquidity: args.liquidity,
      amount0Max: args.amount0Max,
      amount1Max: args.amount1Max,
      baseFlag: args.baseFlag,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data });
  return ix;
}
