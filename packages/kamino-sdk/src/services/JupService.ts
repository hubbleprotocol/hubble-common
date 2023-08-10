import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';
import { SolanaCluster } from '@hubbleprotocol/hubble-config';
import axios from 'axios';
import Decimal from 'decimal.js';
import { RouteInfo } from '@jup-ag/core';
import { DeserializedVersionedTransaction } from '../utils';
import {
  QuoteResponse,
  SwapInstructionsResponse,
  SwapInstructionsResponseFromJSONTyped,
  SwapResponse,
  TransactionObject,
  createJupiterApiClient,
} from '@jup-ag/api';
import { decodeSerializedTransaction } from '../utils/transactions';

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

  static getSwapTransactions = async (
    route: RouteInfo,
    walletPublicKey: PublicKey,
    wrapUnwrapSOL = true,
    asLegacyTransaction?: boolean
  ): Promise<SwapTransactionsResponse> => {
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
  };

  // the amounts has to be in lamports
  static getBestRoute = async (
    amount: Decimal,
    inputMint: PublicKey,
    outputMint: PublicKey,
    slippageBps: number,
    mode = 'ExactIn',
    asLegacyTransaction?: boolean
  ): Promise<RouteInfo> => {
    const params = {
      inputMint: inputMint.toString(),
      outputMint: outputMint.toString(),
      amount: amount.ceil().toString(),
      slippageBps,
      onlyDirectRoutes: false,
      asLegacyTransaction,
      mode,
    };

    const res = await axios.get('https://quote-api.jup.ag/v4/quote', { params });

    return res.data.data[0] as RouteInfo;
  };

  // the amounts has to be in lamports
  static getAllRoutesV4 = async (
    amount: Decimal,
    inputMint: PublicKey,
    outputMint: PublicKey,
    slippageBps: number,
    mode = 'ExactIn',
    asLegacyTransaction?: boolean
  ): Promise<RouteInfo[]> => {
    const params = {
      inputMint: inputMint.toString(),
      outputMint: outputMint.toString(),
      amount: amount.ceil().toString(),
      slippageBps,
      onlyDirectRoutes: false,
      asLegacyTransaction,
      mode,
    };

    const res = await axios.get('https://quote-api.jup.ag/v4/quote', { params });

    return res.data.data as RouteInfo[];
  };

  // the amounts has to be in lamports
  static getBestRouteV6 = async (
    userPublicKey: PublicKey,
    amount: Decimal,
    inputMint: PublicKey,
    outputMint: PublicKey,
    slippageBps: number,
    asLegacyTransaction?: boolean,
    maxAccounts?: number
  ): Promise<SwapResponse> => {
    try {
      const jupiterQuoteApi = createJupiterApiClient(); // config is optional

      // quote-api.jup.ag/v6/quote?inputMint=7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj&outputMint=mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So&amount=71101983&slippageBps=10&onlyDirectRoutes=false&asLegacyTransaction=false&maxAccounts=33

      const params = {
        inputMint: inputMint.toString(),
        outputMint: outputMint.toString(),
        amount: amount.floor().toNumber(),
        slippageBps,
        onlyDirectRoutes: false,
        asLegacyTransaction,
        maxAccounts,
      };

      console.log('getBestRouteV6 params', JSON.stringify(params));
      const res = await axios.get('https://quote-api.jup.ag/v6/quote', { params });

      const transaction: SwapResponse = await jupiterQuoteApi.swapPost({
        swapRequest: {
          quoteResponse: res.data,
          userPublicKey: userPublicKey.toString(),
          wrapAndUnwrapSol: false,
        },
      });

      return transaction;
    } catch (error) {
      console.log('getBestRouteV6 error', error);
      throw error;
    }
  };

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

  static buildTransactionsFromSerialized = (serializedTransactions: Array<string | undefined>): Transaction[] => {
    return serializedTransactions.filter(Boolean).map((tx) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return Transaction.from(Buffer.from(tx!, 'base64'));
    });
  };

  static deserealizeVersionedTransactions = async (
    connection: Connection,
    serializedTransactions: Array<string | undefined>
  ): Promise<DeserializedVersionedTransaction> => {
    const filtered = serializedTransactions.filter(Boolean);
    const result: TransactionMessage[] = [];
    let lookupTablesAddresses: PublicKey[] = [];

    for (let i = 0; i < filtered.length; i++) {
      const tx = filtered[i];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      // safe to use as it is filtered above at 120 line
      const buffer = Buffer.from(tx!, 'base64');

      const versionedTx = VersionedTransaction.deserialize(buffer);
      const { addressTableLookups } = versionedTx.message;
      lookupTablesAddresses = [...lookupTablesAddresses, ...addressTableLookups.map((item) => item.accountKey)];

      const lookupTableAccountsRequests = addressTableLookups.map((item) => {
        return JupService.getLookupTableAccount(connection, item.accountKey);
      });

      const lookupTableAccounts = await Promise.all(lookupTableAccountsRequests);

      const decompiledMessage = TransactionMessage.decompile(versionedTx.message, {
        // @ts-ignore
        addressLookupTableAccounts: lookupTableAccounts,
      });
      result.push(decompiledMessage);
    }

    return { txMessage: result, lookupTablesAddresses };
  };

  static getLookupTableAccount = async (connection: Connection, address: string | PublicKey) => {
    return connection.getAddressLookupTable(new PublicKey(address)).then((res) => res.value);
  };
}
