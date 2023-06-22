import { Connection, PublicKey } from '@solana/web3.js';
import { SolanaCluster } from '@hubbleprotocol/hubble-config';
import axios from 'axios';

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
