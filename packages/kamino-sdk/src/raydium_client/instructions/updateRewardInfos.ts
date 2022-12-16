import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateRewardInfosAccounts {
  /** The liquidity pool for which reward info to update */
  poolState: PublicKey
}

/**
 * Update rewards info of the given pool, can be called for everyone
 *
 * # Arguments
 *
 * * `ctx`- The context of accounts
 *
 */
export function updateRewardInfos(accounts: UpdateRewardInfosAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([163, 172, 224, 52, 11, 154, 106, 223])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
