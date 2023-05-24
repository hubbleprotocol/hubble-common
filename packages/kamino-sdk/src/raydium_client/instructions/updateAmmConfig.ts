import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateAmmConfigArgs {
  param: number
  value: number
}

export interface UpdateAmmConfigAccounts {
  /** The amm config owner or admin */
  owner: PublicKey
  /** Amm config account to be changed */
  ammConfig: PublicKey
}

export const layout = borsh.struct([borsh.u8("param"), borsh.u32("value")])

/**
 * Updates the owner of the amm config
 * Must be called by the current owner or admin
 *
 * # Arguments
 *
 * * `ctx`- The context of accounts
 * * `trade_fee_rate`- The new trade fee rate of amm config, be set when `param` is 0
 * * `protocol_fee_rate`- The new protocol fee rate of amm config, be set when `param` is 1
 * * `fund_fee_rate`- The new fund fee rate of amm config, be set when `param` is 2
 * * `new_owner`- The config's new owner, be set when `param` is 3
 * * `new_fund_owner`- The config's new fund owner, be set when `param` is 4
 * * `param`- The vaule can be 0 | 1 | 2 | 3 | 4, otherwise will report a error
 *
 */
export function updateAmmConfig(
  args: UpdateAmmConfigArgs,
  accounts: UpdateAmmConfigAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.owner, isSigner: true, isWritable: false },
    { pubkey: accounts.ammConfig, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([49, 60, 174, 136, 154, 28, 116, 200])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      param: args.param,
      value: args.value,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
