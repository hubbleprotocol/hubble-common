import { getConfigByCluster, HubbleConfig, SolanaCluster } from '@hubbleprotocol/hubble-config';
import { Connection, PublicKey } from '@solana/web3.js';
import StakingPoolState from './models/StakingPoolState';
import StabilityPoolState from './models/StabilityPoolState';
import BorrowingMarketState from './models/BorrowingMarketState';
import { Idl, Program, Provider } from '@project-serum/anchor';
import { BORROWING_IDL } from '@hubbleprotocol/hubble-idl';
import {
  calculateStabilityProvided,
  getReadOnlyWallet,
  calculateTotalDebt,
  replaceBigNumberWithDecimal,
  calculateTotalCollateral,
} from './utils';
import UserStakingState from './models/UserStakingState';
import StabilityProviderState from './models/StabilityProviderState';
import UserMetadata from './models/UserMetadata';
import Loan from './models/Loan';
import { HBB_DECIMALS, STABLECOIN_DECIMALS } from './constants';
import Decimal from 'decimal.js';

export class Hubble {
  private _cluster: SolanaCluster;
  private _connection: Connection;
  private readonly _config: HubbleConfig;
  private readonly _provider: Provider;
  private _borrowingProgram: Program;

  /**
   * Create a new instance of the Hubble SDK class.
   * @param cluster Name of the Solana cluster
   * @param connection Connection to the Solana cluster
   */
  constructor(cluster: SolanaCluster, connection: Connection) {
    this._cluster = cluster;
    this._connection = connection;
    this._config = getConfigByCluster(cluster);
    this._provider = new Provider(connection, getReadOnlyWallet(), { commitment: connection.commitment });
    this._borrowingProgram = new Program(BORROWING_IDL as Idl, this._config.borrowing.programId, this._provider);
  }

  /**
   * Get Hubble's staking pool state.
   * @return on-chain {@link StakingPoolState} from the borrowing program with numbers as lamports
   */
  async getStakingPoolState(): Promise<StakingPoolState> {
    const stakingPoolState = (await this._borrowingProgram.account.stakingPoolState.fetch(
      this._config.borrowing.accounts.stakingPoolState
    )) as StakingPoolState;
    return replaceBigNumberWithDecimal(stakingPoolState);
  }

  /**
   * Get Hubble's stability pool state.
   * @return on-chain {@link StabilityPoolState} from the borrowing program with numbers as lamports
   */
  async getStabilityPoolState(): Promise<StabilityPoolState> {
    let stability = (await this._borrowingProgram.account.stabilityPoolState.fetch(
      this._config.borrowing.accounts.stabilityPoolState
    )) as StabilityPoolState;
    stability = replaceBigNumberWithDecimal(stability);
    stability.cumulativeGainsTotal = replaceBigNumberWithDecimal(stability.cumulativeGainsTotal);
    stability.lastCollLossErrorOffset = replaceBigNumberWithDecimal(stability.lastCollLossErrorOffset);
    stability.pendingCollateralGains = replaceBigNumberWithDecimal(stability.pendingCollateralGains);
    return stability;
  }

  /**
   * Get Hubble's borrowing market state.
   * @return on-chain {@link BorrowingMarketState} from the borrowing program with numbers as lamports
   */
  async getBorrowingMarketState(): Promise<BorrowingMarketState> {
    let state = (await this._borrowingProgram.account.borrowingMarketState.fetch(
      this._config.borrowing.accounts.borrowingMarketState
    )) as BorrowingMarketState;
    state = replaceBigNumberWithDecimal(state);
    state.depositedCollateral = replaceBigNumberWithDecimal(state.depositedCollateral);
    state.inactiveCollateral = replaceBigNumberWithDecimal(state.inactiveCollateral);
    state.collateralRewardPerToken = replaceBigNumberWithDecimal(state.collateralRewardPerToken);
    return state;
  }

  /**
   * Get user's staking state (staking stats).
   * @param user Base58 encoded Public Key of the user
   * @return on-chain {@link UserStakingState} from the borrowing program for the specific user with numbers as lamports
   * or undefined if user has never used Hubble before or authorized HBB staking
   */
  async getUserStakingState(user: PublicKey | string): Promise<UserStakingState | undefined> {
    const userStakingStates = (
      await this._borrowingProgram.account.userStakingState.all([
        {
          memcmp: {
            bytes: user instanceof PublicKey ? user.toBase58() : user,
            offset: 49, // 8 (account discriminator for user staking state) + 1 (version u8) + 8 (user_id u64) + 32 (staking_pool_state pubkey [u8, 32])
          },
        },
        {
          memcmp: {
            bytes: this._config.borrowing.accounts.stakingPoolState.toBase58(),
            offset: 17, // 8 (account discriminator for user staking state) + 1 (version u8) + 8 (user_id u64)
          },
        },
      ])
    ).map((x) => replaceBigNumberWithDecimal(x.account as UserStakingState));
    return userStakingStates[0];
  }

