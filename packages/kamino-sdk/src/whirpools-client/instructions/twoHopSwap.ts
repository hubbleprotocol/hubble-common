import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface TwoHopSwapArgs {
  amount: BN
  otherAmountThreshold: BN
  amountSpecifiedIsInput: boolean
  aToBOne: boolean
  aToBTwo: boolean
  sqrtPriceLimitOne: BN
  sqrtPriceLimitTwo: BN
}

export interface TwoHopSwapAccounts {
  tokenProgram: PublicKey
  tokenAuthority: PublicKey
  whirlpoolOne: PublicKey
  whirlpoolTwo: PublicKey
  tokenOwnerAccountOneA: PublicKey
  tokenVaultOneA: PublicKey
  tokenOwnerAccountOneB: PublicKey
  tokenVaultOneB: PublicKey
  tokenOwnerAccountTwoA: PublicKey
  tokenVaultTwoA: PublicKey
  tokenOwnerAccountTwoB: PublicKey
  tokenVaultTwoB: PublicKey
  tickArrayOne0: PublicKey
  tickArrayOne1: PublicKey
  tickArrayOne2: PublicKey
  tickArrayTwo0: PublicKey
  tickArrayTwo1: PublicKey
  tickArrayTwo2: PublicKey
  oracleOne: PublicKey
  oracleTwo: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("amount"),
  borsh.u64("otherAmountThreshold"),
  borsh.bool("amountSpecifiedIsInput"),
  borsh.bool("aToBOne"),
  borsh.bool("aToBTwo"),
  borsh.u128("sqrtPriceLimitOne"),
  borsh.u128("sqrtPriceLimitTwo"),
])

export function twoHopSwap(
  args: TwoHopSwapArgs,
  accounts: TwoHopSwapAccounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.whirlpoolOne, isSigner: false, isWritable: true },
    { pubkey: accounts.whirlpoolTwo, isSigner: false, isWritable: true },
    {
      pubkey: accounts.tokenOwnerAccountOneA,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenVaultOneA, isSigner: false, isWritable: true },
    {
      pubkey: accounts.tokenOwnerAccountOneB,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenVaultOneB, isSigner: false, isWritable: true },
    {
      pubkey: accounts.tokenOwnerAccountTwoA,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenVaultTwoA, isSigner: false, isWritable: true },
    {
      pubkey: accounts.tokenOwnerAccountTwoB,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenVaultTwoB, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayOne0, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayOne1, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayOne2, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayTwo0, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayTwo1, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayTwo2, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleOne, isSigner: false, isWritable: false },
    { pubkey: accounts.oracleTwo, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([195, 96, 237, 108, 68, 162, 219, 230])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      amount: args.amount,
      otherAmountThreshold: args.otherAmountThreshold,
      amountSpecifiedIsInput: args.amountSpecifiedIsInput,
      aToBOne: args.aToBOne,
      aToBTwo: args.aToBTwo,
      sqrtPriceLimitOne: args.sqrtPriceLimitOne,
      sqrtPriceLimitTwo: args.sqrtPriceLimitTwo,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
