import { getConfigByCluster, HubbleConfig, SolanaCluster } from '@hubbleprotocol/hubble-config';
import { Connection } from '@solana/web3.js';
import StakingPoolState from './models/StakingPoolState';
import StabilityPoolState from './models/StabilityPoolState';
import BorrowingMarketState from './models/BorrowingMarketState';
import { Idl, Program, Provider } from '@project-serum/anchor';
import { BORROWING_IDL } from '@hubbleprotocol/hubble-idl';
import { getReadOnlyWallet } from './utils';

export default class Hubble {
  private _cluster: SolanaCluster;
  private _connection: Connection;
  private readonly _config: HubbleConfig;
  private readonly _provider: Provider;
  private _borrowingProgram: Program;

  constructor(cluster: SolanaCluster, connection: Connection) {
    this._cluster = cluster;
    this._connection = connection;
    this._config = getConfigByCluster(cluster);
    this._provider = new Provider(connection, getReadOnlyWallet(), { commitment: connection.commitment });
    this._borrowingProgram = new Program(BORROWING_IDL as Idl, this._config.borrowing.programId, this._provider);
  }

  getStakingPoolState(): Promise<StakingPoolState> {
    return this._borrowingProgram.account.stakingPoolState.fetch(
      this._config.borrowing.accounts.stakingPoolState
    ) as Promise<StakingPoolState>;
  }

  getStabilityPoolState(): Promise<StabilityPoolState> {
    return this._borrowingProgram.account.stabilityPoolState.fetch(
      this._config.borrowing.accounts.stabilityPoolState
    ) as Promise<StabilityPoolState>;
  }

  getBorrowingMarketState(): Promise<BorrowingMarketState> {
    return this._borrowingProgram.account.borrowingMarketState.fetch(
      this._config.borrowing.accounts.borrowingMarketState
    ) as Promise<BorrowingMarketState>;
  }

  async getTreasuryVault() {
    // const acccountBalance = await this._provider.connection.getTokenAccountBalance(
    //   this._config.borrowing.accounts.treasuryVault!
    // );
    // return acccountBalance.value;
  }

  async getHbbTokenSupply() {
    // const tokenSupply = await this._provider.connection.getTokenSupply(this._config.borrowing.accounts.mint.HBB);
    // return tokenSupply.value;
  }
}
