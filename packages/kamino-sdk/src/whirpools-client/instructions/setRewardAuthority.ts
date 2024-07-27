import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface SetRewardAuthorityArgs {
  rewardIndex: number
}

export interface SetRewardAuthorityAccounts {
  whirlpool: PublicKey
  rewardAuthority: PublicKey
  newRewardAuthority: PublicKey
}

export const layout = borsh.struct([borsh.u8("rewardIndex")])

export function setRewardAuthority(
  args: SetRewardAuthorityArgs,
  accounts: SetRewardAuthorityAccounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.newRewardAuthority, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([34, 39, 183, 252, 83, 28, 85, 127])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      rewardIndex: args.rewardIndex,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
