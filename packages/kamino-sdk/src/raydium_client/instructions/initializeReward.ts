import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface InitializeRewardArgs {
  param: types.InitializeRewardParamFields;
}

export interface InitializeRewardAccounts {
  rewardFunder: PublicKey;
  funderTokenAccount: PublicKey;
  ammConfig: PublicKey;
  poolState: PublicKey;
  operationState: PublicKey;
  rewardTokenMint: PublicKey;
  rewardTokenVault: PublicKey;
  rewardTokenProgram: PublicKey;
  systemProgram: PublicKey;
  rent: PublicKey;
}

export const layout = borsh.struct([types.InitializeRewardParam.layout('param')]);

export function initializeReward(
  args: InitializeRewardArgs,
  accounts: InitializeRewardAccounts,
  programId: PublicKey = PROGRAM_ID
) {
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
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
