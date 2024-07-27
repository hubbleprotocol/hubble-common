import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface DecreaseLiquidityArgs {
  liquidity: BN;
  amount0Min: BN;
  amount1Min: BN;
}

export interface DecreaseLiquidityAccounts {
  nftOwner: PublicKey;
  nftAccount: PublicKey;
  personalPosition: PublicKey;
  poolState: PublicKey;
  protocolPosition: PublicKey;
  tokenVault0: PublicKey;
  tokenVault1: PublicKey;
  tickArrayLower: PublicKey;
  tickArrayUpper: PublicKey;
  recipientTokenAccount0: PublicKey;
  recipientTokenAccount1: PublicKey;
  tokenProgram: PublicKey;
}

export const layout = borsh.struct([borsh.u128('liquidity'), borsh.u64('amount0Min'), borsh.u64('amount1Min')]);

export function decreaseLiquidity(
  args: DecreaseLiquidityArgs,
  accounts: DecreaseLiquidityAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.nftOwner, isSigner: true, isWritable: false },
    { pubkey: accounts.nftAccount, isSigner: false, isWritable: false },
    { pubkey: accounts.personalPosition, isSigner: false, isWritable: true },
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
    { pubkey: accounts.protocolPosition, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVault0, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVault1, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: true },
    {
      pubkey: accounts.recipientTokenAccount0,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.recipientTokenAccount1,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([160, 38, 208, 111, 104, 91, 44, 1]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      liquidity: args.liquidity,
      amount0Min: args.amount0Min,
      amount1Min: args.amount1Min,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
