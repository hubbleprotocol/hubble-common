import { PublicKey } from '@solana/web3.js';

export type TreasuryFeeVault = {
  treasuryFeeTokenAVault: PublicKey;
  treasuryFeeTokenBVault: PublicKey;
  treasuryFeeVaultAuthority: PublicKey;
};

export default TreasuryFeeVault;
