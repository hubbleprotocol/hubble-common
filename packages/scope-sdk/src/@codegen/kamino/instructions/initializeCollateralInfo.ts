import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitializeCollateralInfoAccounts {
  adminAuthority: PublicKey
  globalConfig: PublicKey
  collInfo: PublicKey
  systemProgram: PublicKey
}

export function initializeCollateralInfo(
  accounts: InitializeCollateralInfoAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: true },
    { pubkey: accounts.collInfo, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([74, 61, 216, 76, 244, 91, 18, 119])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
