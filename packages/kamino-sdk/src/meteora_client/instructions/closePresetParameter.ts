import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ClosePresetParameterAccounts {
  presetParameter: PublicKey
  admin: PublicKey
  rentReceiver: PublicKey
}

export function closePresetParameter(
  accounts: ClosePresetParameterAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.presetParameter, isSigner: false, isWritable: true },
    { pubkey: accounts.admin, isSigner: true, isWritable: true },
    { pubkey: accounts.rentReceiver, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([4, 148, 145, 100, 134, 26, 181, 61])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
