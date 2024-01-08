import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateWhitelistedWalletArgs {
  idx: number
  wallet: PublicKey
}

export interface UpdateWhitelistedWalletAccounts {
  lbPair: PublicKey
  admin: PublicKey
}

export const layout = borsh.struct([borsh.u8("idx"), borsh.publicKey("wallet")])

export function updateWhitelistedWallet(
  args: UpdateWhitelistedWalletArgs,
  accounts: UpdateWhitelistedWalletAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    { pubkey: accounts.admin, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([4, 105, 92, 167, 132, 28, 9, 90])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      idx: args.idx,
      wallet: args.wallet,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
