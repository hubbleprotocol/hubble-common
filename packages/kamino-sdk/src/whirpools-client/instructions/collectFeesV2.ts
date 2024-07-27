import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface CollectFeesV2Args {
  remainingAccountsInfo: types.RemainingAccountsInfoFields | null
}

export interface CollectFeesV2Accounts {
  whirlpool: PublicKey
  positionAuthority: PublicKey
  position: PublicKey
  positionTokenAccount: PublicKey
  tokenMintA: PublicKey
  tokenMintB: PublicKey
  tokenOwnerAccountA: PublicKey
  tokenVaultA: PublicKey
  tokenOwnerAccountB: PublicKey
  tokenVaultB: PublicKey
  tokenProgramA: PublicKey
  tokenProgramB: PublicKey
  memoProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.option(types.RemainingAccountsInfo.layout(), "remainingAccountsInfo"),
])

export function collectFeesV2(
  args: CollectFeesV2Args,
  accounts: CollectFeesV2Accounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: false },
    { pubkey: accounts.positionAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    {
      pubkey: accounts.positionTokenAccount,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.tokenMintA, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenMintB, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenOwnerAccountA, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVaultA, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenOwnerAccountB, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVaultB, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgramA, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgramB, isSigner: false, isWritable: false },
    { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([207, 117, 95, 191, 229, 180, 226, 15])
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
