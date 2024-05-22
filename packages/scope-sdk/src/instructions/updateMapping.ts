import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateMappingArgs {
  token: number
  priceType: number
  twapEnabled: boolean
  twapSource: number
  refPriceIndex: number
  feedName: string
}

export interface UpdateMappingAccounts {
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

export function updateMapping(
  args: UpdateMappingArgs,
  accounts: UpdateMappingAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.admin, isSigner: true, isWritable: false },
    { pubkey: accounts.configuration, isSigner: false, isWritable: false },
    { pubkey: accounts.oracleMappings, isSigner: false, isWritable: true },
    { pubkey: accounts.priceInfo, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([56, 102, 90, 236, 243, 21, 185, 105])
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
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
