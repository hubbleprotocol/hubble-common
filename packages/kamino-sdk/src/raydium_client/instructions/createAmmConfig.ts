import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface CreateAmmConfigArgs {
  index: number;
  tickSpacing: number;
  tradeFeeRate: number;
  protocolFeeRate: number;
  fundFeeRate: number;
}

export interface CreateAmmConfigAccounts {
  owner: PublicKey;
  ammConfig: PublicKey;
  systemProgram: PublicKey;
}

export const layout = borsh.struct([
  borsh.u16('index'),
  borsh.u16('tickSpacing'),
  borsh.u32('tradeFeeRate'),
  borsh.u32('protocolFeeRate'),
  borsh.u32('fundFeeRate'),
]);

export function createAmmConfig(
  args: CreateAmmConfigArgs,
  accounts: CreateAmmConfigAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.ammConfig, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([137, 52, 237, 212, 215, 117, 108, 104]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      index: args.index,
      tickSpacing: args.tickSpacing,
      tradeFeeRate: args.tradeFeeRate,
      protocolFeeRate: args.protocolFeeRate,
      fundFeeRate: args.fundFeeRate,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
