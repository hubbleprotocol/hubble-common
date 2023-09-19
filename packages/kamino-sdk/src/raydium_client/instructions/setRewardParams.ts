import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface SetRewardParamsArgs {
  rewardIndex: number;
  emissionsPerSecondX64: BN;
  openTime: BN;
  endTime: BN;
}

export interface SetRewardParamsAccounts {
  /** Address to be set as protocol owner. It pays to create factory state account. */
  authority: PublicKey;
  ammConfig: PublicKey;
  poolState: PublicKey;
  /** load info from the account to judge reward permission */
  operationState: PublicKey;
  /** Token program */
  tokenProgram: PublicKey;
  /** Token program 2022 */
  tokenProgram2022: PublicKey;
}

export const layout = borsh.struct([
  borsh.u8('rewardIndex'),
  borsh.u128('emissionsPerSecondX64'),
  borsh.u64('openTime'),
  borsh.u64('endTime'),
]);

/**
 * Restset reward param, start a new reward cycle or extend the current cycle.
 *
 * # Arguments
 *
 * * `ctx` - The context of accounts
 * * `reward_index` - The index of reward token in the pool.
 * * `emissions_per_second_x64` - The per second emission reward, when extend the current cycle,
 * new value can't be less than old value
 * * `open_time` - reward open timestamp, must be set when state a new cycle
 * * `end_time` - reward end timestamp
 *
 */
export function setRewardParams(args: SetRewardParamsArgs, accounts: SetRewardParamsAccounts) {
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
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data });
  return ix;
}
