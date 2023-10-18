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
import { mintToScopeToken, scopeTokenToMint, SupportedToken, U16_MAX } from './constants';
import { ScopeToken } from './ScopeToken';
import * as ScopeIx from './instructions';
import { Provider, Wallet } from '@project-serum/anchor';
import { getConfigurationPda, ORACLE_MAPPINGS_LEN, ORACLE_PRICES_LEN } from './utils';
import BN from 'bn.js';
import { FeedParam, PricesParam, validateFeedParam, validatePricesParam } from './model';

export class Scope {
  private readonly _cluster: SolanaCluster;
  private readonly _connection: Connection;
  private readonly _config: HubbleConfig;

  private _tokens: ScopeToken[] = [
    { id: 0, pair: 'SOL/USD', name: 'SOL', price: new Decimal(0) },
    { id: 1, pair: 'ETH/USD', name: 'ETH', price: new Decimal(0) },
    { id: 2, pair: 'BTC/USD', name: 'BTC', price: new Decimal(0) },
    { id: 2, pair: 'wBTC/USD', name: 'wBTC', price: new Decimal(0) },
    { id: 2, pair: 'tBTC/USD', name: 'tBTC', price: new Decimal(0) }, // use the same scope ID as wBTC
    { id: 3, pair: 'SRM/USD', name: 'SRM', price: new Decimal(0) },
    { id: 4, pair: 'RAY/USD', name: 'RAY', price: new Decimal(0) },
    { id: 5, pair: 'FTT/USD', name: 'FTT', price: new Decimal(0) },
    { id: 6, pair: 'MSOL/USD', name: 'MSOL', price: new Decimal(0) },
    { id: 7, pair: 'scnSOL/SOL', name: 'scnSOL', price: new Decimal(0), nonUsdPairId: 0 },
    { id: 8, pair: 'BNB/USD', name: 'BNB', price: new Decimal(0) },
    { id: 9, pair: 'AVAX/USD', name: 'AVAX', price: new Decimal(0) },
    { id: 10, pair: 'daoSOL/SOL', name: 'daoSOL', price: new Decimal(0), nonUsdPairId: 0 },
    { id: 12, pair: 'USDH/USD', name: 'USDH', price: new Decimal(0) },
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
    { id: 26, pair: 'cORCA/ORCA', name: 'cORCA', price: new Decimal(0), nonUsdPairId: 23 },
    { id: 27, pair: 'cSLND/SLND', name: 'cSLND', price: new Decimal(0), nonUsdPairId: 32 },
    { id: 28, pair: 'cSRM/SRM', name: 'cSRM', price: new Decimal(0), nonUsdPairId: 3 },
    { id: 29, pair: 'cRAY/RAY', name: 'cRAY', price: new Decimal(0), nonUsdPairId: 4 },
    { id: 30, pair: 'cFTT/FTT', name: 'cFTT', price: new Decimal(0), nonUsdPairId: 5 },
    { id: 31, pair: 'cSTSOL/STSOL', name: 'cSTSOL', price: new Decimal(0), nonUsdPairId: 13 },
    { id: 32, pair: 'SLND/USD', name: 'SLND', price: new Decimal(0) },
    { id: 33, pair: 'DAI/USD', name: 'DAI', price: new Decimal(0) },
    { id: 34, pair: 'JSOL/SOL', name: 'JSOL', price: new Decimal(0), nonUsdPairId: 0 },
    { id: 35, pair: 'USH/USD', name: 'USH', price: new Decimal(0) },
    { id: 36, pair: 'UXD/USD', name: 'UXD', price: new Decimal(0) },
    { id: 37, pair: 'USDHTwap/USD', name: 'USDHTwap', price: new Decimal(0) },
    { id: 38, pair: 'USHTwap/USD', name: 'USHTwap', price: new Decimal(0) },
    { id: 39, pair: 'UXDTwap/USD', name: 'UXDTwap', price: new Decimal(0) },
    { id: 40, pair: 'HDG/USD', name: 'HDG', price: new Decimal(0) },
    { id: 41, pair: 'DUST/USD', name: 'DUST', price: new Decimal(0) },
    { id: 42, pair: 'kUSDHUSDCOrca/USD', name: 'kUSDHUSDCOrca', price: new Decimal(0) },
    { id: 43, pair: 'kSOLSTSOLOrca/USD', name: 'kSOLSTSOLOrca', price: new Decimal(0) },
    { id: 44, pair: 'kUSDCUSDTOrca/USD', name: 'kUSDCUSDTOrca', price: new Decimal(0) },
    { id: 45, pair: 'kUSHUSDCOrca/USD', name: 'kUSHUSDCOrca', price: new Decimal(0) },
    { id: 46, pair: 'USDR/USD', name: 'USDR', price: new Decimal(0) },
    { id: 47, pair: 'USDRTwap/USD', name: 'USDRTwap', price: new Decimal(0) },
    { id: 48, pair: 'RATIO/USD', name: 'RATIO', price: new Decimal(0) },
    { id: 49, pair: 'UXP/USD', name: 'UXP', price: new Decimal(0) },
    { id: 50, pair: 'kUXDUSDCOrca/USD', name: 'kUXDUSDCOrca', price: new Decimal(0) },
    { id: 51, pair: 'JITOSOL/SOL', name: 'JITOSOL', price: new Decimal(0), nonUsdPairId: 0 },
    { id: 52, pair: 'SOLEma/USD', name: 'SOLEma', price: new Decimal(0) },
    { id: 53, pair: 'ETHEma/USD', name: 'ETHEma', price: new Decimal(0) },
    { id: 54, pair: 'BTCEma/USD', name: 'BTCEma', price: new Decimal(0) },
    { id: 55, pair: 'SRMEma/USD', name: 'SRMEma', price: new Decimal(0) },
    { id: 56, pair: 'RAYEma/USD', name: 'RAYEma', price: new Decimal(0) },
    { id: 57, pair: 'FTTEma/USD', name: 'FTTEma', price: new Decimal(0) },
    { id: 58, pair: 'MSOLTwap/USD', name: 'MSOLTwap', price: new Decimal(0) },
    { id: 59, pair: 'BNBEma/USD', name: 'BNBEma', price: new Decimal(0) },
    { id: 60, pair: 'AVAXEma/USD', name: 'AVAXEma', price: new Decimal(0) },
    { id: 62, pair: 'USDCEma/USD', name: 'USDCEma', price: new Decimal(0) },
    { id: 63, pair: 'USDTEma/USD', name: 'USDTEma', price: new Decimal(0) },
    { id: 65, pair: 'DAIEma/USD', name: 'DAIEma', price: new Decimal(0) },
    { id: 66, pair: 'wstETHEma/USD', name: 'wstETHEma', price: new Decimal(0) },
    { id: 67, pair: 'DUSTTwap/USD', name: 'DUSTTwap', price: new Decimal(0) },
    { id: 68, pair: 'BONK/USD', name: 'BONK', price: new Decimal(0) },
    { id: 69, pair: 'BONKTwap/USD', name: 'BONKTwap', price: new Decimal(0) },
    { id: 70, pair: 'SAMO/USD', name: 'SAMO', price: new Decimal(0) },
    { id: 71, pair: 'SAMOTwap/USD', name: 'SAMOTwap', price: new Decimal(0) },
    { id: 72, pair: 'bSOL/SOL', name: 'bSOL', price: new Decimal(0), nonUsdPairId: 0 },
    { id: 73, pair: 'LaineSOL/SOL', name: 'LaineSOL', price: new Decimal(0), nonUsdPairId: 0 },
    { id: 74, pair: 'HADES/USD', name: 'HADES', price: new Decimal(0) },
    { id: 75, pair: 'HADESTwap/USD', name: 'HADESTwap', price: new Decimal(0) },
    { id: 76, pair: 'STSOL/SOL', name: 'STSOL', price: new Decimal(0), nonUsdPairId: 0 },
    { id: 77, pair: 'STSOLTwap/USD', name: 'STSOLTwap', price: new Decimal(0), nonUsdPairId: 52 },
    { id: 78, pair: 'RLB/USD', name: 'RLB', price: new Decimal(0) },
    { id: 79, pair: 'RLBTwap/USD', name: 'RLBTwap', price: new Decimal(0) },
    { id: 80, pair: 'CGNTSOL/SOL', name: 'CGNTSOL', price: new Decimal(0), nonUsdPairId: 0 },
    { id: 81, pair: 'HXRO/USD', name: 'HXRO', price: new Decimal(0) },
    { id: 82, pair: 'HXROTwap/USD', name: 'HXROTwap', price: new Decimal(0) },
    { id: 83, pair: 'MNDETwap/USD', name: 'MNDETwap', price: new Decimal(0) },
    { id: 20, pair: 'USDC/USD', name: 'USDCet', price: new Decimal(0) },
    { id: 84, pair: 'HNT/USD', name: 'HNT', price: new Decimal(0) },
    { id: 85, pair: 'HNTEma/USD', name: 'HNTEma', price: new Decimal(0) },
    { id: 86, pair: 'MOBILE/HNT', name: 'MOBILE', price: new Decimal(0), nonUsdPairId: 84 },
    { id: 87, pair: 'MOBILETwap/HNT', name: 'MOBILETwap', price: new Decimal(0), nonUsdPairId: 85 },
    { id: 88, pair: 'IOT/HNT', name: 'IOT', price: new Decimal(0), nonUsdPairId: 84 },
    { id: 89, pair: 'IOTTwap/HNT', name: 'IOTTwap', price: new Decimal(0), nonUsdPairId: 85 },
    { id: 90, pair: 'NANA/USD', name: 'NANA', price: new Decimal(0) },
    { id: 91, pair: 'NANATwap/USD', name: 'NANATwap', price: new Decimal(0) },
    { id: 92, pair: 'STEP/USD', name: 'STEP', price: new Decimal(0) },
    { id: 93, pair: 'STEPTwap/USD', name: 'STEPTwap', price: new Decimal(0) },
    { id: 94, pair: 'FORGE/USD', name: 'FORGE', price: new Decimal(0) },
    { id: 95, pair: 'FORGETwap/USD', name: 'FORGETwap', price: new Decimal(0) },
    { id: 96, pair: 'COCO/USD', name: 'COCO', price: new Decimal(0) },
    { id: 97, pair: 'COCOTwap/USD', name: 'COCOTwap', price: new Decimal(0) },
    { id: 98, pair: 'STYLE/USD', name: 'STYLE', price: new Decimal(0) },
    { id: 99, pair: 'STYLETwap/USD', name: 'STYLETwap', price: new Decimal(0) },
    { id: 100, pair: 'CHAI/USD', name: 'CHAI', price: new Decimal(0) },
    { id: 101, pair: 'CHAITwap/USD', name: 'CHAITwap', price: new Decimal(0) },
    { id: 102, pair: 'T/USD', name: 'T', price: new Decimal(0) },
    { id: 103, pair: 'TTwap/USD', name: 'TTwap', price: new Decimal(0) },
    { id: 104, pair: 'BLZE/USD', name: 'BLZE', price: new Decimal(0) },
    { id: 105, pair: 'BLZETwap/USD', name: 'BLZETwap', price: new Decimal(0) },
    { id: 106, pair: 'EUROE/USD', name: 'EUROE', price: new Decimal(0) },
    { id: 107, pair: 'EUROETwap/USD', name: 'EUROETwap', price: new Decimal(0) },
    { id: 108, pair: 'kSOLBSOLOrca/USD', name: 'kSOLBSOLOrca', price: new Decimal(0) },
    { id: 109, pair: 'kMNDEMSOLOrca/USD', name: 'kMNDEMSOLOrca', price: new Decimal(0) },
    { id: 110, pair: 'kSTSOLUSDCOrca/USD', name: 'kSTSOLUSDCOrca', price: new Decimal(0) },
    { id: 111, pair: 'kUSDHUSDTOrca/USD', name: 'kUSDHUSDTOrca', price: new Decimal(0) },
    { id: 112, pair: 'kSOLJITOSOLOrca/USD', name: 'kSOLJITOSOLOrca', price: new Decimal(0) },
    { id: 113, pair: 'kbSOLMSOLOrca/USD', name: 'kbSOLMSOLOrca', price: new Decimal(0) },
    { id: 114, pair: 'kMSOLJITOSOLOrca/USD', name: 'kMSOLJITOSOLOrca', price: new Decimal(0) },
    { id: 115, pair: 'kSOLUSDCOrca/USD', name: 'kSOLUSDCOrca', price: new Decimal(0) },
    { id: 116, pair: 'kJITOSOLUSDCOrca/USD', name: 'kJITOSOLUSDCOrca', price: new Decimal(0) },
    { id: 117, pair: 'LST/SOL', name: 'LST', price: new Decimal(0), nonUsdPairId: 0 },
    { id: 118, pair: 'kSOLJITOSOLRaydium/USD', name: 'kSOLJITOSOLRaydium', price: new Decimal(0) },
    { id: 119, pair: 'kSOLMSOLRaydium/USD', name: 'kSOLMSOLRaydium', price: new Decimal(0) },
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

    const mint = scopeTokenToMint(token, this._cluster);
    tokenInfo.mint = mint ? new PublicKey(mint) : undefined;

    return tokenInfo;
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
   * Get prices of the specified token mints
   * @param mints list of token mints
   */
  async getPricesByMints(mints: (string | PublicKey)[]) {
    const prices: ScopeToken[] = [];
    const oraclePrices = await this.getOraclePrices();
    for (const mint of mints) {
      const token = mintToScopeToken(mint.toString(), this._cluster);
      if (!token) {
        throw Error(`Could not map mint ${mint} to a Scope token. Is the mint mapping missing?`);
      }
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
   * Get all mappings of the supported tokens
   */
  getMappings(): ScopeToken[] {
    return this._tokens;
  }

  /**
   * Get USD price of the specified token
   * @param token name of the token
   */
  async getPrice(token: SupportedToken) {
    const oraclePrices = await this.getOraclePrices();
    return this.getSinglePrice(token, oraclePrices);
  }

  /**
   * Get USD price of the specified token mint
   * @param mint token mint pubkey
   */
  async getPriceByMint(mint: PublicKey | string) {
    const token = mintToScopeToken(mint.toString(), this._cluster);
    if (!token) {
      throw Error(`Could not map mint ${mint} to a Scope token. Is the mint mapping missing?`);
    }
    return this.getPrice(token);
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
