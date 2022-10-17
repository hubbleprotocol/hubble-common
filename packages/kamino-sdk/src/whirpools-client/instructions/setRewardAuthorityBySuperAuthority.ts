import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from '../programId';

export interface SetRewardAuthorityBySuperAuthorityArgs {
  rewardIndex: number;
}

export interface SetRewardAuthorityBySuperAuthorityAccounts {
  whirlpoolsConfig: PublicKey;
  whirlpool: PublicKey;
  rewardEmissionsSuperAuthority: PublicKey;
  newRewardAuthority: PublicKey;
}

export const layout = borsh.struct([borsh.u8('rewardIndex')]);

export function setRewardAuthorityBySuperAuthority(
  args: SetRewardAuthorityBySuperAuthorityArgs,
  accounts: SetRewardAuthorityBySuperAuthorityAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpoolsConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    {
      pubkey: accounts.rewardEmissionsSuperAuthority,
      isSigner: true,
      isWritable: false,
    },
    { pubkey: accounts.newRewardAuthority, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([240, 154, 201, 198, 148, 93, 56, 25]);
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
