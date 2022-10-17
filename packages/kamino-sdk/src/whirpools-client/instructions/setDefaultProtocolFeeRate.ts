import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from '../programId';

export interface SetDefaultProtocolFeeRateArgs {
  defaultProtocolFeeRate: number;
}

export interface SetDefaultProtocolFeeRateAccounts {
  whirlpoolsConfig: PublicKey;
  feeAuthority: PublicKey;
}

export const layout = borsh.struct([borsh.u16('defaultProtocolFeeRate')]);

export function setDefaultProtocolFeeRate(
  args: SetDefaultProtocolFeeRateArgs,
  accounts: SetDefaultProtocolFeeRateAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpoolsConfig, isSigner: false, isWritable: true },
    { pubkey: accounts.feeAuthority, isSigner: true, isWritable: false },
  ];
  const identifier = Buffer.from([107, 205, 249, 226, 151, 35, 86, 0]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      defaultProtocolFeeRate: args.defaultProtocolFeeRate,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId: WHIRLPOOL_PROGRAM_ID, data });
  return ix;
}
