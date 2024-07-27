import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface SwapV2Args {
  amount: BN;
  otherAmountThreshold: BN;
  sqrtPriceLimitX64: BN;
  isBaseInput: boolean;
}

export interface SwapV2Accounts {
  payer: PublicKey;
  ammConfig: PublicKey;
  poolState: PublicKey;
  inputTokenAccount: PublicKey;
  outputTokenAccount: PublicKey;
  inputVault: PublicKey;
  outputVault: PublicKey;
  observationState: PublicKey;
  tokenProgram: PublicKey;
  tokenProgram2022: PublicKey;
  memoProgram: PublicKey;
  inputVaultMint: PublicKey;
  outputVaultMint: PublicKey;
}

export const layout = borsh.struct([
  borsh.u64('amount'),
  borsh.u64('otherAmountThreshold'),
  borsh.u128('sqrtPriceLimitX64'),
  borsh.bool('isBaseInput'),
]);

export function swapV2(args: SwapV2Args, accounts: SwapV2Accounts, programId: PublicKey = PROGRAM_ID) {
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
    { pubkey: accounts.tokenProgram2022, isSigner: false, isWritable: false },
    { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.inputVaultMint, isSigner: false, isWritable: false },
    { pubkey: accounts.outputVaultMint, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([43, 4, 237, 11, 26, 201, 30, 98]);
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
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
