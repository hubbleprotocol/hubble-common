import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateFeesAndRewardsAccounts {
  whirlpool: PublicKey
  position: PublicKey
  tickArrayLower: PublicKey
  tickArrayUpper: PublicKey
}

export function updateFeesAndRewards(accounts: UpdateFeesAndRewardsAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: false },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([154, 230, 250, 13, 236, 209, 75, 223])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
