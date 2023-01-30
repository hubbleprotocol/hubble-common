import { Connection } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { estimateAprsForPriceRange, OrcaNetwork, OrcaWhirlpoolClient } from '@orca-so/whirlpool-sdk';
import axios from 'axios';
import { OrcaWhirlpoolsResponse } from './OrcaWhirlpoolsResponse';
import { HubbleConfig, SolanaCluster } from '@hubbleprotocol/hubble-config';
import { WhirlpoolStrategy } from '../kamino-client';
import { Scope, ScopeToken } from '@hubbleprotocol/scope-sdk';
import { Position } from '../whirpools-client';
import { getKaminoTokenName, getScopeTokenFromKaminoMints } from '../constants';
import { WhirlpoolAprApy } from './WhirlpoolAprApy';
import { aprToApy } from '../utils';

export class OrcaService {
  private readonly _connection: Connection;
  private readonly _cluster: SolanaCluster;
  private readonly _config: HubbleConfig;
  private readonly _orcaNetwork: OrcaNetwork;
  private readonly _orcaApiUrl: string;

  constructor(connection: Connection, cluster: SolanaCluster, config: HubbleConfig) {
    this._connection = connection;
    this._cluster = cluster;
    this._config = config;
    this._orcaNetwork = cluster === 'mainnet-beta' ? OrcaNetwork.MAINNET : OrcaNetwork.DEVNET;
    this._orcaApiUrl = `https://api.${cluster === 'mainnet-beta' ? 'mainnet' : 'devnet'}.orca.so`;
  }

  private async getOrcaWhirlpools() {
    return (await axios.get<OrcaWhirlpoolsResponse>(`${this._orcaApiUrl}/v1/whirlpool/list`)).data;
  }

  private getTokenPrices(strategy: WhirlpoolStrategy, prices: ScopeToken[]) {
    const tokensPrices: Record<string, Decimal> = {};
    const tokenA = getScopeTokenFromKaminoMints(strategy.tokenAMint, this._config);
    const tokenB = getScopeTokenFromKaminoMints(strategy.tokenBMint, this._config);
    const reward0 = getKaminoTokenName(Number(strategy.reward0CollateralId));
    const reward1 = getKaminoTokenName(Number(strategy.reward1CollateralId));
    const reward2 = getKaminoTokenName(Number(strategy.reward2CollateralId));
    const tokens = [tokenA, tokenB, reward0, reward1, reward2];
    for (const token of tokens) {
      const mint = this._config.kamino.mints.find((x) => x.scopeToken === token);
      const scopeToken = prices.find((x) => x.name === token);
      if (!mint || !scopeToken) {
        throw new Error(`Could not get token ${token} prices`);
      }
      tokensPrices[mint.address.toString()] = scopeToken.price;
    }
    return tokensPrices;
  }

  async getStrategyWhirlpoolPoolAprApy(strategy: WhirlpoolStrategy): Promise<WhirlpoolAprApy> {
    const orca = new OrcaWhirlpoolClient({
      connection: this._connection,
      network: this._orcaNetwork,
    });
    const scope = new Scope(this._cluster, this._connection);
    const prices = await scope.getAllPrices();
    const position = await Position.fetch(this._connection, strategy.position);
    if (!position) {
      throw new Error(`Position ${strategy.position} does not exist`);
    }

    const pool = await orca.getPool(strategy.pool);
    const { whirlpools } = await this.getOrcaWhirlpools();
    const whirlpool = whirlpools?.find((x) => x.address === strategy.pool.toString());

    if (!pool || !whirlpool) {
      throw Error(`Could not get orca pool data for ${strategy.pool}`);
    }
    const lpFeeRate = pool.feePercentage;
    const volume24hUsd = whirlpool?.volume?.day ?? new Decimal(0);
    const fee24Usd = new Decimal(volume24hUsd).mul(lpFeeRate).toNumber();
    const tokensPrices = this.getTokenPrices(strategy, prices);

    const apr = estimateAprsForPriceRange(
      pool,
      tokensPrices,
      fee24Usd,
      position.tickLowerIndex,
      position.tickUpperIndex
    );

    const totalApr = new Decimal(apr.fee).add(apr.rewards[0]).add(apr.rewards[1]).add(apr.rewards[2]);
    const feeApr = new Decimal(apr.fee);
    const rewardsApr = apr.rewards.map((r) => new Decimal(r));
    return {
      totalApr,
      totalApy: aprToApy(totalApr),
      feeApr,
      feeApy: aprToApy(feeApr),
      rewardsApr,
      rewardsApy: rewardsApr.map((x) => aprToApy(x)),
    };
  }
}
