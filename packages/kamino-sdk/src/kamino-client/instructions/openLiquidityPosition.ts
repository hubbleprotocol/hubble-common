import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface OpenLiquidityPositionArgs {
  tickLowerIndex: BN
  tickUpperIndex: BN
  bump: number
}

export interface OpenLiquidityPositionAccounts {
  adminAuthority: PublicKey
  strategy: PublicKey
  whirlpool: PublicKey
  tickerArrayLower: PublicKey
  tickerArrayUpper: PublicKey
  baseVaultAuthority: PublicKey
  /** Also whirlpools will fail if this is not set correctly */
  position: PublicKey
  /** Also whirlpools will fail if this is not set correctly */
  positionMint: PublicKey
  /** Also whirlpools will fail if this is not set correctly */
  positionMetadataAccount: PublicKey
  /** Also whirlpools will fail if this is not set correctly */
  positionTokenAccount: PublicKey
  rent: PublicKey
  system: PublicKey
  tokenProgram: PublicKey
  associatedTokenProgram: PublicKey
  metadataProgram: PublicKey
  metadataUpdateAuth: PublicKey
  whirlpoolProgram: PublicKey
  /** Readonly (can be rent as a safe `default`) */
  oldPositionOrRent: PublicKey
}

export const layout = borsh.struct([
  borsh.i64("tickLowerIndex"),
  borsh.i64("tickUpperIndex"),
  borsh.u8("bump"),
])

export function openLiquidityPosition(
  args: OpenLiquidityPositionArgs,
  accounts: OpenLiquidityPositionAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.tickerArrayLower, isSigner: false, isWritable: false },
    { pubkey: accounts.tickerArrayUpper, isSigner: false, isWritable: false },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
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
    { pubkey: accounts.whirlpoolProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.oldPositionOrRent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([204, 234, 204, 219, 6, 91, 96, 241])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      tickLowerIndex: args.tickLowerIndex,
      tickUpperIndex: args.tickUpperIndex,
      bump: args.bump,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
