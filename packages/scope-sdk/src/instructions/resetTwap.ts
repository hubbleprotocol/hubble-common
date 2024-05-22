import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ResetTwapArgs {
  token: BN
  feedName: string
}

export interface ResetTwapAccounts {
  admin: PublicKey
  oraclePrices: PublicKey
  configuration: PublicKey
  oracleTwaps: PublicKey
  instructionSysvarAccountInfo: PublicKey
}

export const layout = borsh.struct([borsh.u64("token"), borsh.str("feedName")])

export function resetTwap(
  args: ResetTwapArgs,
  accounts: ResetTwapAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.admin, isSigner: true, isWritable: false },
    { pubkey: accounts.oraclePrices, isSigner: false, isWritable: false },
    { pubkey: accounts.configuration, isSigner: false, isWritable: false },
    { pubkey: accounts.oracleTwaps, isSigner: false, isWritable: true },
    {
      pubkey: accounts.instructionSysvarAccountInfo,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([101, 216, 28, 92, 154, 79, 49, 187])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      token: args.token,
      feedName: args.feedName,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
