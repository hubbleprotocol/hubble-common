import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface InitializeKaminoRewardArgs {
  kaminoRewardIndex: BN;
  collateralToken: BN;
}

export interface InitializeKaminoRewardAccounts {
  adminAuthority: PublicKey;
  strategy: PublicKey;
  globalConfig: PublicKey;
  rewardMint: PublicKey;
  rewardVault: PublicKey;
  tokenInfos: PublicKey;
  baseVaultAuthority: PublicKey;
  systemProgram: PublicKey;
  rent: PublicKey;
  tokenProgram: PublicKey;
}

export const layout = borsh.struct([borsh.u64('kaminoRewardIndex'), borsh.u64('collateralToken')]);

export function initializeKaminoReward(args: InitializeKaminoRewardArgs, accounts: InitializeKaminoRewardAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.adminAuthority, isSigner: true, isWritable: true },
    { pubkey: accounts.strategy, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.rewardMint, isSigner: false, isWritable: false },
    { pubkey: accounts.rewardVault, isSigner: true, isWritable: true },
    { pubkey: accounts.tokenInfos, isSigner: false, isWritable: false },
    { pubkey: accounts.baseVaultAuthority, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([203, 212, 8, 90, 91, 118, 111, 50]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      kaminoRewardIndex: args.kaminoRewardIndex,
      collateralToken: args.collateralToken,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data });
  return ix;
}
