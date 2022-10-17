import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from '../programId';

export interface CollectRewardArgs {
  rewardIndex: number;
}

export interface CollectRewardAccounts {
  whirlpool: PublicKey;
  positionAuthority: PublicKey;
  position: PublicKey;
  positionTokenAccount: PublicKey;
  rewardOwnerAccount: PublicKey;
  rewardVault: PublicKey;
  tokenProgram: PublicKey;
}

export const layout = borsh.struct([borsh.u8('rewardIndex')]);

export function collectReward(args: CollectRewardArgs, accounts: CollectRewardAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: false },
    { pubkey: accounts.positionAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    {
      pubkey: accounts.positionTokenAccount,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.rewardOwnerAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardVault, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([70, 5, 132, 87, 86, 235, 177, 34]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      rewardIndex: args.rewardIndex,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId: WHIRLPOOL_PROGRAM_ID, data });
  return ix;
}
