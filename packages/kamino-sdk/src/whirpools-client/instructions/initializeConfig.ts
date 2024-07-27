import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface InitializeConfigArgs {
  feeAuthority: PublicKey
  collectProtocolFeesAuthority: PublicKey
  rewardEmissionsSuperAuthority: PublicKey
  defaultProtocolFeeRate: number
}

export interface InitializeConfigAccounts {
  config: PublicKey
  funder: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.publicKey("feeAuthority"),
  borsh.publicKey("collectProtocolFeesAuthority"),
  borsh.publicKey("rewardEmissionsSuperAuthority"),
  borsh.u16("defaultProtocolFeeRate"),
])

export function initializeConfig(
  args: InitializeConfigArgs,
  accounts: InitializeConfigAccounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.config, isSigner: true, isWritable: true },
    { pubkey: accounts.funder, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([208, 127, 21, 1, 194, 190, 196, 70])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      feeAuthority: args.feeAuthority,
      collectProtocolFeesAuthority: args.collectProtocolFeesAuthority,
      rewardEmissionsSuperAuthority: args.rewardEmissionsSuperAuthority,
      defaultProtocolFeeRate: args.defaultProtocolFeeRate,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
