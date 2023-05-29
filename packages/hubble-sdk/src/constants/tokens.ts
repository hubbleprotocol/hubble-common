import { PublicKey } from '@solana/web3.js';
import { ExtraCollateralAmount } from '../models';
import Decimal from 'decimal.js';

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
// Streamflow contract for HBB vesting
export const STREAMFLOW_HBB_CONTRACT = '84D1KGEXRwVzP2D7QFLx7ntUsPKWTm2EDkniTQCjE3W2';
export const MINT_ADDRESSES: PublicKey[] = [
  new PublicKey(BTC_MINT),
  new PublicKey(ETH_MINT),
  new PublicKey(FTT_MINT),
  new PublicKey(SOL_MINT),
  new PublicKey(RAY_MINT),
  new PublicKey(SRM_MINT),
  new PublicKey(MSOL_MINT),
];

export interface ExtraCollateralToken {
  /**
   * Collateral token name
   */
  name: string;
  /**
   * Hubble smart contracts extra collateral ID
   */
  id: number;
}

export const ExtraCollateralMap: ExtraCollateralToken[] = [
  { id: 0, name: 'SOL' },
  { id: 1, name: 'ETH' },
  { id: 2, name: 'BTC' },
  { id: 3, name: 'SRM' },
  { id: 4, name: 'RAY' },
  { id: 5, name: 'FTT' },
  { id: 6, name: 'MSOL' },
  { id: 7, name: 'daoSOL' },
  { id: 8, name: 'STSOL' },
  { id: 9, name: 'scnSOL' },
  { id: 10, name: 'wstETH' },
  { id: 11, name: 'LDO' },
  { id: 12, name: 'CSOL' },
  { id: 13, name: 'CETH' },
  { id: 14, name: 'CBTC' },
  { id: 15, name: 'CMSOL' },
  { id: 16, name: 'CUSDC' },
  { id: 17, name: 'CSRM' },
  { id: 18, name: 'CRAY' },
  { id: 19, name: 'CFTT' },
  { id: 20, name: 'CSTSOL' },
  { id: 21, name: 'CSLND' },
  { id: 22, name: 'CORCA' },
  { id: 23, name: 'KUSDHUSDCORCA' },
  { id: 24, name: 'KUSDCUSDTORCA' },
  { id: 25, name: 'KSTSOLSOLORCA' },
  { id: 26, name: 'KUSHUSDCORCA' },
  { id: 27, name: 'JSOL' },
];

export const getExtraCollateralToken = (token: string) => {
  return ExtraCollateralMap.find((x) => x.name.toLowerCase() === token.toLowerCase());
};

export const getExtraCollateralTokenById = (tokenId: Decimal) => {
  const coll = ExtraCollateralMap.find((x) => tokenId.eq(x.id));
  if (!coll) {
    throw Error(`Could not find token id ${tokenId} in a list of extra collateral`);
  }
  return coll;
};

export const findInExtraCollateralByName = (token: string, extraCollateral: ExtraCollateralAmount[]) => {
  const coll = getExtraCollateralToken(token);
  if (!coll) {
    throw Error(`Could not find ${token} in a list of extra collateral`);
  }
  const extra = extraCollateral.find((x) => x.tokenId.eq(coll.id));
  if (!extra) {
    throw Error(`Could not find ${token} in a list of extra collateral`);
  }
  return extra;
};
