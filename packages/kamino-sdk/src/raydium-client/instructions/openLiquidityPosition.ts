import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface OpenLiquidityPositionArgs {
  tickLowerIndex: BN;
  tickUpperIndex: BN;
  bump: number;
}

export interface OpenLiquidityPositionAccounts {
  adminAuthority: PublicKey;
  strategy: PublicKey;
  pool: PublicKey;
  tickArrayLower: PublicKey;
  tickArrayUpper: PublicKey;
  baseVaultAuthority: PublicKey;
  /** Also whirlpools will fail if this is not set correctly */
  position: PublicKey;
  raydiumProtocolPositionOrBaseVaultAuthority: PublicKey;
  adminTokenAAtaOrBaseVaultAuthority: PublicKey;
  adminTokenBAtaOrBaseVaultAuthority: PublicKey;
  poolTokenVaultAOrBaseVaultAuthority: PublicKey;
  poolTokenVaultBOrBaseVaultAuthority: PublicKey;
  /** Also whirlpools will fail if this is not set correctly */
  positionMint: PublicKey;
  /** Also whirlpools will fail if this is not set correctly */
  positionMetadataAccount: PublicKey;
  /** Also whirlpools will fail if this is not set correctly */
  positionTokenAccount: PublicKey;
  rent: PublicKey;
  system: PublicKey;
  tokenProgram: PublicKey;
  associatedTokenProgram: PublicKey;
  metadataProgram: PublicKey;
  metadataUpdateAuth: PublicKey;
  poolProgram: PublicKey;
  /** If strategy is uninitialized then pass base_vault_authority */
  oldPositionOrBaseVaultAuthority: PublicKey;
  /** If strategy is uninitialized then pass base_vault_authority */
  oldPositionMintOrBaseVaultAuthority: PublicKey;
  /** If strategy is uninitialized then pass base_vault_authority */
  oldPositionTokenAccountOrBaseVaultAuthority: PublicKey;
}

export const layout = borsh.struct([borsh.i64('tickLowerIndex'), borsh.i64('tickUpperIndex'), borsh.u8('bump')]);

export function openLiquidityPosition(args: OpenLiquidityPositionArgs, accounts: OpenLiquidityPositionAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.pool, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: true },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    {
      pubkey: accounts.raydiumProtocolPositionOrBaseVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.adminTokenAAtaOrBaseVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.adminTokenBAtaOrBaseVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.poolTokenVaultAOrBaseVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.poolTokenVaultBOrBaseVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.positionMint, isSigner: true, isWritable: true },
    {
      pubkey: accounts.positionMetadataAccount,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.positionTokenAccount,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.system, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.metadataProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.metadataUpdateAuth, isSigner: false, isWritable: false },
    { pubkey: accounts.poolProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.oldPositionOrBaseVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.oldPositionMintOrBaseVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.oldPositionTokenAccountOrBaseVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
  ];
  const identifier = Buffer.from([204, 234, 204, 219, 6, 91, 96, 241]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      tickLowerIndex: args.tickLowerIndex,
      tickUpperIndex: args.tickUpperIndex,
      bump: args.bump,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data });
  return ix;
}
