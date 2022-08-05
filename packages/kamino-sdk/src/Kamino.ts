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
import { Holdings, StrategyBalances, StrategyVaultBalances } from './models';
import axios from 'axios';
import { MultipleAccountsResponse } from './models/MultipleAccountsResponse';
import { StrategyHolder } from './models/StrategyHolder';
import { Scope, SupportedToken } from '@hubbleprotocol/scope-sdk';

export class Kamino {
  private readonly _cluster: SolanaCluster;
  private readonly _connection: Connection;
  readonly _config: HubbleConfig;
  private readonly _scope: Scope;

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
    return WhirlpoolStrategy.fetchMultiple(
      this._connection,
      this._config.kamino.strategies.map((x) => x.address)
    );
  }

  /**
   * Get a Kamino whirlpool strategy by its name
   */
  getStrategyByName(tokenA: string, tokenB: string) {
    const strategy = this._config.kamino.strategies.find(
      (x) =>
        x.collateralA.toLowerCase() === tokenA.toLowerCase() && x.collateralB.toLowerCase() === tokenB.toLowerCase()
    );
    if (strategy) {
      return WhirlpoolStrategy.fetch(this._connection, strategy.address);
    } else {
      throw new Error(`Could not find strategy: ${tokenA}-${tokenB}`);
    }
  }

  /**
   * Get a Kamino whirlpool strategy by its public key address
   * @param address
   */
  getStrategyByAddress(address: PublicKey) {
    return WhirlpoolStrategy.fetch(this._connection, address);
  }

  /**
   * Get the share price of the specified Kamino whirlpool strategy
   * @param strategy
   */
  async getStrategySharePrice(strategy: WhirlpoolStrategy) {
    const dollarFactor = Decimal.pow(10, 6);
    const sharesIssued = new Decimal(strategy.sharesIssued.toString());
    if (sharesIssued.isZero()) {
      return new Decimal(1);
    } else {
      const balances = await this.getStrategyBalances(strategy);
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
    const { aPrice, bPrice } = await this.getPrices(strategy);

    let computedHoldings: Holdings = this.getStrategyHoldingsUsd(
      new Decimal(strategy.tokenAAmounts.toNumber()),
      new Decimal(strategy.tokenBAmounts.toNumber()),
      new Decimal(removeLiquidityQuote.estTokenA.toNumber()),
      new Decimal(removeLiquidityQuote.estTokenB.toNumber()),
      decimalsA,
      decimalsB,
      aPrice.price,
      bPrice.price
    );

    const balances: StrategyBalances = {
      computedHoldings,
      vaultBalances,
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

  private async getPrices(strategy: WhirlpoolStrategy) {
    const collateralMintA = getCollateralMintByAddress(strategy.tokenAMint, this._config);
    const collateralMintB = getCollateralMintByAddress(strategy.tokenBMint, this._config);
    if (!collateralMintA) {
      throw Error(`Could not map token mint with scope price token (token A: ${strategy.tokenAMint.toBase58()})`);
    }
    if (!collateralMintB) {
      throw Error(`Could not map token mint with scope price token (token B: ${strategy.tokenBMint.toBase58()})`);
    }
    const prices = await this._scope.getPrices([
      collateralMintA.scopeToken as SupportedToken,
      collateralMintB.scopeToken as SupportedToken,
    ]);
    const aPrice = prices.find((x) => x.name === collateralMintA.scopeToken);
    const bPrice = prices.find((x) => x.name === collateralMintB.scopeToken);

    if (!aPrice) {
      throw Error(`Could not get token price from scope for ${collateralMintA.scopeToken}`);
    }
    if (!bPrice) {
      throw Error(`Could not get token price from scope for ${collateralMintB.scopeToken}`);
    }
    return { aPrice, bPrice };
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
    const response = await axios.post<MultipleAccountsResponse>(
      this._connection.rpcEndpoint,
      JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getMultipleAccounts',
        params: [[tokenAccounts.map((x) => x.pubkey.toString()).toString()], { encoding: 'jsonParsed' }],
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 200 && response.data?.result?.value) {
      return response.data.result.value.map((x) => ({
        holderPubkey: new PublicKey(x.data.parsed.info.owner),
        amount: new Decimal(x.data.parsed.info.tokenAmount.uiAmountString),
      }));
    } else if (response.status !== 200) {
      throw Error(`Could not get strategy holders, request error: ${response.status} - ${response.statusText}`);
    } else {
      return [];
    }
  }

  getWhirlpools(whirlpools: PublicKey[]) {
    return Whirlpool.fetchMultiple(this._connection, whirlpools);
  }
}

export default Kamino;
