import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateMintMapArgs {
  seedPk: PublicKey
  seedId: BN
  bump: number
  scopeChains: Array<Array<number>>
}

export interface CreateMintMapAccounts {
  admin: PublicKey
  configuration: PublicKey
  mappings: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.publicKey("seedPk"),
  borsh.u64("seedId"),
  borsh.u8("bump"),
  borsh.vec(borsh.array(borsh.u16(), 4), "scopeChains"),
])

export function createMintMap(
  args: CreateMintMapArgs,
  accounts: CreateMintMapAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.admin, isSigner: true, isWritable: true },
    { pubkey: accounts.configuration, isSigner: false, isWritable: false },
    { pubkey: accounts.mappings, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([216, 218, 224, 60, 23, 31, 193, 243])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      seedPk: args.seedPk,
      seedId: args.seedId,
      bump: args.bump,
      scopeChains: args.scopeChains,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
