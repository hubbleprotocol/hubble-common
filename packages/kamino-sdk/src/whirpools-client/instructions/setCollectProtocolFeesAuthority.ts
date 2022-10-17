import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from '../programId';

export interface SetCollectProtocolFeesAuthorityAccounts {
  whirlpoolsConfig: PublicKey;
  collectProtocolFeesAuthority: PublicKey;
  newCollectProtocolFeesAuthority: PublicKey;
}

export function setCollectProtocolFeesAuthority(accounts: SetCollectProtocolFeesAuthorityAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpoolsConfig, isSigner: false, isWritable: true },
    {
      pubkey: accounts.collectProtocolFeesAuthority,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: accounts.newCollectProtocolFeesAuthority,
      isSigner: false,
      isWritable: false,
    },
  ];
  const identifier = Buffer.from([34, 150, 93, 244, 139, 225, 233, 67]);
  const data = identifier;
  const ix = new TransactionInstruction({ keys, programId: WHIRLPOOL_PROGRAM_ID, data });
  return ix;
}
