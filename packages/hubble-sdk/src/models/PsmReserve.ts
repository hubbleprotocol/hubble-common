import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import WithdrawalCaps from './WithdrawalCaps';

export type PsmReserve = {
  version: number;
  bump: number;
  borrowingMarketState: PublicKey;
  depositedStablecoin: Decimal;
  maxCapacity: Decimal;
  mintedUsdh: Decimal;
  stablecoinMintDecimals: number;
  stablecoinMint: PublicKey;
  psmVault: PublicKey;
  psmVaultAuthority: PublicKey;
  psmVaultAuthoritySeed: number;
  withdrawalCapUsdh: WithdrawalCaps;
  withdrawalCapStable: WithdrawalCaps;
  mintFeeBps: number;
  burnFeeBps: number;
  treasuryVaultOtherStable: PublicKey;
  treasuryVaultOtherStableAuthority: PublicKey;
};

export default PsmReserve;
