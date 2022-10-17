import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from '../programId';

export interface SetFeeRateArgs {
  feeRate: number;
}

export interface SetFeeRateAccounts {
  whirlpoolsConfig: PublicKey;
  whirlpool: PublicKey;
  feeAuthority: PublicKey;
}

export const layout = borsh.struct([borsh.u16('feeRate')]);

export function setFeeRate(args: SetFeeRateArgs, accounts: SetFeeRateAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpoolsConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.feeAuthority, isSigner: true, isWritable: false },
  ];
  const identifier = Buffer.from([53, 243, 137, 65, 8, 140, 158, 6]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      feeRate: args.feeRate,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId: WHIRLPOOL_PROGRAM_ID, data });
  return ix;
}
