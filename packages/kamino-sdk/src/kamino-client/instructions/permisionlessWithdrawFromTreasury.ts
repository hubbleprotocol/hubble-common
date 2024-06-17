import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface PermisionlessWithdrawFromTreasuryAccounts {
  signer: PublicKey
  globalConfig: PublicKey
  mint: PublicKey
  treasuryFeeVault: PublicKey
  treasuryFeeVaultAuthority: PublicKey
  tokenAccount: PublicKey
  tokenProgram: PublicKey
}

export function permisionlessWithdrawFromTreasury(
  accounts: PermisionlessWithdrawFromTreasuryAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.mint, isSigner: false, isWritable: false },
    { pubkey: accounts.treasuryFeeVault, isSigner: false, isWritable: true },
    {
      pubkey: accounts.treasuryFeeVaultAuthority,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([167, 36, 32, 79, 97, 170, 183, 108])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
