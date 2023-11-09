import { getConfigByCluster, HubbleConfig, SolanaCluster } from '@hubbleprotocol/hubble-config';
import {
  AccountMeta,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import Decimal from 'decimal.js';
import { Configuration, GlobalConfig, OracleMappings, OraclePrices, WhirlpoolStrategy } from './accounts';
import { OracleType, OracleTypeKind, Price } from './types';
import { U16_MAX } from './constants';
import * as ScopeIx from './instructions';
import { Provider, Wallet } from '@project-serum/anchor';
import { getConfigurationPda, ORACLE_MAPPINGS_LEN, ORACLE_PRICES_LEN } from './utils';
import BN from 'bn.js';
import { FeedParam, PricesParam, validateFeedParam, validatePricesParam } from './model';

export class Scope {
  private readonly _connection: Connection;
  private readonly _config: HubbleConfig;

  /**
   * Create a new instance of the Scope SDK class.
   * @param cluster Name of the Solana cluster
   * @param connection Connection to the Solana cluster
   */
  constructor(cluster: SolanaCluster, connection: Connection) {
    this._connection = connection;
    this._config = getConfigByCluster(cluster);
  }

  private static priceToDecimal(price: Price) {
    return new Decimal(price.value.toString()).mul(new Decimal(10).pow(new Decimal(-price.exp.toString())));
  }

  /**
   * Get the deserialised OraclePrices account for a given feed
   * @param feed - either the feed PDA seed or the configuration account address
   * @returns OraclePrices
   */
  async getOraclePrices(feed?: PricesParam): Promise<OraclePrices> {
    validatePricesParam(feed);
    let oraclePrices: PublicKey;
    if (feed?.feed || feed?.config) {
      const [, configAccount] = await this.getFeedConfiguration(feed);
      oraclePrices = configAccount.oraclePrices;
    } else if (feed?.prices) {
      oraclePrices = feed.prices;
    } else {
      oraclePrices = this._config.scope.oraclePrices;
    }
    const prices = await OraclePrices.fetch(this._connection, oraclePrices, this._config.scope.programId);
    if (!prices) {
      throw Error(`Could not get scope oracle prices`);
    }
    return prices;
  }

  /**
   * Get the deserialised OraclePrices accounts for a given `OraclePrices` account pubkeys
   * Optimised to filter duplicate keys from the network request but returns the same size response as requested in the same order
   * @throws Error if any of the accounts cannot be fetched
   * @param prices - public keys of the `OraclePrices` accounts
   * @returns [PublicKey, OraclePrices][]
   */
  async getMultipleOraclePrices(prices: PublicKey[]): Promise<[PublicKey, OraclePrices][]> {
    const priceStrings = prices.map((price) => price.toBase58());
    const uniqueScopePrices = [...new Set(priceStrings)].map((value) => new PublicKey(value));
    if (uniqueScopePrices.length === 1) {
      return [[uniqueScopePrices[0], await this.getOraclePrices({ prices: uniqueScopePrices[0] })]];
    }
    const oraclePrices = await OraclePrices.fetchMultiple(
      this._connection,
      uniqueScopePrices,
      this._config.scope.programId
    );
    const oraclePricesMap: Record<string, OraclePrices> = oraclePrices
      .map((price, i) => {
        if (price === null) {
          throw Error(`Could not get scope oracle prices for ${uniqueScopePrices[i].toBase58()}`);
        }
        return price;
      })
      .reduce((map, price, i) => {
        map[uniqueScopePrices[i].toBase58()] = price;
        return map;
      }, {});
    return prices.map((price) => [price, oraclePricesMap[price.toBase58()]]);
  }

  /**
   * Get the deserialised Configuration account for a given feed
   * @param feedParam - either the feed PDA seed or the configuration account address
   * @returns [configuration account address, deserialised configuration]
   */
  async getFeedConfiguration(feedParam?: FeedParam): Promise<[PublicKey, Configuration]> {
    validateFeedParam(feedParam);
    const { feed, config } = feedParam || {};
    let configPubkey: PublicKey;
    if (feed) {
      configPubkey = getConfigurationPda(feed);
    } else if (config) {
      configPubkey = config;
    } else {
      configPubkey = this._config.scope.configurationAccount;
    }
    const configAccount = await Configuration.fetch(this._connection, configPubkey, this._config.scope.programId);
    if (!configAccount) {
      throw new Error(`Could not find configuration account for ${feed || configPubkey.toBase58()}`);
    }
    return [configPubkey, configAccount];
  }

  /**
   * Get the deserialised OracleMappings account for a given feed
   * @param feed - either the feed PDA seed or the configuration account address
   * @returns OracleMappings
   */
  async getOracleMappings(feed: FeedParam): Promise<OracleMappings> {
    const [config, configAccount] = await this.getFeedConfiguration(feed);
    const oracleMappings = await OracleMappings.fetch(
      this._connection,
      configAccount.oracleMappings,
      this._config.scope.programId
    );
    if (!oracleMappings) {
      throw Error(`Could not get scope oracle mappings account for feed ${feed}, config ${config.toBase58()}`);
    }
    return oracleMappings;
  }

  /**
   * Get the price of a token from a chain of token prices
   * @param chain
   * @param prices
   */
  public static getPriceFromScopeChain(chain: Array<number>, prices: OraclePrices) {
    // Protect from bad defaults
    if (chain.every((tokenId) => tokenId === 0)) {
      throw new Error('Token chain cannot be all 0s');
    }
    // Protect from bad defaults
    chain = chain.filter((tokenId) => tokenId !== U16_MAX);
    if (chain.length === 0) {
      throw new Error(`Token chain cannot be all ${U16_MAX}s (u16 max)`);
    }
    const priceChain = chain.map((tokenId) => {
      const datedPrice = prices.prices[tokenId];
      if (!datedPrice) {
        throw Error(`Could not get price for token ${tokenId}`);
      }
      const priceInfo = datedPrice.price;
      return Scope.priceToDecimal(priceInfo);
    });

    if (priceChain.length === 1) {
      return priceChain[0];
    }

    // Compute token value by multiplying all values of the chain
    return priceChain.reduce((acc, price) => acc.mul(price), new Decimal(1));
  }

  /**
   * Verify if the scope chain is valid
   * @param chain
   */
  public static isScopeChainValid(chain: Array<number>) {
    return !(
      chain.length === 0 ||
      chain.every((tokenId) => tokenId === 0) ||
      chain.every((tokenId) => tokenId === U16_MAX)
    );
  }

  /**
   * Get the price of a token from a chain of token prices
   * @param chain
   * @param oraclePrices
   */
  async getPriceFromChain(chain: Array<number>, oraclePrices?: OraclePrices): Promise<Decimal> {
    let prices: OraclePrices;
    if (oraclePrices) {
      prices = oraclePrices;
    } else {
      prices = await this.getOraclePrices();
    }
    return Scope.getPriceFromScopeChain(chain, prices);
  }

  /**
   * Create a new scope price feed
   * @param admin
   * @param feed
   */
  async initialise(
    admin: Keypair,
    feed: string
  ): Promise<
    [
      string,
      {
        configuration: PublicKey;
        oracleMappings: PublicKey;
        oraclePrices: PublicKey;
      },
    ]
  > {
    const config = getConfigurationPda(feed);
    const oraclePrices = Keypair.generate();
    const createOraclePricesIx = SystemProgram.createAccount({
      fromPubkey: admin.publicKey,
      newAccountPubkey: oraclePrices.publicKey,
      lamports: await this._connection.getMinimumBalanceForRentExemption(ORACLE_PRICES_LEN),
      space: ORACLE_PRICES_LEN,
      programId: this._config.scope.programId,
    });
    const oracleMappings = Keypair.generate();
    const createOracleMappingsIx = SystemProgram.createAccount({
      fromPubkey: admin.publicKey,
      newAccountPubkey: oracleMappings.publicKey,
      lamports: await this._connection.getMinimumBalanceForRentExemption(ORACLE_MAPPINGS_LEN),
      space: ORACLE_MAPPINGS_LEN,
      programId: this._config.scope.programId,
    });
    const initScopeIx = ScopeIx.initialize(
      { feedName: feed },
      {
        admin: admin.publicKey,
        configuration: config,
        oracleMappings: oracleMappings.publicKey,
        oraclePrices: oraclePrices.publicKey,
        systemProgram: SystemProgram.programId,
      },
      this._config.scope.programId
    );
    const provider = new Provider(this._connection, new Wallet(admin), {
      commitment: this._connection.commitment,
    });
    const sig = await provider.send(
      new Transaction().add(...[createOraclePricesIx, createOracleMappingsIx, initScopeIx]),
      [admin, oraclePrices, oracleMappings]
    );
    return [
      sig,
      {
        configuration: config,
        oracleMappings: oracleMappings.publicKey,
        oraclePrices: oraclePrices.publicKey,
      },
    ];
  }

  /**
   * Update the price mapping of a token
   * @param admin
   * @param feed
   * @param index
   * @param oracleType
   * @param mapping
   */
  async updateFeedMapping(
    admin: Keypair,
    feed: string,
    index: number,
    oracleType: OracleTypeKind,
    mapping: PublicKey
  ): Promise<string> {
    const [config, configAccount] = await this.getFeedConfiguration({ feed });
    const updateIx = ScopeIx.updateMapping(
      {
        feedName: feed,
        token: new BN(index),
        priceType: oracleType.discriminator,
      },
      {
        admin: admin.publicKey,
        configuration: config,
        oracleMappings: configAccount.oracleMappings,
        priceInfo: mapping,
      },
      this._config.scope.programId
    );
    const provider = new Provider(this._connection, new Wallet(admin), {
      commitment: this._connection.commitment,
    });
    return provider.send(new Transaction().add(updateIx), [admin]);
  }

  async refreshPriceList(payer: Keypair, feed: FeedParam, tokens: number[]) {
    const [, configAccount] = await this.getFeedConfiguration(feed);
    const refreshIx = ScopeIx.refreshPriceList(
      {
        tokens,
      },
      {
        oracleMappings: configAccount.oracleMappings,
        oraclePrices: configAccount.oraclePrices,
        clock: SYSVAR_CLOCK_PUBKEY,
        instructionSysvarAccountInfo: SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      this._config.scope.programId
    );
    const provider = new Provider(this._connection, new Wallet(payer), {
      commitment: this._connection.commitment,
    });
    const mappings = await this.getOracleMappings(feed);
    for (const token of tokens) {
      refreshIx.keys.push(
        ...(await Scope.getRefreshAccounts(this._connection, this._config.kamino.programId, mappings, token))
      );
    }
    return provider.send(new Transaction().add(refreshIx), [payer]);
  }

  static async getRefreshAccounts(
    connection: Connection,
    kaminoProgramId: PublicKey,
    mappings: OracleMappings,
    token: number
  ): Promise<AccountMeta[]> {
    const keys: AccountMeta[] = [];
    keys.push({
      isSigner: false,
      isWritable: false,
      pubkey: mappings.priceInfoAccounts[token],
    });
    switch (mappings.priceTypes[token]) {
      case new OracleType.KToken().discriminator:
        keys.push(...(await Scope.getKTokenRefreshAccounts(connection, kaminoProgramId, mappings, token)));
        break;
    }
    return keys;
  }

  static async getKTokenRefreshAccounts(
    connection: Connection,
    kaminoProgramId: PublicKey,
    mappings: OracleMappings,
    token: number
  ): Promise<AccountMeta[]> {
    const strategy = await WhirlpoolStrategy.fetch(connection, mappings.priceInfoAccounts[token], kaminoProgramId);
    if (!strategy) {
      throw Error(
        `Could not get Kamino strategy ${mappings.priceInfoAccounts[token].toBase58()} to refresh token index ${token}`
      );
    }
    const globalConfig = await GlobalConfig.fetch(connection, strategy.globalConfig, kaminoProgramId);
    if (!globalConfig) {
      throw Error(
        `Could not get global config for Kamino strategy ${mappings.priceInfoAccounts[
          token
        ].toBase58()} to refresh token index ${token}`
      );
    }
    return [strategy.globalConfig, globalConfig.tokenInfos, strategy.pool, strategy.position, strategy.scopePrices].map(
      (acc) => {
        return {
          isSigner: false,
          isWritable: false,
          pubkey: acc,
        };
      }
    );
  }
}

export default Scope;
