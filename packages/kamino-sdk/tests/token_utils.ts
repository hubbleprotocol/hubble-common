export const CollateralTokens = [
  'USDC',
  'USDH',
  'SOL',
  'ETH',
  'BTC',
  'MSOL',
  'STSOL',
  'USDT',
  'ORCA',
  'MNDE',
  'HBB',
  'JSOL',
  'USH',
  'DAI',
  'LDO',
  'SCNSOL',
  'UXD',
  'HDG',
  'DUST',
  'USDR',
  'RATIO',
  'UXP',
  'JITOSOL',
  'RAY',
  'BONK',
  'SAMO',
  'BSOL',
  'LaineSOL',
] as const;

export type CollateralToken = typeof CollateralTokens[number];

export function collateralTokenToNumber(token: CollateralToken): number {
  for (let i = 0; i < CollateralTokens.length; i++) {
    if (CollateralTokens[i] === token) {
      return i;
    }
  }

  throw 'Unknown token' + token;
}
