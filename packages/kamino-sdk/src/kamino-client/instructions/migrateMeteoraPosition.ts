import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface MigrateMeteoraPositionAccounts {
  adminAuthority: PublicKey
  strategy: PublicKey
  pool: PublicKey
  baseVaultAuthority: PublicKey
  tickArrayLower: PublicKey
  tickArrayUpper: PublicKey
  position: PublicKey
  system: PublicKey
  poolProgram: PublicKey
  oldPosition: PublicKey
  eventAuthority: PublicKey
}

export function migrateMeteoraPosition(
  accounts: MigrateMeteoraPositionAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.pool, isSigner: false, isWritable: false },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: true },
    { pubkey: accounts.position, isSigner: true, isWritable: true },
    { pubkey: accounts.system, isSigner: false, isWritable: false },
    { pubkey: accounts.poolProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.oldPosition, isSigner: false, isWritable: true },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([201, 22, 121, 177, 235, 166, 180, 80])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
