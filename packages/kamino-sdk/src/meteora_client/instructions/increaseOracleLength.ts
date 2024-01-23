import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface IncreaseOracleLengthArgs {
  lengthToAdd: BN
}

export interface IncreaseOracleLengthAccounts {
  oracle: PublicKey
  funder: PublicKey
  systemProgram: PublicKey
  eventAuthority: PublicKey
  program: PublicKey
}

export const layout = borsh.struct([borsh.u64("lengthToAdd")])

export function increaseOracleLength(
  args: IncreaseOracleLengthArgs,
  accounts: IncreaseOracleLengthAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.oracle, isSigner: false, isWritable: true },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([190, 61, 125, 87, 103, 79, 158, 173])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      lengthToAdd: args.lengthToAdd,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
