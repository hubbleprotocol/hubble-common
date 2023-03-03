import { KaminoToken } from '../models';
import { PublicKey } from '@solana/web3.js';
import { HubbleConfig } from '@hubbleprotocol/hubble-config';

export const KAMINO_TOKEN_MAP: KaminoToken[] = [
  { name: 'USDC', id: 0 },
  { name: 'USDH', id: 1 },
  { name: 'SOL', id: 2 },
  { name: 'ETH', id: 3 },
  { name: 'BTC', id: 4 },
  { name: 'MSOL', id: 5 },
  { name: 'STSOL', id: 6 },
  { name: 'USDT', id: 7 },
  { name: 'ORCA', id: 8 },
  { name: 'MNDE', id: 9 },
  { name: 'HBB', id: 10 },
  { name: 'JSOL', id: 11 },
  { name: 'USH', id: 12 },
  { name: 'DAI', id: 13 },
  { name: 'LDO', id: 14 },
  { name: 'scnSOL', id: 15 },
  { name: 'UXD', id: 16 },
  { name: 'HDG', id: 17 },
  { name: 'DUST', id: 18 },
  { name: 'USDR', id: 19 },
  { name: 'RATIO', id: 20 },
  { name: 'UXP', id: 21 },
  { name: 'JITOSOL', id: 22 },
  { name: 'RAY', id: 23 },
  { name: 'BONK', id: 24 },
  { name: 'SAMO', id: 25 },
  { name: 'LaineSOL', id: 26 },
  { name: 'bSOL', id: 27 },
  { name: 'HADES', id: 28 },
  { name: 'BTC', id: 29 },
  { name: 'RLB', id: 30 },
  { name: 'CGNTSOL', id: 31 },
  { name: 'HXRO', id: 32 },
];

/**
 * Get scope token name from a kamino strategy collateral ID
 * @param collateralId ID of the collateral token
 * @returns Kamino token name
 */
export function getKaminoTokenName(collateralId: number) {
  const token = KAMINO_TOKEN_MAP.find((x) => x.id === collateralId);
  if (!token) {
    throw Error(`Token with collateral ID ${collateralId} does not exist.`);
  }
  return token.name;
}

export const getScopeTokenFromKaminoMints = (mint: PublicKey, config: HubbleConfig): string | undefined => {
  return config.kamino.mints.find((x) => x.address.toString() === mint.toString())?.scopeToken;
};
