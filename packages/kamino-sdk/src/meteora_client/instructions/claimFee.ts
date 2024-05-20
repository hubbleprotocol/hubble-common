import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ClaimFeeArgs {
  minBinId: number
  maxBinId: number
}

export interface ClaimFeeAccounts {
  lbPair: PublicKey
  position: PublicKey
  sender: PublicKey
  reserveX: PublicKey
  reserveY: PublicKey
  userTokenX: PublicKey
  userTokenY: PublicKey
  tokenXMint: PublicKey
  tokenYMint: PublicKey
  tokenProgram: PublicKey
  eventAuthority: PublicKey
  program: PublicKey
}

export const layout = borsh.struct([
  borsh.i32("minBinId"),
  borsh.i32("maxBinId"),
])

export function claimFee(args: ClaimFeeArgs, accounts: ClaimFeeAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.sender, isSigner: true, isWritable: false },
    { pubkey: accounts.reserveX, isSigner: false, isWritable: true },
    { pubkey: accounts.reserveY, isSigner: false, isWritable: true },
    { pubkey: accounts.userTokenX, isSigner: false, isWritable: true },
    { pubkey: accounts.userTokenY, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenXMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenYMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([169, 32, 79, 137, 136, 232, 70, 137])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      minBinId: args.minBinId,
      maxBinId: args.maxBinId,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