  /**
   * Convert anchor's stability provider state with BN to stability provider state with decimals
   * @param stabilityProviderState
   */
  private static stabilityProviderStateToDecimals(stabilityProviderState: StabilityProviderState) {
    const converted = replaceBigNumberWithDecimal(stabilityProviderState);
    converted.userDepositSnapshot = replaceBigNumberWithDecimal(converted.userDepositSnapshot);
    converted.userDepositSnapshot.sum = replaceBigNumberWithDecimal(converted.userDepositSnapshot.sum);
    converted.pendingGainsPerUser = replaceBigNumberWithDecimal(converted.pendingGainsPerUser);
    converted.cumulativeGainsPerUser = replaceBigNumberWithDecimal(converted.cumulativeGainsPerUser);
    return converted;
  }

  /**
   * Get user's stability provider state (stability pool stats).
   * @param user Base58 encoded Public Key of the user
   * @return on-chain {@link StabilityProviderState} from the borrowing program for the specific user with numbers as lamports.
   * Returns undefined if this user has never used Hubble Stability pool before and does not exist in Hubble on-chain data
   */
  async getUserStabilityProviderState(user: PublicKey | string): Promise<StabilityProviderState | undefined> {
    const stabilityProviderStates = (
      await this._borrowingProgram.account.stabilityProviderState.all([
        {
          memcmp: {
            bytes: user instanceof PublicKey ? user.toBase58() : user,
            offset: 41, // 8 (account discriminator for stability provider state) + 1 (version u8) + 32 (stability pool state pubkey [u8, 32])
          },
        },
        {
          memcmp: {
            bytes: this._config.borrowing.accounts.stabilityPoolState.toBase58(),
            offset: 9, // 8 (account discriminator for stability provider state) + 1 (version u8)
          },
        },
      ])
    ).map((x) => Hubble.stabilityProviderStateToDecimals(x.account as StabilityProviderState));
    return stabilityProviderStates[0];
  }

  /**
   * Get all Hubble stability providers (stability pool stats).
   * @return list of on-chain {@link StabilityProviderState} from the borrowing program
   */
  async getStabilityProviders(): Promise<StabilityProviderState[]> {
    return (
      await this._borrowingProgram.account.stabilityProviderState.all([
        {
          memcmp: {
            bytes: this._config.borrowing.accounts.stabilityPoolState.toBase58(),
            offset: 9, // 8 (account discriminator for stability provider state) + 1 (version u8)
          },
        },
      ])
    ).map((x) => Hubble.stabilityProviderStateToDecimals(x.account as StabilityProviderState));
  }

  /**
   * Convert user metadata BN fields to Decimal
   * @param user
   * @private
   */
  private static userMetadataToDecimals(user: UserMetadata) {
    const converted: UserMetadata = replaceBigNumberWithDecimal(user);
    converted.userCollateralRewardPerToken = replaceBigNumberWithDecimal(converted.userCollateralRewardPerToken);
    converted.depositedCollateral = replaceBigNumberWithDecimal(converted.depositedCollateral);
    converted.inactiveCollateral = replaceBigNumberWithDecimal(converted.inactiveCollateral);
    return replaceBigNumberWithDecimal(converted);
  }

  /**
   * Get all of user's metadatas (borrowing state, debt, collateral stats...), user can have multiple borrowing accounts.
   * @param user Base58 encoded Public Key of the user
   * @return on-chain {@link UserMetadata} from the borrowing program for the specific user with numbers as lamports
   */
  async getUserMetadatas(user: PublicKey | string): Promise<UserMetadata[]> {
    return (
      await this._borrowingProgram.account.userMetadata.all([
        {
          memcmp: {
            bytes: user instanceof PublicKey ? user.toBase58() : user,
            offset: 50, // 8 (account discriminator for usermetadata) + 1 (version u8) + 1 (status u8) + 8 (user_id u64) + 32 (metadata_pk pubkey [u8, 32])
          },
        },
        {
          memcmp: {
            bytes: this._config.borrowing.accounts.borrowingMarketState.toBase58(),
            offset: 82, // 8 (account discriminator for usermetadata) + 1 (version u8) + 1 (status u8) + 8 (user_id u64) + 32 (metadata_pk pubkey [u8, 32]) + 32 (owner pubkey)
          },
        },
      ])
    ).map((x) => Hubble.userMetadataToDecimals(x.account as UserMetadata));
  }

  /**
   * Get all Hubble user metadatas (borrowing state, debt, collateral stats...), one user can have multiple borrowing accounts.
   * @return list of on-chain {@link UserMetadata} from the borrowing program for the specific user with numbers as lamports
   */
  async getAllUserMetadatas(): Promise<UserMetadata[]> {
    return (
      await this._borrowingProgram.account.userMetadata.all([
        {
          memcmp: {
            bytes: this._config.borrowing.accounts.borrowingMarketState.toBase58(),
            offset: 82, // 8 (account discriminator for usermetadata) + 1 (version u8) + 1 (status u8) + 8 (user_id u64) + 32 (metadata_pk pubkey [u8, 32]) + 32 (owner pubkey)
          },
        },
      ])
    ).map((x) => Hubble.userMetadataToDecimals(x.account as UserMetadata));
  }

