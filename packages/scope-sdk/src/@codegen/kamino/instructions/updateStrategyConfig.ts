import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateStrategyConfigArgs {
  mode: number
  value: Array<number>
}

export interface UpdateStrategyConfigAccounts {
  adminAuthority: PublicKey
  newAccount: PublicKey
  strategy: PublicKey
  globalConfig: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.u16("mode"),
  borsh.array(borsh.u8(), 128, "value"),
])

export function updateStrategyConfig(
  args: UpdateStrategyConfigArgs,
  accounts: UpdateStrategyConfigAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.newAccount, isSigner: false, isWritable: false },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([81, 217, 177, 65, 40, 227, 8, 165])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      mode: args.mode,
      value: args.value,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
