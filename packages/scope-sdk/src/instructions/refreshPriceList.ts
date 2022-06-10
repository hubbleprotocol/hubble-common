import { TransactionInstruction, PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface RefreshPriceListArgs {
  tokens: Array<number>
}

export interface RefreshPriceListAccounts {
  oraclePrices: PublicKey
  oracleMappings: PublicKey
  clock: PublicKey
}

export const layout = borsh.struct([borsh.vec(borsh.u16(), "tokens")])

export function refreshPriceList(
  args: RefreshPriceListArgs,
  accounts: RefreshPriceListAccounts
) {
  const keys = [
    { pubkey: accounts.oraclePrices, isSigner: false, isWritable: true },
    { pubkey: accounts.oracleMappings, isSigner: false, isWritable: false },
    { pubkey: accounts.clock, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([83, 186, 207, 131, 203, 254, 198, 130])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      tokens: args.tokens,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
