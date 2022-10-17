import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from '../programId';

export interface SetRewardEmissionsSuperAuthorityAccounts {
  whirlpoolsConfig: PublicKey;
  rewardEmissionsSuperAuthority: PublicKey;
  newRewardEmissionsSuperAuthority: PublicKey;
}

export function setRewardEmissionsSuperAuthority(accounts: SetRewardEmissionsSuperAuthorityAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpoolsConfig, isSigner: false, isWritable: true },
    {
      pubkey: accounts.rewardEmissionsSuperAuthority,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: accounts.newRewardEmissionsSuperAuthority,
      isSigner: false,
      isWritable: false,
    },
  ];
  const identifier = Buffer.from([207, 5, 200, 209, 122, 56, 82, 183]);
  const data = identifier;
  const ix = new TransactionInstruction({ keys, programId: WHIRLPOOL_PROGRAM_ID, data });
  return ix;
}