  /**
   * Get all Hubble user metadatas (borrowing state, debt, collateral stats...) and include raw JSON RPC responses in the return value.
   * @return list of on-chain {@link UserMetadata} from the borrowing program for the specific user with numbers as lamports
   */
  async getAllUserMetadatasIncludeJsonResponse(): Promise<{ userMetadata: UserMetadata; jsonResponse: string }[]> {
    return (
      await this._borrowingProgram.account.userMetadata.all([
        {
          memcmp: {
            bytes: this._config.borrowing.accounts.borrowingMarketState.toBase58(),
            offset: 82, // 8 (account discriminator for usermetadata) + 1 (version u8) + 1 (status u8) + 8 (user_id u64) + 32 (metadata_pk pubkey [u8, 32]) + 32 (owner pubkey)
          },
        },
      ])
    ).map((x) => ({
      userMetadata: Hubble.userMetadataToDecimals(x.account as UserMetadata),
      jsonResponse: JSON.stringify(x.account),
    }));
  }

  /**
   * Get user's loans. Fetches all {@link UserMetadata} of the specified user and converts it to a human-friendly list of {@link Loan}.
   * @param user Base58 encoded Public Key of the user
   * @return User's loans with already converted on-chain data (from lamports to decimal values)
   */
  async getUserLoans(user: PublicKey | string): Promise<Loan[]> {
    const loans: Loan[] = [];
    const userVaults = await this.getUserMetadatas(user);
    if (userVaults.length === 0) {
      return [];
    }
    const borrowingMarketState = await this.getBorrowingMarketState();
    for (const userVault of userVaults) {
      if (userVault.borrowedStablecoin.greaterThan(0)) {
        loans.push({
          usdhDebt: calculateTotalDebt(userVault, borrowingMarketState),
          collateral: calculateTotalCollateral(userVault, borrowingMarketState),
        });
      }
    }
    return loans;
  }

  /**
   * Get user's deposited stablecoin (USDH) in the stability pool.
   * @param user Base58 encoded Public Key of the user
   * @return Deposited stablecoin (USDH) in decimal format or
   * undefined if user has never used Hubble before or authorized stability pool deposits
   */
  async getUserUsdhInStabilityPool(user: PublicKey | string): Promise<Decimal | undefined> {
    const provider = await this.getUserStabilityProviderState(user);
    if (provider) {
      const pool = await this.getStabilityPoolState();
      return calculateStabilityProvided(pool, provider).dividedBy(STABLECOIN_DECIMALS);
    }
    return undefined;
  }

  /**
   * Get the amount of staked HBB of a specific user.
   * @param user Base58 encoded Public Key of the user
   * @return HBB staked in decimal format or
   * undefined if user has never used Hubble before or authorized HBB staking
   */
  async getUserStakedHbb(user: PublicKey | string): Promise<Decimal | undefined> {
    const stakingState = await this.getUserStakingState(user);
    if (stakingState) {
      return stakingState.userStake.dividedBy(HBB_DECIMALS);
    }
    return undefined;
  }

  /**
   * Get Hubble's treasury vault value
   * @return Value of Hubble's treasury vault in decimal representation
   */
  async getTreasuryVault() {
    const acccountBalance = await this._provider.connection.getTokenAccountBalance(
      this._config.borrowing.accounts.treasuryVault!
    );
    if (!acccountBalance.value.uiAmountString) {
      throw Error(
        `Could not get account balance of Hubble treasury vault: ${this._config.borrowing.accounts.treasuryVault}`
      );
    }
    return new Decimal(acccountBalance.value.uiAmountString);
  }

  /**
   * Get circulating supply number of the Hubble (HBB) token
   * @return Number of HBB in circulation in decimal representation
   */
  async getHbbCirculatingSupply() {
    const tokenSupply = await this._provider.connection.getTokenSupply(this._config.borrowing.accounts.mint.HBB);
    if (!tokenSupply.value.uiAmountString) {
      throw Error(
        `Could not get HBB circulating supply from the HBB mint account: ${this._config.borrowing.accounts.mint.HBB}`
      );
    }
    return new Decimal(tokenSupply.value.uiAmountString);
  }

  /**
   * Get all token accounts that are holding HBB
   */
  getHbbTokenAccounts() {
    //how to get all token accounts for specific mint: https://spl.solana.com/token#finding-all-token-accounts-for-a-specific-mint
    //get it from the hardcoded token program and create a filter with the actual mint address
    //datasize:165 filter selects all token accounts, memcmp filter selects based on the mint address withing each token account
    const tokenProgram = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    return this._provider.connection.getParsedProgramAccounts(tokenProgram, {
      filters: [
        { dataSize: 165 },
        { memcmp: { offset: 0, bytes: this._config.borrowing.accounts.mint.HBB.toBase58() } },
      ],
    });
  }
}

export default Hubble;
