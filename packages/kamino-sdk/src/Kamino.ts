import {
  getCollateralMintByAddress,
  getConfigByCluster,
  HubbleConfig,
  SolanaCluster,
} from '@hubbleprotocol/hubble-config';
import { Connection, PublicKey } from '@solana/web3.js';
import { setKaminoProgramId } from './kamino-client/programId';
import { WhirlpoolStrategy } from './kamino-client/accounts';
import Decimal from 'decimal.js';
import { Position, Whirlpool } from './whirpools-client/accounts';
import { getMintDecimals } from '@project-serum/serum/lib/market';
import { Percentage, RemoveLiquidityQuote, RemoveLiquidityQuoteParam } from '@orca-so/whirlpool-sdk';
import { OrcaDAL } from '@orca-so/whirlpool-sdk/dist/dal/orca-dal';
import { OrcaPosition } from '@orca-so/whirlpool-sdk/dist/position/orca-position';
import { PROGRAM_ID_CLI as WHIRLPOOL_PROGRAM_ID } from './whirpools-client/programId';
import { Holdings, ShareData, StrategyBalances, StrategyVaultBalances } from './models';
import { Data } from './models/MultipleAccountsResponse';
import { StrategyHolder } from './models/StrategyHolder';
import { Scope, SupportedToken } from '@hubbleprotocol/scope-sdk';
import { KaminoToken } from './models/KaminoToken';
import { PriceData } from './models/PriceData';

export class Kamino {
  private readonly _cluster: SolanaCluster;
  private readonly _connection: Connection;
  readonly _config: HubbleConfig;
  private readonly _scope: Scope;

  private readonly _tokenMap: KaminoToken[] = [
    { name: 'USDC', id: 0 },
    { name: 'USDH', id: 1 },
    { name: 'SOL', id: 2 },
    { name: 'ETH', id: 3 },
    { name: 'BTC', id: 4 },
    { name: 'MSOL', id: 5 },
    { name: 'STSOL', id: 6 },
    { name: 'USDT', id: 7 },
    { name: 'ORCA', id: 8 },
    { name: 'MNDE', id: 9 },
    { name: 'HBB', id: 10 },
    { name: 'JSOL', id: 11 },
    { name: 'USH', id: 12 },
    { name: 'DAI', id: 13 },
    { name: 'LDO', id: 14 },
    { name: 'scnSOL', id: 15 },
    { name: 'UXD', id: 16 },
  ];

  /**
   * Create a new instance of the Kamino SDK class.
   * @param cluster Name of the Solana cluster
   * @param connection Connection to the Solana cluster
   */
  constructor(cluster: SolanaCluster, connection: Connection) {
    this._cluster = cluster;
    this._connection = connection;
    this._config = getConfigByCluster(cluster);
    this._scope = new Scope(cluster, connection);
    setKaminoProgramId(this._config.kamino.programId);
  }

  /**
   * Return a list of all Kamino whirlpool strategies
   */
  getStrategies() {
    return WhirlpoolStrategy.fetchMultiple(this._connection, this._config.kamino.strategies);
  }

  /**
   * Get a Kamino whirlpool strategy by its public key address
   * @param address
   */
  getStrategyByAddress(address: PublicKey) {
    return WhirlpoolStrategy.fetch(this._connection, address);
  }

  /**
   * Get the strategy share data (price + balances) of the specified Kamino whirlpool strategy
   * @param strategy
   */
  async getStrategyShareData(strategy: WhirlpoolStrategy): Promise<ShareData> {
    const dollarFactor = Decimal.pow(10, 6);
    const sharesIssued = new Decimal(strategy.sharesIssued.toString());
    const balances = await this.getStrategyBalances(strategy);
    if (sharesIssued.isZero()) {
      return { price: new Decimal(1), balance: balances };
    } else {
      return { price: balances.computedHoldings.totalSum.div(sharesIssued).mul(dollarFactor), balance: balances };
    }
  }

  /**
   * Get the strategy share price of the specified Kamino whirlpool strategy
   * @param strategy
   */
  async getStrategySharePrice(strategy: WhirlpoolStrategy): Promise<Decimal> {
    const dollarFactor = Decimal.pow(10, 6);
    const sharesIssued = new Decimal(strategy.sharesIssued.toString());
    const balances = await this.getStrategyBalances(strategy);
    if (sharesIssued.isZero()) {
      return new Decimal(1);
    } else {
      return balances.computedHoldings.totalSum.div(sharesIssued).mul(dollarFactor);
    }
  }

