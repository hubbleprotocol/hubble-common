import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateCollateralInfoArgs {
  index: BN
  mode: BN
  value: Array<number>
}

export interface UpdateCollateralInfoAccounts {
  adminAuthority: PublicKey
  globalConfig: PublicKey
  tokenInfos: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("index"),
  borsh.u64("mode"),
  borsh.array(borsh.u8(), 32, "value"),
])

export function updateCollateralInfo(
  args: UpdateCollateralInfoArgs,
  accounts: UpdateCollateralInfoAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenInfos, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([76, 94, 131, 44, 137, 61, 161, 110])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      index: args.index,
      mode: args.mode,
      value: args.value,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
