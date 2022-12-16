import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CollectRemainingRewardsArgs {
  rewardIndex: number
}

export interface CollectRemainingRewardsAccounts {
  /** The founder who init reward info in berfore */
  rewardFunder: PublicKey
  /** The funder's reward token account */
  funderTokenAccount: PublicKey
  /** Set reward for this pool */
  poolState: PublicKey
  /** Reward vault transfer remaining token to founder token account */
  rewardTokenVault: PublicKey
  tokenProgram: PublicKey
}

export const layout = borsh.struct([borsh.u8("rewardIndex")])

/**
 * Collect remaining reward token for reward founder
 *
 * # Arguments
 *
 * * `ctx`- The context of accounts
 * * `reward_index` - the index to reward info
 *
 */
export function collectRemainingRewards(
  args: CollectRemainingRewardsArgs,
  accounts: CollectRemainingRewardsAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.rewardFunder, isSigner: true, isWritable: true },
    { pubkey: accounts.funderTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardTokenVault, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([18, 237, 166, 197, 34, 16, 213, 144])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      rewardIndex: args.rewardIndex,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
