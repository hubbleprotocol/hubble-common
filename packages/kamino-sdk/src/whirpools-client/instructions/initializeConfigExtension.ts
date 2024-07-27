import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface InitializeConfigExtensionAccounts {
  config: PublicKey
  configExtension: PublicKey
  funder: PublicKey
  feeAuthority: PublicKey
  systemProgram: PublicKey
}

export function initializeConfigExtension(
  accounts: InitializeConfigExtensionAccounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.config, isSigner: false, isWritable: false },
    { pubkey: accounts.configExtension, isSigner: false, isWritable: true },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.feeAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([55, 9, 53, 9, 114, 57, 209, 52])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
