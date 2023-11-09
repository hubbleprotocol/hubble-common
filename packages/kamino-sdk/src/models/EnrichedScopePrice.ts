import Decimal from 'decimal.js';
import { OraclePrices } from '@hubbleprotocol/scope-sdk';
import { CollateralInfo } from '../kamino-client/types';

export interface EnrichedScopePrice {
  /**
   * Price in USD
   */
  price: Decimal;
  /**
   * Token name (as specified in collateral infos)
   */
  name: string;
}

export interface KaminoPrices {
  /**
   * Spot prices where record key is token mint and value is enriched scope price
   */
  spot: MintToPriceMap;
  /**
   * Twap prices where record key is token mint and value is enriched scope price
   */
  twap: MintToPriceMap;
}

export type MintToPriceMap = Record<string, EnrichedScopePrice>;

export interface OraclePricesAndCollateralInfos {
  oraclePrices: OraclePrices;
  collateralInfos: CollateralInfo[];
}
