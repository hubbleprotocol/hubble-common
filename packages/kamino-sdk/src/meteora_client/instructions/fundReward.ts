import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface FundRewardArgs {
  rewardIndex: BN
  amount: BN
  carryForward: boolean
}

export interface FundRewardAccounts {
  lbPair: PublicKey
  rewardVault: PublicKey
  rewardMint: PublicKey
  funderTokenAccount: PublicKey
  funder: PublicKey
  binArray: PublicKey
  tokenProgram: PublicKey
  eventAuthority: PublicKey
  program: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("rewardIndex"),
  borsh.u64("amount"),
  borsh.bool("carryForward"),
])

export function fundReward(
  args: FundRewardArgs,
  accounts: FundRewardAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardVault, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardMint, isSigner: false, isWritable: false },
    { pubkey: accounts.funderTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.funder, isSigner: true, isWritable: false },
    { pubkey: accounts.binArray, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([188, 50, 249, 165, 93, 151, 38, 63])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      rewardIndex: args.rewardIndex,
      amount: args.amount,
      carryForward: args.carryForward,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
