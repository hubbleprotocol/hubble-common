import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface MigratePositionFromV2Accounts {
  positionV3: PublicKey
  positionV2: PublicKey
  lbPair: PublicKey
  binArrayLower: PublicKey
  binArrayUpper: PublicKey
  owner: PublicKey
  systemProgram: PublicKey
  rentReceiver: PublicKey
  eventAuthority: PublicKey
  program: PublicKey
}

export function migratePositionFromV2(accounts: MigratePositionFromV2Accounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.positionV3, isSigner: true, isWritable: true },
    { pubkey: accounts.positionV2, isSigner: false, isWritable: true },
    { pubkey: accounts.lbPair, isSigner: false, isWritable: false },
    { pubkey: accounts.binArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.binArrayUpper, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rentReceiver, isSigner: false, isWritable: true },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([91, 17, 12, 117, 198, 143, 84, 190])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
