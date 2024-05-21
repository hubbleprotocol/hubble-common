import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateTokenMetadataArgs {
  index: BN
  mode: BN
  feedName: string
  value: Uint8Array
}

export interface UpdateTokenMetadataAccounts {
  admin: PublicKey
  configuration: PublicKey
  tokensMetadata: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("index"),
  borsh.u64("mode"),
  borsh.str("feedName"),
  borsh.vecU8("value"),
])

export function updateTokenMetadata(
  args: UpdateTokenMetadataArgs,
  accounts: UpdateTokenMetadataAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.admin, isSigner: true, isWritable: false },
    { pubkey: accounts.configuration, isSigner: false, isWritable: false },
    { pubkey: accounts.tokensMetadata, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([243, 6, 8, 23, 126, 181, 251, 158])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      index: args.index,
      mode: args.mode,
      feedName: args.feedName,
      value: Buffer.from(
        args.value.buffer,
        args.value.byteOffset,
        args.value.length
      ),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
