import { getConfigByCluster, HubbleConfig, SolanaCluster } from '@hubbleprotocol/hubble-config';
import { Connection } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { OraclePrices } from './accounts';
import { setProgramId } from './programId';
import { Price } from './types';

export type SupportedToken =
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
  | 'daoSOL/USDC'
  | 'SaberMSOL/SOL'
  | 'USDH/USD'
  | 'STSOL/USD'
  | 'cSOL/SOL'
  | 'cETH/ETH'
  | 'cBTC/BTC'
  | 'cMSOL/MSOL'
  | 'stETH/USD'
  | 'wstETH/USD'
  | 'LDO/USD';

export interface ScopeToken {
  name: SupportedToken;
  id: number;
  price: Decimal;
}

export class Scope {
  private readonly _cluster: SolanaCluster;
  private readonly _connection: Connection;
  private readonly _config: HubbleConfig;

  private _tokens: ScopeToken[] = [
    { id: 0, name: 'SOL/USD', price: new Decimal(0) },
    { id: 1, name: 'ETH/USD', price: new Decimal(0) },
    { id: 2, name: 'BTC/USD', price: new Decimal(0) },
    { id: 3, name: 'SRM/USD', price: new Decimal(0) },
    { id: 4, name: 'RAY/USD', price: new Decimal(0) },
    { id: 5, name: 'FTT/USD', price: new Decimal(0) },
    { id: 6, name: 'MSOL/USD', price: new Decimal(0) },
    { id: 7, name: 'scnSOL/SOL', price: new Decimal(0) },
    { id: 8, name: 'BNB/USD', price: new Decimal(0) },
    { id: 9, name: 'AVAX/USD', price: new Decimal(0) },
    { id: 10, name: 'daoSOL/USDC', price: new Decimal(0) },
    { id: 11, name: 'SaberMSOL/SOL', price: new Decimal(0) },
    { id: 12, name: 'USDH/USD', price: new Decimal(0) },
    { id: 13, name: 'STSOL/USD', price: new Decimal(0) },
    { id: 14, name: 'cSOL/SOL', price: new Decimal(0) },
    { id: 15, name: 'cETH/ETH', price: new Decimal(0) },
    { id: 16, name: 'cBTC/BTC', price: new Decimal(0) },
    { id: 17, name: 'cMSOL/MSOL', price: new Decimal(0) },
    { id: 18, name: 'wstETH/USD', price: new Decimal(0) },
    { id: 19, name: 'LDO/USD', price: new Decimal(0) },
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

  /**
   * Get price of the specified token
   * @param token name of the token
   */
  async getPrice(token: SupportedToken) {
    const tokenInfo = this._tokens.find((x) => x.name === token);
    if (!tokenInfo) {
      throw Error(`Could not get price for ${token} - not supported`);
    }

    const prices = await OraclePrices.fetch(this._connection, this._config.scope.oraclePrices);
    if (!prices) {
      throw Error(`Could not get price for ${token}`);
    }

    const priceInfo = prices.prices[tokenInfo.id].price;
    tokenInfo.price = Scope.priceToDecimal(priceInfo);

    return tokenInfo;
  }

  private static priceToDecimal(price: Price) {
    return new Decimal(price.value.toString()).mul(new Decimal(10).pow(new Decimal(-price.exp.toString())));
  }

  /**
   * Get prices of the specified tokens
   * @param tokens list of names of the token
   */
  async getPrices(tokens: SupportedToken[]) {
    const prices: ScopeToken[] = [];
    for (const token of tokens) {
      prices.push(await this.getPrice(token));
    }
    return prices;
  }

  /**
   * Get all prices of the supported tokens
   */
  async getAllPrices() {
    return this.getPrices(this._tokens.map((x) => x.name));
  }
}

export default Scope;
