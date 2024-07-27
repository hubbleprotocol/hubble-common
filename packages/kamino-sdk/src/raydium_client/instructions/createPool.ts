import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface CreatePoolArgs {
  sqrtPriceX64: BN;
  openTime: BN;
}

export interface CreatePoolAccounts {
  poolCreator: PublicKey;
  ammConfig: PublicKey;
  poolState: PublicKey;
  tokenMint0: PublicKey;
  tokenMint1: PublicKey;
  tokenVault0: PublicKey;
  tokenVault1: PublicKey;
  observationState: PublicKey;
  tickArrayBitmap: PublicKey;
  tokenProgram0: PublicKey;
  tokenProgram1: PublicKey;
  systemProgram: PublicKey;
  rent: PublicKey;
}

export const layout = borsh.struct([borsh.u128('sqrtPriceX64'), borsh.u64('openTime')]);

export function createPool(args: CreatePoolArgs, accounts: CreatePoolAccounts, programId: PublicKey = PROGRAM_ID) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.poolCreator, isSigner: true, isWritable: true },
    { pubkey: accounts.ammConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenMint0, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenMint1, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenVault0, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVault1, isSigner: false, isWritable: true },
    { pubkey: accounts.observationState, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayBitmap, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram0, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram1, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([233, 146, 209, 142, 207, 104, 64, 188]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      sqrtPriceX64: args.sqrtPriceX64,
      openTime: args.openTime,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
