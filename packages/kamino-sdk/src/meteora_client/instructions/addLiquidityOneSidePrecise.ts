import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface AddLiquidityOneSidePreciseArgs {
  parameter: types.AddLiquiditySingleSidePreciseParameterFields
}

export interface AddLiquidityOneSidePreciseAccounts {
  position: PublicKey
  lbPair: PublicKey
  binArrayBitmapExtension: PublicKey
  userToken: PublicKey
  reserve: PublicKey
  tokenMint: PublicKey
  sender: PublicKey
  tokenProgram: PublicKey
  eventAuthority: PublicKey
  program: PublicKey
}

export const layout = borsh.struct([
  types.AddLiquiditySingleSidePreciseParameter.layout("parameter"),
])

export function addLiquidityOneSidePrecise(
  args: AddLiquidityOneSidePreciseArgs,
  accounts: AddLiquidityOneSidePreciseAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    {
      pubkey: accounts.binArrayBitmapExtension,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.userToken, isSigner: false, isWritable: true },
    { pubkey: accounts.reserve, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.sender, isSigner: true, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
    { pubkey: accounts.program, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([161, 194, 103, 84, 171, 71, 250, 154])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      parameter: types.AddLiquiditySingleSidePreciseParameter.toEncodable(
        args.parameter
      ),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
