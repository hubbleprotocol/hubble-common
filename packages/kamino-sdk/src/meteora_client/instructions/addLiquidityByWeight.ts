import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface AddLiquidityByWeightArgs {
  liquidityParameter: types.LiquidityParameterByWeightFields
}

export interface AddLiquidityByWeightAccounts {
  position: PublicKey
  lbPair: PublicKey
  binArrayBitmapExtension: PublicKey
  userTokenX: PublicKey
  userTokenY: PublicKey
  reserveX: PublicKey
  reserveY: PublicKey
  tokenXMint: PublicKey
  tokenYMint: PublicKey
  binArrayLower: PublicKey
  binArrayUpper: PublicKey
  sender: PublicKey
  tokenXProgram: PublicKey
  tokenYProgram: PublicKey
  eventAuthority: PublicKey
  program: PublicKey
}

export const layout = borsh.struct([
  types.LiquidityParameterByWeight.layout("liquidityParameter"),
])

export function addLiquidityByWeight(
  args: AddLiquidityByWeightArgs,
  accounts: AddLiquidityByWeightAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    {
      pubkey: accounts.binArrayBitmapExtension,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.userTokenX, isSigner: false, isWritable: true },
    { pubkey: accounts.userTokenY, isSigner: false, isWritable: true },
    { pubkey: accounts.reserveX, isSigner: false, isWritable: true },
    { pubkey: accounts.reserveY, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenXMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenYMint, isSigner: false, isWritable: false },
    { pubkey: accounts.binArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.binArrayUpper, isSigner: false, isWritable: true },
    { pubkey: accounts.sender, isSigner: true, isWritable: false },
    { pubkey: accounts.tokenXProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenYProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([28, 140, 238, 99, 231, 162, 21, 149])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      liquidityParameter: types.LiquidityParameterByWeight.toEncodable(
        args.liquidityParameter
      ),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
