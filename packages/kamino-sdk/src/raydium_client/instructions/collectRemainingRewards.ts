import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface CollectRemainingRewardsArgs {
  rewardIndex: number;
}

export interface CollectRemainingRewardsAccounts {
  rewardFunder: PublicKey;
  funderTokenAccount: PublicKey;
  poolState: PublicKey;
  rewardTokenVault: PublicKey;
  rewardVaultMint: PublicKey;
  tokenProgram: PublicKey;
  tokenProgram2022: PublicKey;
  memoProgram: PublicKey;
}

export const layout = borsh.struct([borsh.u8('rewardIndex')]);

export function collectRemainingRewards(
  args: CollectRemainingRewardsArgs,
  accounts: CollectRemainingRewardsAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.rewardFunder, isSigner: true, isWritable: false },
    { pubkey: accounts.funderTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardTokenVault, isSigner: false, isWritable: false },
    { pubkey: accounts.rewardVaultMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram2022, isSigner: false, isWritable: false },
    { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([18, 237, 166, 197, 34, 16, 213, 144]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      rewardIndex: args.rewardIndex,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
