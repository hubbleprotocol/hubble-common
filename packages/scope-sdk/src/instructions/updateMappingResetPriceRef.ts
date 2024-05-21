import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateMappingResetPriceRefArgs {
  token: number
  priceType: number
  twapEnabled: boolean
  twapSource: number
  refPriceIndex: number
  feedName: string
}

export interface UpdateMappingResetPriceRefAccounts {
  admin: PublicKey
  configuration: PublicKey
  oracleMappings: PublicKey
  priceInfo: PublicKey
}

export const layout = borsh.struct([
  borsh.u16("token"),
  borsh.u8("priceType"),
  borsh.bool("twapEnabled"),
  borsh.u16("twapSource"),
  borsh.u16("refPriceIndex"),
  borsh.str("feedName"),
])

export function updateMappingResetPriceRef(
  args: UpdateMappingResetPriceRefArgs,
  accounts: UpdateMappingResetPriceRefAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.admin, isSigner: true, isWritable: false },
    { pubkey: accounts.configuration, isSigner: false, isWritable: false },
    { pubkey: accounts.oracleMappings, isSigner: false, isWritable: true },
    { pubkey: accounts.priceInfo, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([161, 158, 88, 148, 227, 18, 163, 74])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      token: args.token,
      priceType: args.priceType,
      twapEnabled: args.twapEnabled,
      twapSource: args.twapSource,
      refPriceIndex: args.refPriceIndex,
      feedName: args.feedName,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
