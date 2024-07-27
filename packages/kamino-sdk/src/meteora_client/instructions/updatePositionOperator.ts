import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdatePositionOperatorArgs {
  operator: PublicKey
}

export interface UpdatePositionOperatorAccounts {
  position: PublicKey
  owner: PublicKey
  eventAuthority: PublicKey
  program: PublicKey
}

export const layout = borsh.struct([borsh.publicKey("operator")])

export function updatePositionOperator(
  args: UpdatePositionOperatorArgs,
  accounts: UpdatePositionOperatorAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: false },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([202, 184, 103, 143, 180, 191, 116, 217])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      operator: args.operator,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
