import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from '../programId';

export interface SwapArgs {
  amount: BN;
  otherAmountThreshold: BN;
  sqrtPriceLimit: BN;
  exactInput: boolean;
  aToB: boolean;
}

export interface SwapAccounts {
  tokenProgram: PublicKey;
  tokenAuthority: PublicKey;
  whirlpool: PublicKey;
  tokenOwnerAccountA: PublicKey;
  tokenVaultA: PublicKey;
  tokenOwnerAccountB: PublicKey;
  tokenVaultB: PublicKey;
  tickArray0: PublicKey;
  tickArray1: PublicKey;
  tickArray2: PublicKey;
  oracle: PublicKey;
}

export const layout = borsh.struct([
  borsh.u64('amount'),
  borsh.u64('otherAmountThreshold'),
  borsh.u128('sqrtPriceLimit'),
  borsh.bool('exactInput'),
  borsh.bool('aToB'),
]);

export function swap(args: SwapArgs, accounts: SwapAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenOwnerAccountA, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVaultA, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenOwnerAccountB, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVaultB, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArray0, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArray1, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArray2, isSigner: false, isWritable: true },
    { pubkey: accounts.oracle, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([248, 198, 158, 145, 225, 117, 135, 200]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      amount: args.amount,
      otherAmountThreshold: args.otherAmountThreshold,
      sqrtPriceLimit: args.sqrtPriceLimit,
      exactInput: args.exactInput,
      aToB: args.aToB,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId: WHIRLPOOL_PROGRAM_ID, data });
  return ix;
}
