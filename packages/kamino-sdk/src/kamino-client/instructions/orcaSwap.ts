import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface OrcaSwapArgs {
  amount: BN
  otherAmountThreshold: BN
  sqrtPriceLimit: BN
  amountSpecifiedIsInput: boolean
  aToB: boolean
}

export interface OrcaSwapAccounts {
  funder: PublicKey
  tokenATokenProgram: PublicKey
  tokenBTokenProgram: PublicKey
  memoProgram: PublicKey
  tokenAuthority: PublicKey
  whirlpool: PublicKey
  tokenOwnerAccountA: PublicKey
  tokenVaultA: PublicKey
  tokenOwnerAccountB: PublicKey
  tokenVaultB: PublicKey
  tickArray0: PublicKey
  tickArray1: PublicKey
  tickArray2: PublicKey
  oracle: PublicKey
  whirlpoolProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("amount"),
  borsh.u64("otherAmountThreshold"),
  borsh.u128("sqrtPriceLimit"),
  borsh.bool("amountSpecifiedIsInput"),
  borsh.bool("aToB"),
])

export function orcaSwap(
  args: OrcaSwapArgs,
  accounts: OrcaSwapAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenATokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBTokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenOwnerAccountA, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenVaultA, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenOwnerAccountB, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenVaultB, isSigner: false, isWritable: false },
    { pubkey: accounts.tickArray0, isSigner: false, isWritable: false },
    { pubkey: accounts.tickArray1, isSigner: false, isWritable: false },
    { pubkey: accounts.tickArray2, isSigner: false, isWritable: false },
    { pubkey: accounts.oracle, isSigner: false, isWritable: false },
    { pubkey: accounts.whirlpoolProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([33, 94, 249, 97, 250, 254, 198, 93])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      amount: args.amount,
      otherAmountThreshold: args.otherAmountThreshold,
      sqrtPriceLimit: args.sqrtPriceLimit,
      amountSpecifiedIsInput: args.amountSpecifiedIsInput,
      aToB: args.aToB,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
