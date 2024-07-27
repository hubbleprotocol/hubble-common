import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface OpenPositionArgs {
  tickLowerIndex: number;
  tickUpperIndex: number;
  tickArrayLowerStartIndex: number;
  tickArrayUpperStartIndex: number;
  liquidity: BN;
  amount0Max: BN;
  amount1Max: BN;
}

export interface OpenPositionAccounts {
  payer: PublicKey;
  positionNftOwner: PublicKey;
  positionNftMint: PublicKey;
  positionNftAccount: PublicKey;
  metadataAccount: PublicKey;
  poolState: PublicKey;
  protocolPosition: PublicKey;
  tickArrayLower: PublicKey;
  tickArrayUpper: PublicKey;
  personalPosition: PublicKey;
  tokenAccount0: PublicKey;
  tokenAccount1: PublicKey;
  tokenVault0: PublicKey;
  tokenVault1: PublicKey;
  rent: PublicKey;
  systemProgram: PublicKey;
  tokenProgram: PublicKey;
  associatedTokenProgram: PublicKey;
  metadataProgram: PublicKey;
}

export const layout = borsh.struct([
  borsh.i32('tickLowerIndex'),
  borsh.i32('tickUpperIndex'),
  borsh.i32('tickArrayLowerStartIndex'),
  borsh.i32('tickArrayUpperStartIndex'),
  borsh.u128('liquidity'),
  borsh.u64('amount0Max'),
  borsh.u64('amount1Max'),
]);

export function openPosition(
  args: OpenPositionArgs,
  accounts: OpenPositionAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.positionNftOwner, isSigner: false, isWritable: false },
    { pubkey: accounts.positionNftMint, isSigner: true, isWritable: true },
    { pubkey: accounts.positionNftAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.metadataAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
    { pubkey: accounts.protocolPosition, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: true },
    { pubkey: accounts.personalPosition, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenAccount0, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenAccount1, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVault0, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVault1, isSigner: false, isWritable: true },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.metadataProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([135, 128, 47, 77, 15, 152, 240, 49]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      tickLowerIndex: args.tickLowerIndex,
      tickUpperIndex: args.tickUpperIndex,
      tickArrayLowerStartIndex: args.tickArrayLowerStartIndex,
      tickArrayUpperStartIndex: args.tickArrayUpperStartIndex,
      liquidity: args.liquidity,
      amount0Max: args.amount0Max,
      amount1Max: args.amount1Max,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
