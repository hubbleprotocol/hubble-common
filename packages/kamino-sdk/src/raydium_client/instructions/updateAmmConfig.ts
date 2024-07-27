import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface UpdateAmmConfigArgs {
  param: number;
  value: number;
}

export interface UpdateAmmConfigAccounts {
  owner: PublicKey;
  ammConfig: PublicKey;
}

export const layout = borsh.struct([borsh.u8('param'), borsh.u32('value')]);

export function updateAmmConfig(
  args: UpdateAmmConfigArgs,
  accounts: UpdateAmmConfigAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.owner, isSigner: true, isWritable: false },
    { pubkey: accounts.ammConfig, isSigner: false, isWritable: true },
  ];
  const identifier = Buffer.from([49, 60, 174, 136, 154, 28, 116, 200]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      param: args.param,
      value: args.value,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
