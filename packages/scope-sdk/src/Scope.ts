import { getConfigByCluster, HubbleConfig, SolanaCluster } from '@hubbleprotocol/hubble-config';
import {
  AccountMeta,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  Transaction,
} from '@solana/web3.js';
import Decimal from 'decimal.js';
import { Configuration, OracleMappings, OraclePrices } from './accounts';
import { OracleType, OracleTypeKind, Price } from './types';
import { U16_MAX } from './constants';
import * as ScopeIx from './instructions';
import { Provider, Wallet } from '@project-serum/anchor';
import {
  getConfigurationPda,
  ORACLE_MAPPINGS_LEN,
  TOKEN_METADATAS_LEN,
  ORACLE_PRICES_LEN,
  ORACLE_TWAPS_LEN,
  getJlpMintPda,
  JLP_PROGRAM_ID,
  getMintsToScopeChainPda,
} from './utils';
import { FeedParam, PricesParam, validateFeedParam, validatePricesParam } from './model';
import { GlobalConfig, WhirlpoolStrategy } from './@codegen/kamino/accounts';
import { Custody, Pool } from './@codegen/jupiter-perps/accounts';

export type ScopeDatedPrice = {
  price: Decimal;
  timestamp: Decimal;
};

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
  public static getPriceFromScopeChain(chain: Array<number>, prices: OraclePrices): ScopeDatedPrice {
    // Protect from bad defaults
    if (chain.every((tokenId) => tokenId === 0)) {
      throw new Error('Token chain cannot be all 0s');
    }
    // Protect from bad defaults
    const filteredChain = chain.filter((tokenId) => tokenId !== U16_MAX);
    if (filteredChain.length === 0) {
      throw new Error(`Token chain cannot be all ${U16_MAX}s (u16 max)`);
    }
    let oldestTimestamp = new Decimal('0');
    const priceChain = filteredChain.map((tokenId) => {
      const datedPrice = prices.prices[tokenId];
      if (!datedPrice) {
        throw Error(`Could not get price for token ${tokenId}`);
      }
      const currentPxTs = new Decimal(datedPrice.unixTimestamp.toString());
      if (oldestTimestamp.eq(new Decimal('0'))) {
        oldestTimestamp = currentPxTs;
      } else if (!currentPxTs.eq(new Decimal('0'))) {
        oldestTimestamp = Decimal.min(oldestTimestamp, currentPxTs);
      }
      const priceInfo = datedPrice.price;
      return Scope.priceToDecimal(priceInfo);
    });

    if (priceChain.length === 1) {
      return {
        price: priceChain[0],
        timestamp: oldestTimestamp,
      };
    }

    // Compute token value by multiplying all values of the chain
    const pxFromChain = priceChain.reduce((acc, price) => acc.mul(price), new Decimal(1));
    return {
      price: pxFromChain,
      timestamp: oldestTimestamp,
    };
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
  async getPriceFromChain(chain: Array<number>, oraclePrices?: OraclePrices): Promise<ScopeDatedPrice> {
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
        oracleTwaps: PublicKey;
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
    const tokenMetadatas = Keypair.generate();
    const createTokenMetadatasIx = SystemProgram.createAccount({
      fromPubkey: admin.publicKey,
      newAccountPubkey: tokenMetadatas.publicKey,
      lamports: await this._connection.getMinimumBalanceForRentExemption(TOKEN_METADATAS_LEN),
      space: TOKEN_METADATAS_LEN,
      programId: this._config.scope.programId,
    });
    const oracleTwaps = Keypair.generate();
    const createOracleTwapsIx = SystemProgram.createAccount({
      fromPubkey: admin.publicKey,
      newAccountPubkey: oracleTwaps.publicKey,
      lamports: await this._connection.getMinimumBalanceForRentExemption(ORACLE_TWAPS_LEN),
      space: ORACLE_TWAPS_LEN,
      programId: this._config.scope.programId,
    });
    const initScopeIx = ScopeIx.initialize(
      { feedName: feed },
      {
        admin: admin.publicKey,
        configuration: config,
        oracleMappings: oracleMappings.publicKey,
        oracleTwaps: oracleTwaps.publicKey,
        tokenMetadatas: tokenMetadatas.publicKey,
        oraclePrices: oraclePrices.publicKey,
        systemProgram: SystemProgram.programId,
      },
      this._config.scope.programId
    );
    const provider = new Provider(this._connection, new Wallet(admin), {
      commitment: this._connection.commitment,
    });
    const sig = await provider.send(
      new Transaction().add(
        ...[createOraclePricesIx, createOracleMappingsIx, createOracleTwapsIx, createTokenMetadatasIx, initScopeIx]
      ),
      [admin, oraclePrices, oracleMappings, oracleTwaps, tokenMetadatas]
    );
    return [
      sig,
      {
        configuration: config,
        oracleMappings: oracleMappings.publicKey,
        oraclePrices: oraclePrices.publicKey,
        oracleTwaps: oracleTwaps.publicKey,
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
   * @param twapEnabled
   * @param twapSource
   */
  async updateFeedMapping(
    admin: Keypair,
    feed: string,
    index: number,
    oracleType: OracleTypeKind,
    mapping: PublicKey,
    twapEnabled: boolean = false,
    twapSource: number = 0,
    refPriceIndex: number = 65_535,
    genericData: Array<number> = Array(20).fill(0)
  ): Promise<string> {
    const [config, configAccount] = await this.getFeedConfiguration({ feed });
    const updateIx = ScopeIx.updateMapping(
      {
        feedName: feed,
        token: index,
        priceType: oracleType.discriminator,
        twapEnabled,
        twapSource,
        refPriceIndex,
        genericData,
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
        oracleTwaps: configAccount.oracleTwaps,
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
        ...(await Scope.getRefreshAccounts(
          this._connection,
          configAccount,
          this._config.kamino.programId,
          mappings,
          token
        ))
      );
    }
    return provider.send(new Transaction().add(refreshIx), [payer]);
  }

  async refreshPriceListIx(feed: FeedParam, tokens: number[]) {
    const [, configAccount] = await this.getFeedConfiguration(feed);

    const refreshIx = ScopeIx.refreshPriceList(
      {
        tokens,
      },
      {
        oracleMappings: configAccount.oracleMappings,
        oraclePrices: configAccount.oraclePrices,
        oracleTwaps: configAccount.oracleTwaps,
        instructionSysvarAccountInfo: SYSVAR_INSTRUCTIONS_PUBKEY,
      },
      this._config.scope.programId
    );
    const mappings = await this.getOracleMappings(feed);
    for (const token of tokens) {
      refreshIx.keys.push(
        ...(await Scope.getRefreshAccounts(
          this._connection,
          configAccount,
          this._config.kamino.programId,
          mappings,
          token
        ))
      );
    }
    return refreshIx;
  }

  static async getRefreshAccounts(
    connection: Connection,
    configAccount: Configuration,
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
      case new OracleType.KToken().discriminator: {
        keys.push(...(await Scope.getKTokenRefreshAccounts(connection, kaminoProgramId, mappings, token)));
        return keys;
      }
      case new OracleType.JupiterLpFetch().discriminator: {
        const lpMint = getJlpMintPda(mappings.priceInfoAccounts[token]);
        keys.push({
          isSigner: false,
          isWritable: false,
          pubkey: lpMint,
        });
        return keys;
      }
      case new OracleType.JupiterLpCompute().discriminator: {
        const lpMint = getJlpMintPda(mappings.priceInfoAccounts[token]);

        const jlpRefreshAccounts = await this.getJlpRefreshAccounts(
          connection,
          configAccount,
          mappings,
          token,
          'compute'
        );

        jlpRefreshAccounts.unshift({
          isSigner: false,
          isWritable: false,
          pubkey: lpMint,
        });

        return keys;
      }
      case new OracleType.JupiterLpScope().discriminator: {
        const lpMint = getJlpMintPda(mappings.priceInfoAccounts[token]);

        const jlpRefreshAccounts = await this.getJlpRefreshAccounts(
          connection,
          configAccount,
          mappings,
          token,
          'compute'
        );

        jlpRefreshAccounts.unshift({
          isSigner: false,
          isWritable: false,
          pubkey: lpMint,
        });

        return keys;
      }
      default: {
        return keys;
      }
    }
  }

  static async getJlpRefreshAccounts(
    connection: Connection,
    configAccount: Configuration,
    mappings: OracleMappings,
    token: number,
    fetchingMechanism: 'compute' | 'scope'
  ): Promise<AccountMeta[]> {
    const pool = await Pool.fetch(connection, mappings.priceInfoAccounts[token], JLP_PROGRAM_ID);
    if (!pool) {
      throw Error(
        `Could not get Jupiter pool ${mappings.priceInfoAccounts[token].toBase58()} to refresh token index ${token}`
      );
    }

    const extraAccounts: AccountMeta[] = [];

    if (fetchingMechanism === 'scope') {
      const mintsToScopeChain = getMintsToScopeChainPda(
        configAccount.oraclePrices,
        configAccount.oracleMappings,
        token
      );

      extraAccounts.push({
        isSigner: false,
        isWritable: false,
        pubkey: mintsToScopeChain,
      });
    }

    extraAccounts.concat(
      pool.custodies.map((custody) => {
        return {
          isSigner: false,
          isWritable: false,
          pubkey: custody,
        };
      })
    );

    if (fetchingMechanism === 'compute') {
      for (let custodyPk of pool.custodies) {
        const custody = await Custody.fetch(connection, custodyPk, JLP_PROGRAM_ID);

        if (!custody) {
          throw Error(`Could not get Jupiter custody ${custodyPk.toBase58()} to refresh token index ${token}`);
        }

        extraAccounts.push({
          isSigner: false,
          isWritable: false,
          pubkey: custody.oracle.oracleAccount,
        });
      }
    }

    return extraAccounts;
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
