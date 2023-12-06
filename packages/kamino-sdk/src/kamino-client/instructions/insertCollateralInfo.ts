import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InsertCollateralInfoArgs {
  index: BN
  params: types.CollateralInfoParamsFields
}

export interface InsertCollateralInfoAccounts {
  adminAuthority: PublicKey
  globalConfig: PublicKey
  tokenInfos: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("index"),
  types.CollateralInfoParams.layout("params"),
])

export function insertCollateralInfo(
  args: InsertCollateralInfoArgs,
  accounts: InsertCollateralInfoAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenInfos, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([22, 97, 4, 78, 166, 188, 51, 190])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      index: args.index,
      params: types.CollateralInfoParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
