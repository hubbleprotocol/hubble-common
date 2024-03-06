import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface WithdrawFromTreasuryArgs {
  amount: BN
}

export interface WithdrawFromTreasuryAccounts {
  adminAuthority: PublicKey
  globalConfig: PublicKey
  mint: PublicKey
  treasuryFeeVault: PublicKey
  treasuryFeeVaultAuthority: PublicKey
  tokenAccount: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
  tokenProgram: PublicKey
}

export const layout = borsh.struct([borsh.u64("amount")])

export function withdrawFromTreasury(
  args: WithdrawFromTreasuryArgs,
  accounts: WithdrawFromTreasuryAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
    { pubkey: accounts.treasuryFeeVault, isSigner: false, isWritable: true },
    {
      pubkey: accounts.treasuryFeeVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([0, 164, 86, 76, 56, 72, 12, 170])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      amount: args.amount,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
