import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface CollectProtocolFeesV2Args {
  remainingAccountsInfo: types.RemainingAccountsInfoFields | null
}

export interface CollectProtocolFeesV2Accounts {
  whirlpoolsConfig: PublicKey
  whirlpool: PublicKey
  collectProtocolFeesAuthority: PublicKey
  tokenMintA: PublicKey
  tokenMintB: PublicKey
  tokenVaultA: PublicKey
  tokenVaultB: PublicKey
  tokenDestinationA: PublicKey
  tokenDestinationB: PublicKey
  tokenProgramA: PublicKey
  tokenProgramB: PublicKey
  memoProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.option(types.RemainingAccountsInfo.layout(), "remainingAccountsInfo"),
])

export function collectProtocolFeesV2(
  args: CollectProtocolFeesV2Args,
  accounts: CollectProtocolFeesV2Accounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpoolsConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    {
      pubkey: accounts.collectProtocolFeesAuthority,
      isSigner: true,
      isWritable: false,
    },
    { pubkey: accounts.tokenMintA, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenMintB, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenVaultA, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVaultB, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenDestinationA, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenDestinationB, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgramA, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgramB, isSigner: false, isWritable: false },
    { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([103, 128, 222, 134, 114, 200, 22, 200])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      remainingAccountsInfo:
        (args.remainingAccountsInfo &&
          types.RemainingAccountsInfo.toEncodable(
            args.remainingAccountsInfo
          )) ||
        null,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
