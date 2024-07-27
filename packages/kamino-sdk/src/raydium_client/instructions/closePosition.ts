import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface ClosePositionAccounts {
  nftOwner: PublicKey;
  positionNftMint: PublicKey;
  positionNftAccount: PublicKey;
  personalPosition: PublicKey;
  systemProgram: PublicKey;
  tokenProgram: PublicKey;
}

export function closePosition(accounts: ClosePositionAccounts, programId: PublicKey = PROGRAM_ID) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.nftOwner, isSigner: true, isWritable: true },
    { pubkey: accounts.positionNftMint, isSigner: false, isWritable: true },
    { pubkey: accounts.positionNftAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.personalPosition, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([123, 134, 81, 0, 49, 68, 98, 98]);
  const data = identifier;
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
