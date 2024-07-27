import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface TwoHopSwapV2Args {
  amount: BN
  otherAmountThreshold: BN
  amountSpecifiedIsInput: boolean
  aToBOne: boolean
  aToBTwo: boolean
  sqrtPriceLimitOne: BN
  sqrtPriceLimitTwo: BN
  remainingAccountsInfo: types.RemainingAccountsInfoFields | null
}

export interface TwoHopSwapV2Accounts {
  whirlpoolOne: PublicKey
  whirlpoolTwo: PublicKey
  tokenMintInput: PublicKey
  tokenMintIntermediate: PublicKey
  tokenMintOutput: PublicKey
  tokenProgramInput: PublicKey
  tokenProgramIntermediate: PublicKey
  tokenProgramOutput: PublicKey
  tokenOwnerAccountInput: PublicKey
  tokenVaultOneInput: PublicKey
  tokenVaultOneIntermediate: PublicKey
  tokenVaultTwoIntermediate: PublicKey
  tokenVaultTwoOutput: PublicKey
  tokenOwnerAccountOutput: PublicKey
  tokenAuthority: PublicKey
  tickArrayOne0: PublicKey
  tickArrayOne1: PublicKey
  tickArrayOne2: PublicKey
  tickArrayTwo0: PublicKey
  tickArrayTwo1: PublicKey
  tickArrayTwo2: PublicKey
  oracleOne: PublicKey
  oracleTwo: PublicKey
  memoProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("amount"),
  borsh.u64("otherAmountThreshold"),
  borsh.bool("amountSpecifiedIsInput"),
  borsh.bool("aToBOne"),
  borsh.bool("aToBTwo"),
  borsh.u128("sqrtPriceLimitOne"),
  borsh.u128("sqrtPriceLimitTwo"),
  borsh.option(types.RemainingAccountsInfo.layout(), "remainingAccountsInfo"),
])

export function twoHopSwapV2(
  args: TwoHopSwapV2Args,
  accounts: TwoHopSwapV2Accounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpoolOne, isSigner: false, isWritable: true },
    { pubkey: accounts.whirlpoolTwo, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenMintInput, isSigner: false, isWritable: false },
    {
      pubkey: accounts.tokenMintIntermediate,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.tokenMintOutput, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgramInput, isSigner: false, isWritable: false },
    {
      pubkey: accounts.tokenProgramIntermediate,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.tokenProgramOutput, isSigner: false, isWritable: false },
    {
      pubkey: accounts.tokenOwnerAccountInput,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenVaultOneInput, isSigner: false, isWritable: true },
    {
      pubkey: accounts.tokenVaultOneIntermediate,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.tokenVaultTwoIntermediate,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenVaultTwoOutput, isSigner: false, isWritable: true },
    {
      pubkey: accounts.tokenOwnerAccountOutput,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.tickArrayOne0, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayOne1, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayOne2, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayTwo0, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayTwo1, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayTwo2, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleOne, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleTwo, isSigner: false, isWritable: true },
    { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([186, 143, 209, 29, 254, 2, 194, 117])
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
