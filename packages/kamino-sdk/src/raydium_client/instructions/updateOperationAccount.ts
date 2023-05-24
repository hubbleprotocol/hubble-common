import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateOperationAccountArgs {
  param: number
  keys: Array<PublicKey>
}

export interface UpdateOperationAccountAccounts {
  /** Address to be set as operation account owner. */
  owner: PublicKey
  /** Initialize operation state account to store operation owner address and white list mint. */
  operationState: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u8("param"),
  borsh.vec(borsh.publicKey(), "keys"),
])

/**
 * Update the operation account
 *
 * # Arguments
 *
 * * `ctx`- The context of accounts
 * * `param`- The vaule can be 0 | 1 | 2 | 3, otherwise will report a error
 * * `keys`- update operation owner when the `param` is 0
 * remove operation owner when the `param` is 1
 * update whitelist mint when the `param` is 2
 * remove whitelist mint when the `param` is 3
 *
 */
export function updateOperationAccount(
  args: UpdateOperationAccountArgs,
  accounts: UpdateOperationAccountAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.owner, isSigner: true, isWritable: false },
    { pubkey: accounts.operationState, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([127, 70, 119, 40, 188, 227, 61, 7])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      param: args.param,
      keys: args.keys,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
