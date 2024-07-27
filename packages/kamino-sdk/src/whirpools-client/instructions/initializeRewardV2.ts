import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface InitializeRewardV2Args {
  rewardIndex: number
}

export interface InitializeRewardV2Accounts {
  rewardAuthority: PublicKey
  funder: PublicKey
  whirlpool: PublicKey
  rewardMint: PublicKey
  rewardTokenBadge: PublicKey
  rewardVault: PublicKey
  rewardTokenProgram: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([borsh.u8("rewardIndex")])

export function initializeRewardV2(
  args: InitializeRewardV2Args,
  accounts: InitializeRewardV2Accounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.rewardAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardMint, isSigner: false, isWritable: false },
    { pubkey: accounts.rewardTokenBadge, isSigner: false, isWritable: false },
    { pubkey: accounts.rewardVault, isSigner: true, isWritable: true },
    { pubkey: accounts.rewardTokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([91, 1, 77, 50, 235, 229, 133, 49])
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
