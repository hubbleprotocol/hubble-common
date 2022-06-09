import { getConfigByCluster, HubbleConfig, SolanaCluster } from '@hubbleprotocol/hubble-config';
import { Connection } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { OraclePrices } from './accounts';
import { setProgramId } from './programId';
import { Price } from './types';

export type SupportedToken =
  | 'SOL'
  | 'ETH'
  | 'BTC'
  | 'SRM'
  | 'RAY'
  | 'FTT'
  | 'MSOL'
  | 'UST'
  | 'BNB'
  | 'AVAX'
  | 'STSOLUST'
  | 'SABERMSOLSOL'
  | 'USDHUSD'
  | 'STSOLUSD'
  | 'CSOL'
  | 'CETH'
  | 'CBTC'
  | 'CMSOL'
  | 'SCNSOL';

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
    { id: 0, name: 'SOL', price: new Decimal(0) },
    { id: 1, name: 'ETH', price: new Decimal(0) },
    { id: 2, name: 'BTC', price: new Decimal(0) },
    { id: 3, name: 'SRM', price: new Decimal(0) },
    { id: 4, name: 'RAY', price: new Decimal(0) },
    { id: 5, name: 'FTT', price: new Decimal(0) },
    { id: 6, name: 'MSOL', price: new Decimal(0) },
    { id: 7, name: 'UST', price: new Decimal(0) },
    { id: 8, name: 'BNB', price: new Decimal(0) },
    { id: 9, name: 'AVAX', price: new Decimal(0) },
    { id: 10, name: 'STSOLUST', price: new Decimal(0) },
    { id: 11, name: 'SABERMSOLSOL', price: new Decimal(0) },
    { id: 12, name: 'USDHUSD', price: new Decimal(0) },
    { id: 13, name: 'STSOLUSD', price: new Decimal(0) },
    { id: 14, name: 'CSOL', price: new Decimal(0) },
    { id: 15, name: 'CETH', price: new Decimal(0) },
    { id: 16, name: 'CBTC', price: new Decimal(0) },
    { id: 17, name: 'CMSOL', price: new Decimal(0) },
    { id: 18, name: 'SCNSOL', price: new Decimal(0) },
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
