import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface InitializeRewardArgs {
  param: types.InitializeRewardParamFields;
}

export interface InitializeRewardAccounts {
  /** The founder deposit reward token to vault */
  rewardFunder: PublicKey;
  funderTokenAccount: PublicKey;
  /** For check the reward_funder authority */
  ammConfig: PublicKey;
  /** Set reward for this pool */
  poolState: PublicKey;
  /** load info from the account to judge reward permission */
  operationState: PublicKey;
  /** Reward mint */
  rewardTokenMint: PublicKey;
  /** A pda, reward vault */
  rewardTokenVault: PublicKey;
  rewardTokenProgram: PublicKey;
  systemProgram: PublicKey;
  rent: PublicKey;
}

export const layout = borsh.struct([types.InitializeRewardParam.layout('param')]);

/**
 * Initialize a reward info for a given pool and reward index
 *
 * # Arguments
 *
 * * `ctx`- The context of accounts
 * * `reward_index` - the index to reward info
 * * `open_time` - reward open timestamp
 * * `end_time` - reward end timestamp
 * * `emissions_per_second_x64` - Token reward per second are earned per unit of liquidity.
 *
 */
export function initializeReward(args: InitializeRewardArgs, accounts: InitializeRewardAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.rewardFunder, isSigner: true, isWritable: true },
    { pubkey: accounts.funderTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.ammConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
    { pubkey: accounts.operationState, isSigner: false, isWritable: false },
    { pubkey: accounts.rewardTokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.rewardTokenVault, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardTokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([95, 135, 192, 196, 242, 129, 230, 68]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      param: types.InitializeRewardParam.toEncodable(args.param),
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data });
  return ix;
}
