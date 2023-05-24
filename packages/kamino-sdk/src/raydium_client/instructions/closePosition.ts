import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface ClosePositionAccounts {
  /** The position nft owner */
  nftOwner: PublicKey;
  /** Unique token mint address */
  positionNftMint: PublicKey;
  /** Token account where position NFT will be minted */
  positionNftAccount: PublicKey;
  /**
   * To store metaplex metadata
   * Metadata for the tokenized position
   */
  personalPosition: PublicKey;
  /** Program to create the position manager state account */
  systemProgram: PublicKey;
  /** Program to create mint account and mint tokens */
  tokenProgram: PublicKey;
}

/**
 * Close a position, the nft mint and nft account
 *
 * # Arguments
 *
 * * `ctx` - The context of accounts
 *
 */
export function closePosition(accounts: ClosePositionAccounts) {
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
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data });
  return ix;
}
