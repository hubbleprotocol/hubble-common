import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from '../programId';

export interface InitializePoolArgs {
  bumps: types.WhirlpoolBumpsFields;
  tickSpacing: number;
  initialSqrtPrice: BN;
}

export interface InitializePoolAccounts {
  whirlpoolsConfig: PublicKey;
  tokenMintA: PublicKey;
  tokenMintB: PublicKey;
  funder: PublicKey;
  whirlpool: PublicKey;
  tokenVaultA: PublicKey;
  tokenVaultB: PublicKey;
  feeTier: PublicKey;
  tokenProgram: PublicKey;
  systemProgram: PublicKey;
  rent: PublicKey;
}

export const layout = borsh.struct([
  types.WhirlpoolBumps.layout('bumps'),
  borsh.u16('tickSpacing'),
  borsh.u128('initialSqrtPrice'),
]);

export function initializePool(args: InitializePoolArgs, accounts: InitializePoolAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpoolsConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenMintA, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenMintB, isSigner: false, isWritable: false },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVaultA, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenVaultB, isSigner: true, isWritable: true },
    { pubkey: accounts.feeTier, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([95, 180, 10, 172, 84, 174, 232, 40]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      bumps: types.WhirlpoolBumps.toEncodable(args.bumps),
      tickSpacing: args.tickSpacing,
      initialSqrtPrice: args.initialSqrtPrice,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId: WHIRLPOOL_PROGRAM_ID, data });
  return ix;
}
