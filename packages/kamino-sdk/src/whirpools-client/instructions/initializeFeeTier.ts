import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeFeeTierArgs {
  tickSpacing: number
  defaultFeeRate: number
}

export interface InitializeFeeTierAccounts {
  config: PublicKey
  feeTier: PublicKey
  funder: PublicKey
  feeAuthority: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u16("tickSpacing"),
  borsh.u16("defaultFeeRate"),
])

export function initializeFeeTier(
  args: InitializeFeeTierArgs,
  accounts: InitializeFeeTierAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.config, isSigner: false, isWritable: false },
    { pubkey: accounts.feeTier, isSigner: false, isWritable: true },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.feeAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([183, 74, 156, 160, 112, 2, 42, 30])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      tickSpacing: args.tickSpacing,
      defaultFeeRate: args.defaultFeeRate,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
