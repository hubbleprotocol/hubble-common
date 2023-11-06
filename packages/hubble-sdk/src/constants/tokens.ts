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

  /**
   * Collateral mint
   */
  mint?: string;
  /**
   * Collateral scope price chain
   */
  scopePriceChain?: number[];
  /**
   * Collateral scope twap chain
   */
  scopeTwapChain?: number[];
}

export const ExtraCollateralMap: ExtraCollateralToken[] = [
  {
    id: 0,
    name: 'SOL',
    mint: 'So11111111111111111111111111111111111111112',
    scopePriceChain: [0, 65535, 65535, 65535],
    scopeTwapChain: [52, 65535, 65535, 65535],
  },
  {
    id: 1,
    name: 'ETH',
    mint: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
    scopePriceChain: [1, 65535, 65535, 65535],
    scopeTwapChain: [53, 65535, 65535, 65535],
  },
  {
    id: 2,
    name: 'BTC',
    mint: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
    scopePriceChain: [2, 65535, 65535, 65535],
    scopeTwapChain: [65535, 65535, 65535, 65535],
  },
  {
    id: 3,
    name: 'SRM',
    mint: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
    scopePriceChain: [3, 65535, 65535, 65535],
    scopeTwapChain: [65535, 65535, 65535, 65535],
  },
  {
    id: 4,
    name: 'RAY',
    mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    scopePriceChain: [4, 65535, 65535, 65535],
    scopeTwapChain: [56, 65535, 65535, 65535],
  },
  {
    id: 5,
    name: 'FTT',
    mint: 'AGFEad2et2ZJif9jaGpdMixQqvW5i81aBdvKe7PHNfz3',
    scopePriceChain: [5, 65535, 65535, 65535],
    scopeTwapChain: [65535, 65535, 65535, 65535],
  },
  {
    id: 6,
    name: 'MSOL',
    mint: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    scopePriceChain: [6, 65535, 65535, 65535],
    scopeTwapChain: [58, 65535, 65535, 65535],
  },
  {
    id: 7,
    name: 'daoSOL',
    mint: 'GEJpt3Wjmr628FqXxTgxMce1pLntcPV4uFi8ksxMyPQh',
    scopePriceChain: [10, 65535, 65535, 65535],
    scopeTwapChain: [65535, 65535, 65535, 65535],
  },
  {
    id: 8,
    name: 'STSOL',
    mint: '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj',
    scopePriceChain: [76, 0, 65535, 65535],
    scopeTwapChain: [61, 65535, 65535, 65535],
  },
  {
    id: 9,
    name: 'scnSOL',
    mint: '5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm',
    scopePriceChain: [7, 0, 65535, 65535],
    scopeTwapChain: [65535, 65535, 65535, 65535],
  },
  {
    id: 10,
    name: 'wstETH',
    mint: 'ZScHuTtqZukUrtZS43teTKGs2VqkKL8k4QCouR2n6Uo',
    scopePriceChain: [18, 65535, 65535, 65535],
    scopeTwapChain: [66, 65535, 65535, 65535],
  },
  {
    id: 11,
    name: 'LDO',
    mint: 'HZRCwxP2Vq9PCpPXooayhJ2bxTpo5xfpQrwB1svh332p',
    scopePriceChain: [19, 65535, 65535, 65535],
    scopeTwapChain: [65535, 65535, 65535, 65535],
  },
  {
    id: 23,
    name: 'KUSDHUSDCORCA',
    mint: '5BmZgW7dk1kximGfn7MPvDigp3yRmgT64jS9Skdq4nPY',
    scopePriceChain: [42, 65535, 65535, 65535],
    scopeTwapChain: [65535, 65535, 65535, 65535],
  },
  {
    id: 27,
    name: 'JSOL',
    mint: '7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn',
    scopePriceChain: [34, 0, 65535, 65535],
    scopeTwapChain: [65535, 65535, 65535, 65535],
  },
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
