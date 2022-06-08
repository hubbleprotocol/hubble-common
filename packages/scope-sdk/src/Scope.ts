import { SolanaCluster } from '@hubbleprotocol/hubble-config';
import { Connection } from '@solana/web3.js';
import Decimal from 'decimal.js';

export type SupportedToken = 'SOL' | 'ETH' | 'BTC' | 'SRM' | 'RAY' | 'FTT' | 'MSOL' | 'DAOSOL' | 'STSOL';

export interface CollateralToken {
  name: SupportedToken;
  id: number;
  price: Decimal;
}

export class Scope {
  private _cluster: SolanaCluster;
  private _connection: Connection;

  private _tokens: CollateralToken[] = [
    { id: 0, name: 'SOL', price: new Decimal(39.36) },
    { id: 1, name: 'ETH', price: new Decimal(1806.81) },
    { id: 2, name: 'BTC', price: new Decimal(30409.56) },
    { id: 3, name: 'SRM', price: new Decimal(1.03) },
    { id: 4, name: 'RAY', price: new Decimal(0.9176) },
    { id: 5, name: 'FTT', price: new Decimal(27.98) },
    { id: 6, name: 'MSOL', price: new Decimal(41.33) },
    { id: 7, name: 'DAOSOL', price: new Decimal(40.02) },
    { id: 8, name: 'STSOL', price: new Decimal(40.94) },
  ];

  /**
   * Create a new instance of the Scope SDK class.
   * @param cluster Name of the Solana cluster
   * @param connection Connection to the Solana cluster
   */
  constructor(cluster: SolanaCluster, connection: Connection) {
    this._cluster = cluster;
    this._connection = connection;
  }

  /**
   * Get price of the specified token
   * @param token name of the token
   */
  async getPrice(token: SupportedToken) {
    const priceInfo = this._tokens.find((x) => x.name === token);
    if (!priceInfo) {
      throw Error(`Could not get price for ${token} - not supported`);
    }
    return priceInfo;
  }

  /**
   * Get prices of the specified tokens
   * @param tokens list of names of the token
   */
  async getPrices(tokens: SupportedToken[]) {
    const prices: CollateralToken[] = [];
    for (const token of tokens) {
      prices.push(await this.getPrice(token));
    }
    return prices;
  }

  /**
   * Get all prices of the supported tokens
   */
  async getAllPrices() {
    return this._tokens;
  }
}

export default Scope;
