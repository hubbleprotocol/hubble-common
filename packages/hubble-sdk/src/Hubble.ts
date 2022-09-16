import { getConfigByCluster, HubbleConfig, SolanaCluster } from '@hubbleprotocol/hubble-config';
import { Connection, PublicKey } from '@solana/web3.js';
import StakingPoolState from './models/StakingPoolState';
import StabilityPoolState from './models/StabilityPoolState';
import BorrowingMarketState from './models/BorrowingMarketState';
import { Idl, Program, Provider } from '@project-serum/anchor';
import { BORROWING_IDL } from '@hubbleprotocol/hubble-idl';
import {
  calculatePendingGains,
  calculateStabilityProvided,
  calculateTotalCollateral,
  calculateTotalDebt,
  decimalToNumWithdrawalCap,
  getReadOnlyWallet,
  replaceBigNumberWithDecimal,
} from './utils';
import UserStakingState from './models/UserStakingState';
import StabilityProviderState from './models/StabilityProviderState';
import UserMetadata from './models/UserMetadata';
import Loan from './models/Loan';
import { DECIMAL_FACTOR, HBB_DECIMALS, STABLECOIN_DECIMALS, STREAMFLOW_HBB_CONTRACT } from './constants';
import Decimal from 'decimal.js';
import UserMetadataWithJson from './models/UserMetadataWithJson';
import Stream, { Cluster } from '@streamflow/stream';
import StabilityProviderStateWithJson from './models/StabilityProviderStateWithJson';
import { HbbVault, PsmReserve, UsdhVault } from './models';
import GlobalConfig from './models/GlobalConfig';
import { SwapInfo } from './models/SwapInfo';

export class Hubble {
  private readonly _cluster: SolanaCluster;
  private readonly _connection: Connection;
  readonly _config: HubbleConfig;
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
    this._provider = new Provider(connection, getReadOnlyWallet(), {
      commitment: connection.commitment,
    });
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

  private borrowingMarketStateToDecimals(state: BorrowingMarketState, pubkey: PublicKey) {
    state = replaceBigNumberWithDecimal(state);
    state.depositedCollateral.amounts = replaceBigNumberWithDecimal(state.depositedCollateral.amounts);
    state.inactiveCollateral.amounts = replaceBigNumberWithDecimal(state.inactiveCollateral.amounts);
    state.collateralRewardPerToken = replaceBigNumberWithDecimal(state.collateralRewardPerToken);
    state.withdrawalCap = decimalToNumWithdrawalCap(replaceBigNumberWithDecimal(state.withdrawalCap) as any);
    state.withdrawalCapsCollateral = state.withdrawalCapsCollateral.map((collCap) => {
      collCap.tokenCap = decimalToNumWithdrawalCap(replaceBigNumberWithDecimal(collCap.tokenCap) as any);
      return replaceBigNumberWithDecimal(collCap);
    });
    state.supportedCollaterals = state.supportedCollaterals.map((collateral) =>
      replaceBigNumberWithDecimal(collateral)
    );
    state.pubkey = pubkey;
    return state;
  }

  /**
   * @deprecated Deprecated since version 1.0.114.
   * Please use getBorrowingMarketStateByPubkey or getBorrowingMarketStates and use the correct borrowing market state specified by the UserMetadata.
   * Get Hubble's borrowing market state.
   * @return on-chain {@link BorrowingMarketState} from the borrowing program with numbers as lamports
   */
  async getBorrowingMarketState(): Promise<BorrowingMarketState> {
    console.warn(
      'getBorrowingMarketState has been deprecated since version 1.0.114. Please use getBorrowingMarketStates and use the correct borrowing market state specified by the UserMetadata.'
    );
    const state = (await this._borrowingProgram.account.borrowingMarketState.fetch(
      this._config.borrowing.accounts.borrowingMarketState
    )) as BorrowingMarketState;
    return this.borrowingMarketStateToDecimals(state, this._config.borrowing.accounts.borrowingMarketState);
  }

