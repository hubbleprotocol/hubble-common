import { ScopePair, SupportedToken } from './constants';
import Decimal from 'decimal.js';
import { PublicKey } from '@solana/web3.js';

/**
 * @deprecated Deprecated since version 2.2.47 - please use {@link getOraclePrices} or the respective SDK client instead.
 * @see [hubble-sdk]{@link https://github.com/hubbleprotocol/hubble-common/blob/0512e85c5a816a557fe7feaf55981cabcd992476/packages/hubble-sdk/src/Hubble.ts#L722} getAllPrices method
 * @see [kamino-sdk]{@link https://github.com/hubbleprotocol/hubble-common/blob/0be269d4fdb3dbadbbd8c7fcca68c6b1928d445a/packages/kamino-sdk/src/Kamino.ts#L1717} getAllPrices method
 * @see [kamino-lending-sdk]{@link https://github.com/hubbleprotocol/kamino-lending-sdk/blob/17a48b6bb21945d2d799d31d6f0b20104e8c83ac/src/classes/market.ts#L759} getAllScopePrices method
 * @description Scope token
 */
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

  /**
   * Collateral token mint pubkey
   */
  mint?: PublicKey;
}
