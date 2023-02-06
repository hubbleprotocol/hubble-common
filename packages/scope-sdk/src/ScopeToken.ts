import { ScopePair, SupportedToken } from './constants';
import Decimal from 'decimal.js';

export interface ScopeToken {
  /**
   * Scope collateral token pair name
   */
  pair: ScopePair;
  /**
   * Collateral token name
   */
  name: SupportedToken;
  /**
   * Scope token pair ID
   */
  id: number;
  /**
   * Current price of collateral token in USD or USDC - it will always be calculated as usd or usdc
   */
  price: Decimal;

  /**
   * If the Scope collateral pair isn't in USD or USDC, we need to multiply by this collateral token.
   * For example scnSOL/SOL will have this ID set to the SOL/USD pair.
   */
  nonUsdPairId?: number;
}