  private async getTokenAccountBalance(tokenAccount: PublicKey): Promise<Decimal> {
    const tokenAccountBalance = await this._connection.getTokenAccountBalance(tokenAccount);
    if (!tokenAccountBalance.value) {
      throw new Error(`Could not get token account balance for ${tokenAccount.toString()}.`);
    }
    return new Decimal(tokenAccountBalance.value.uiAmountString!);
  }

  private async getStrategyBalances(strategy: WhirlpoolStrategy) {
    const whirlpool = await Whirlpool.fetch(this._connection, strategy.whirlpool);
    const position = await Position.fetch(this._connection, strategy.position);

    if (!position) {
      throw new Error(`Position ${strategy.position.toString()} could not be found.`);
    }
    if (!whirlpool) {
      throw new Error(`Whirlpool ${strategy.whirlpool.toString()} could not be found.`);
    }

    const decimalsA = await getMintDecimals(this._connection, whirlpool.tokenMintA);
    const decimalsB = await getMintDecimals(this._connection, whirlpool.tokenMintB);

    const aVault = await this.getTokenAccountBalance(strategy.tokenAVault);
    const bVault = await this.getTokenAccountBalance(strategy.tokenBVault);

    // 2. Calc given Max B (3 tokens) - what is max a, max b, etc
    const accessor = new OrcaDAL(whirlpool.whirlpoolsConfig, WHIRLPOOL_PROGRAM_ID, this._connection);
    const orcaPosition = new OrcaPosition(accessor);
    const params: RemoveLiquidityQuoteParam = {
      positionAddress: strategy.position,
      liquidity: position.liquidity,
      refresh: true,
      slippageTolerance: Percentage.fromFraction(0, 1000),
    };
    const removeLiquidityQuote: RemoveLiquidityQuote = await orcaPosition.getRemoveLiquidityQuote(params);

    const vaultBalances: StrategyVaultBalances = {
      a: aVault,
      b: bVault,
    };
    const prices = await this.getPrices(strategy);
    const aAvailable = new Decimal(strategy.tokenAAmounts.toNumber());
    const bAvailable = new Decimal(strategy.tokenBAmounts.toNumber());
    const aInvested = new Decimal(removeLiquidityQuote.estTokenA.toNumber());
    const bInvested = new Decimal(removeLiquidityQuote.estTokenB.toNumber());

    let computedHoldings: Holdings = this.getStrategyHoldingsUsd(
      aAvailable,
      bAvailable,
      aInvested,
      bInvested,
      decimalsA,
      decimalsB,
      prices.aPrice,
      prices.bPrice
    );

    const balances: StrategyBalances = {
      computedHoldings,
      vaultBalances,
      prices,
      tokenAAmounts: aAvailable.plus(aInvested),
      tokenBAmounts: bAvailable.plus(bInvested),
    };
    return balances;
  }

  private getStrategyHoldingsUsd(
    aAvailable: Decimal,
    bAvailable: Decimal,
    aInvested: Decimal,
    bInvested: Decimal,
    decimalsA: number,
    decimalsB: number,
    aPrice: Decimal,
    bPrice: Decimal
  ): Holdings {
    const aAvailableScaled = aAvailable.div(Decimal.pow(10, decimalsA));
    const bAvailableScaled = bAvailable.div(Decimal.pow(10, decimalsB));

    const aInvestedScaled = aInvested.div(Decimal.pow(10, decimalsA));
    const bInvestedScaled = bInvested.div(Decimal.pow(10, decimalsB));

    const availableUsd = aAvailableScaled.mul(aPrice).add(bAvailableScaled.mul(bPrice));
    const investedUsd = aInvestedScaled.mul(aPrice).add(bInvestedScaled.mul(bPrice));

    return {
      available: {
        a: aAvailableScaled,
        b: bAvailableScaled,
      },
      availableUsd: availableUsd,
      invested: {
        a: aInvestedScaled,
        b: bInvestedScaled,
      },
      investedUsd: investedUsd,
      totalSum: availableUsd.add(investedUsd),
    };
  }

