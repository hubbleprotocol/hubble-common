import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface SetFeeAuthorityAccounts {
  whirlpoolsConfig: PublicKey
  feeAuthority: PublicKey
  newFeeAuthority: PublicKey
}

export function setFeeAuthority(
  accounts: SetFeeAuthorityAccounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpoolsConfig, isSigner: false, isWritable: true },
    { pubkey: accounts.feeAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.newFeeAuthority, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([31, 1, 50, 87, 237, 101, 97, 132])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