  /**
   * Get Hubble's borrowing market state by public key.
   * @return on-chain {@link BorrowingMarketState} from the borrowing program with numbers as lamports
   */
  async getBorrowingMarketStateByPubkey(pubkey: PublicKey): Promise<BorrowingMarketState> {
    const state = (await this._borrowingProgram.account.borrowingMarketState.fetch(pubkey)) as BorrowingMarketState;
    return this.borrowingMarketStateToDecimals(state, pubkey);
  }

  /**
   * Get Hubble's borrowing market states.
   * @return list of on-chain {@link BorrowingMarketState} from the borrowing program with numbers as lamports
   */
  async getBorrowingMarketStates(): Promise<BorrowingMarketState[]> {
    const states = [];
    for (const pubkey of this._config.borrowing.accounts.borrowingMarketStates) {
      const state = (await this._borrowingProgram.account.borrowingMarketState.fetch(pubkey)) as BorrowingMarketState;
      states.push(this.borrowingMarketStateToDecimals(state, pubkey));
    }
    return states;
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
    return userStakingStates.find((x) => !x.userStake.isZero());
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
    return stabilityProviderStates.find((x) => !x.depositedStablecoin.isZero());
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
   * Get all non-zero Hubble user staking states.
   * @return list of on-chain {@link UserStakingState} from the borrowing program
   */
  async getUserStakingStates(): Promise<UserStakingState[]> {
    const userStakingStates = (
      await this._borrowingProgram.account.userStakingState.all([
        {
          memcmp: {
            bytes: this._config.borrowing.accounts.stakingPoolState.toBase58(),
            offset: 17, // 8 (account discriminator for user staking state) + 1 (version u8) + 8 (user_id u64)
          },
        },
      ])
    ).map((x) => replaceBigNumberWithDecimal(x.account as UserStakingState));
    return userStakingStates.filter((x) => !x.userStake.isZero());
  }

  /**
   * Get all Hubble stability providers (stability pool stats) and include raw JSON RPC responses in the return value.
   * @return list of on-chain {@link StabilityProviderStateWithJson} from the borrowing program
   */
  async getStabilityProvidersIncludeJsonResponse(): Promise<StabilityProviderStateWithJson[]> {
    return (
      await this._borrowingProgram.account.stabilityProviderState.all([
        {
          memcmp: {
            bytes: this._config.borrowing.accounts.stabilityPoolState.toBase58(),
            offset: 9, // 8 (account discriminator for stability provider state) + 1 (version u8)
          },
        },
      ])
    ).map((x) => {
      const stabilityProvider = Hubble.stabilityProviderStateToDecimals(
        x.account as StabilityProviderState
      ) as StabilityProviderStateWithJson;
      stabilityProvider.jsonResponse = JSON.stringify(x.account);
      return stabilityProvider;
    });
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
    converted.depositedCollateral.extraCollaterals = converted.depositedCollateral.extraCollaterals.map((x) =>
      replaceBigNumberWithDecimal(x)
    );
    converted.inactiveCollateral.extraCollaterals = converted.inactiveCollateral.extraCollaterals.map((x) =>
      replaceBigNumberWithDecimal(x)
    );
    return replaceBigNumberWithDecimal(converted);
  }

  /**
   * Get all of user's metadatas (borrowing state, debt, collateral stats...), user can have multiple borrowing accounts.
   * @param user Base58 encoded Public Key of the user
   * @return on-chain {@link UserMetadata} from the borrowing program for the specific user with numbers as lamports
   */
  async getUserMetadatas(user: PublicKey | string): Promise<UserMetadata[]> {
    const result: UserMetadata[] = [];
    for (const bms of this._config.borrowing.accounts.borrowingMarketStates) {
      const userMetadatas = (
        await this._borrowingProgram.account.userMetadata.all([
          {
            memcmp: {
              bytes: user instanceof PublicKey ? user.toBase58() : user,
              offset: 50, // 8 (account discriminator for usermetadata) + 1 (version u8) + 1 (status u8) + 8 (user_id u64) + 32 (metadata_pk pubkey [u8, 32])
            },
          },
          {
            memcmp: {
              bytes: bms.toBase58(),
              offset: 82, // 8 (account discriminator for usermetadata) + 1 (version u8) + 1 (status u8) + 8 (user_id u64) + 32 (metadata_pk pubkey [u8, 32]) + 32 (owner pubkey)
            },
          },
        ])
      ).map((x) => Hubble.userMetadataToDecimals(x.account as UserMetadata));
      result.push(...userMetadatas);
    }
    return result;
  }

  /**
   * Get specific user metadata (borrowing state, debt, collateral stats...).
   * @param metadata Base58 encoded Public Key of the user metadata
   * @return on-chain {@link UserMetadata} from the borrowing program for the specific user with numbers as lamports
   */
  async getUserMetadata(metadata: PublicKey | string): Promise<UserMetadata> {
    return Hubble.userMetadataToDecimals(
      (await this._borrowingProgram.account.userMetadata.fetch(metadata)) as UserMetadata
    );
  }

  /**
   * Get all Hubble user metadatas (borrowing state, debt, collateral stats...), one user can have multiple borrowing accounts.
   * @return list of on-chain {@link UserMetadata} from the borrowing program for the specific user with numbers as lamports
   */
  async getAllUserMetadatas(): Promise<UserMetadata[]> {
    const result: UserMetadata[] = [];
    for (const bms of this._config.borrowing.accounts.borrowingMarketStates) {
      const userMetadatas = (
        await this._borrowingProgram.account.userMetadata.all([
          {
            memcmp: {
              bytes: bms.toBase58(),
              offset: 82, // 8 (account discriminator for usermetadata) + 1 (version u8) + 1 (status u8) + 8 (user_id u64) + 32 (metadata_pk pubkey [u8, 32]) + 32 (owner pubkey)
            },
          },
        ])
      ).map((x) => Hubble.userMetadataToDecimals(x.account as UserMetadata));
      result.push(...userMetadatas);
    }
    return result;
  }

  /**
   * Get all Hubble user metadatas (borrowing state, debt, collateral stats...) and include raw JSON RPC responses in the return value.
   * @return list of on-chain {@link UserMetadata} from the borrowing program for the specific user with numbers as lamports
   */
  async getAllUserMetadatasIncludeJsonResponse(): Promise<UserMetadataWithJson[]> {
    const result: UserMetadataWithJson[] = [];
    for (const bms of this._config.borrowing.accounts.borrowingMarketStates) {
      const userMetadatas = (
        await this._borrowingProgram.account.userMetadata.all([
          {
            memcmp: {
              bytes: bms.toBase58(),
              offset: 82, // 8 (account discriminator for usermetadata) + 1 (version u8) + 1 (status u8) + 8 (user_id u64) + 32 (metadata_pk pubkey [u8, 32]) + 32 (owner pubkey)
            },
          },
        ])
      ).map((x) => {
        const userMetadata = Hubble.userMetadataToDecimals(x.account as UserMetadata) as UserMetadataWithJson;
        userMetadata.jsonResponse = JSON.stringify(x.account);
        return userMetadata;
      });
      result.push(...userMetadatas);
    }
    return result;
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
    const borrowingMarketStates = await this.getBorrowingMarketStates();
    for (const userVault of userVaults) {
      let borrowingMarketState = borrowingMarketStates.find(
        (x) => x.pubkey.toBase58() === userVault.borrowingMarketState.toBase58()
      );
      if (!borrowingMarketState) {
        borrowingMarketState = await this.getBorrowingMarketStateByPubkey(userVault.borrowingMarketState);
        borrowingMarketStates.push(borrowingMarketState);
      }
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
   * Get user's USDH vault (usdh staked + liquidation rewards + hbb rewards)
   * @param user Base58 encoded Public Key of the user
   * @return USDH vault with amount of USDH staked, liquidation rewards and HBB rewards or
   * undefined if user has never used Hubble before or authorized stability pool deposits
   */
  async getUserUsdhVault(user: PublicKey | string): Promise<UsdhVault | undefined> {
    const provider = await this.getUserStabilityProviderState(user);
    if (provider) {
      const pool = await this.getStabilityPoolState();
      const epoch = await this.getEpochToScaleToSum();
      const usdhStaked = calculateStabilityProvided(pool, provider).dividedBy(STABLECOIN_DECIMALS);
      const gains = calculatePendingGains(pool, provider, epoch);
      return {
        usdhStaked,
        hbbRewards: gains.hbb,
        liquidationRewards: {
          sol: gains.sol,
          eth: gains.eth,
          ftt: gains.ftt,
          btc: gains.btc,
          ray: gains.ray,
          srm: gains.srm,
          msol: gains.msol,
          extraCollaterals: [], // user does not gain any liquidation rewards from extra collateral
        },
      };
    }
    return undefined;
  }

  /**
   * Get a list of epoch to scale to sum values for Hubble
   * @return Array of epoch to scale to sum in decimal format
   */
  async getEpochToScaleToSum() {
    const epoch = await this._borrowingProgram.account.epochToScaleToSumAccount.fetch(
      this._config.borrowing.accounts.epochToScaleToSum
    );
    if (epoch) {
      return replaceBigNumberWithDecimal(epoch.data) as Decimal[];
    }
    throw Error(`Could not get epoch to scale to sum values from ${this._config.borrowing.accounts.epochToScaleToSum}`);
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
   * Get the user's HBB vault (HBB staked + USDH rewards)
   * @param user Base58 encoded Public Key of the user
   * @return HBB vault with number of HBB staked and USDH rewards or
   * undefined if user has never used Hubble before or authorized HBB staking
   */
  async getUserHbbVault(user: PublicKey | string): Promise<HbbVault | undefined> {
    const stakingState = await this.getUserStakingState(user);
    if (stakingState) {
      const stakingPoolState = await this.getStakingPoolState();
      const usdhRewards = new Decimal(
        stakingState.userStake.mul(stakingPoolState.rewardPerToken).minus(stakingState.rewardsTally)
      )
        .div(DECIMAL_FACTOR)
        .div(STABLECOIN_DECIMALS);
      return {
        hbbStaked: stakingState.userStake.dividedBy(HBB_DECIMALS),
        usdhRewards,
      };
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
   * Get circulating supply number of the Hubble (HBB) token.
   * This also takes into account the locked HBB inside Streamflow vesting contracts and subtracts the locked HBB amount.
   * @return Number of HBB in circulation in decimal representation
   */
  async getHbbCirculatingSupply() {
    const tokenSupply = await this._provider.connection.getTokenSupply(this._config.borrowing.accounts.mint.HBB);
    if (!tokenSupply.value.uiAmountString) {
      throw Error(
        `Could not get HBB circulating supply from the HBB mint account: ${this._config.borrowing.accounts.mint.HBB}`
      );
    }
    let totalTokenSupply = new Decimal(tokenSupply.value.uiAmountString);

    if (this._cluster === 'mainnet-beta') {
      try {
        const streams = await Stream.get({
          connection: this._connection,
          wallet: new PublicKey(STREAMFLOW_HBB_CONTRACT),
          cluster: Cluster.Mainnet,
        });
        let notWithdrawnTokens = new Decimal(0);
        for (let [pubkey, stream] of streams) {
          const totalWithdrawn = new Decimal(stream.withdrawnAmount.toString()).add(
            stream.streamflowFeeWithdrawn.toString()
          );
          const deposited = new Decimal(stream.depositedAmount.toString());
          notWithdrawnTokens = notWithdrawnTokens.add(deposited.minus(totalWithdrawn).dividedBy(HBB_DECIMALS));
        }
        totalTokenSupply = totalTokenSupply.minus(notWithdrawnTokens);
      } catch (exception) {
        throw Error(`Could not get HBB Streamflow contract data: ${exception}`);
      }
    }

    return totalTokenSupply;
  }

  async getUsdhCirculatingSupply() {
    const tokenSupply = await this._provider.connection.getTokenSupply(this._config.borrowing.accounts.stablecoinMint);
    if (!tokenSupply.value.uiAmountString) {
      throw Error(
        `Could not get USDH circulating supply from the USDH mint account: ${this._config.borrowing.accounts.stablecoinMint}`
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

  /**
   * Get Hubble's global config values
   */
  async getGlobalConfig(): Promise<GlobalConfig> {
    let globalConfig = (await this._borrowingProgram.account.globalConfig.fetch(
      this._config.borrowing.accounts.globalConfig!
    )) as GlobalConfig;
    globalConfig = replaceBigNumberWithDecimal(globalConfig);
    return globalConfig;
  }

  /**
   * Get PSM reserve state
   */
  async getPsmReserve(): Promise<PsmReserve> {
    const psmPubkey = await this.getPsmPublicKey();
    let reserve = (await this._borrowingProgram.account.psmReserve.fetch(psmPubkey)) as PsmReserve;
    reserve.withdrawalCapStable = decimalToNumWithdrawalCap(
      replaceBigNumberWithDecimal(reserve.withdrawalCapStable) as any
    );
    reserve.withdrawalCapUsdh = decimalToNumWithdrawalCap(
      replaceBigNumberWithDecimal(reserve.withdrawalCapUsdh) as any
    );
    reserve = replaceBigNumberWithDecimal(reserve);
    reserve.mintFeeBps = (reserve.mintFeeBps as any).toNumber();
    reserve.burnFeeBps = (reserve.burnFeeBps as any).toNumber();
    return reserve;
  }

  /**
   * Get PSM public key
   */
  async getPsmPublicKey(): Promise<PublicKey> {
    const res = await PublicKey.findProgramAddress(
      [Buffer.from('PSM'), this._config.borrowing.accounts.USDC!.toBuffer()],
      this._config.borrowing.programId
    );
    return res[0];
  }

  /**
   * Get the USDC -> USDH swap information
   * @param usdcInAmount number of USDC tokens
   * @param slippage
   */
  async getUsdcToUsdhSwap(usdcInAmount: Decimal, slippage: Decimal = new Decimal(0)): Promise<SwapInfo> {
    const psmReserve = await this.getPsmReserve();

    // we would be minting USDH with this operation

    // remaining USDC = max capacity - deposited,
    // this is the amount of USDC that can be stored inside the PSM reserve
    // we can only mint max this much USDH
    const availableUsdc = psmReserve.maxCapacity
      .dividedBy(10 ** psmReserve.stablecoinMintDecimals)
      .minus(psmReserve.depositedStablecoin.dividedBy(10 ** psmReserve.stablecoinMintDecimals));
    let outAmount = usdcInAmount;
    if (usdcInAmount.greaterThan(availableUsdc)) {
      outAmount = new Decimal(0);
    }
    return {
      fees: new Decimal(0), // TODO after fees are implemented
      slippage: new Decimal(0), // TODO: there is no slippage (currently) with PSM
      inAmount: usdcInAmount,
      outAmount,
    };
  }

  /**
   * Get the USDH -> USDC swap information
   * @param usdhInAmount number of USDH tokens
   * @param slippage
   */
  async getUsdhToUsdcSwap(usdhInAmount: Decimal, slippage: Decimal = new Decimal(0)): Promise<SwapInfo> {
    const psmReserve = await this.getPsmReserve();
    let outAmount = new Decimal(0);

    // we are burning USDH with this operation and we can only burn as much as there is deposited_stablecoin inside psm reserve
    const usdcAvailable = psmReserve.depositedStablecoin.dividedBy(10 ** psmReserve.stablecoinMintDecimals);
    if (usdhInAmount.lessThanOrEqualTo(usdcAvailable)) {
      outAmount = usdhInAmount;
    }
    return {
      fees: new Decimal(0), // TODO: after fees are implemented
      slippage: new Decimal(0), // TODO: there is no slippage (currently) with PSM
      inAmount: usdhInAmount,
      outAmount,
    };
  }
}

export default Hubble;
