import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface CollectFundFeeArgs {
  amount0Requested: BN;
  amount1Requested: BN;
}

export interface CollectFundFeeAccounts {
  owner: PublicKey;
  poolState: PublicKey;
  ammConfig: PublicKey;
  tokenVault0: PublicKey;
  tokenVault1: PublicKey;
  vault0Mint: PublicKey;
  vault1Mint: PublicKey;
  recipientTokenAccount0: PublicKey;
  recipientTokenAccount1: PublicKey;
  tokenProgram: PublicKey;
  tokenProgram2022: PublicKey;
}

export const layout = borsh.struct([borsh.u64('amount0Requested'), borsh.u64('amount1Requested')]);

export function collectFundFee(
  args: CollectFundFeeArgs,
  accounts: CollectFundFeeAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.owner, isSigner: true, isWritable: false },
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
    { pubkey: accounts.ammConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenVault0, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVault1, isSigner: false, isWritable: true },
    { pubkey: accounts.vault0Mint, isSigner: false, isWritable: false },
    { pubkey: accounts.vault1Mint, isSigner: false, isWritable: false },
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
    { pubkey: accounts.tokenProgram2022, isSigner: false, isWritable: false },
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
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
