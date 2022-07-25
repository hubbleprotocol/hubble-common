import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CollectProtocolFeesAccounts {
  whirlpoolsConfig: PublicKey
  whirlpool: PublicKey
  collectProtocolFeesAuthority: PublicKey
  tokenVaultA: PublicKey
  tokenVaultB: PublicKey
  tokenDestinationA: PublicKey
  tokenDestinationB: PublicKey
  tokenProgram: PublicKey
}

export function collectProtocolFees(accounts: CollectProtocolFeesAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpoolsConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    {
      pubkey: accounts.collectProtocolFeesAuthority,
      isSigner: true,
      isWritable: false,
    },
    { pubkey: accounts.tokenVaultA, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVaultB, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenDestinationA, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenDestinationB, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([22, 67, 23, 98, 150, 178, 70, 220])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
