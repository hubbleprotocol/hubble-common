import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface IncreaseLiquidityV2Args {
  liquidity: BN;
  amount0Max: BN;
  amount1Max: BN;
  baseFlag: boolean | null;
}

export interface IncreaseLiquidityV2Accounts {
  nftOwner: PublicKey;
  nftAccount: PublicKey;
  poolState: PublicKey;
  protocolPosition: PublicKey;
  personalPosition: PublicKey;
  tickArrayLower: PublicKey;
  tickArrayUpper: PublicKey;
  tokenAccount0: PublicKey;
  tokenAccount1: PublicKey;
  tokenVault0: PublicKey;
  tokenVault1: PublicKey;
  tokenProgram: PublicKey;
  tokenProgram2022: PublicKey;
  vault0Mint: PublicKey;
  vault1Mint: PublicKey;
}

export const layout = borsh.struct([
  borsh.u128('liquidity'),
  borsh.u64('amount0Max'),
  borsh.u64('amount1Max'),
  borsh.option(borsh.bool(), 'baseFlag'),
]);

export function increaseLiquidityV2(
  args: IncreaseLiquidityV2Args,
  accounts: IncreaseLiquidityV2Accounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.nftOwner, isSigner: true, isWritable: false },
    { pubkey: accounts.nftAccount, isSigner: false, isWritable: false },
    { pubkey: accounts.poolState, isSigner: false, isWritable: true },
    { pubkey: accounts.protocolPosition, isSigner: false, isWritable: true },
    { pubkey: accounts.personalPosition, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayLower, isSigner: false, isWritable: true },
    { pubkey: accounts.tickArrayUpper, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenAccount0, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenAccount1, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVault0, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenVault1, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram2022, isSigner: false, isWritable: false },
    { pubkey: accounts.vault0Mint, isSigner: false, isWritable: false },
    { pubkey: accounts.vault1Mint, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([133, 29, 89, 223, 69, 238, 176, 10]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      liquidity: args.liquidity,
      amount0Max: args.amount0Max,
      amount1Max: args.amount1Max,
      baseFlag: args.baseFlag,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId, data });
  return ix;
}
