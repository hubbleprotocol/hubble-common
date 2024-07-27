import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface GoToABinArgs {
  binId: number
}

export interface GoToABinAccounts {
  lbPair: PublicKey
  binArrayBitmapExtension: PublicKey
  fromBinArray: PublicKey
  toBinArray: PublicKey
  eventAuthority: PublicKey
  program: PublicKey
}

export const layout = borsh.struct([borsh.i32("binId")])

export function goToABin(
  args: GoToABinArgs,
  accounts: GoToABinAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    {
      pubkey: accounts.binArrayBitmapExtension,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.fromBinArray, isSigner: false, isWritable: false },
    { pubkey: accounts.toBinArray, isSigner: false, isWritable: false },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([146, 72, 174, 224, 40, 253, 84, 174])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      binId: args.binId,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
