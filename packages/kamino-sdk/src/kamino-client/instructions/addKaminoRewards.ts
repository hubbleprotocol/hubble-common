import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface AddKaminoRewardsArgs {
  kaminoRewardIndex: BN
  amount: BN
}

export interface AddKaminoRewardsAccounts {
  adminAuthority: PublicKey
  strategy: PublicKey
  rewardMint: PublicKey
  rewardVault: PublicKey
  baseVaultAuthority: PublicKey
  rewardAta: PublicKey
  tokenProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("kaminoRewardIndex"),
  borsh.u64("amount"),
])

export function addKaminoRewards(
  args: AddKaminoRewardsArgs,
  accounts: AddKaminoRewardsAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardMint, isSigner: false, isWritable: false },
    { pubkey: accounts.rewardVault, isSigner: false, isWritable: true },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardAta, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([174, 174, 142, 193, 47, 77, 235, 65])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      kaminoRewardIndex: args.kaminoRewardIndex,
      amount: args.amount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
