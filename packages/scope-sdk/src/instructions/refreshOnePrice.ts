import { TransactionInstruction, PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface RefreshOnePriceArgs {
  token: BN
}

export interface RefreshOnePriceAccounts {
  oraclePrices: PublicKey
  oracleMappings: PublicKey
  priceInfo: PublicKey
  clock: PublicKey
}

export const layout = borsh.struct([borsh.u64("token")])

export function refreshOnePrice(
  args: RefreshOnePriceArgs,
  accounts: RefreshOnePriceAccounts
) {
  const keys = [
    { pubkey: accounts.oraclePrices, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleMappings, isSigner: false, isWritable: false },
    { pubkey: accounts.priceInfo, isSigner: false, isWritable: false },
    { pubkey: accounts.clock, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([106, 50, 31, 29, 180, 161, 244, 99])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      token: args.token,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
