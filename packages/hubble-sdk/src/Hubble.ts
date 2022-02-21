import { getConfigByCluster, HubbleConfig, SolanaCluster } from '@hubbleprotocol/hubble-config';
import { Connection, PublicKey } from '@solana/web3.js';
import StakingPoolState from './models/StakingPoolState';
import StabilityPoolState from './models/StabilityPoolState';
import BorrowingMarketState from './models/BorrowingMarketState';
import { Idl, Program, Provider } from '@project-serum/anchor';
import { BORROWING_IDL } from '@hubbleprotocol/hubble-idl';
import { getReadOnlyWallet } from './utils';
import UserStakingState from './models/UserStakingState';
import StabilityProviderState from './models/StabilityProviderState';

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

  /**
   * Get Hubble's staking pool state
   */
  getStakingPoolState(): Promise<StakingPoolState> {
    return this._borrowingProgram.account.stakingPoolState.fetch(
      this._config.borrowing.accounts.stakingPoolState
    ) as Promise<StakingPoolState>;
  }

  /**
   * Get Hubble's stability pool state
   */
  getStabilityPoolState(): Promise<StabilityPoolState> {
    return this._borrowingProgram.account.stabilityPoolState.fetch(
      this._config.borrowing.accounts.stabilityPoolState
    ) as Promise<StabilityPoolState>;
  }

  /**
   * Get Hubble's borrowing market state
   */
  getBorrowingMarketState(): Promise<BorrowingMarketState> {
    return this._borrowingProgram.account.borrowingMarketState.fetch(
      this._config.borrowing.accounts.borrowingMarketState
    ) as Promise<BorrowingMarketState>;
  }

  /**
   * Get user's staking state
   * @param user Base58 encoded Public Key of the user
   */
  async getUserStakingState(user: PublicKey | string) {
    const userStakingStates = (
      await this._borrowingProgram.account.userStakingState.all([
        {
          memcmp: {
            bytes: user instanceof PublicKey ? user.toBase58() : user,
            offset: 49, // 8 (account discriminator for user staking state) + 1 (version u8) + 8 (user_id u64) + 32 (staking_pool_state pubkey [u8, 32])
          },
        },
      ])
    ).map((x) => x.account as UserStakingState);
    return userStakingStates[0] ?? [];
  }

  async getUserStabilityProviderState(user: PublicKey | string) {
    const stabilityProviderStates = (
      await this._borrowingProgram.account.stabilityProviderState.all([
        {
          memcmp: {
            bytes: user instanceof PublicKey ? user.toBase58() : user,
            offset: 41, // 8 (account discriminator for stability provider state) + 1 (version u8) + 32 (stability pool state pubkey [u8, 32])
          },
        },
      ])
    ).map((x) => x.account as StabilityProviderState);
    return stabilityProviderStates[0] ?? [];
  }
}
