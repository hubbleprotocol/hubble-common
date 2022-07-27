import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SetProtocolFeeRateArgs {
  protocolFeeRate: number
}

export interface SetProtocolFeeRateAccounts {
  whirlpoolsConfig: PublicKey
  whirlpool: PublicKey
  feeAuthority: PublicKey
}

export const layout = borsh.struct([borsh.u16("protocolFeeRate")])

export function setProtocolFeeRate(
  args: SetProtocolFeeRateArgs,
  accounts: SetProtocolFeeRateAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.whirlpoolsConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.feeAuthority, isSigner: true, isWritable: false },
  ]
  const identifier = Buffer.from([95, 7, 4, 50, 154, 79, 156, 131])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      protocolFeeRate: args.protocolFeeRate,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
