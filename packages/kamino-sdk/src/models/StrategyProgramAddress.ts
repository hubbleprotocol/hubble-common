import { PublicKey } from '@solana/web3.js';

export type StrategyProgramAddress = {
  tokenAVault: PublicKey;
  tokenABump: number;
  tokenBVault: PublicKey;
  tokenBBump: number;
  baseVaultAuthority: PublicKey;
  baseVaultAuthorityBump: number;
  sharesMint: PublicKey;
  sharesMintBump: number;
  sharesMintAuthority: PublicKey;
  sharesMintAuthorityBump: number;
};
