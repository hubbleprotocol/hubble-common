import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface SetRewardEmissionsV2Args {
  rewardIndex: number
  emissionsPerSecondX64: BN
}

export interface SetRewardEmissionsV2Accounts {
  whirlpool: PublicKey
  rewardAuthority: PublicKey
  rewardVault: PublicKey
}

export const layout = borsh.struct([
  borsh.u8("rewardIndex"),
  borsh.u128("emissionsPerSecondX64"),
])

export function setRewardEmissionsV2(
  args: SetRewardEmissionsV2Args,
  accounts: SetRewardEmissionsV2Accounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.rewardVault, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([114, 228, 72, 32, 193, 48, 160, 102])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      rewardIndex: args.rewardIndex,
      emissionsPerSecondX64: args.emissionsPerSecondX64,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
