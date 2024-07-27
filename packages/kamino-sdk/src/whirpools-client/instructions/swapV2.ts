import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface SwapV2Args {
  amount: BN
  otherAmountThreshold: BN
  sqrtPriceLimit: BN
  amountSpecifiedIsInput: boolean
  aToB: boolean
  remainingAccountsInfo: types.RemainingAccountsInfoFields | null
}

export interface SwapV2Accounts {
  tokenProgramA: PublicKey
  tokenProgramB: PublicKey
  memoProgram: PublicKey
  tokenAuthority: PublicKey
  whirlpool: PublicKey
  tokenMintA: PublicKey
  tokenMintB: PublicKey
  tokenOwnerAccountA: PublicKey
  tokenVaultA: PublicKey
  tokenOwnerAccountB: PublicKey
  tokenVaultB: PublicKey
  tickArray0: PublicKey
  tickArray1: PublicKey
  tickArray2: PublicKey
  oracle: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("amount"),
  borsh.u64("otherAmountThreshold"),
  borsh.u128("sqrtPriceLimit"),
  borsh.bool("amountSpecifiedIsInput"),
  borsh.bool("aToB"),
  borsh.option(types.RemainingAccountsInfo.layout(), "remainingAccountsInfo"),
])

export function swapV2(
  args: SwapV2Args,
  accounts: SwapV2Accounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.tokenProgramA, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgramB, isSigner: false, isWritable: false },
    { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenMintA, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenMintB, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenOwnerAccountA, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVaultA, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenOwnerAccountB, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVaultB, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArray0, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArray1, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArray2, isSigner: false, isWritable: true },
    { pubkey: accounts.oracle, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([43, 4, 237, 11, 26, 201, 30, 98])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      amount: args.amount,
      otherAmountThreshold: args.otherAmountThreshold,
      sqrtPriceLimit: args.sqrtPriceLimit,
      amountSpecifiedIsInput: args.amountSpecifiedIsInput,
      aToB: args.aToB,
      remainingAccountsInfo:
        (args.remainingAccountsInfo &&
          types.RemainingAccountsInfo.toEncodable(
            args.remainingAccountsInfo
          )) ||
        null,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
