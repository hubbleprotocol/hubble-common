import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface TransferRewardOwnerArgs {
  newOwner: PublicKey;
}

export interface TransferRewardOwnerAccounts {
  authority: PublicKey;
  poolState: PublicKey;
}

export const layout = borsh.struct([borsh.publicKey('newOwner')]);

export function transferRewardOwner(
  args: TransferRewardOwnerArgs,
  accounts: TransferRewardOwnerAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
  ];
  const identifier = Buffer.from([7, 22, 12, 83, 242, 43, 48, 121]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      newOwner: args.newOwner,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
