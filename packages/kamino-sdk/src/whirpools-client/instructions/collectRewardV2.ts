import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface CollectRewardV2Args {
  rewardIndex: number
  remainingAccountsInfo: types.RemainingAccountsInfoFields | null
}

export interface CollectRewardV2Accounts {
  whirlpool: PublicKey
  positionAuthority: PublicKey
  position: PublicKey
  positionTokenAccount: PublicKey
  rewardOwnerAccount: PublicKey
  rewardMint: PublicKey
  rewardVault: PublicKey
  rewardTokenProgram: PublicKey
  memoProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u8("rewardIndex"),
  borsh.option(types.RemainingAccountsInfo.layout(), "remainingAccountsInfo"),
])

export function collectRewardV2(
  args: CollectRewardV2Args,
  accounts: CollectRewardV2Accounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: false },
    { pubkey: accounts.positionAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    {
      pubkey: accounts.positionTokenAccount,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.rewardOwnerAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardMint, isSigner: false, isWritable: false },
    { pubkey: accounts.rewardVault, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardTokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([177, 107, 37, 180, 160, 19, 49, 209])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      rewardIndex: args.rewardIndex,
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
