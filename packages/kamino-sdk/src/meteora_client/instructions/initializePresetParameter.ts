import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializePresetParameterArgs {
  ix: types.InitPresetParametersIxFields
}

export interface InitializePresetParameterAccounts {
  presetParameter: PublicKey
  admin: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([types.InitPresetParametersIx.layout("ix")])

export function initializePresetParameter(
  args: InitializePresetParameterArgs,
  accounts: InitializePresetParameterAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.presetParameter, isSigner: false, isWritable: true },
    { pubkey: accounts.admin, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([66, 188, 71, 211, 98, 109, 14, 186])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      ix: types.InitPresetParametersIx.toEncodable(args.ix),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
