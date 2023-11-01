import Decimal from 'decimal.js';

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

export interface HubblePrices {
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
