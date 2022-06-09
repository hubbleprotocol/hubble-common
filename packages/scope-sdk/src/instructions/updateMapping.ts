import { TransactionInstruction, PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateMappingArgs {
  token: BN
  priceType: number
}

export interface UpdateMappingAccounts {
  admin: PublicKey
  program: PublicKey
  programData: PublicKey
  oracleMappings: PublicKey
  priceInfo: PublicKey
}

export const layout = borsh.struct([borsh.u64("token"), borsh.u8("priceType")])

export function updateMapping(
  args: UpdateMappingArgs,
  accounts: UpdateMappingAccounts
) {
  const keys = [
    { pubkey: accounts.admin, isSigner: true, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
    { pubkey: accounts.programData, isSigner: false, isWritable: false },
    { pubkey: accounts.oracleMappings, isSigner: false, isWritable: true },
    { pubkey: accounts.priceInfo, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([56, 102, 90, 236, 243, 21, 185, 105])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      token: args.token,
      priceType: args.priceType,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
