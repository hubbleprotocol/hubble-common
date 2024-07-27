import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface SetDefaultFeeRateArgs {
  defaultFeeRate: number
}

export interface SetDefaultFeeRateAccounts {
  whirlpoolsConfig: PublicKey
  feeTier: PublicKey
  feeAuthority: PublicKey
}

export const layout = borsh.struct([borsh.u16("defaultFeeRate")])

export function setDefaultFeeRate(
  args: SetDefaultFeeRateArgs,
  accounts: SetDefaultFeeRateAccounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpoolsConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.feeTier, isSigner: false, isWritable: true },
    { pubkey: accounts.feeAuthority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([118, 215, 214, 157, 182, 229, 208, 228])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      defaultFeeRate: args.defaultFeeRate,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
