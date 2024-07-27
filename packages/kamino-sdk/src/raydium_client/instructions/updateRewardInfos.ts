import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface UpdateRewardInfosAccounts {
  poolState: PublicKey;
}

export function updateRewardInfos(accounts: UpdateRewardInfosAccounts, programId: PublicKey = PROGRAM_ID) {
  const keys: Array<AccountMeta> = [{ pubkey: accounts.poolState, isSigner: false, isWritable: true }];
  const identifier = Buffer.from([163, 172, 224, 52, 11, 154, 106, 223]);
  const data = identifier;
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
