import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
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
  /** Address to be set as protocol owner. */
  owner: PublicKey;
  /** Initialize config state account to store protocol owner address and fee rates. */
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

/**
 * # Arguments
 *
 * * `ctx`- The accounts needed by instruction.
 * * `index` - The index of amm config, there may be multiple config.
 * * `tick_spacing` - The tickspacing binding with config, cannot be changed.
 * * `trade_fee_rate` - Trade fee rate, can be changed.
 * * `protocol_fee_rate` - The rate of protocol fee within tarde fee.
 * * `fund_fee_rate` - The rate of fund fee within tarde fee.
 *
 */
export function createAmmConfig(args: CreateAmmConfigArgs, accounts: CreateAmmConfigAccounts) {
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
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data });
  return ix;
}
