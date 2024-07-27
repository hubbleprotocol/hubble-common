import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { WHIRLPOOL_PROGRAM_ID } from "../programId"

export interface ClosePositionAccounts {
  positionAuthority: PublicKey
  receiver: PublicKey
  position: PublicKey
  positionMint: PublicKey
  positionTokenAccount: PublicKey
  tokenProgram: PublicKey
}

export function closePosition(
  accounts: ClosePositionAccounts,
  programId: PublicKey = WHIRLPOOL_PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.positionAuthority, isSigner: true, isWritable: false },
    { pubkey: accounts.receiver, isSigner: false, isWritable: true },
    { pubkey: accounts.position, isSigner: false, isWritable: true },
    { pubkey: accounts.positionMint, isSigner: false, isWritable: true },
    {
      pubkey: accounts.positionTokenAccount,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([123, 134, 81, 0, 49, 68, 98, 98])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
