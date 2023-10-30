import Decimal from 'decimal.js';
import { PublicKey } from '@solana/web3.js';
import { OraclePrices } from '@hubbleprotocol/scope-sdk';
import { CollateralInfo } from '../kamino-client/types';

export interface EnrichedScopePrice {
  /**
   * Price in USD
   */
  price: Decimal;
  /**
   * Token mint
   */
  mint: PublicKey;
  /**
   * Token name (as specified in collateral infos)
   */
  name: string;
}

export interface KaminoPrices {
  spot: EnrichedScopePrice[];
  twap: EnrichedScopePrice[];
}

export interface OraclePricesAndCollateralInfos {
  oraclePrices: OraclePrices;
  collateralInfos: CollateralInfo[];
}
