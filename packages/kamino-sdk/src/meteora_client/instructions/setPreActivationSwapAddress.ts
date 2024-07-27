import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SetPreActivationSwapAddressArgs {
  preActivationSwapAddress: PublicKey
}

export interface SetPreActivationSwapAddressAccounts {
  lbPair: PublicKey
  creator: PublicKey
}

export const layout = borsh.struct([
  borsh.publicKey("preActivationSwapAddress"),
])

export function setPreActivationSwapAddress(
  args: SetPreActivationSwapAddressArgs,
  accounts: SetPreActivationSwapAddressAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    { pubkey: accounts.creator, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([57, 139, 47, 123, 216, 80, 223, 10])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      preActivationSwapAddress: args.preActivationSwapAddress,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
