import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface SetConfigExtensionAuthorityAccounts {
  whirlpoolsConfig: PublicKey
  whirlpoolsConfigExtension: PublicKey
  configExtensionAuthority: PublicKey
  newConfigExtensionAuthority: PublicKey
}

export function setConfigExtensionAuthority(
  accounts: SetConfigExtensionAuthorityAccounts,
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
      pubkey: accounts.newConfigExtensionAuthority,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([44, 94, 241, 116, 24, 188, 60, 143])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
