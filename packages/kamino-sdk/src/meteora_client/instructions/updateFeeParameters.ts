import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateFeeParametersArgs {
  feeParameter: types.FeeParameterFields
}

export interface UpdateFeeParametersAccounts {
  lbPair: PublicKey
  admin: PublicKey
  eventAuthority: PublicKey
  program: PublicKey
}

export const layout = borsh.struct([types.FeeParameter.layout("feeParameter")])

export function updateFeeParameters(
  args: UpdateFeeParametersArgs,
  accounts: UpdateFeeParametersAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    { pubkey: accounts.admin, isSigner: true, isWritable: false },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([128, 128, 208, 91, 246, 53, 31, 176])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      feeParameter: types.FeeParameter.toEncodable(args.feeParameter),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
