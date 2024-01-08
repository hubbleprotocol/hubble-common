import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface RemoveAllLiquidityAccounts {
  position: PublicKey
  lbPair: PublicKey
  binArrayBitmapExtension: PublicKey
  userTokenX: PublicKey
  userTokenY: PublicKey
  reserveX: PublicKey
  reserveY: PublicKey
  tokenXMint: PublicKey
  tokenYMint: PublicKey
  binArrayLower: PublicKey
  binArrayUpper: PublicKey
  owner: PublicKey
  tokenXProgram: PublicKey
  tokenYProgram: PublicKey
  eventAuthority: PublicKey
  program: PublicKey
}

export function removeAllLiquidity(accounts: RemoveAllLiquidityAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    {
      pubkey: accounts.binArrayBitmapExtension,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.userTokenX, isSigner: false, isWritable: true },
    { pubkey: accounts.userTokenY, isSigner: false, isWritable: true },
    { pubkey: accounts.reserveX, isSigner: false, isWritable: true },
    { pubkey: accounts.reserveY, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenXMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenYMint, isSigner: false, isWritable: false },
    { pubkey: accounts.binArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.binArrayUpper, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: false },
    { pubkey: accounts.tokenXProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenYProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([10, 51, 61, 35, 112, 105, 24, 85])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
