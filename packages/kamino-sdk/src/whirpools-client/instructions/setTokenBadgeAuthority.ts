import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface SetTokenBadgeAuthorityAccounts {
  whirlpoolsConfig: PublicKey
  whirlpoolsConfigExtension: PublicKey
  configExtensionAuthority: PublicKey
  newTokenBadgeAuthority: PublicKey
}

export function setTokenBadgeAuthority(
  accounts: SetTokenBadgeAuthorityAccounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpoolsConfig, isSigner: false, isWritable: false },
    {
      pubkey: accounts.whirlpoolsConfigExtension,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.configExtensionAuthority,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: accounts.newTokenBadgeAuthority,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([207, 202, 4, 32, 205, 79, 13, 178])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
