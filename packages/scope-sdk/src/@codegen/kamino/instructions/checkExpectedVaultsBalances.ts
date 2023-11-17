import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CheckExpectedVaultsBalancesArgs {
  tokenAAtaBalance: BN
  tokenBAtaBalance: BN
}

export interface CheckExpectedVaultsBalancesAccounts {
  user: PublicKey
  tokenAAta: PublicKey
  tokenBAta: PublicKey
}

export const layout = borsh.struct([
  borsh.u64("tokenAAtaBalance"),
  borsh.u64("tokenBAtaBalance"),
])

export function checkExpectedVaultsBalances(
  args: CheckExpectedVaultsBalancesArgs,
  accounts: CheckExpectedVaultsBalancesAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenAAta, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBAta, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([75, 151, 187, 125, 50, 4, 11, 71])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      tokenAAtaBalance: args.tokenAAtaBalance,
      tokenBAtaBalance: args.tokenBAtaBalance,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
