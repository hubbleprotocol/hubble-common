import { PublicKey } from '@solana/web3.js';

// Currently supported tokens in Hubble
export type SupportedToken = 'BTC' | 'SRM' | 'ETH' | 'SOL' | 'FTT' | 'RAY' | 'mSOL';
export const SUPPORTED_TOKENS: SupportedToken[] = ['BTC', 'SRM', 'ETH', 'SOL', 'FTT', 'RAY', 'mSOL'];
export const STABLE_COINS = new Set(['USDC', 'wUSDC', 'USDT']);
// BTC mint address
export const BTC_MINT = '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E';
// ETH mint address
export const ETH_MINT = '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk';
// FTT mint address
export const FTT_MINT = 'AGFEad2et2ZJif9jaGpdMixQqvW5i81aBdvKe7PHNfz3';
// SOL mint address
export const SOL_MINT = 'So11111111111111111111111111111111111111112';
// RAY mint address
export const RAY_MINT = '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R';
// SRM mint address
export const SRM_MINT = 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt';
// mSOL mint address
export const MSOL_MINT = 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So';
export const MINT_ADDRESSES: PublicKey[] = [
  new PublicKey(BTC_MINT),
  new PublicKey(ETH_MINT),
  new PublicKey(FTT_MINT),
  new PublicKey(SOL_MINT),
  new PublicKey(RAY_MINT),
  new PublicKey(SRM_MINT),
  new PublicKey(MSOL_MINT),
];
