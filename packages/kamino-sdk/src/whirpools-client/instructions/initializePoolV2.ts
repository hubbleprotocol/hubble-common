import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface InitializePoolV2Args {
  tickSpacing: number
  initialSqrtPrice: BN
}

export interface InitializePoolV2Accounts {
  whirlpoolsConfig: PublicKey
  tokenMintA: PublicKey
  tokenMintB: PublicKey
  tokenBadgeA: PublicKey
  tokenBadgeB: PublicKey
  funder: PublicKey
  whirlpool: PublicKey
  tokenVaultA: PublicKey
  tokenVaultB: PublicKey
  feeTier: PublicKey
  tokenProgramA: PublicKey
  tokenProgramB: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
}

export const layout = borsh.struct([
  borsh.u16("tickSpacing"),
  borsh.u128("initialSqrtPrice"),
])

export function initializePoolV2(
  args: InitializePoolV2Args,
  accounts: InitializePoolV2Accounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpoolsConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenMintA, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenMintB, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBadgeA, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBadgeB, isSigner: false, isWritable: false },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVaultA, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenVaultB, isSigner: true, isWritable: true },
    { pubkey: accounts.feeTier, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgramA, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgramB, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([207, 45, 87, 242, 27, 63, 204, 67])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      tickSpacing: args.tickSpacing,
      initialSqrtPrice: args.initialSqrtPrice,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
