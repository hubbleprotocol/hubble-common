import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';

export type PsmReserve = {
  version: Decimal;
  bump: number;
  borrowingMarketState: PublicKey;
  depositedStablecoin: Decimal;
  maxCapacity: Decimal;
  mintedUsdh: Decimal;
  stablecoinMintDecimals: number;
  stablecoinMint: PublicKey;
  psmVault: PublicKey;
  psmVaultAuthority: PublicKey;
  psmVaultAuthoritySeed: PublicKey;
};

export default PsmReserve;
