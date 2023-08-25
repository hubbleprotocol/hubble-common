import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface MigrateToDepositWithoutInvestAccounts {
  strategy: PublicKey
  globalConfig: PublicKey
}

export function migrateToDepositWithoutInvest(
  accounts: MigrateToDepositWithoutInvestAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([233, 27, 171, 141, 108, 225, 2, 243])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
