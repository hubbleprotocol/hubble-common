import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SetRewardEmissionsArgs {
  rewardIndex: number
  emissionsPerSecondX64: BN
}

export interface SetRewardEmissionsAccounts {
  whirlpool: PublicKey
  rewardAuthority: PublicKey
  rewardVault: PublicKey
}

export const layout = borsh.struct([
  borsh.u8("rewardIndex"),
  borsh.u128("emissionsPerSecondX64"),
])

export function setRewardEmissions(
  args: SetRewardEmissionsArgs,
  accounts: SetRewardEmissionsAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.rewardVault, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([13, 197, 86, 168, 109, 176, 27, 244])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      rewardIndex: args.rewardIndex,
      emissionsPerSecondX64: args.emissionsPerSecondX64,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
