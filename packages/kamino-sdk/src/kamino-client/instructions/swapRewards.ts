import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface SwapRewardsArgs {
  tokenAIn: BN;
  tokenBIn: BN;
  rewardIndex: BN;
  rewardCollateralId: BN;
  minCollateralTokenOut: BN;
}

export interface SwapRewardsAccounts {
  user: PublicKey;
  strategy: PublicKey;
  globalConfig: PublicKey;
  pool: PublicKey;
  tokenAVault: PublicKey;
  tokenBVault: PublicKey;
  rewardVault: PublicKey;
  baseVaultAuthority: PublicKey;
  treasuryFeeTokenAVault: PublicKey;
  treasuryFeeTokenBVault: PublicKey;
  treasuryFeeVaultAuthority: PublicKey;
  tokenAMint: PublicKey;
  tokenBMint: PublicKey;
  userTokenAAta: PublicKey;
  userTokenBAta: PublicKey;
  userRewardTokenAccount: PublicKey;
  scopePrices: PublicKey;
  systemProgram: PublicKey;
  tokenProgram: PublicKey;
  instructionSysvarAccount: PublicKey;
}

export const layout = borsh.struct([
  borsh.u64('tokenAIn'),
  borsh.u64('tokenBIn'),
  borsh.u64('rewardIndex'),
  borsh.u64('rewardCollateralId'),
  borsh.u64('minCollateralTokenOut'),
]);

export function swapRewards(args: SwapRewardsArgs, accounts: SwapRewardsAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.user, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.pool, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenAVault, isSigner: false, isWritable: true },
    { pubkey: accounts.tokenBVault, isSigner: false, isWritable: true },
    { pubkey: accounts.rewardVault, isSigner: false, isWritable: true },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    {
      pubkey: accounts.treasuryFeeTokenAVault,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.treasuryFeeTokenBVault,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: accounts.treasuryFeeVaultAuthority,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.tokenAMint, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenBMint, isSigner: false, isWritable: false },
    { pubkey: accounts.userTokenAAta, isSigner: false, isWritable: true },
    { pubkey: accounts.userTokenBAta, isSigner: false, isWritable: true },
    {
      pubkey: accounts.userRewardTokenAccount,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.scopePrices, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.instructionSysvarAccount,
      isSigner: false,
      isWritable: false,
    },
  ];
  const identifier = Buffer.from([92, 41, 172, 30, 190, 65, 174, 90]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      tokenAIn: args.tokenAIn,
      tokenBIn: args.tokenBIn,
      rewardIndex: args.rewardIndex,
      rewardCollateralId: args.rewardCollateralId,
      minCollateralTokenOut: args.minCollateralTokenOut,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data });
  return ix;
}