  private async getPrices(strategy: WhirlpoolStrategy): Promise<PriceData> {
    const collateralMintA = getCollateralMintByAddress(strategy.tokenAMint, this._config);
    const collateralMintB = getCollateralMintByAddress(strategy.tokenBMint, this._config);
    if (!collateralMintA) {
      throw Error(`Could not map token mint with scope price token (token A: ${strategy.tokenAMint.toBase58()})`);
    }
    if (!collateralMintB) {
      throw Error(`Could not map token mint with scope price token (token B: ${strategy.tokenBMint.toBase58()})`);
    }
    const tokens: SupportedToken[] = [];
    const rewardToken0 = this.getRewardToken(strategy.reward0CollateralId.toNumber(), tokens);
    const rewardToken1 = this.getRewardToken(strategy.reward1CollateralId.toNumber(), tokens);
    const rewardToken2 = this.getRewardToken(strategy.reward2CollateralId.toNumber(), tokens);
    tokens.push(collateralMintA.scopeToken as SupportedToken);
    tokens.push(collateralMintB.scopeToken as SupportedToken);

    const prices = await this._scope.getPrices([...new Set(tokens)]);
    const aPrice = prices.find((x) => x.name === collateralMintA.scopeToken);
    const bPrice = prices.find((x) => x.name === collateralMintB.scopeToken);

    const reward0Price = prices.find((x) => x.name === rewardToken0?.name)?.price ?? new Decimal(0);
    const reward1Price = prices.find((x) => x.name === rewardToken1?.name)?.price ?? new Decimal(0);
    const reward2Price = prices.find((x) => x.name === rewardToken2?.name)?.price ?? new Decimal(0);

    if (!aPrice) {
      throw Error(`Could not get token price from scope for ${collateralMintA.scopeToken}`);
    }
    if (!bPrice) {
      throw Error(`Could not get token price from scope for ${collateralMintB.scopeToken}`);
    }
    return { aPrice: aPrice.price, bPrice: bPrice.price, reward0Price, reward1Price, reward2Price };
  }

  private getRewardToken(tokenId: number, tokens: SupportedToken[]) {
    const rewardToken = this._tokenMap.find((x) => x.id === tokenId);
    if (rewardToken) {
      tokens.push(rewardToken.name);
    }
    return rewardToken;
  }

  /**
   * Get all token accounts for the specified share mint
   */
  getShareTokenAccounts(shareMint: PublicKey) {
    //how to get all token accounts for specific mint: https://spl.solana.com/token#finding-all-token-accounts-for-a-specific-mint
    //get it from the hardcoded token program and create a filter with the actual mint address
    //datasize:165 filter selects all token accounts, memcmp filter selects based on the mint address withing each token account
    const tokenProgram = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    return this._connection.getParsedProgramAccounts(tokenProgram, {
      filters: [{ dataSize: 165 }, { memcmp: { offset: 0, bytes: shareMint.toBase58() } }],
    });
  }

  /**
   * Get all token accounts that are holding a specific Kamino whirlpool strategy
   */
  getStrategyTokenAccounts(strategy: WhirlpoolStrategy) {
    return this.getShareTokenAccounts(strategy.sharesMint);
  }

  /**
   * Get all strategy token holders
   * @param strategy
   */
  async getStrategyHolders(strategy: WhirlpoolStrategy): Promise<StrategyHolder[]> {
    const tokenAccounts = await this.getStrategyTokenAccounts(strategy);
    const result: StrategyHolder[] = [];
    for (const tokenAccount of tokenAccounts) {
      const accountData = tokenAccount.account.data as Data;
      result.push({
        holderPubkey: new PublicKey(accountData.parsed.info.owner),
        amount: new Decimal(accountData.parsed.info.tokenAmount.uiAmountString),
      });
    }
    return result;
  }

  getWhirlpools(whirlpools: PublicKey[]) {
    return Whirlpool.fetchMultiple(this._connection, whirlpools);
  }

  getTokenName(collateralId: number) {
    const tokenName = this._tokenMap.find((x) => x.id === collateralId);
    if (!tokenName) {
      throw Error(`Token with collateral ID ${collateralId} does not exist.`);
    }
    return tokenName.name;
  }
}

export default Kamino;
