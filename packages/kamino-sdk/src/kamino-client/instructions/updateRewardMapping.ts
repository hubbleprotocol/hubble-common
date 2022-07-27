import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateRewardMappingArgs {
  rewardId: number
  collateralToken: number
}

export interface UpdateRewardMappingAccounts {
  adminAuthority: PublicKey
  strategy: PublicKey
  whirlpool: PublicKey
  rewardMint: PublicKey
  rewardVault: PublicKey
  baseVaultAuthority: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
  tokenProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u8("rewardId"),
  borsh.u8("collateralToken"),
])

export function updateRewardMapping(
  args: UpdateRewardMappingArgs,
  accounts: UpdateRewardMappingAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: false },
    { pubkey: accounts.rewardMint, isSigner: false, isWritable: false },
    { pubkey: accounts.rewardVault, isSigner: true, isWritable: true },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([203, 37, 37, 96, 23, 85, 233, 42])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      rewardId: args.rewardId,
      collateralToken: args.collateralToken,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
