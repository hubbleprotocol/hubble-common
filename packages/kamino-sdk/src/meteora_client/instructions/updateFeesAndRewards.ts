import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateFeesAndRewardsArgs {
  minBinId: number
  maxBinId: number
}

export interface UpdateFeesAndRewardsAccounts {
  position: PublicKey
  lbPair: PublicKey
  owner: PublicKey
}

export const layout = borsh.struct([
  borsh.i32("minBinId"),
  borsh.i32("maxBinId"),
])

export function updateFeesAndRewards(
  args: UpdateFeesAndRewardsArgs,
  accounts: UpdateFeesAndRewardsAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([154, 230, 250, 13, 236, 209, 75, 223])
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
