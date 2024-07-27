import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface WithdrawProtocolFeeArgs {
  amountX: BN
  amountY: BN
}

export interface WithdrawProtocolFeeAccounts {
  lbPair: PublicKey
  reserveX: PublicKey
  reserveY: PublicKey
  tokenXMint: PublicKey
  tokenYMint: PublicKey
  receiverTokenX: PublicKey
  receiverTokenY: PublicKey
  tokenXProgram: PublicKey
  tokenYProgram: PublicKey
}

export const layout = borsh.struct([borsh.u64("amountX"), borsh.u64("amountY")])

export function withdrawProtocolFee(
  args: WithdrawProtocolFeeArgs,
  accounts: WithdrawProtocolFeeAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.lbPair, isSigner: false, isWritable: true },
    { pubkey: accounts.reserveX, isSigner: false, isWritable: true },
    { pubkey: accounts.reserveY, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenXMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenYMint, isSigner: false, isWritable: false },
    { pubkey: accounts.receiverTokenX, isSigner: false, isWritable: true },
    { pubkey: accounts.receiverTokenY, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenXProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenYProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([158, 201, 158, 189, 33, 93, 162, 103])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      amountX: args.amountX,
      amountY: args.amountY,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
