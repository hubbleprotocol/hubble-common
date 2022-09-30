import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SwapUnevenVaultsAccounts {
  actionsAuthority: PublicKey
  strategy: PublicKey
  globalConfig: PublicKey
  tokenAVault: PublicKey
  tokenBVault: PublicKey
  baseVaultAuthority: PublicKey
  whirlpool: PublicKey
  position: PublicKey
  whirlpoolTokenVaultA: PublicKey
  whirlpoolTokenVaultB: PublicKey
  /** Payer must send this correctly. */
  tickArray0: PublicKey
  /** Payer must send this correctly. */
  tickArray1: PublicKey
  /** Payer must send this correctly. */
  tickArray2: PublicKey
  oracle: PublicKey
  whirlpoolProgram: PublicKey
  scopePrices: PublicKey
  tokenProgram: PublicKey
}

export function swapUnevenVaults(accounts: SwapUnevenVaultsAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.actionsAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenAVault, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBVault, isSigner: false, isWritable: true },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.whirlpool, isSigner: false, isWritable: true },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    {
      pubkey: accounts.whirlpoolTokenVaultA,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.whirlpoolTokenVaultB,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tickArray0, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArray1, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArray2, isSigner: false, isWritable: true },
    { pubkey: accounts.oracle, isSigner: false, isWritable: false },
    { pubkey: accounts.whirlpoolProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.scopePrices, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([143, 212, 101, 95, 105, 209, 184, 1])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
