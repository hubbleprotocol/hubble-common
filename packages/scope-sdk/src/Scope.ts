import { getConfigByCluster, HubbleConfig, SolanaCluster } from '@hubbleprotocol/hubble-config';
import { Connection } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { OraclePrices } from './accounts';
import { setProgramId } from './programId';
import { Price } from './types';

export type ScopePair =
  | 'SOL/USD'
  | 'ETH/USD'
  | 'BTC/USD'
  | 'SRM/USD'
  | 'RAY/USD'
  | 'FTT/USD'
  | 'MSOL/USD'
  | 'scnSOL/SOL'
  | 'BNB/USD'
  | 'AVAX/USD'
  | 'daoSOL/SOL'
  | 'SaberMSOL/SOL'
  | 'USDH/USD'
  | 'STSOL/USD'
  | 'cSOL/SOL'
  | 'cETH/ETH'
  | 'cBTC/BTC'
  | 'cMSOL/MSOL'
  | 'stETH/USD'
  | 'wstETH/USD'
  | 'LDO/USD'
  | 'USDC/USD'
  | 'cUSDC/USDC'
  | 'USDT/USD'
  | 'ORCA/USD'
  | 'MNDE/USD'
  | 'HBB/USD';

export type SupportedToken =
  | 'SOL'
  | 'ETH'
  | 'BTC'
  | 'SRM'
  | 'RAY'
  | 'FTT'
  | 'MSOL'
  | 'scnSOL'
  | 'BNB'
  | 'AVAX'
  | 'daoSOL'
  | 'SaberMSOL'
  | 'USDH'
  | 'STSOL'
  | 'cSOL'
  | 'cETH'
  | 'cBTC'
  | 'cMSOL'
  | 'stETH'
  | 'wstETH'
  | 'LDO'
  | 'USDC'
  | 'cUSDC'
  | 'USDT'
  | 'ORCA'
  | 'MNDE'
  | 'HBB';

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

export class Scope {
  private readonly _cluster: SolanaCluster;
  private readonly _connection: Connection;
  private readonly _config: HubbleConfig;

  private _tokens: ScopeToken[] = [
    { id: 0, pair: 'SOL/USD', name: 'SOL', price: new Decimal(0) },
    { id: 1, pair: 'ETH/USD', name: 'ETH', price: new Decimal(0) },
    { id: 2, pair: 'BTC/USD', name: 'BTC', price: new Decimal(0) },
    { id: 3, pair: 'SRM/USD', name: 'SRM', price: new Decimal(0) },
    { id: 4, pair: 'RAY/USD', name: 'RAY', price: new Decimal(0) },
    { id: 5, pair: 'FTT/USD', name: 'FTT', price: new Decimal(0) },
    { id: 6, pair: 'MSOL/USD', name: 'MSOL', price: new Decimal(0) },
    { id: 7, pair: 'scnSOL/SOL', name: 'scnSOL', price: new Decimal(0), nonUsdPairId: 0 },
    { id: 8, pair: 'BNB/USD', name: 'BNB', price: new Decimal(0) },
    { id: 9, pair: 'AVAX/USD', name: 'AVAX', price: new Decimal(0) },
    { id: 10, pair: 'daoSOL/SOL', name: 'daoSOL', price: new Decimal(0), nonUsdPairId: 0 },
    { id: 11, pair: 'SaberMSOL/SOL', name: 'SaberMSOL', price: new Decimal(0), nonUsdPairId: 0 },
    { id: 12, pair: 'USDH/USD', name: 'USDH', price: new Decimal(0) },
    { id: 13, pair: 'STSOL/USD', name: 'STSOL', price: new Decimal(0) },
    { id: 14, pair: 'cSOL/SOL', name: 'cSOL', price: new Decimal(0), nonUsdPairId: 0 },
    { id: 15, pair: 'cETH/ETH', name: 'cETH', price: new Decimal(0), nonUsdPairId: 1 },
    { id: 16, pair: 'cBTC/BTC', name: 'cBTC', price: new Decimal(0), nonUsdPairId: 2 },
    { id: 17, pair: 'cMSOL/MSOL', name: 'cMSOL', price: new Decimal(0), nonUsdPairId: 6 },
    { id: 18, pair: 'wstETH/USD', name: 'wstETH', price: new Decimal(0) },
    { id: 19, pair: 'LDO/USD', name: 'LDO', price: new Decimal(0) },
    { id: 20, pair: 'USDC/USD', name: 'USDC', price: new Decimal(0) },
    { id: 21, pair: 'cUSDC/USDC', name: 'cUSDC', price: new Decimal(0), nonUsdPairId: 20 },
    { id: 22, pair: 'USDT/USD', name: 'USDT', price: new Decimal(0) },
    { id: 23, pair: 'ORCA/USD', name: 'ORCA', price: new Decimal(0) },
    { id: 24, pair: 'MNDE/USD', name: 'MNDE', price: new Decimal(0) },
    { id: 25, pair: 'HBB/USD', name: 'HBB', price: new Decimal(0) },
  ];

  /**
   * Create a new instance of the Scope SDK class.
   * @param cluster Name of the Solana cluster
   * @param connection Connection to the Solana cluster
   */
  constructor(cluster: SolanaCluster, connection: Connection) {
    this._cluster = cluster;
    this._connection = connection;
    this._config = getConfigByCluster(cluster);
    setProgramId(this._config.scope.programId);
  }

  private async getSinglePrice(token: SupportedToken, prices: OraclePrices) {
    const tokenInfo = this._tokens.find((x) => x.name === token);
    if (!tokenInfo) {
      throw Error(`Could not get price for ${token} - not supported`);
    }

    const priceInfo = prices.prices[tokenInfo.id].price;
    tokenInfo.price = Scope.priceToDecimal(priceInfo);
    if (tokenInfo.nonUsdPairId !== undefined) {
      const pairPrice = Scope.priceToDecimal(prices.prices[tokenInfo.nonUsdPairId].price);
      tokenInfo.price = tokenInfo.price.mul(pairPrice);
    }

    return tokenInfo;
  }

  private static priceToDecimal(price: Price) {
    return new Decimal(price.value.toString()).mul(new Decimal(10).pow(new Decimal(-price.exp.toString())));
  }

  private async getOraclePrices() {
    const prices = await OraclePrices.fetch(this._connection, this._config.scope.oraclePrices);
    if (!prices) {
      throw Error(`Could not get scope oracle prices`);
    }
    return prices;
  }

  /**
   * Get prices of the specified tokens
   * @param tokens list of names of the token
   */
  async getPrices(tokens: SupportedToken[]) {
    const prices: ScopeToken[] = [];
    const oraclePrices = await this.getOraclePrices();
    for (const token of tokens) {
      prices.push(await this.getSinglePrice(token, oraclePrices));
    }
    return prices;
  }

  /**
   * Get all prices of the supported tokens
   */
  async getAllPrices() {
    return this.getPrices(this._tokens.map((x) => x.name));
  }

  /**
   * Get price of the specified token
   * @param token name of the token
   */
  async getPrice(token: SupportedToken) {
    const oraclePrices = await this.getOraclePrices();
    return this.getSinglePrice(token, oraclePrices);
  }
}

export default Scope;
