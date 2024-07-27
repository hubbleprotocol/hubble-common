import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface UpdateOperationAccountArgs {
  param: number;
  keys: Array<PublicKey>;
}

export interface UpdateOperationAccountAccounts {
  owner: PublicKey;
  operationState: PublicKey;
  systemProgram: PublicKey;
}

export const layout = borsh.struct([borsh.u8('param'), borsh.vec(borsh.publicKey(), 'keys')]);

export function updateOperationAccount(
  args: UpdateOperationAccountArgs,
  accounts: UpdateOperationAccountAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.owner, isSigner: true, isWritable: false },
    { pubkey: accounts.operationState, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([127, 70, 119, 40, 188, 227, 61, 7]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      param: args.param,
      keys: args.keys,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
