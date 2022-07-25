import { getConfigByCluster, HubbleConfig, SolanaCluster } from '@hubbleprotocol/hubble-config';
import { Connection } from '@solana/web3.js';
import { setProgramId } from './programId';

export class Kamino {
  private readonly _cluster: SolanaCluster;
  private readonly _connection: Connection;
  private readonly _config: HubbleConfig;

  /**
   * Create a new instance of the Kamino SDK class.
   * @param cluster Name of the Solana cluster
   * @param connection Connection to the Solana cluster
   */
  constructor(cluster: SolanaCluster, connection: Connection) {
    this._cluster = cluster;
    this._connection = connection;
    this._config = getConfigByCluster(cluster);
    //TODO:
    // setProgramId(this._config.kamino.programId);
  }
}

export default Kamino;
