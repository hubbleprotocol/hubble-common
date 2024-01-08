import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ClosePositionAccounts {
  position: PublicKey
  lbPair: PublicKey
  binArrayLower: PublicKey
  binArrayUpper: PublicKey
  owner: PublicKey
  rentReceiver: PublicKey
  eventAuthority: PublicKey
  program: PublicKey
}

export function closePosition(accounts: ClosePositionAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    { pubkey: accounts.binArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.binArrayUpper, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: false },
    { pubkey: accounts.rentReceiver, isSigner: false, isWritable: true },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([123, 134, 81, 0, 49, 68, 98, 98])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
