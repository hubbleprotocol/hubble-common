import { Connection, PublicKey } from '@solana/web3.js';
import { SolanaCluster } from '@hubbleprotocol/hubble-config';
import { RouteInfo } from '@jup-ag/react-hook';
import {
  LiquidityDistribution as RaydiumLiquidityDistribuion,
  Pool,
  RaydiumPoolsResponse,
} from './RaydiumPoolsResponse';
import { PersonalPositionState, PoolState } from '../raydium_client';
import Decimal from 'decimal.js';
import { AmmV3, AmmV3PoolInfo, PositionInfoLayout, TickMath, SqrtPriceMath } from '@raydium-io/raydium-sdk';
import { WhirlpoolAprApy } from './WhirlpoolAprApy';
import { WhirlpoolStrategy } from '../kamino-client/accounts';
import {
  aprToApy,
  GenericPoolInfo,
  getStrategyPriceRangeRaydium,
  LiquidityDistribution,
  LiquidityForPrice,
  ZERO,
} from '../utils';
import axios from 'axios';
import { FullPercentage } from '../utils/CreationParameters';
import { PROGRAM_ID as RAYDIUM_PROGRAM_ID } from '../raydium_client/programId';

export type SwapTransactionsResponse = {
  setupTransaction: string | undefined;
  swapTransaction: string;
  cleanupTransaction: string | undefined;
};

export class JupService {
  private readonly _connection: Connection;
  private readonly _cluster: SolanaCluster;

  constructor(connection: Connection, cluster: SolanaCluster) {
    this._connection = connection;
    this._cluster = cluster;
  }

  async getSwapTransactions(
    route: RouteInfo,
    walletPublicKey: PublicKey,
    wrapUnwrapSOL = true,
    asLegacyTransaction?: boolean
  ): Promise<SwapTransactionsResponse> {
    const res = await axios.post('https://quote-api.jup.ag/v4/swap', {
      // route from /quote api
      route,
      // user public key to be used for the swap
      userPublicKey: walletPublicKey.toString(),
      // auto wrap and unwrap SOL. default is true
      wrapUnwrapSOL,
      asLegacyTransaction,
    });
    return res.data;
  }

  async getBestRoute(
    amount: Decimal,
    inputMint: PublicKey,
    outputMint: PublicKey,
    slippage: number,
    mode = 'ExactIn',
    asLegacyTransaction?: boolean
  ): Promise<RouteInfo> {
    const params = {
      inputMint: inputMint.toString(),
      outputMint: outputMint.toString(),
      amount: amount.ceil().toString(),
      slippageBps: slippage * 100,
      onlyDirectRoutes: false,
      asLegacyTransaction,
      mode,
    };

    const res = await axios.get('https://quote-api.jup.ag/v4/quote', { params });

    return res.data.data[0] as RouteInfo;
  }

  async getPrice(inputMint: PublicKey | string, outputMint: PublicKey | string): Promise<number> {
    const params = {
      ids: inputMint.toString(),
      vsToken: outputMint.toString(),
      vsAmount: 1,
    };

    // BONK token
    if (outputMint.toString() === 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263') {
      params.vsAmount = 100;
    }

    const res = await axios.get('https://quote-api.jup.ag/v4/price', { params });
    return res.data.data[inputMint.toString()].price;
  }
}
