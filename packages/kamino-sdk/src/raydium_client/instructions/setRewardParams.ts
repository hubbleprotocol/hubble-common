import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface SetRewardParamsArgs {
  rewardIndex: number;
  emissionsPerSecondX64: BN;
  openTime: BN;
  endTime: BN;
}

export interface SetRewardParamsAccounts {
  authority: PublicKey;
  ammConfig: PublicKey;
  poolState: PublicKey;
  operationState: PublicKey;
  tokenProgram: PublicKey;
  tokenProgram2022: PublicKey;
}

export const layout = borsh.struct([
  borsh.u8('rewardIndex'),
  borsh.u128('emissionsPerSecondX64'),
  borsh.u64('openTime'),
  borsh.u64('endTime'),
]);

export function setRewardParams(
  args: SetRewardParamsArgs,
  accounts: SetRewardParamsAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.authority, isSigner: true, isWritable: false },
    { pubkey: accounts.ammConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
    { pubkey: accounts.operationState, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram2022, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([112, 52, 167, 75, 32, 201, 211, 137]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      rewardIndex: args.rewardIndex,
      emissionsPerSecondX64: args.emissionsPerSecondX64,
      openTime: args.openTime,
      endTime: args.endTime,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
