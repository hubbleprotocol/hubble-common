import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateTreasuryFeeVaultArgs {
  collateralId: number
}

export interface UpdateTreasuryFeeVaultAccounts {
  adminAuthority: PublicKey
  globalConfig: PublicKey
  feeMint: PublicKey
  treasuryFeeVault: PublicKey
  treasuryFeeVaultAuthority: PublicKey
  systemProgram: PublicKey
  rent: PublicKey
  tokenProgram: PublicKey
}

export const layout = borsh.struct([borsh.u16("collateralId")])

export function updateTreasuryFeeVault(
  args: UpdateTreasuryFeeVaultArgs,
  accounts: UpdateTreasuryFeeVaultAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: true },
    { pubkey: accounts.feeMint, isSigner: false, isWritable: false },
    { pubkey: accounts.treasuryFeeVault, isSigner: false, isWritable: true },
    {
      pubkey: accounts.treasuryFeeVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([9, 241, 94, 91, 173, 74, 166, 119])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      collateralId: args.collateralId,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
