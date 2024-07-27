import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface SwapRouterBaseInArgs {
  amountIn: BN;
  amountOutMinimum: BN;
}

export interface SwapRouterBaseInAccounts {
  payer: PublicKey;
  inputTokenAccount: PublicKey;
  inputTokenMint: PublicKey;
  tokenProgram: PublicKey;
  tokenProgram2022: PublicKey;
  memoProgram: PublicKey;
}

export const layout = borsh.struct([borsh.u64('amountIn'), borsh.u64('amountOutMinimum')]);

export function swapRouterBaseIn(
  args: SwapRouterBaseInArgs,
  accounts: SwapRouterBaseInAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: false },
    { pubkey: accounts.inputTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.inputTokenMint, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram2022, isSigner: false, isWritable: false },
    { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([69, 125, 115, 218, 245, 186, 242, 196]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      amountIn: args.amountIn,
      amountOutMinimum: args.amountOutMinimum,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
