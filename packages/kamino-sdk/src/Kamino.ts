import {
  getCollateralMintByAddress,
  getConfigByCluster,
  HubbleConfig,
  SolanaCluster,
} from '@hubbleprotocol/hubble-config';
import {
  AccountInfo,
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  AddressLookupTableProgram,
  AddressLookupTableAccount,
  MessageV0,
  TransactionMessage,
} from '@solana/web3.js';
import { setKaminoProgramId } from './kamino-client/programId';
import {
  GlobalConfig,
  TermsSignature,
  WhirlpoolStrategy,
  WhirlpoolStrategyFields,
  CollateralInfos,
} from './kamino-client/accounts';
import Decimal from 'decimal.js';
import { Position, Whirlpool } from './whirpools-client';
import {
  AddLiquidityQuote,
  AddLiquidityQuoteParam,
  defaultSlippagePercentage,
  getNearestValidTickIndexFromTickIndex,
  getRemoveLiquidityQuote,
  getStartTickIndex,
  Percentage,
  priceToTickIndex,
} from '@orca-so/whirlpool-sdk';
import { OrcaDAL } from '@orca-so/whirlpool-sdk/dist/dal/orca-dal';
import { OrcaPosition } from '@orca-so/whirlpool-sdk/dist/position/orca-position';
import {
  Data,
  getEmptyShareData,
  Holdings,
  KaminoPosition,
  ShareData,
  ShareDataWithAddress,
  StrategyBalances,
  StrategyBalanceWithAddress,
  StrategyHolder,
  StrategyProgramAddress,
  StrategyVaultTokens,
  TotalStrategyVaultTokens,
  TreasuryFeeVault,
} from './models';
import { PROGRAM_ID_CLI as WHIRLPOOL_PROGRAM_ID, setWhirlpoolsProgramId } from './whirpools-client/programId';
import { Scope, ScopeToken, SupportedToken, SupportedTokens } from '@hubbleprotocol/scope-sdk';
import { KaminoToken } from './models/KaminoToken';
import { PriceData } from './models/PriceData';
import {
  batchFetch,
  createAssociatedTokenAccountInstruction,
  Dex,
  dexToNumber,
  GenericPoolInfo,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressAndData,
  getDexProgramId,
  getManualRebalanceFieldInfos,
  getPricePercentageRebalanceFieldInfos,
  getReadOnlyWallet,
  getStrategyConfigValue,
  getStrategyRebalanceParams,
  getUpdateStrategyConfigIx,
  numberToRebalanceType,
  RebalanceFieldInfo,
  StrategiesFilters,
  strategyCreationStatusToBase58,
  strategyTypeToBase58,
  VaultParameters,
  ZERO,
} from './utils';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  collectFeesAndRewards,
  CollectFeesAndRewardsAccounts,
  depositAndInvest,
  DepositAndInvestAccounts,
  DepositAndInvestArgs,
  executiveWithdraw,
  ExecutiveWithdrawAccounts,
  ExecutiveWithdrawArgs,
  initializeStrategy,
  InitializeStrategyAccounts,
  InitializeStrategyArgs,
  invest,
  InvestAccounts,
  openLiquidityPosition,
  OpenLiquidityPositionAccounts,
  OpenLiquidityPositionArgs,
  updateRewardMapping,
  UpdateRewardMappingAccounts,
  UpdateRewardMappingArgs,
  updateStrategyConfig,
  UpdateStrategyConfigAccounts,
  UpdateStrategyConfigArgs,
  withdraw,
  WithdrawAccounts,
  WithdrawArgs,
} from './kamino-client/instructions';
import BN from 'bn.js';
import StrategyWithAddress from './models/StrategyWithAddress';
import { Idl, Program, Provider } from '@project-serum/anchor';
import { Rebalancing, Uninitialized } from './kamino-client/types/StrategyStatus';
import {
  FRONTEND_KAMINO_STRATEGY_URL,
  getKaminoTokenName,
  KAMINO_TOKEN_MAP,
  METADATA_PROGRAM_ID,
  METADATA_UPDATE_AUTH,
} from './constants';
import {
  CollateralInfo,
  ExecutiveWithdrawActionKind,
  RebalanceType,
  RebalanceTypeKind,
  StrategyConfigOption,
  StrategyConfigOptionKind,
  StrategyStatusKind,
} from './kamino-client/types';
import { Rebalance } from './kamino-client/types/ExecutiveWithdrawAction';
import { AmmConfig, PersonalPositionState, PoolState } from './raydium_client';
import { PROGRAM_ID as RAYDIUM_PROGRAM_ID, setRaydiumProgramId } from './raydium_client/programId';
import { i32ToBytes, LiquidityMath, SqrtPriceMath, TickMath, TickUtils } from '@raydium-io/raydium-sdk';

import KaminoIdl from './kamino-client/kamino.json';
import { OrcaService, RaydiumService, Whirlpool as OrcaPool, WhirlpoolAprApy } from './services';
import {
  getAddLiquidityQuote,
  InternalAddLiquidityQuote,
  InternalAddLiquidityQuoteParam,
} from '@orca-so/whirlpool-sdk/dist/position/quotes/add-liquidity';
import { signTerms, SignTermsAccounts, SignTermsArgs } from './kamino-client/instructions';
import { Pool } from './services/RaydiumPoolsResponse';
import { Orca, Raydium } from './kamino-client/types/DEX';
import {
  UpdateDepositCap,
  UpdateDepositCapIxn,
  UpdateWithdrawFee,
  UpdateDepositFee,
  UpdateReward0Fee,
  UpdateReward1Fee,
  UpdateReward2Fee,
  UpdateCollectFeesFee,
  UpdateRebalanceType,
} from './kamino-client/types/StrategyConfigOption';
import {
  DefaultDepositCap,
  DefaultDepositCapPerIx,
  DefaultDepositFeeBps,
  DefaultPerformanceFeeBps,
  DefaultWithdrawFeeBps,
} from './constants/DefaultStrategyConfig';
import { DEVNET_GLOBAL_LOOKUP_TABLE, MAINNET_GLOBAL_LOOKUP_TABLE } from './constants/pubkeys';
import {
  DefaultDex,
  DefaultFeeTierOrca,
  DefaultLowerPercentageBPS,
  DefaultLowerPriceDifferenceBPS,
  DefaultMintTokenA,
  DefaultMintTokenB,
  DefaultUpperPercentageBPS,
  DefaultUpperPriceDifferenceBPS,
  FullBPS,
  ManualRebalanceMethod,
  PricePercentageRebalanceMethod,
  RebalanceMethod,
} from './utils/CreationParameters';
export const KAMINO_IDL = KaminoIdl;

export class Kamino {
  private readonly _cluster: SolanaCluster;
  private readonly _connection: Connection;
  readonly _config: HubbleConfig;
  private _globalConfig: PublicKey;
  private readonly _scope: Scope;
  private readonly _provider: Provider;
  private readonly _kaminoProgram: Program;
  private readonly _kaminoProgramId: PublicKey;
  private readonly _tokenMap: KaminoToken[] = KAMINO_TOKEN_MAP;
  private readonly _orcaService: OrcaService;
  private readonly _raydiumService: RaydiumService;

  /**
   * Create a new instance of the Kamino SDK class.
   * @param cluster Name of the Solana cluster
   * @param connection Connection to the Solana cluster
   * @param globalConfig override kamino global config
   * @param programId override kamino program id
   * @param whirlpoolProgramId override whirlpool program id
   * @param raydiumProgramId override raydium program id
   */
  constructor(
    cluster: SolanaCluster,
    connection: Connection,
    globalConfig?: PublicKey,
    programId?: PublicKey,
    whirlpoolProgramId?: PublicKey,
    raydiumProgramId?: PublicKey
  ) {
    this._cluster = cluster;
    this._connection = connection;
    this._config = getConfigByCluster(cluster);
    this._globalConfig = globalConfig ? globalConfig : new PublicKey(this._config.kamino.globalConfig);
    this._provider = new Provider(connection, getReadOnlyWallet(), {
      commitment: connection.commitment,
    });
    this._kaminoProgramId = programId ? programId : this._config.kamino.programId;
    this._kaminoProgram = new Program(KAMINO_IDL as Idl, this._kaminoProgramId, this._provider);

    this._scope = new Scope(cluster, connection);
    setKaminoProgramId(this._kaminoProgramId);

    if (whirlpoolProgramId) {
      setWhirlpoolsProgramId(whirlpoolProgramId);
    }
    if (raydiumProgramId) {
      setRaydiumProgramId(raydiumProgramId);
    }
    this._orcaService = new OrcaService(connection, cluster, this._config);
    this._raydiumService = new RaydiumService(connection, cluster);
  }

  getConnection = () => this._connection;

  getProgramID = () => this._kaminoProgramId;

  getProgram = () => this._kaminoProgram;

  setGlobalConfig = (globalConfig: PublicKey) => {
    this._globalConfig = globalConfig;
  };

  getGlobalConfig = () => this._globalConfig;

  getTokenMap = () => this._tokenMap;

  getDepositableTokens = async (): Promise<CollateralInfo[]> => {
    let config = await GlobalConfig.fetch(this._connection, this._globalConfig);
    if (!config) {
      throw Error(`Could not fetch globalConfig  with pubkey ${this.getGlobalConfig().toString()}`);
    }
    const collateralInfos = await this.getCollateralInfo(config.tokenInfos);

    return collateralInfos.filter((x) => x.mint.toString() != SystemProgram.programId.toString());
  };

  getSupportedDexes = (): Dex[] => ['ORCA', 'RAYDIUM'];

  // const whirlpoolConfig: PublicKey = new PublicKey("2LecshUwdy9xi7meFgHtFJQNSKk4KdTrcpvaB56dP2NQ");

  // todo: see if we can read this dinamically
  getFeeTiersForDex = (dex: Dex): Decimal[] => {
    if (dex == 'ORCA') {
      return [new Decimal(0.0001), new Decimal(0.0005), new Decimal(0.003), new Decimal(0.01)];
    } else if (dex == 'RAYDIUM') {
      return [new Decimal(0.0001), new Decimal(0.0005), new Decimal(0.0025), new Decimal(0.01)];
    } else {
      throw new Error(`Dex ${dex} is not supported`);
    }
  };

  getRebalanceMethods = (): RebalanceMethod[] => {
    return [ManualRebalanceMethod, PricePercentageRebalanceMethod];
  };

  getDefaultRebalanceMethod = (): RebalanceMethod => PricePercentageRebalanceMethod;

  getDefaultParametersForNewVault = async () => {
    const dex = DefaultDex;
    const tokenMintA = DefaultMintTokenA;
    const tokenMintB = DefaultMintTokenB;
    const rebalanceMethod = this.getDefaultRebalanceMethod();
    const feeTier = DefaultFeeTierOrca;
    let rebalancingParameters = await this.getDefaultRebalanceFields(dex, tokenMintA, tokenMintB, rebalanceMethod);
    let defaultParameters: VaultParameters = {
      dex,
      tokenMintA,
      tokenMintB,
      feeTier,
      rebalancingParameters,
    };
    return defaultParameters;
  };

  getFieldsForRebalanceMethod = (
    rebalanceMethod: RebalanceMethod,
    dex: Dex,
    fieldOverrides: RebalanceFieldInfo[],
    tokenAMint: PublicKey,
    tokenBMint: PublicKey
  ) => {
    if (rebalanceMethod == ManualRebalanceMethod) {
      return this.getFieldsForManualRebalanceMethod(dex, fieldOverrides, tokenAMint, tokenBMint);
    } else if (rebalanceMethod == PricePercentageRebalanceMethod) {
      return this.getFieldsForPricePercentageMethod(dex, fieldOverrides, tokenAMint, tokenBMint);
    } else {
      throw new Error(`Rebalance method ${rebalanceMethod} is not supported`);
    }
  };

  getFieldsForManualRebalanceMethod = async (
    dex: Dex,
    fieldOverrides: RebalanceFieldInfo[],
    tokenAMint: PublicKey,
    tokenBMint: PublicKey
  ): Promise<RebalanceFieldInfo[]> => {
    let price = await this.getPriceForPair(dex, tokenAMint, tokenBMint);

    let lowerPrice: number;
    let lowerPriceInput = fieldOverrides.find((x) => x.label == 'lowerPrice');
    if (lowerPriceInput) {
      lowerPrice = lowerPriceInput.value;
    } else {
      lowerPrice = (price * (FullBPS - DefaultLowerPriceDifferenceBPS)) / FullBPS;
    }

    let upperPrice: number;
    let upperPriceInput = fieldOverrides.find((x) => x.label == 'upperPrice');
    if (upperPriceInput) {
      upperPrice = upperPriceInput.value;
    } else {
      upperPrice = (price * (FullBPS + DefaultUpperPriceDifferenceBPS)) / FullBPS;
    }

    return getManualRebalanceFieldInfos(lowerPrice, upperPrice);
  };

  getFieldsForPricePercentageMethod = async (
    dex: Dex,
    fieldOverrides: RebalanceFieldInfo[],
    tokenAMint: PublicKey,
    tokenBMint: PublicKey
  ) => {
    let price = await this.getPriceForPair(dex, tokenAMint, tokenBMint);

    let lowerPriceDifferenceBPS: number;
    let lowerPriceDifferenceBPSInput = fieldOverrides.find((x) => x.label == 'lowerThresholdBps');
    if (lowerPriceDifferenceBPSInput) {
      lowerPriceDifferenceBPS = lowerPriceDifferenceBPSInput.value;
    } else {
      lowerPriceDifferenceBPS = DefaultLowerPriceDifferenceBPS;
    }

    let upperPriceDifferenceBPS: number;
    let upperPriceDifferenceBPSInput = fieldOverrides.find((x) => x.label == 'upperThresholdBps');
    if (upperPriceDifferenceBPSInput) {
      upperPriceDifferenceBPS = upperPriceDifferenceBPSInput.value;
    } else {
      upperPriceDifferenceBPS = DefaultUpperPriceDifferenceBPS;
    }

    let lowerPrice = (price * (FullBPS - lowerPriceDifferenceBPS)) / FullBPS;
    let upperPrice = (price * (FullBPS + upperPriceDifferenceBPS)) / FullBPS;
    let fieldInfos = getPricePercentageRebalanceFieldInfos(lowerPriceDifferenceBPS, upperPriceDifferenceBPS).concat(
      getManualRebalanceFieldInfos(lowerPrice, upperPrice, false)
    );

    return fieldInfos;
  };

  getPriceForPair = async (dex: Dex, poolTokenA: PublicKey, poolTokenB: PublicKey): Promise<number> => {
    if (dex == 'ORCA') {
      let pools = await this.getOrcaPoolsForTokens(poolTokenA, poolTokenB);
      if (pools.length == 0) {
        throw new Error(`No pool found for ${poolTokenA.toString()} and ${poolTokenB.toString()}`);
      }
      return pools[0].price;
    } else if (dex == 'RAYDIUM') {
      let pools = await this.getRaydiumPoolsForTokens(poolTokenA, poolTokenB);
      if (pools.length == 0) {
        throw new Error(`No pool found for ${poolTokenA.toString()} and ${poolTokenB.toString()}`);
      }
      return pools[0].price;
    } else {
      throw new Error(`Dex ${dex} is not supported`);
    }
  };

  getDefaultRebalanceFields = async (
    dex: Dex,
    poolTokenA: PublicKey,
    poolTokenB: PublicKey,
    rebalanceMethod: RebalanceMethod
  ): Promise<RebalanceFieldInfo[]> => {
    let price = await this.getPriceForPair(dex, poolTokenA, poolTokenB);

    if (rebalanceMethod == PricePercentageRebalanceMethod) {
      let lowerPrice = (price * (FullBPS - DefaultLowerPriceDifferenceBPS)) / FullBPS;
      let upperPrice = (price * (FullBPS + DefaultUpperPriceDifferenceBPS)) / FullBPS;

      let fieldInfos = getPricePercentageRebalanceFieldInfos(
        DefaultLowerPercentageBPS,
        DefaultUpperPercentageBPS
      ).concat(getManualRebalanceFieldInfos(lowerPrice, upperPrice, false));

      return fieldInfos;
    } else if (rebalanceMethod == ManualRebalanceMethod) {
      let lowerPrice = (price * (FullBPS - DefaultLowerPercentageBPS)) / FullBPS;
      let upperPrice = (price * (FullBPS + DefaultUpperPercentageBPS)) / FullBPS;

      return getManualRebalanceFieldInfos(lowerPrice, upperPrice);
    } else {
      throw new Error(`Rebalance method ${rebalanceMethod} is not supported`);
    }
  };

  getPoolInitializedForDexPairTier = async (
    dex: Dex,
    poolTokenA: PublicKey,
    poolTokenB: PublicKey,
    fee: Decimal
  ): Promise<PublicKey> => {
    if (dex == 'ORCA') {
      let pool = PublicKey.default;
      let orcaPools = await this.getOrcaPoolsForTokens(poolTokenA, poolTokenB);
      orcaPools.forEach((element) => {
        if (element.lpFeeRate == fee.toNumber()) {
          pool = new PublicKey(element.address);
        }
      });
      return pool;
    } else if (dex == 'RAYDIUM') {
      let pool = PublicKey.default;
      let raydiumPools = await this.getRaydiumPoolsForTokens(poolTokenA, poolTokenB);
      raydiumPools.forEach((element) => {
        if (element.ammConfig.tradeFeeRate == fee.toNumber()) {
          pool = new PublicKey(element.id);
        }
      });
      return pool;
    } else {
      throw new Error(`Dex ${dex} is not supported`);
    }
  };

  async getExistentPoolsForPair(dex: Dex, tokenMintA: PublicKey, tokenMintB: PublicKey): Promise<GenericPoolInfo[]> {
    if (dex == 'ORCA') {
      let pools = await this.getOrcaPoolsForTokens(tokenMintA, tokenMintB);
      let genericPoolInfos: GenericPoolInfo[] = pools.map((x: OrcaPool) => {
        let poolInfo: GenericPoolInfo = {
          dex,
          address: new PublicKey(x.address),
          price: x.price,
          tokenMintA,
          tokenMintB,
          tvl: x.tvl,
          feeRate: x.lpFeeRate,
          volumeOnLast7d: x.volume?.week,
        };
        return poolInfo;
      });
      return genericPoolInfos;
    } else if (dex == 'RAYDIUM') {
      let pools = await this.getRaydiumPoolsForTokens(tokenMintA, tokenMintB);
      let genericPoolInfos: GenericPoolInfo[] = pools.map((x: Pool) => {
        let poolInfo: GenericPoolInfo = {
          dex,
          address: new PublicKey(x.id),
          price: x.price,
          tokenMintA,
          tokenMintB,
          tvl: x.tvl,
          feeRate: x.ammConfig.tradeFeeRate / FullBPS,
          volumeOnLast7d: x.week.volume,
        };
        return poolInfo;
      });

      return genericPoolInfos;
    } else {
      throw new Error(`Dex ${dex} is not supported`);
    }
  }

  getOrcaPoolsForTokens = async (poolTokenA: PublicKey, poolTokenB: PublicKey): Promise<OrcaPool[]> => {
    let pools: OrcaPool[] = [];
    let whirlpools = await this._orcaService.getOrcaWhirlpools();
    whirlpools.whirlpools.forEach((element) => {
      if (
        (element.tokenA.mint.toString() == poolTokenA.toString() &&
          element.tokenB.mint.toString() == poolTokenB.toString()) ||
        (element.tokenA.mint.toString() == poolTokenB.toString() &&
          element.tokenB.mint.toString() == poolTokenA.toString())
      )
        pools.push(element);
    });

    return pools;
  };

  getRaydiumPoolsForTokens = async (poolTokenA: PublicKey, poolTokenB: PublicKey): Promise<Pool[]> => {
    let pools: Pool[] = [];
    let raydiumPools = await this._raydiumService.getRaydiumWhirlpools();
    raydiumPools.data.forEach((element) => {
      if (
        (element.mintA.toString() == poolTokenA.toString() && element.mintB.toString() == poolTokenB.toString()) ||
        (element.mintA.toString() == poolTokenB.toString() && element.mintB.toString() == poolTokenA.toString())
      ) {
        pools.push(element);
      }
    });

    return pools;
  };

  /**
   * Return a list of all Kamino whirlpool strategies
   * @param strategies Limit results to these strategy addresses
   */
  getStrategies = async (strategies?: Array<PublicKey>): Promise<Array<WhirlpoolStrategy | null>> => {
    if (!strategies) {
      strategies = (await this.getAllStrategiesWithFilters({})).map((x) => x.address);
    }
    return await batchFetch(strategies, (chunk) => WhirlpoolStrategy.fetchMultiple(this._connection, chunk));
  };

  /**
   * Return a list of all Kamino whirlpool strategies with their addresses
   * @param strategies Limit results to these strategy addresses
   */
  getStrategiesWithAddresses = async (strategies?: Array<PublicKey>): Promise<Array<StrategyWithAddress>> => {
    if (!strategies) {
      return this.getAllStrategiesWithFilters({});
    }
    const result: StrategyWithAddress[] = [];
    const states = await batchFetch(strategies, (chunk) => WhirlpoolStrategy.fetchMultiple(this._connection, chunk));
    for (let i = 0; i < strategies.length; i++) {
      if (states[i]) {
        result.push({ address: strategies[i], strategy: states[i]! });
      } else {
        throw Error(`Could not fetch strategy state for ${strategies[i].toString()}`);
      }
    }
    return result;
  };

  getAllStrategiesWithFilters = async (strategyFilters: StrategiesFilters): Promise<Array<StrategyWithAddress>> => {
    let filters: GetProgramAccountsFilter[] = [];
    filters.push({
      dataSize: 4064,
    });

    if (strategyFilters.strategyCreationStatus) {
      filters.push({
        memcmp: {
          bytes: strategyCreationStatusToBase58(strategyFilters.strategyCreationStatus),
          offset: 1625,
        },
      });
    }
    if (strategyFilters.strategyType) {
      filters.push({
        memcmp: {
          bytes: strategyTypeToBase58(strategyFilters.strategyType).toString(),
          offset: 1120,
        },
      });
    }

    return (await this._kaminoProgram.account.whirlpoolStrategy.all(filters)).map((x) => {
      const res: StrategyWithAddress = {
        strategy: new WhirlpoolStrategy(x.account as WhirlpoolStrategyFields),
        address: x.publicKey,
      };
      return res;
    });
  };

  /**
   * Get a Kamino whirlpool strategy by its public key address
   * @param address
   */
  getStrategyByAddress = (address: PublicKey) => WhirlpoolStrategy.fetch(this._connection, address);

  /**
   * Get the strategy share data (price + balances) of the specified Kamino whirlpool strategy
   * @param strategy
   * @param scopePrices
   */
  getStrategyShareData = async (
    strategy: PublicKey | StrategyWithAddress,
    scopePrices?: ScopeToken[]
  ): Promise<ShareData> => {
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);
    const sharesFactor = Decimal.pow(10, strategyState.strategy.sharesMintDecimals.toString());
    const sharesIssued = new Decimal(strategyState.strategy.sharesIssued.toString());
    const balances = await this.getStrategyBalances(strategyState.strategy, scopePrices);
    if (sharesIssued.isZero()) {
      return { price: new Decimal(1), balance: balances };
    } else {
      return { price: balances.computedHoldings.totalSum.div(sharesIssued).mul(sharesFactor), balance: balances };
    }
  };

  /**
   * Batch fetch share data for all or a filtered list of strategies
   * @param strategyFilters strategy filters or a list of strategy public keys
   */
  getStrategiesShareData = async (
    strategyFilters: StrategiesFilters | PublicKey[]
  ): Promise<Array<ShareDataWithAddress>> => {
    const result: Array<ShareDataWithAddress> = [];
    const prices = await this.getAllPrices();
    const strategiesWithAddresses = Array.isArray(strategyFilters)
      ? await this.getStrategiesWithAddresses(strategyFilters)
      : await this.getAllStrategiesWithFilters(strategyFilters);
    const fetchBalances: Promise<StrategyBalanceWithAddress>[] = [];

    const raydiumStrategies = strategiesWithAddresses.filter(
      (x) =>
        x.strategy.strategyDex.toNumber() === dexToNumber('RAYDIUM') &&
        x.strategy.position.toString() !== PublicKey.default.toString()
    );
    const raydiumPools = await this.getRaydiumPools(raydiumStrategies.map((x) => x.strategy.pool));
    const raydiumPositions = await this.getRaydiumPositions(raydiumStrategies.map((x) => x.strategy.position));
    const orcaStrategies = strategiesWithAddresses.filter(
      (x) =>
        x.strategy.strategyDex.toNumber() === dexToNumber('ORCA') &&
        x.strategy.position.toString() !== PublicKey.default.toString()
    );
    const orcaPools = await this.getWhirlpools(orcaStrategies.map((x) => x.strategy.pool));
    const orcaPositions = await this.getOrcaPositions(orcaStrategies.map((x) => x.strategy.position));

    const inactiveStrategies = strategiesWithAddresses.filter(
      (x) => x.strategy.position.toString() === PublicKey.default.toString()
    );
    for (const { strategy, address } of inactiveStrategies) {
      const strategyPrices = await this.getPrices(strategy, prices);
      result.push({
        address,
        strategy,
        shareData: getEmptyShareData(strategyPrices),
      });
    }

    fetchBalances.push(
      ...this.getBalance<PoolState, PersonalPositionState>(
        raydiumStrategies,
        raydiumPools,
        raydiumPositions,
        this.getRaydiumBalances,
        prices
      )
    );

    fetchBalances.push(
      ...this.getBalance<Whirlpool, Position>(orcaStrategies, orcaPools, orcaPositions, this.getOrcaBalances, prices)
    );

    const strategyBalances = await Promise.all(fetchBalances);

    for (const { balance, strategyWithAddress } of strategyBalances) {
      const sharesFactor = Decimal.pow(10, strategyWithAddress.strategy.sharesMintDecimals.toString());
      const sharesIssued = new Decimal(strategyWithAddress.strategy.sharesIssued.toString());
      if (sharesIssued.isZero()) {
        result.push({
          address: strategyWithAddress.address,
          strategy: strategyWithAddress.strategy,
          shareData: { price: new Decimal(1), balance },
        });
      } else {
        result.push({
          address: strategyWithAddress.address,
          strategy: strategyWithAddress.strategy,
          shareData: { price: balance.computedHoldings.totalSum.div(sharesIssued).mul(sharesFactor), balance },
        });
      }
    }

    return result;
  };

  private getBalance = <PoolT, PositionT>(
    strategies: StrategyWithAddress[],
    pools: (PoolT | null)[],
    positions: (PositionT | null)[],
    fetchBalance: (
      strategy: WhirlpoolStrategy,
      pool: PoolT,
      position: PositionT,
      prices?: ScopeToken[]
    ) => Promise<StrategyBalances>,
    prices?: ScopeToken[]
  ): Promise<StrategyBalanceWithAddress>[] => {
    const fetchBalances: Promise<StrategyBalanceWithAddress>[] = [];
    for (let i = 0; i < strategies.length; i++) {
      const { strategy, address } = strategies[i];
      const pool = pools[i];
      const position = positions[i];
      if (!pool) {
        throw new Error(`Pool ${strategy.pool.toString()} could not be found.`);
      }
      if (!position) {
        throw new Error(`Position ${strategy.position.toString()} could not be found.`);
      }
      fetchBalances.push(
        fetchBalance(strategy, pool as PoolT, position as PositionT, prices).then((balance) => {
          return { balance, strategyWithAddress: { strategy, address } };
        })
      );
    }
    return fetchBalances;
  };

  private getRaydiumBalances = async (
    strategy: WhirlpoolStrategy,
    pool: PoolState,
    position: PersonalPositionState,
    prices?: ScopeToken[]
  ) => {
    const lowerSqrtPriceX64 = SqrtPriceMath.getSqrtPriceX64FromTick(position.tickLowerIndex);
    const upperSqrtPriceX64 = SqrtPriceMath.getSqrtPriceX64FromTick(position.tickUpperIndex);

    const { amountA, amountB } = LiquidityMath.getAmountsFromLiquidity(
      pool.sqrtPriceX64,
      new BN(lowerSqrtPriceX64),
      new BN(upperSqrtPriceX64),
      position.liquidity,
      false // round down so the holdings are not overestimated
    );

    const strategyPrices = await this.getPrices(strategy, prices);
    const aAvailable = new Decimal(strategy.tokenAAmounts.toString());
    const bAvailable = new Decimal(strategy.tokenBAmounts.toString());
    const aInvested = new Decimal(amountA.toString());
    const bInvested = new Decimal(amountB.toString());

    let computedHoldings: Holdings = this.getStrategyHoldingsUsd(
      aAvailable,
      bAvailable,
      aInvested,
      bInvested,
      new Decimal(strategy.tokenAMintDecimals.toString()),
      new Decimal(strategy.tokenBMintDecimals.toString()),
      strategyPrices.aPrice,
      strategyPrices.bPrice
    );

    const balance: StrategyBalances = {
      computedHoldings,
      prices: strategyPrices,
      tokenAAmounts: aAvailable.plus(aInvested),
      tokenBAmounts: bAvailable.plus(bInvested),
    };
    return balance;
  };

  private getOrcaBalances = async (
    strategy: WhirlpoolStrategy,
    pool: Whirlpool,
    position: Position,
    prices?: ScopeToken[]
  ) => {
    const strategyPrices = await this.getPrices(strategy, prices);
    const quote = getRemoveLiquidityQuote({
      positionAddress: strategy.position,
      liquidity: position.liquidity,
      slippageTolerance: Percentage.fromFraction(0, 1000),
      sqrtPrice: pool.sqrtPrice,
      tickLowerIndex: position.tickLowerIndex,
      tickUpperIndex: position.tickUpperIndex,
      tickCurrentIndex: pool.tickCurrentIndex,
    });
    const aAvailable = new Decimal(strategy.tokenAAmounts.toString());
    const bAvailable = new Decimal(strategy.tokenBAmounts.toString());
    const aInvested = new Decimal(quote.estTokenA.toString());
    const bInvested = new Decimal(quote.estTokenB.toString());
    const computedHoldings: Holdings = this.getStrategyHoldingsUsd(
      aAvailable,
      bAvailable,
      aInvested,
      bInvested,
      new Decimal(strategy.tokenAMintDecimals.toString()),
      new Decimal(strategy.tokenBMintDecimals.toString()),
      strategyPrices.aPrice,
      strategyPrices.bPrice
    );

    const balance: StrategyBalances = {
      computedHoldings,
      prices: strategyPrices,
      tokenAAmounts: aAvailable.plus(aInvested),
      tokenBAmounts: bAvailable.plus(bInvested),
    };
    return balance;
  };

  /**
   * Get the strategies share data (price + balances) of the Kamino whirlpool strategies that match the filters
   * @param strategyFilters
   */
  getStrategyShareDataForStrategies = async (
    strategyFilters: StrategiesFilters
  ): Promise<Array<ShareDataWithAddress>> => {
    // weird name of method, but want to keep this method backwards compatible and not rename it
    return this.getStrategiesShareData(strategyFilters);
  };

  /**
   * Get the strategy share price of the specified Kamino whirlpool strategy
   * @param strategy
   */
  getStrategySharePrice = async (strategy: PublicKey | StrategyWithAddress): Promise<Decimal> => {
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);
    const sharesFactor = Decimal.pow(10, strategyState.strategy.sharesMintDecimals.toString());
    const sharesIssued = new Decimal(strategyState.strategy.sharesIssued.toString());
    const balances = await this.getStrategyBalances(strategyState.strategy);
    if (sharesIssued.isZero()) {
      return new Decimal(1);
    } else {
      return balances.computedHoldings.totalSum.div(sharesIssued).mul(sharesFactor);
    }
  };

  private getTokenAccountBalance = async (tokenAccount: PublicKey): Promise<Decimal> => {
    const tokenAccountBalance = await this._connection.getTokenAccountBalance(tokenAccount);
    if (!tokenAccountBalance.value) {
      throw new Error(`Could not get token account balance for ${tokenAccount.toString()}.`);
    }
    return new Decimal(tokenAccountBalance.value.uiAmountString!);
  };

  private getStrategyBalances = async (strategy: WhirlpoolStrategy, scopePrices?: ScopeToken[]) => {
    if (strategy.strategyDex.toNumber() == dexToNumber('ORCA')) {
      return this.getStrategyBalancesOrca(strategy, scopePrices);
    } else if (strategy.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      return this.getStrategyBalancesRaydium(strategy, scopePrices);
    } else {
      throw new Error(`Invalid dex ${strategy.strategyDex.toString()}`);
    }
  };

  /**
   * Get amount of specified token in all Kamino live strategies
   * @param tokenMint token mint pubkey
   */
  getTotalTokensInStrategies = async (tokenMint: PublicKey | string): Promise<TotalStrategyVaultTokens> => {
    const strategies = await this.getStrategiesShareData({ strategyCreationStatus: 'LIVE' });
    let totalTokenAmount = new Decimal(0);
    const vaults: StrategyVaultTokens[] = [];
    for (const { strategy, address, shareData } of strategies) {
      const aTotal = shareData.balance.computedHoldings.invested.a.plus(shareData.balance.computedHoldings.available.a);
      const bTotal = shareData.balance.computedHoldings.invested.b.plus(shareData.balance.computedHoldings.available.b);
      let amount = new Decimal(0);
      if (strategy.tokenAMint.toString() === tokenMint.toString() && aTotal.greaterThan(0)) {
        amount = aTotal;
      } else if (strategy.tokenBMint.toString() === tokenMint.toString() && bTotal.greaterThan(0)) {
        amount = bTotal;
      }
      if (amount.greaterThan(0)) {
        totalTokenAmount = totalTokenAmount.plus(amount);
        vaults.push({
          address: address,
          frontendUrl: `${FRONTEND_KAMINO_STRATEGY_URL}/${address}`,
          amount,
        });
      }
    }
    return { totalTokenAmount, vaults, timestamp: new Date() };
  };

  private getStrategyBalancesOrca = async (strategy: WhirlpoolStrategy, scopePrices?: ScopeToken[]) => {
    const states = await Promise.all([
      Whirlpool.fetch(this._connection, strategy.pool),
      Position.fetch(this._connection, strategy.position),
    ]);
    const whirlpool = states[0];
    const position = states[1];

    if (!position) {
      throw new Error(`Position ${strategy.position.toString()} could not be found.`);
    }
    if (!whirlpool) {
      throw new Error(`Whirlpool ${strategy.pool.toString()} could not be found.`);
    }

    return this.getOrcaBalances(strategy, whirlpool, position, scopePrices);
  };

  private getStrategyBalancesRaydium = async (strategy: WhirlpoolStrategy, scopePrices?: ScopeToken[]) => {
    const states = await Promise.all([
      PoolState.fetch(this._connection, strategy.pool),
      PersonalPositionState.fetch(this._connection, strategy.position),
    ]);
    const poolState = states[0];
    const positionState = states[1];

    if (!positionState) {
      throw new Error(`Raydium position ${strategy.position.toString()} could not be found.`);
    }
    if (!poolState) {
      throw new Error(`Raydium pool ${strategy.pool.toString()} could not be found.`);
    }

    return this.getRaydiumBalances(strategy, poolState, positionState, scopePrices);
  };

  private getStrategyHoldingsUsd = (
    aAvailable: Decimal,
    bAvailable: Decimal,
    aInvested: Decimal,
    bInvested: Decimal,
    decimalsA: Decimal,
    decimalsB: Decimal,
    aPrice: Decimal,
    bPrice: Decimal
  ): Holdings => {
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
  };

  private getAllPrices = (): Promise<ScopeToken[]> => this._scope.getPrices([...SupportedTokens]);

  private getPrices = async (strategy: WhirlpoolStrategy, scopeTokens?: ScopeToken[]): Promise<PriceData> => {
    const collateralMintA = getCollateralMintByAddress(strategy.tokenAMint, this._config);
    const collateralMintB = getCollateralMintByAddress(strategy.tokenBMint, this._config);
    if (!collateralMintA) {
      throw Error(`Could not map token mint with scope price token (token A: ${strategy.tokenAMint.toBase58()})`);
    }
    if (!collateralMintB) {
      throw Error(`Could not map token mint with scope price token (token B: ${strategy.tokenBMint.toBase58()})`);
    }
    const tokens: SupportedToken[] = [];
    const rewardToken0 = this.getRewardToken(strategy.reward0CollateralId.toNumber(), tokens);
    const rewardToken1 = this.getRewardToken(strategy.reward1CollateralId.toNumber(), tokens);
    const rewardToken2 = this.getRewardToken(strategy.reward2CollateralId.toNumber(), tokens);
    tokens.push(collateralMintA.scopeToken as SupportedToken);
    tokens.push(collateralMintB.scopeToken as SupportedToken);

    let prices: ScopeToken[];
    if (scopeTokens) {
      prices = scopeTokens;
    } else {
      prices = await this._scope.getPrices([...new Set(tokens)]);
    }
    const aPrice = prices.find((x) => x.name === collateralMintA.scopeToken);
    const bPrice = prices.find((x) => x.name === collateralMintB.scopeToken);

    const reward0Price = prices.find((x) => x.name === rewardToken0?.name)?.price ?? new Decimal(0);
    const reward1Price = prices.find((x) => x.name === rewardToken1?.name)?.price ?? new Decimal(0);
    const reward2Price = prices.find((x) => x.name === rewardToken2?.name)?.price ?? new Decimal(0);

    if (!aPrice) {
      throw Error(`Could not get token price from scope for ${collateralMintA.scopeToken}`);
    }
    if (!bPrice) {
      throw Error(`Could not get token price from scope for ${collateralMintB.scopeToken}`);
    }
    return { aPrice: aPrice.price, bPrice: bPrice.price, reward0Price, reward1Price, reward2Price };
  };

  private getRewardToken = (tokenId: number, tokens: SupportedToken[]) => {
    const rewardToken = this._tokenMap.find((x) => x.id === tokenId);
    if (rewardToken) {
      tokens.push(rewardToken.name);
    }
    return rewardToken;
  };

  /**
   * Get all token accounts for the specified share mint
   */
  getShareTokenAccounts = (shareMint: PublicKey) => {
    //how to get all token accounts for specific mint: https://spl.solana.com/token#finding-all-token-accounts-for-a-specific-mint
    //get it from the hardcoded token program and create a filter with the actual mint address
    //datasize:165 filter selects all token accounts, memcmp filter selects based on the mint address withing each token account
    return this._connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [{ dataSize: 165 }, { memcmp: { offset: 0, bytes: shareMint.toBase58() } }],
    });
  };

  /**
   * Get all token accounts for the specified wallet
   */
  getAllTokenAccounts = (wallet: PublicKey) => {
    //how to get all token accounts for specific wallet: https://spl.solana.com/token#finding-all-token-accounts-for-a-wallet
    return this._connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
      filters: [{ dataSize: 165 }, { memcmp: { offset: 32, bytes: wallet.toString() } }],
    });
  };

  /**
   * Get all token accounts that are holding a specific Kamino whirlpool strategy
   */
  getStrategyTokenAccounts = async (strategy: PublicKey | StrategyWithAddress) => {
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);
    return this.getShareTokenAccounts(strategyState.strategy.sharesMint);
  };

  /**
   * Get all strategy token holders
   * @param strategy
   */
  getStrategyHolders = async (strategy: PublicKey | StrategyWithAddress): Promise<StrategyHolder[]> => {
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);
    const tokenAccounts = await this.getStrategyTokenAccounts(strategyState);
    const result: StrategyHolder[] = [];
    for (const tokenAccount of tokenAccounts) {
      const accountData = tokenAccount.account.data as Data;
      result.push({
        holderPubkey: new PublicKey(accountData.parsed.info.owner),
        amount: new Decimal(accountData.parsed.info.tokenAmount.uiAmountString),
      });
    }
    return result;
  };

  /**
   * Get a list of whirlpools from public keys
   * @param whirlpools
   */
  getWhirlpools = (whirlpools: PublicKey[]) =>
    batchFetch(whirlpools, (chunk) => Whirlpool.fetchMultiple(this._connection, chunk));

  /**
   * Get a list of Orca positions from public keys
   * @param positions
   */
  getOrcaPositions = (positions: PublicKey[]) =>
    batchFetch(positions, (chunk) => Position.fetchMultiple(this._connection, chunk));

  /**
   * Get a list of Raydium positions from public keys
   * @param positions
   */
  getRaydiumPositions = (positions: PublicKey[]) =>
    batchFetch(positions, (chunk) => PersonalPositionState.fetchMultiple(this._connection, chunk));

  /**
   * Get whirlpool from public key
   * @param whirlpool pubkey of the orca whirlpool
   */
  getWhirlpoolByAddress = (whirlpool: PublicKey) => Whirlpool.fetch(this._connection, whirlpool);

  /**
   * Get a list of Raydium pools from public keys
   * @param pools
   */
  getRaydiumPools = (pools: PublicKey[]) => {
    return batchFetch(pools, (chunk) => PoolState.fetchMultiple(this._connection, chunk));
  };

  getRaydiumAmmConfig = (config: PublicKey) => AmmConfig.fetch(this._connection, config);

  /**
   * Get Raydium pool from public key
   * @param pool pubkey of the orca whirlpool
   */
  getRaydiumPoollByAddress = (pool: PublicKey) => PoolState.fetch(this._connection, pool);

  /**
   * Get scope token name from a kamino strategy collateral ID
   * @param collateralId ID of the collateral token
   * @returns Kamino token name
   */
  getTokenName = (collateralId: number) => getKaminoTokenName(collateralId);

  /**
   * Get Kamino collateral ID from token name
   * @param name Name of the collateral token
   * @returns Kamino collateral ID
   */
  getCollateralId = (name: SupportedToken) => {
    const token = this._tokenMap.find((x) => x.name === name);
    if (!token) {
      throw Error(`Token with collateral name ${name} does not exist.`);
    }
    return token.id;
  };

  /**
   * Return transaction instruction to withdraw shares from a strategy owner (wallet) and get back token A and token B
   * @param strategy strategy public key
   * @param sharesAmount amount of shares (decimal representation), NOT in lamports
   * @param owner shares owner (wallet with shares)
   * @returns transaction instruction
   */
  withdrawShares = async (strategy: PublicKey | StrategyWithAddress, sharesAmount: Decimal, owner: PublicKey) => {
    if (sharesAmount.lessThanOrEqualTo(0)) {
      throw Error('Shares amount cant be lower than or equal to 0.');
    }
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);

    const { treasuryFeeTokenAVault, treasuryFeeTokenBVault, treasuryFeeVaultAuthority } =
      await this.getTreasuryFeeVaultPDAs(strategyState.strategy.tokenAMint, strategyState.strategy.tokenBMint);

    const sharesAta = await getAssociatedTokenAddress(strategyState.strategy.sharesMint, owner);
    const tokenAAta = await getAssociatedTokenAddress(strategyState.strategy.tokenAMint, owner);
    const tokenBAta = await getAssociatedTokenAddress(strategyState.strategy.tokenBMint, owner);

    const sharesAmountInLamports = sharesAmount.mul(
      new Decimal(10).pow(strategyState.strategy.sharesMintDecimals.toString())
    );

    let programId = getDexProgramId(strategyState.strategy);

    const args: WithdrawArgs = { sharesAmount: new BN(sharesAmountInLamports.toString()) };
    const accounts: WithdrawAccounts = {
      user: owner,
      strategy: strategyState.address,
      globalConfig: strategyState.strategy.globalConfig,
      pool: strategyState.strategy.pool,
      position: strategyState.strategy.position,
      tickArrayLower: strategyState.strategy.tickArrayLower,
      tickArrayUpper: strategyState.strategy.tickArrayUpper,
      tokenAVault: strategyState.strategy.tokenAVault,
      tokenBVault: strategyState.strategy.tokenBVault,
      baseVaultAuthority: strategyState.strategy.baseVaultAuthority,
      poolTokenVaultA: strategyState.strategy.poolTokenVaultA,
      poolTokenVaultB: strategyState.strategy.poolTokenVaultB,
      tokenAAta: tokenAAta,
      tokenBAta: tokenBAta,
      userSharesAta: sharesAta,
      sharesMint: strategyState.strategy.sharesMint,
      treasuryFeeTokenAVault,
      treasuryFeeTokenBVault,
      tokenProgram: TOKEN_PROGRAM_ID,
      positionTokenAccount: strategyState.strategy.positionTokenAccount,
      raydiumProtocolPositionOrBaseVaultAuthority: strategyState.strategy.raydiumProtocolPositionOrBaseVaultAuthority,
      poolProgram: programId,
      instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
    };

    return withdraw(args, accounts);
  };

  /**
   * Get transaction instructions that create associated token accounts if they don't exist (token A, B and share)
   * @param owner wallet owner (shareholder)
   * @param strategyState kamino strategy state
   * @param tokenAData token A data of the owner's wallet
   * @param tokenAAta associated token account for token B
   * @param tokenBData token B data of the owner's wallet
   * @param tokenBAta associated token account for token B
   * @param sharesMintData shares data of the owner's wallet
   * @param sharesAta associated token account for shares
   * @returns list of transaction instructions (empty if all accounts already exist)
   */
  getCreateAssociatedTokenAccountInstructionsIfNotExist = async (
    owner: PublicKey,
    strategyState: StrategyWithAddress,
    tokenAData: AccountInfo<Buffer> | null,
    tokenAAta: PublicKey,
    tokenBData: AccountInfo<Buffer> | null,
    tokenBAta: PublicKey,
    sharesMintData: AccountInfo<Buffer> | null,
    sharesAta: PublicKey
  ) => {
    const instructions: TransactionInstruction[] = [];
    if (!tokenAData) {
      instructions.push(
        createAssociatedTokenAccountInstruction(owner, tokenAAta, owner, strategyState.strategy.tokenAMint)
      );
    }
    if (!tokenBData) {
      instructions.push(
        createAssociatedTokenAccountInstruction(owner, tokenBAta, owner, strategyState.strategy.tokenBMint)
      );
    }
    if (!sharesMintData) {
      instructions.push(
        createAssociatedTokenAccountInstruction(owner, sharesAta, owner, strategyState.strategy.sharesMint)
      );
    }
    return instructions;
  };

  /**
   * Check if strategy has already been fetched (is StrategyWithAddress type) and return that,
   * otherwise fetch it first from PublicKey and return it
   * @param strategy
   * @private
   */
  private getStrategyStateIfNotFetched = async (strategy: PublicKey | StrategyWithAddress) => {
    const hasStrategyBeenFetched = (object: PublicKey | StrategyWithAddress): object is StrategyWithAddress => {
      return 'strategy' in object;
    };

    if (hasStrategyBeenFetched(strategy)) {
      return strategy;
    } else {
      const strategyState = await this.getStrategyByAddress(strategy);
      if (!strategyState) {
        throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
      }
      return { strategy: strategyState, address: strategy };
    }
  };

  /**
   * Get treasury fee vault program addresses from for token A and B mints
   * @param tokenAMint
   * @param tokenBMint
   * @private
   */
  private getTreasuryFeeVaultPDAs = (tokenAMint: PublicKey, tokenBMint: PublicKey): TreasuryFeeVault => {
    const [treasuryFeeTokenAVault, _treasuryFeeTokenAVaultBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('treasury_fee_vault'), tokenAMint.toBuffer()],
      this.getProgramID()
    );
    const [treasuryFeeTokenBVault, _treasuryFeeTokenBVaultBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('treasury_fee_vault'), tokenBMint.toBuffer()],
      this.getProgramID()
    );
    const [treasuryFeeVaultAuthority, _treasuryFeeVaultAuthorityBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('treasury_fee_vault_authority')],
      this.getProgramID()
    );
    return { treasuryFeeTokenAVault, treasuryFeeTokenBVault, treasuryFeeVaultAuthority };
  };

  /**
   * Get a transaction instruction to withdraw all strategy shares from a specific wallet into token A and B
   * @param strategy public key of the strategy
   * @param owner public key of the owner (shareholder)
   * @returns transaction instruction or null if no shares or no sharesMint ATA present in the wallet
   */
  withdrawAllShares = async (strategy: PublicKey | StrategyWithAddress, owner: PublicKey) => {
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);
    const [sharesAta, sharesData] = await getAssociatedTokenAddressAndData(
      this._connection,
      strategyState.strategy.sharesMint,
      owner
    );
    if (!sharesData) {
      return null;
    }
    const balance = await this.getTokenAccountBalance(sharesAta);
    if (balance.isZero()) {
      return null;
    }
    return this.withdrawShares(strategyState, balance, owner);
  };

  /**
   * Get transaction instruction to deposit token A and B into a strategy.
   * @param strategy Kamino strategy public key or on-chain object
   * @param amountA Amount of token A to deposit into strategy
   * @param amountB Amount of token B to deposit into strategy
   * @param owner Owner (wallet, shareholder) public key
   * @returns transaction instruction for depositing tokens into a strategy
   */
  deposit = async (strategy: PublicKey | StrategyWithAddress, amountA: Decimal, amountB: Decimal, owner: PublicKey) => {
    if (amountA.lessThanOrEqualTo(0) || amountB.lessThanOrEqualTo(0)) {
      throw Error('Token A or B amount cant be lower than or equal to 0.');
    }
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);

    let poolProgram = PublicKey.default;
    if (strategyState.strategy.strategyDex.toNumber() == dexToNumber('ORCA')) {
      poolProgram = WHIRLPOOL_PROGRAM_ID;
    } else if (strategyState.strategy.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      poolProgram = RAYDIUM_PROGRAM_ID;
    } else {
      throw new Error(`Invaid dex ${strategyState.strategy.strategyDex}`);
    }
    const globalConfig = await GlobalConfig.fetch(this._connection, strategyState.strategy.globalConfig);
    if (!globalConfig) {
      throw Error(`Could not fetch global config with pubkey ${strategyState.strategy.globalConfig.toString()}`);
    }

    const { treasuryFeeTokenAVault, treasuryFeeTokenBVault } = this.getTreasuryFeeVaultPDAs(
      strategyState.strategy.tokenAMint,
      strategyState.strategy.tokenBMint
    );

    const [sharesAta] = await getAssociatedTokenAddressAndData(
      this._connection,
      strategyState.strategy.sharesMint,
      owner
    );
    const [tokenAAta] = await getAssociatedTokenAddressAndData(
      this._connection,
      strategyState.strategy.tokenAMint,
      owner
    );
    const [tokenBAta] = await getAssociatedTokenAddressAndData(
      this._connection,
      strategyState.strategy.tokenBMint,
      owner
    );

    const lamportsA = amountA.mul(new Decimal(10).pow(strategyState.strategy.tokenAMintDecimals.toString()));
    const lamportsB = amountB.mul(new Decimal(10).pow(strategyState.strategy.tokenBMintDecimals.toString()));

    const depositArgs: DepositAndInvestArgs = {
      tokenMaxA: new BN(lamportsA.toString()),
      tokenMaxB: new BN(lamportsB.toString()),
    };

    const depositAccounts: DepositAndInvestAccounts = {
      user: owner,
      strategy: strategyState.address,
      globalConfig: strategyState.strategy.globalConfig,
      pool: strategyState.strategy.pool,
      position: strategyState.strategy.position,
      tokenAVault: strategyState.strategy.tokenAVault,
      tokenBVault: strategyState.strategy.tokenBVault,
      baseVaultAuthority: strategyState.strategy.baseVaultAuthority,
      treasuryFeeTokenAVault,
      treasuryFeeTokenBVault,
      tokenAAta,
      tokenBAta,
      tokenAMint: strategyState.strategy.tokenAMint,
      tokenBMint: strategyState.strategy.tokenBMint,
      userSharesAta: sharesAta,
      sharesMint: strategyState.strategy.sharesMint,
      sharesMintAuthority: strategyState.strategy.sharesMintAuthority,
      scopePrices: strategyState.strategy.scopePrices,
      tokenInfos: globalConfig.tokenInfos,
      systemProgram: SystemProgram.programId,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
      raydiumProtocolPositionOrBaseVaultAuthority: strategyState.strategy.raydiumProtocolPositionOrBaseVaultAuthority,
      positionTokenAccount: strategyState.strategy.positionTokenAccount,
      poolTokenVaultA: strategyState.strategy.poolTokenVaultA,
      poolTokenVaultB: strategyState.strategy.poolTokenVaultB,
      tickArrayLower: strategyState.strategy.tickArrayLower,
      tickArrayUpper: strategyState.strategy.tickArrayUpper,
      poolProgram: poolProgram,
    };

    return depositAndInvest(depositArgs, depositAccounts);
  };

  /**
   * Get transaction instruction to create a new Kamino strategy.
   * Current limitations:
   *   - strategy can only be created by the owner (admin) of the global config, we will need to allow non-admins to bypass this check
   *   - after the strategy is created, only the owner (admin) can update the treasury fee vault with token A/B, we need to allow non-admins to be able to do (and require) this as well
   * @param strategy public key of the new strategy to create
   * @param pool public key of the CLMM pool (either Orca or Raydium)
   * @param owner public key of the strategy owner (admin authority)
   * @param tokenA name of the token A collateral used in the strategy
   * @param tokenB name of the token B collateral used in the strategy
   * @param dex decentralized exchange specifier
   * @returns transaction instruction for Kamino strategy creation
   */
  createStrategy = async (
    strategy: PublicKey,
    pool: PublicKey,
    owner: PublicKey,
    tokenA: SupportedToken,
    tokenB: SupportedToken,
    dex: Dex
  ) => {
    let tokenMintA = PublicKey.default;
    let tokenMintB = PublicKey.default;
    if (dex == 'ORCA') {
      const whirlpoolState = await Whirlpool.fetch(this._connection, pool);
      if (!whirlpoolState) {
        throw Error(`Could not fetch whirlpool state with pubkey ${pool.toString()}`);
      }
      tokenMintA = whirlpoolState.tokenMintA;
      tokenMintB = whirlpoolState.tokenMintB;
    } else if (dex == 'RAYDIUM') {
      const raydiumPoolState = await PoolState.fetch(this._connection, pool);
      if (!raydiumPoolState) {
        throw Error(`Could not fetch Raydium pool state with pubkey ${pool.toString()}`);
      }
      tokenMintA = raydiumPoolState.tokenMint0;
      tokenMintB = raydiumPoolState.tokenMint1;
    } else {
      throw new Error(`Invalid dex ${dex.toString()}`);
    }

    let config = await GlobalConfig.fetch(this._connection, this._globalConfig);
    if (!config) {
      throw Error(`Could not fetch globalConfig  with pubkey ${this.getGlobalConfig().toString()}`);
    }

    const programAddresses = await this.getStrategyProgramAddresses(strategy, tokenMintA, tokenMintB);

    const strategyArgs: InitializeStrategyArgs = {
      tokenACollateralId: new BN(this.getCollateralId(tokenA)),
      tokenBCollateralId: new BN(this.getCollateralId(tokenB)),
      strategyType: new BN(dexToNumber(dex)),
    };

    const strategyAccounts: InitializeStrategyAccounts = {
      adminAuthority: owner,
      strategy,
      globalConfig: this._globalConfig,
      pool,
      tokenAMint: tokenMintA,
      tokenBMint: tokenMintB,
      tokenAVault: programAddresses.tokenAVault,
      tokenBVault: programAddresses.tokenBVault,
      baseVaultAuthority: programAddresses.baseVaultAuthority,
      sharesMint: programAddresses.sharesMint,
      sharesMintAuthority: programAddresses.sharesMintAuthority,
      scopePriceId: config.scopePriceId,
      scopeProgramId: config.scopeProgramId,
      tokenInfos: config.tokenInfos,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    };

    return initializeStrategy(strategyArgs, strategyAccounts);
  };

  /**
   * Find program adresses required for kamino strategy creation
   * @param strategy
   * @param tokenMintA
   * @param tokenMintB
   * @private
   * @returns object with program addresses for kamino strategy creation
   */
  private getStrategyProgramAddresses = async (
    strategy: PublicKey,
    tokenMintA: PublicKey,
    tokenMintB: PublicKey
  ): Promise<StrategyProgramAddress> => {
    const [tokenAVault, tokenABump] = PublicKey.findProgramAddressSync(
      [Buffer.from('svault_a'), strategy.toBuffer()],
      this.getProgramID()
    );
    const [tokenBVault, tokenBBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('svault_b'), strategy.toBuffer()],
      this.getProgramID()
    );
    const [baseVaultAuthority, baseVaultAuthorityBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('authority'), tokenAVault.toBuffer(), tokenBVault.toBuffer()],
      this.getProgramID()
    );
    const [sharesMint, sharesMintBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('shares'), strategy.toBuffer(), tokenMintA.toBuffer(), tokenMintB.toBuffer()],
      this.getProgramID()
    );
    const [sharesMintAuthority, sharesMintAuthorityBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('authority'), sharesMint.toBuffer()],
      this.getProgramID()
    );

    return {
      sharesMintAuthority,
      tokenAVault,
      tokenBVault,
      baseVaultAuthority,
      baseVaultAuthorityBump,
      sharesMintAuthorityBump,
      sharesMintBump,
      tokenBBump,
      sharesMint,
      tokenABump,
    };
  };

  /**
   * Get transaction instruction to create a new rent exempt strategy account
   * @param payer transaction payer (signer) public key
   * @param newStrategy public key of the new strategy
   * @returns transaction instruction to create the account
   */
  createStrategyAccount = async (payer: PublicKey, newStrategy: PublicKey) => {
    const accountSize = this._kaminoProgram.account.whirlpoolStrategy.size;
    return this.createAccountRentExempt(payer, newStrategy, accountSize);
  };

  createAccountRentExempt = async (payer: PublicKey, newAccountPubkey: PublicKey, size: number) => {
    const lamports = await this._connection.getMinimumBalanceForRentExemption(size);
    return SystemProgram.createAccount({
      programId: this.getProgramID(),
      fromPubkey: payer,
      newAccountPubkey,
      space: size,
      lamports,
    });
  };

  /**
   * Get transaction instruction to collect strategy fees from the treasury fee
   * vaults and rewards from the reward vaults.
   * @param strategy strategy public key or already fetched object
   * @returns transaction instruction to collect strategy fees and rewards
   */
  collectFeesAndRewards = async (strategy: PublicKey | StrategyWithAddress) => {
    const { address: strategyPubkey, strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    const { treasuryFeeTokenAVault, treasuryFeeTokenBVault, treasuryFeeVaultAuthority } =
      await this.getTreasuryFeeVaultPDAs(strategyState.tokenAMint, strategyState.tokenBMint);

    let programId = WHIRLPOOL_PROGRAM_ID;

    let poolRewardVault0 = PublicKey.default;
    let poolRewardVault1 = PublicKey.default;
    let poolRewardVault2 = PublicKey.default;
    if (strategyState.strategyDex.toNumber() == dexToNumber('ORCA')) {
      const whirlpool = await Whirlpool.fetch(this._connection, strategyState.pool);
      if (!whirlpool) {
        throw Error(`Could not fetch whirlpool state with pubkey ${strategyState.pool.toString()}`);
      }

      poolRewardVault0 = whirlpool.rewardInfos[0].vault;
      poolRewardVault1 = whirlpool.rewardInfos[1].vault;
      poolRewardVault2 = whirlpool.rewardInfos[2].vault;
    } else if (strategyState.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      programId = RAYDIUM_PROGRAM_ID;

      const poolState = await PoolState.fetch(this._connection, strategyState.pool);
      if (!poolState) {
        throw Error(`Could not fetch Raydium pool state with pubkey ${strategyState.pool.toString()}`);
      }
      poolRewardVault0 = poolState.rewardInfos[0].tokenVault;
      poolRewardVault1 = poolState.rewardInfos[1].tokenVault;
      poolRewardVault2 = poolState.rewardInfos[2].tokenVault;
    }

    const accounts: CollectFeesAndRewardsAccounts = {
      user: strategyState.adminAuthority,
      strategy: strategyPubkey,
      globalConfig: strategyState.globalConfig,
      pool: strategyState.pool,
      position: strategyState.position,
      positionTokenAccount: strategyState.positionTokenAccount,
      treasuryFeeTokenAVault,
      treasuryFeeTokenBVault,
      treasuryFeeVaultAuthority,
      tokenAMint: strategyState.tokenAMint,
      tokenBMint: strategyState.tokenBMint,
      tokenAVault: strategyState.tokenAVault,
      tokenBVault: strategyState.tokenBVault,
      poolTokenVaultA: strategyState.poolTokenVaultA,
      poolTokenVaultB: strategyState.poolTokenVaultB,
      baseVaultAuthority: strategyState.baseVaultAuthority,
      reward0Vault: strategyState.reward0Vault,
      reward1Vault: strategyState.reward1Vault,
      reward2Vault: strategyState.reward2Vault,
      poolRewardVault0:
        strategyState.reward0Decimals.toNumber() > 0 ? poolRewardVault0 : strategyState.baseVaultAuthority,
      poolRewardVault1:
        strategyState.reward1Decimals.toNumber() > 0 ? poolRewardVault1 : strategyState.baseVaultAuthority,
      poolRewardVault2:
        strategyState.reward2Decimals.toNumber() > 0 ? poolRewardVault2 : strategyState.baseVaultAuthority,
      tickArrayLower: strategyState.tickArrayLower,
      tickArrayUpper: strategyState.tickArrayUpper,
      raydiumProtocolPositionOrBaseVaultAuthority: strategyState.raydiumProtocolPositionOrBaseVaultAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
      poolProgram: programId,
      instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
    };

    return collectFeesAndRewards(accounts);
  };

  /**
   * Get orca position metadata program addresses
   * @param positionMint mint account of the position
   */
  getMetadataProgramAddressesOrca = (positionMint: PublicKey) => {
    const [position, positionBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('position'), positionMint.toBuffer()],
      WHIRLPOOL_PROGRAM_ID
    );

    const [positionMetadata, positionMetadataBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), positionMint.toBuffer()],
      METADATA_PROGRAM_ID
    );

    return {
      position,
      positionBump,
      positionMetadata,
      positionMetadataBump,
    };
  };

  getMetadataProgramAddressesRaydium = (
    positionMint: PublicKey,
    pool: PublicKey,
    tickLowerIndex: number,
    tickUpperIndex: number
  ) => {
    const [protocolPosition, _protocolPositionBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('position'), pool.toBuffer(), i32ToBytes(tickLowerIndex), i32ToBytes(tickUpperIndex)],
      RAYDIUM_PROGRAM_ID
    );

    const [position, positionBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('position'), positionMint.toBuffer()],
      RAYDIUM_PROGRAM_ID
    );

    const [positionMetadata, positionMetadataBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), positionMint.toBuffer()],
      METADATA_PROGRAM_ID
    );

    return {
      position,
      positionBump,
      protocolPosition,
      positionMetadata,
      positionMetadataBump,
    };
  };

  private getStartEndTicketIndexProgramAddressesOrca = (
    whirlpool: PublicKey,
    whirlpoolState: Whirlpool,
    tickLowerIndex: number,
    tickUpperIndex: number
  ) => {
    const startTickIndex = getStartTickIndex(tickLowerIndex, whirlpoolState.tickSpacing, 0);
    const endTickIndex = getStartTickIndex(tickUpperIndex, whirlpoolState.tickSpacing, 0);

    const [startTickIndexPubkey, startTickIndexBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('tick_array'), whirlpool.toBuffer(), Buffer.from(startTickIndex.toString())],
      WHIRLPOOL_PROGRAM_ID
    );
    const [endTickIndexPubkey, endTickIndexBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('tick_array'), whirlpool.toBuffer(), Buffer.from(endTickIndex.toString())],
      WHIRLPOOL_PROGRAM_ID
    );
    return {
      startTickIndex: startTickIndexPubkey,
      startTickIndexBump,
      endTickIndex: endTickIndexPubkey,
      endTickIndexBump,
    };
  };

  private getStartEndTicketIndexProgramAddressesRaydium = (
    pool: PublicKey,
    poolState: PoolState,
    tickLowerIndex: number,
    tickUpperIndex: number
  ) => {
    const startTickIndex = TickUtils.getTickArrayStartIndexByTick(tickLowerIndex, poolState.tickSpacing);
    const endTickIndex = TickUtils.getTickArrayStartIndexByTick(tickUpperIndex, poolState.tickSpacing);

    const [startTickIndexPubkey, startTickIndexBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('tick_array'), pool.toBuffer(), i32ToBytes(startTickIndex)],
      RAYDIUM_PROGRAM_ID
    );
    const [endTickIndexPubkey, endTickIndexBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('tick_array'), pool.toBuffer(), i32ToBytes(endTickIndex)],
      RAYDIUM_PROGRAM_ID
    );
    return {
      startTickIndex: startTickIndexPubkey,
      startTickIndexBump,
      endTickIndex: endTickIndexPubkey,
      endTickIndexBump,
    };
  };

  /**
   * Get a transaction to open liquidity position for a Kamino strategy
   * @param strategy strategy you want to open liquidity position for
   * @param positionMint position mint pubkey
   * @param priceLower new position's lower price of the range
   * @param priceUpper new position's upper price of the range
   * @param status strategy status
   */
  openPosition = async (
    strategy: PublicKey,
    positionMint: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    status: StrategyStatusKind = new Uninitialized()
  ): Promise<TransactionInstruction> => {
    const strategyState: WhirlpoolStrategy | null = await this.getStrategyByAddress(strategy);
    if (!strategyState) {
      throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
    }

    if (strategyState.strategyDex.toNumber() == dexToNumber('ORCA')) {
      return this.openPositionOrca(strategy, positionMint, priceLower, priceUpper, status);
    } else if (strategyState.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      return this.openPositionRaydium(strategy, positionMint, priceLower, priceUpper, status);
    } else {
      throw new Error(`Invalid dex ${strategyState.strategyDex.toString()}`);
    }
  };

  /**
   * Get a transaction to open liquidity position for a Kamino strategy
   * @param strategy strategy you want to open liquidity position for
   * @param positionMint new liquidity position account pubkey
   * @param priceLower new position's lower price of the range
   * @param priceUpper new position's upper price of the range
   * @param status strategy status
   */
  openPositionOrca = async (
    strategy: PublicKey,
    positionMint: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    status: StrategyStatusKind = new Uninitialized()
  ): Promise<TransactionInstruction> => {
    const strategyState: WhirlpoolStrategy | null = await this.getStrategyByAddress(strategy);
    if (!strategyState) {
      throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
    }

    const whirlpool = await Whirlpool.fetch(this._connection, strategyState.pool);
    if (!whirlpool) {
      throw Error(`Could not fetch whirlpool state with pubkey ${strategyState.pool.toString()}`);
    }

    const isRebalancing = status.discriminator === Rebalancing.discriminator;

    const tickLowerIndex = getNearestValidTickIndexFromTickIndex(
      priceToTickIndex(
        priceLower,
        strategyState.tokenAMintDecimals.toNumber(),
        strategyState.tokenBMintDecimals.toNumber()
      ),
      whirlpool.tickSpacing
    );
    const tickUpperIndex = getNearestValidTickIndexFromTickIndex(
      priceToTickIndex(
        priceUpper,
        strategyState.tokenAMintDecimals.toNumber(),
        strategyState.tokenBMintDecimals.toNumber()
      ),
      whirlpool.tickSpacing
    );

    const { position, positionBump, positionMetadata } = this.getMetadataProgramAddressesOrca(positionMint);

    const positionTokenAccount = await getAssociatedTokenAddress(positionMint, strategyState.baseVaultAuthority);

    const args: OpenLiquidityPositionArgs = {
      tickLowerIndex: new BN(tickLowerIndex),
      tickUpperIndex: new BN(tickUpperIndex),
      bump: positionBump,
    };

    const { startTickIndex, endTickIndex } = this.getStartEndTicketIndexProgramAddressesOrca(
      strategyState.pool,
      whirlpool,
      tickLowerIndex,
      tickUpperIndex
    );

    const accounts: OpenLiquidityPositionAccounts = {
      adminAuthority: strategyState.adminAuthority,
      strategy,
      pool: strategyState.pool,
      tickArrayLower: startTickIndex,
      tickArrayUpper: endTickIndex,
      baseVaultAuthority: strategyState.baseVaultAuthority,
      position,
      positionMint,
      positionMetadataAccount: positionMetadata,
      positionTokenAccount,
      rent: SYSVAR_RENT_PUBKEY,
      system: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      metadataProgram: METADATA_PROGRAM_ID,
      metadataUpdateAuth: METADATA_UPDATE_AUTH,
      poolProgram: WHIRLPOOL_PROGRAM_ID,
      oldPositionOrBaseVaultAuthority: isRebalancing ? strategyState.position : strategyState.baseVaultAuthority,
      oldPositionMintOrBaseVaultAuthority: isRebalancing
        ? strategyState.positionMint
        : strategyState.baseVaultAuthority,
      oldPositionTokenAccountOrBaseVaultAuthority: isRebalancing
        ? strategyState.positionTokenAccount
        : strategyState.baseVaultAuthority,
      raydiumProtocolPositionOrBaseVaultAuthority: strategyState.baseVaultAuthority,
      adminTokenAAtaOrBaseVaultAuthority: strategyState.baseVaultAuthority,
      adminTokenBAtaOrBaseVaultAuthority: strategyState.baseVaultAuthority,
      poolTokenVaultAOrBaseVaultAuthority: strategyState.baseVaultAuthority,
      poolTokenVaultBOrBaseVaultAuthority: strategyState.baseVaultAuthority,
    };

    return openLiquidityPosition(args, accounts);
  };

  /**
   * Get a transaction to open liquidity position for a Kamino strategy
   * @param strategy strategy you want to open liquidity position for
   * @param positionMint new liquidity position account pubkey
   * @param priceLower new position's lower price of the range
   * @param priceUpper new position's upper price of the range
   * @param status strategy status
   */
  openPositionRaydium = async (
    strategy: PublicKey,
    positionMint: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    status: StrategyStatusKind = new Uninitialized()
  ): Promise<TransactionInstruction> => {
    const strategyState: WhirlpoolStrategy | null = await this.getStrategyByAddress(strategy);
    if (!strategyState) {
      throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
    }

    const poolState = await PoolState.fetch(this._connection, strategyState.pool);
    if (!poolState) {
      throw Error(`Could not fetch Raydium pool state with pubkey ${strategyState.pool.toString()}`);
    }

    const isRebalancing = status.discriminator === Rebalancing.discriminator;

    let tickLowerIndex = TickMath.getTickWithPriceAndTickspacing(
      priceLower,
      poolState.tickSpacing,
      strategyState.tokenAMintDecimals.toNumber(),
      strategyState.tokenBMintDecimals.toNumber()
    );

    let tickUpperIndex = TickMath.getTickWithPriceAndTickspacing(
      priceUpper,
      poolState.tickSpacing,
      strategyState.tokenAMintDecimals.toNumber(),
      strategyState.tokenBMintDecimals.toNumber()
    );

    const { position, positionBump, protocolPosition, positionMetadata } = this.getMetadataProgramAddressesRaydium(
      positionMint,
      strategyState.pool,
      tickLowerIndex,
      tickUpperIndex
    );

    const positionTokenAccount = await getAssociatedTokenAddress(positionMint, strategyState.baseVaultAuthority);

    const args: OpenLiquidityPositionArgs = {
      tickLowerIndex: new BN(tickLowerIndex),
      tickUpperIndex: new BN(tickUpperIndex),
      bump: positionBump,
    };

    const { startTickIndex, endTickIndex } = this.getStartEndTicketIndexProgramAddressesRaydium(
      strategyState.pool,
      poolState,
      tickLowerIndex,
      tickUpperIndex
    );

    const accounts: OpenLiquidityPositionAccounts = {
      adminAuthority: strategyState.adminAuthority,
      strategy,
      pool: strategyState.pool,
      tickArrayLower: startTickIndex,
      tickArrayUpper: endTickIndex,
      baseVaultAuthority: strategyState.baseVaultAuthority,
      position,
      positionMint,
      positionMetadataAccount: positionMetadata,
      positionTokenAccount,
      rent: SYSVAR_RENT_PUBKEY,
      system: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      metadataProgram: METADATA_PROGRAM_ID,
      metadataUpdateAuth: METADATA_UPDATE_AUTH,
      poolProgram: RAYDIUM_PROGRAM_ID,
      oldPositionOrBaseVaultAuthority: isRebalancing ? strategyState.position : strategyState.baseVaultAuthority,
      oldPositionMintOrBaseVaultAuthority: isRebalancing
        ? strategyState.positionMint
        : strategyState.baseVaultAuthority,
      oldPositionTokenAccountOrBaseVaultAuthority: isRebalancing
        ? strategyState.positionTokenAccount
        : strategyState.baseVaultAuthority,
      raydiumProtocolPositionOrBaseVaultAuthority: protocolPosition,
      adminTokenAAtaOrBaseVaultAuthority: strategyState.tokenAVault,
      adminTokenBAtaOrBaseVaultAuthority: strategyState.tokenBVault,
      poolTokenVaultAOrBaseVaultAuthority: poolState.tokenVault0,
      poolTokenVaultBOrBaseVaultAuthority: poolState.tokenVault1,
    };

    return openLiquidityPosition(args, accounts);
  };

  /**
   * Get a transaction for executive withdrawal from a Kamino strategy.
   * @param strategy strategy pubkey or object
   * @param action withdrawal action
   * @returns transaction for executive withdrawal
   */
  executiveWithdraw = async (strategy: PublicKey | StrategyWithAddress, action: ExecutiveWithdrawActionKind) => {
    const { address: strategyPubkey, strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    let globalConfig = await GlobalConfig.fetch(this._connection, strategyState.globalConfig);
    if (globalConfig == null) {
      throw new Error(`Unable to fetch GlobalConfig with Pubkey ${strategyState.globalConfig}`);
    }
    const args: ExecutiveWithdrawArgs = {
      action: action.discriminator,
    };

    let programId = WHIRLPOOL_PROGRAM_ID;
    if (strategyState.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      programId = RAYDIUM_PROGRAM_ID;
    }

    const accounts: ExecutiveWithdrawAccounts = {
      adminAuthority: strategyState.adminAuthority,
      strategy: strategyPubkey,
      globalConfig: strategyState.globalConfig,
      pool: strategyState.pool,
      position: strategyState.position,
      positionTokenAccount: strategyState.positionTokenAccount,
      baseVaultAuthority: strategyState.baseVaultAuthority,
      tickArrayLower: strategyState.tickArrayLower,
      tickArrayUpper: strategyState.tickArrayUpper,
      tokenAVault: strategyState.tokenAVault,
      tokenBVault: strategyState.tokenBVault,
      poolTokenVaultA: strategyState.poolTokenVaultA,
      poolTokenVaultB: strategyState.poolTokenVaultB,
      tokenAMint: strategyState.tokenAMint,
      tokenBMint: strategyState.tokenBMint,
      scopePrices: strategyState.scopePrices,
      raydiumProtocolPositionOrBaseVaultAuthority: strategyState.raydiumProtocolPositionOrBaseVaultAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
      poolProgram: programId,
      tokenInfos: globalConfig.tokenInfos,
    };

    return executiveWithdraw(args, accounts);
  };

  /**
   * Get a transaction to invest funds from the Kamino vaults and put them into the DEX pool as liquidity.
   * @param strategy strategy pubkey or object
   * @param payer transaction payer
   */
  invest = async (strategy: PublicKey, payer: PublicKey) => {
    const strategyState: WhirlpoolStrategy | null = await this.getStrategyByAddress(strategy);
    if (!strategyState) {
      throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
    }

    const globalConfig = await GlobalConfig.fetch(this._connection, strategyState.globalConfig);
    if (!globalConfig) {
      throw Error(`Could not fetch global config with pubkey ${strategyState.globalConfig.toString()}`);
    }

    let programId = WHIRLPOOL_PROGRAM_ID;
    if (strategyState.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      programId = RAYDIUM_PROGRAM_ID;
    }

    const accounts: InvestAccounts = {
      position: strategyState.position,
      positionTokenAccount: strategyState.positionTokenAccount,
      pool: strategyState.pool,
      tokenAVault: strategyState.tokenAVault,
      tokenBVault: strategyState.tokenBVault,
      baseVaultAuthority: strategyState.baseVaultAuthority,
      payer,
      strategy: strategy,
      globalConfig: strategyState.globalConfig,
      tokenProgram: TOKEN_PROGRAM_ID,
      poolTokenVaultA: strategyState.poolTokenVaultA,
      poolTokenVaultB: strategyState.poolTokenVaultB,
      tickArrayLower: strategyState.tickArrayLower,
      tickArrayUpper: strategyState.tickArrayUpper,
      scopePrices: globalConfig.scopePriceId,
      raydiumProtocolPositionOrBaseVaultAuthority: strategyState.raydiumProtocolPositionOrBaseVaultAuthority,
      tokenInfos: globalConfig.tokenInfos,
      poolProgram: programId,
      instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
    };

    return invest(accounts);
  };

  getUpdateRebalancingParmsIxns = async (
    strategyAdmin: PublicKey,
    strategy: PublicKey,
    rebalanceParams: Decimal[],
    rebalanceType?: RebalanceTypeKind
  ): Promise<TransactionInstruction> => {
    if (!rebalanceType) {
      const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
      rebalanceType = numberToRebalanceType(strategyState.rebalanceType);
    }
    const value = getStrategyRebalanceParams(rebalanceParams, rebalanceType);
    let args: UpdateStrategyConfigArgs = {
      mode: StrategyConfigOption.UpdateRebalanceParams.discriminator,
      value,
    };

    let accounts: UpdateStrategyConfigAccounts = {
      adminAuthority: strategyAdmin,
      newAccount: PublicKey.default, // not used
      globalConfig: this._globalConfig,
      strategy,
      systemProgram: SystemProgram.programId,
    };
    return updateStrategyConfig(args, accounts);
  };

  /**
   * Get a list of instructions to initialize and set up a strategy
   * @param dex the dex to use (Orca or Raydium)
   * @param feeTier which fee tier for that specific pair should be used
   * @param tokenAMint the mint of TokenA in the pool
   * @param tokenBMint the mint of TokenB in the pool
   * @param depositCap the maximum amount in USD in lamports (6 decimals) that can be deposited into the strategy
   * @param depositCapPerIx the maximum amount in USD in lamports (6 decimals) that can be deposited into the strategy per instruction
   */
  getBuildStrategyIxns = async (
    dex: Dex,
    feeTier: Decimal,
    strategy: PublicKey,
    strategyAdmin: PublicKey,
    rebalanceType: Decimal,
    rebalanceParams: Decimal[],
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    depositCap?: Decimal,
    depositCapPerIx?: Decimal,
    withdrawFeeBps?: Decimal,
    depositFeeBps?: Decimal,
    performanceFeeBps?: Decimal
  ): Promise<[TransactionInstruction, TransactionInstruction[], TransactionInstruction]> => {
    // check both tokens exist in collateralInfo
    let config = await GlobalConfig.fetch(this._connection, this._globalConfig);
    if (!config) {
      throw Error(`Could not fetch globalConfig  with pubkey ${this.getGlobalConfig().toString()}`);
    }
    const collateralInfos = await this.getCollateralInfo(config.tokenInfos);
    if (!this.mintIsSupported(collateralInfos, tokenAMint) || !this.mintIsSupported(collateralInfos, tokenBMint)) {
      throw Error(`Token mint ${tokenAMint.toString()} is not supported`);
    }

    let pool = await this.getPoolInitializedForDexPairTier(dex, tokenAMint, tokenBMint, feeTier);
    if (pool == PublicKey.default) {
      throw Error(
        `Pool for tokens ${tokenAMint.toString()} and ${tokenBMint.toString()} for feeTier ${feeTier.toString()} does not exist`
      );
    }

    let tokenACollateral = getCollateralMintByAddress(tokenAMint, this._config);
    if (!tokenACollateral) {
      throw Error(`Token mint ${tokenAMint.toString()} is not supported`);
    }
    let tokenBCollateral = getCollateralMintByAddress(tokenBMint, this._config);
    if (!tokenBCollateral) {
      throw Error(`Token mint ${tokenBMint.toString()} is not supported`);
    }
    let initStrategyIx = await this.createStrategy(
      strategy,
      pool,
      strategyAdmin,
      tokenACollateral.scopeToken as SupportedToken,
      tokenBCollateral.scopeToken as SupportedToken,
      dex
    );

    let rebalanceKind = numberToRebalanceType(rebalanceType.toNumber());
    let updateRebalanceParamsIx = await this.getUpdateRebalancingParmsIxns(
      strategyAdmin,
      strategy,
      rebalanceParams,
      rebalanceKind
    );

    let updateStrategyParamsIx = await this.getUpdateStrategyParamsIxs(
      strategyAdmin,
      strategy,
      rebalanceType,
      depositCap,
      depositCapPerIx,
      depositFeeBps,
      withdrawFeeBps,
      performanceFeeBps
    );

    let ixs: TransactionInstruction[] = [];
    ixs = ixs.concat(updateStrategyParamsIx);
    return [initStrategyIx, ixs, updateRebalanceParamsIx];
  };

  mintIsSupported = (collateralInfos: CollateralInfo[], tokenMint: PublicKey): boolean => {
    let found = false;
    collateralInfos.forEach((element) => {
      if (element.mint.toString() === tokenMint.toString()) {
        found = true;
      }
    });
    return found;
  };

  getCollateralInfoFromMint = (mint: PublicKey, collateralInfos: CollateralInfo[]): CollateralInfo | undefined => {
    let collInfosForMint = collateralInfos.filter((x) => x.mint.toString() != mint.toString());
    if (collInfosForMint.length == 0) {
      return undefined;
    }
    return collInfosForMint[0];
  };

  getCollateralIdFromMint = (mint: PublicKey, collateralInfos: CollateralInfo[]): number => {
    for (let i = 0; i < collateralInfos.length; i++) {
      if (collateralInfos[i].mint.toString() === mint.toString()) {
        return i;
      }
    }

    return -1;
  };

  getLookupTable = async (): Promise<AddressLookupTableAccount> => {
    if (this._cluster == 'mainnet-beta') {
      const lookupTableAccount = await this._connection
        .getAddressLookupTable(MAINNET_GLOBAL_LOOKUP_TABLE)
        .then((res) => res.value);
      if (!lookupTableAccount) {
        throw new Error(`Could not get lookup table ${MAINNET_GLOBAL_LOOKUP_TABLE}`);
      }
      return lookupTableAccount;
    } else if (this._cluster == 'devnet') {
      const lookupTableAccount = await this._connection
        .getAddressLookupTable(DEVNET_GLOBAL_LOOKUP_TABLE)
        .then((res) => res.value);
      if (!lookupTableAccount) {
        throw new Error(`Could not get lookup table ${DEVNET_GLOBAL_LOOKUP_TABLE}`);
      }
      return lookupTableAccount;
    } else {
      throw Error('There is no lookup table for localnet yet');
    }
  };

  getTransactionV2Message = async (
    payer: PublicKey,
    instructions: Array<TransactionInstruction>
  ): Promise<MessageV0> => {
    if (this._cluster == 'mainnet-beta' || this._cluster == 'devnet') {
      let lookupTable = await this.getLookupTable();
      let blockhash = await this._connection.getLatestBlockhash();
      const v2Tx = new TransactionMessage({
        payerKey: payer,
        recentBlockhash: blockhash.blockhash,
        instructions: instructions,
      }).compileToV0Message([lookupTable]);
      return v2Tx;
    } else {
      throw Error('No TransactionV2 on localnet as no lookup table was created');
    }
  };

  /**
   * Get a list of transactions to rebalance a Kamino strategy.
   * @param strategy strategy pubkey or object
   * @param newPosition new liquidity position account pubkey
   * @param priceLower new position's lower price of the range
   * @param priceUpper new position's upper price of the range
   * @param payer transaction payer pubkey
   * @returns list of transactions to rebalance (executive withdraw, collect fees/rewards, open new position, invest)
   */
  rebalance = async (
    strategy: PublicKey,
    newPosition: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    payer: PublicKey
  ) => [
    await this.executiveWithdraw(strategy, new Rebalance()),
    await this.collectFeesAndRewards(strategy),
    await this.openPosition(strategy, newPosition, priceLower, priceUpper, new Rebalancing()),
  ];

  /**
   * Get a list of user's Kamino strategy positions
   * @param wallet user wallet address
   * @returns list of kamino strategy positions
   */
  getUserPositions = async (wallet: PublicKey): Promise<KaminoPosition[]> => {
    const userTokenAccounts = await this.getAllTokenAccounts(wallet);
    const liveStrategies = await this.getAllStrategiesWithFilters({ strategyCreationStatus: 'LIVE' });
    const positions: KaminoPosition[] = [];
    for (const tokenAccount of userTokenAccounts) {
      const accountData = tokenAccount.account.data as Data;
      const strategy = liveStrategies.find(
        (x) => x.strategy.sharesMint.toString() === accountData.parsed.info.mint.toString()
      );
      if (strategy) {
        positions.push({
          shareMint: strategy.strategy.sharesMint,
          strategy: strategy.address,
          sharesAmount: new Decimal(accountData.parsed.info.tokenAmount.uiAmountString),
        });
      }
    }
    return positions;
  };

  /**
   * Get Kamino strategy vault APY/APR
   * @param strategy strategy pubkey or onchain state
   * @param orcaPools not required, but you can add orca whirlpools if you're caching them, and we don't refetch every time
   * @param raydiumPools not required, but you can add raydium pools if you're caching them, and we don't refetch every time
   */
  getStrategyAprApy = async (
    strategy: PublicKey | StrategyWithAddress,
    orcaPools?: OrcaPool[],
    raydiumPools?: Pool[]
  ): Promise<WhirlpoolAprApy> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
    const dex = Number(strategyState.strategyDex);
    const isOrca = dexToNumber('ORCA') === dex;
    const isRaydium = dexToNumber('RAYDIUM') === dex;
    if (strategyState.position.toString() === PublicKey.default.toString()) {
      return {
        totalApr: ZERO,
        feeApr: ZERO,
        totalApy: ZERO,
        feeApy: ZERO,
        priceUpper: ZERO,
        priceLower: ZERO,
        rewardsApr: [],
        rewardsApy: [],
        poolPrice: ZERO,
        strategyOutOfRange: false,
      };
    }
    if (isOrca) {
      const prices = await this.getAllPrices();
      return this._orcaService.getStrategyWhirlpoolPoolAprApy(strategyState, orcaPools, prices);
    }
    if (isRaydium) {
      return this._raydiumService.getStrategyWhirlpoolPoolAprApy(strategyState, raydiumPools);
    }
    throw Error(`Strategy dex ${dex} not supported`);
  };

  calculateAmounts = async (
    strategy: PublicKey | StrategyWithAddress,
    tokenAAmount?: Decimal,
    tokenBAmount?: Decimal
  ): Promise<[Decimal, Decimal]> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
    const dex = Number(strategyState.strategyDex);
    const isOrca = dexToNumber('ORCA') === dex;
    const isRaydium = dexToNumber('RAYDIUM') === dex;
    if (isOrca) {
      const whirlpool = await Whirlpool.fetch(this._connection, strategyState.pool);
      if (!whirlpool) {
        throw new Error(`Unable to get Orca whirlpool for pubkey ${strategyState.pool}`);
      }

      return this.calculateAmountsOrca({
        whirlpoolConfig: whirlpool.whirlpoolsConfig,
        tokenAMint: strategyState.tokenAMint,
        tokenBMint: strategyState.tokenBMint,
        positionAddress: strategyState.position,
        tokenAAmount,
        tokenBAmount,
      });
    } else if (isRaydium) {
      return this.calculateAmountsRaydium({ strategyState, tokenAAmount, tokenBAmount });
    } else {
      throw new Error(`The strategy ${strategy.toString()} is not Orca or Raydium`);
    }
  };

  calculateAmountsOrca = async ({
    whirlpoolConfig,
    tokenAMint,
    tokenBMint,
    positionAddress,
    tokenAAmount,
    tokenBAmount,
  }: {
    whirlpoolConfig: PublicKey;
    tokenAMint: PublicKey;
    tokenBMint: PublicKey;
    positionAddress: PublicKey;
    tokenAAmount?: Decimal;
    tokenBAmount?: Decimal;
  }): Promise<[Decimal, Decimal]> => {
    if (!tokenAAmount && !tokenBAmount) {
      return [new Decimal(0), new Decimal(0)];
    }
    // Given A in ATA, calc how much A and B
    const accessor = new OrcaDAL(whirlpoolConfig, WHIRLPOOL_PROGRAM_ID, this._connection);
    const orcaPosition = new OrcaPosition(accessor);
    const defaultSlippagePercentage = Percentage.fromFraction(1, 1000); // 0.1%

    const primaryTokenAmount = tokenAAmount || tokenBAmount;
    const primaryTokenMint = tokenAAmount ? tokenAMint : tokenBMint;
    const secondaryTokenAmount = tokenAAmount ? tokenBAmount : tokenAAmount;
    const secondaryTokenMint = tokenAAmount ? tokenBMint : tokenAMint;

    let params: AddLiquidityQuoteParam = {
      positionAddress,
      tokenMint: primaryTokenMint,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tokenAmount: new BN(primaryTokenAmount!.toString()), // safe to use ! here because we check in the beginning that at least one of the amounts are not undefined;
      refresh: true,
      slippageTolerance: defaultSlippagePercentage,
    };
    const estimatedGivenPrimary: AddLiquidityQuote = await orcaPosition.getAddLiquidityQuote(params);

    if (
      secondaryTokenAmount &&
      new Decimal(estimatedGivenPrimary.estTokenB.toString()) > new Decimal(secondaryTokenAmount.toString())
    ) {
      params = {
        positionAddress,
        tokenMint: secondaryTokenMint,
        tokenAmount: new BN(secondaryTokenAmount.toString()),
        refresh: true,
        slippageTolerance: defaultSlippagePercentage,
      };
      const estimatedGivenSecondary: AddLiquidityQuote = await orcaPosition.getAddLiquidityQuote(params);
      return [
        new Decimal(estimatedGivenSecondary.estTokenA.toString()),
        new Decimal(estimatedGivenSecondary.estTokenB.toString()),
      ];
    }
    return [
      new Decimal(estimatedGivenPrimary.estTokenA.toString()),
      new Decimal(estimatedGivenPrimary.estTokenB.toString()),
    ];
  };

  calculateAmountsRaydium = async ({
    strategyState,
    tokenAAmount,
    tokenBAmount,
  }: {
    strategyState: WhirlpoolStrategy;
    tokenAAmount?: Decimal;
    tokenBAmount?: Decimal;
  }): Promise<[Decimal, Decimal]> => {
    if (!tokenAAmount && !tokenBAmount) {
      return [new Decimal(0), new Decimal(0)];
    }

    const poolState = await PoolState.fetch(this._connection, strategyState.pool);
    const position = await PersonalPositionState.fetch(this._connection, strategyState.position);

    if (!position) {
      throw new Error(`position ${strategyState.position.toString()} is not found`);
    }

    if (!poolState) {
      throw new Error(`poolState ${strategyState.pool.toString()} is not found`);
    }
    const primaryTokenAmount = tokenAAmount || tokenBAmount;
    const secondaryTokenAmount = tokenAAmount ? tokenBAmount : tokenAAmount;

    const { amountA, amountB } = LiquidityMath.getAmountsFromLiquidity(
      poolState.sqrtPriceX64,
      SqrtPriceMath.getSqrtPriceX64FromTick(position.tickLowerIndex),
      SqrtPriceMath.getSqrtPriceX64FromTick(position.tickUpperIndex),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      new BN(primaryTokenAmount!.plus(secondaryTokenAmount || 0)!.toString()), // safe to use ! here because we check in the beginning that at least one of the amounts are not undefined;
      true
    );

    return [new Decimal(amountA.toString()), new Decimal(amountB.toString())];
  };

  /**
   * Get amounts of tokenA and tokenB to be deposited
   * @param strategy
   * @param amountA
   */
  getDepositRatioFromTokenA = async (
    strategy: PublicKey | StrategyWithAddress,
    amountA: BN
  ): Promise<{ amountSlippageA: BN; amountSlippageB: BN }> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
    const dex = Number(strategyState.strategyDex);

    const isOrca = dexToNumber('ORCA') === dex;
    const isRaydium = dexToNumber('RAYDIUM') === dex;

    if (isOrca) {
      return this.getDepositRatioFromAOrca(strategy, amountA);
    }
    if (isRaydium) {
      return this.getDepositRatioFromARaydium(strategy, amountA);
    }
    throw Error(`Strategy dex ${dex} not supported`);
  };

  /**
   * Get amounts of tokenA and tokenB to be deposited
   * @param strategy
   * @param amountB
   */
  getDepositRatioFromTokenB = async (
    strategy: PublicKey | StrategyWithAddress,
    amountB: BN
  ): Promise<{ amountSlippageA: BN; amountSlippageB: BN }> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
    const dex = Number(strategyState.strategyDex);

    const isOrca = dexToNumber('ORCA') === dex;
    const isRaydium = dexToNumber('RAYDIUM') === dex;

    if (isOrca) {
      return this.getDepositRatioFromBOrca(strategy, amountB);
    }
    if (isRaydium) {
      return this.getDepositRatioFromBRaydium(strategy, amountB);
    }
    throw Error(`Strategy dex ${dex} not supported`);
  };

  /**
   * Get the on-chain state of the terms&conditions signature for the owner
   * @param owner
   */
  async getUserTermsSignatureState(owner: PublicKey): Promise<TermsSignature | null> {
    const pdaSeed = [Buffer.from('signature'), owner.toBuffer()];
    const [signatureStateKey, _signatureStateBump] = PublicKey.findProgramAddressSync(pdaSeed, this._kaminoProgramId);

    return await TermsSignature.fetch(this._connection, signatureStateKey);
  }

  /**
   * Get the instruction to store the on chain owner signature of terms&conditions
   * @param owner
   * @param signature
   */
  async getUserTermsSignatureIx(owner: PublicKey, signature: Uint8Array): Promise<TransactionInstruction> {
    const pdaSeed = [Buffer.from('signature'), owner.toBuffer()];
    const [signatureStateKey, _signatureStateBump] = PublicKey.findProgramAddressSync(pdaSeed, this._kaminoProgramId);

    const args: SignTermsArgs = {
      signature: Array.from(signature),
    };

    const accounts: SignTermsAccounts = {
      owner: owner,
      ownerSignatureState: signatureStateKey,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    };

    return signTerms(args, accounts);
  }

  private async getDepositRatioFromAOrca(
    strategy: PublicKey | StrategyWithAddress,
    amountA: BN
  ): Promise<{ amountSlippageA: BN; amountSlippageB: BN }> {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    const whirlpool = await Whirlpool.fetch(this._connection, strategyState.pool);
    if (!whirlpool) {
      throw Error(`Could not fetch whirlpool state with pubkey ${strategyState.pool.toString()}`);
    }

    const position = await Position.fetch(this._connection, strategyState.position);
    if (!position) {
      throw new Error(`Whirlpool position ${strategyState.position} does not exist`);
    }

    const params: InternalAddLiquidityQuoteParam = {
      tokenMintA: strategyState.tokenAMint,
      tokenMintB: strategyState.tokenBMint,
      tickCurrentIndex: whirlpool.tickCurrentIndex,
      sqrtPrice: whirlpool.sqrtPrice,
      inputTokenMint: strategyState.tokenAMint,
      inputTokenAmount: amountA,
      tickLowerIndex: position.tickLowerIndex,
      tickUpperIndex: position.tickUpperIndex,
      slippageTolerance: defaultSlippagePercentage,
    };

    const quote: InternalAddLiquidityQuote = getAddLiquidityQuote(params);

    return { amountSlippageA: quote.estTokenA, amountSlippageB: quote.estTokenB };
  }

  private getDepositRatioFromBOrca = async (
    strategy: PublicKey | StrategyWithAddress,
    amountB: BN
  ): Promise<{ amountSlippageA: BN; amountSlippageB: BN }> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    const whirlpool = await Whirlpool.fetch(this._connection, strategyState.pool);
    if (!whirlpool) {
      throw Error(`Could not fetch whirlpool state with pubkey ${strategyState.pool.toString()}`);
    }

    const position = await Position.fetch(this._connection, strategyState.position);
    if (!position) {
      throw new Error(`Whirlpool position ${strategyState.position} does not exist`);
    }

    const params: InternalAddLiquidityQuoteParam = {
      tokenMintA: strategyState.tokenAMint,
      tokenMintB: strategyState.tokenBMint,
      tickCurrentIndex: whirlpool.tickCurrentIndex,
      sqrtPrice: whirlpool.sqrtPrice,
      inputTokenMint: strategyState.tokenBMint,
      inputTokenAmount: amountB,
      tickLowerIndex: position.tickLowerIndex,
      tickUpperIndex: position.tickUpperIndex,
      slippageTolerance: defaultSlippagePercentage,
    };

    const quote: InternalAddLiquidityQuote = getAddLiquidityQuote(params);

    return { amountSlippageA: quote.estTokenA, amountSlippageB: quote.estTokenB };
  };

  private getDepositRatioFromARaydium = async (
    strategy: PublicKey | StrategyWithAddress,
    amountA: BN
  ): Promise<{ amountSlippageA: BN; amountSlippageB: BN }> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    let poolState = await PoolState.fetch(this._connection, strategyState.pool);
    let positionState = await PersonalPositionState.fetch(this._connection, strategyState.position);

    if (!positionState) {
      throw new Error(`Raydium position ${strategyState.position.toString()} could not be found.`);
    }
    if (!poolState) {
      throw new Error(`Raydium pool ${strategyState.pool.toString()} could not be found.`);
    }

    let lowerSqrtPriceX64 = SqrtPriceMath.getSqrtPriceX64FromTick(positionState.tickLowerIndex);
    let upperSqrtPriceX64 = SqrtPriceMath.getSqrtPriceX64FromTick(positionState.tickUpperIndex);

    const liqudity = LiquidityMath.getLiquidityFromTokenAmountA(lowerSqrtPriceX64, upperSqrtPriceX64, amountA, false);
    let amountsSlippage = LiquidityMath.getAmountsFromLiquidityWithSlippage(
      poolState.sqrtPriceX64,
      lowerSqrtPriceX64,
      upperSqrtPriceX64,
      liqudity,
      true,
      false,
      1
    );

    return amountsSlippage;
  };

  private getDepositRatioFromBRaydium = async (
    strategy: PublicKey | StrategyWithAddress,
    amountB: BN
  ): Promise<{ amountSlippageA: BN; amountSlippageB: BN }> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    let poolState = await PoolState.fetch(this._connection, strategyState.pool);
    let positionState = await PersonalPositionState.fetch(this._connection, strategyState.position);

    if (!positionState) {
      throw new Error(`Raydium position ${strategyState.position.toString()} could not be found.`);
    }
    if (!poolState) {
      throw new Error(`Raydium pool ${strategyState.pool.toString()} could not be found.`);
    }

    let lowerSqrtPriceX64 = SqrtPriceMath.getSqrtPriceX64FromTick(positionState.tickLowerIndex);
    let upperSqrtPriceX64 = SqrtPriceMath.getSqrtPriceX64FromTick(positionState.tickUpperIndex);

    const liqudity = LiquidityMath.getLiquidityFromTokenAmountB(lowerSqrtPriceX64, upperSqrtPriceX64, amountB);
    let amountsSlippage = LiquidityMath.getAmountsFromLiquidityWithSlippage(
      poolState.sqrtPriceX64,
      lowerSqrtPriceX64,
      upperSqrtPriceX64,
      liqudity,
      true,
      false,
      1
    );

    return amountsSlippage;
  };

  getCollateralInfo = async (collateralInfo: PublicKey): Promise<CollateralInfo[]> => {
    const collateralInfos = await CollateralInfos.fetch(this._connection, collateralInfo);
    if (!collateralInfos) {
      throw Error('Could not fetch collateral infos');
    }
    return collateralInfos.infos;
  };

  getStrategyVaultBalances = async (strategy: PublicKey | StrategyWithAddress) => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
    const vaults = await Promise.all([
      this.getTokenAccountBalance(strategyState.tokenAVault),
      this.getTokenAccountBalance(strategyState.tokenBVault),
    ]);
    const aVault = vaults[0];
    const bVault = vaults[1];
    return { aVault, bVault };
  };

  getUpdateStrategyParamsIxs = async (
    strategyAdmin: PublicKey,
    strategy: PublicKey,
    rebalanceType: Decimal,
    depositCap?: Decimal,
    depositCapPerIx?: Decimal,
    depositFeeBps?: Decimal,
    withdrawFeeBps?: Decimal,
    performanceFeeBps?: Decimal
  ): Promise<TransactionInstruction[]> => {
    let updateRebalanceTypeIx = await getUpdateStrategyConfigIx(
      strategyAdmin,
      this._globalConfig,
      strategy,
      new UpdateRebalanceType(),
      rebalanceType
    );

    if (!depositCap) {
      depositCap = DefaultDepositCap;
    }
    let updateDepositCapIx = await getUpdateStrategyConfigIx(
      strategyAdmin,
      this._globalConfig,
      strategy,
      new UpdateDepositCap(),
      depositCap
    );

    if (!depositCapPerIx) {
      depositCapPerIx = DefaultDepositCapPerIx;
    }
    let updateDepositCapPerIxnIx = await getUpdateStrategyConfigIx(
      strategyAdmin,
      this._globalConfig,
      strategy,
      new UpdateDepositCapIxn(),
      depositCapPerIx
    );

    if (!depositFeeBps) {
      depositFeeBps = DefaultDepositFeeBps;
    }
    let updateDepositFeeIx = await getUpdateStrategyConfigIx(
      strategyAdmin,
      this._globalConfig,
      strategy,
      new UpdateDepositFee(),
      depositFeeBps
    );

    if (!withdrawFeeBps) {
      withdrawFeeBps = DefaultWithdrawFeeBps;
    }
    let updateWithdrawalFeeIx = await getUpdateStrategyConfigIx(
      strategyAdmin,
      this._globalConfig,
      strategy,
      new UpdateWithdrawFee(),
      withdrawFeeBps
    );

    if (!performanceFeeBps) {
      performanceFeeBps = DefaultPerformanceFeeBps;
    }
    let updateFeesFeeIx = await getUpdateStrategyConfigIx(
      strategyAdmin,
      this._globalConfig,
      strategy,
      new UpdateCollectFeesFee(),
      performanceFeeBps
    );
    let updateRewards0FeeIx = await getUpdateStrategyConfigIx(
      strategyAdmin,
      this._globalConfig,
      strategy,
      new UpdateReward0Fee(),
      performanceFeeBps
    );
    let updateRewards1FeeIx = await getUpdateStrategyConfigIx(
      strategyAdmin,
      this._globalConfig,
      strategy,
      new UpdateReward1Fee(),
      performanceFeeBps
    );
    let updateRewards2FeeIx = await getUpdateStrategyConfigIx(
      strategyAdmin,
      this._globalConfig,
      strategy,
      new UpdateReward2Fee(),
      performanceFeeBps
    );

    return [
      updateRebalanceTypeIx,
      updateDepositCapIx,
      updateDepositCapPerIxnIx,
      updateDepositFeeIx,
      updateWithdrawalFeeIx,
      updateFeesFeeIx,
      updateRewards0FeeIx,
      updateRewards1FeeIx,
      updateRewards2FeeIx,
    ];
  };

  getUpdateRewardsIxs = async (strategyOwner: PublicKey, strategy: PublicKey) => {
    let strategyState = await WhirlpoolStrategy.fetch(this._connection, strategy);
    if (!strategyState) {
      throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
    }
    let globalConfig = await GlobalConfig.fetch(this._connection, strategyState.globalConfig);
    if (!globalConfig) {
      throw Error(`Could not fetch global config with pubkey ${strategyState.globalConfig.toString()}`);
    }
    let collateralInfos = await this.getCollateralInfo(globalConfig.tokenInfos);
    let ixs: TransactionInstruction[] = [];
    if (strategyState.strategyDex.toNumber() == dexToNumber('ORCA')) {
      const whirlpool = await Whirlpool.fetch(this._connection, strategyState.pool);
      if (!whirlpool) {
        throw Error(`Could not fetch whirlpool state with pubkey ${strategyState.pool.toString()}`);
      }
      for (let i = 0; i < 3; i++) {
        if (whirlpool.rewardInfos[i].mint.toString() != PublicKey.default.toString()) {
          let collateralId = this.getCollateralIdFromMint(whirlpool.rewardInfos[i].mint, collateralInfos);
          if (collateralId == -1) {
            throw Error(`Could not find collateral id for mint ${whirlpool.rewardInfos[i].mint.toString()}`);
          }

          let args: UpdateRewardMappingArgs = {
            rewardIndex: 0,
            collateralToken: collateralId,
          };

          let accounts: UpdateRewardMappingAccounts = {
            adminAuthority: strategyOwner,
            globalConfig: strategyState.globalConfig,
            strategy: strategy,
            pool: strategyState.pool,
            rewardMint: whirlpool.rewardInfos[i].mint,
            rewardVault: whirlpool.rewardInfos[i].vault,
            baseVaultAuthority: strategyState.baseVaultAuthority,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenInfos: globalConfig.tokenInfos,
          };

          let ix = updateRewardMapping(args, accounts);
          ixs.push(ix);
        }
      }
    } else if (strategyState.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      const poolState = await PoolState.fetch(this._connection, strategyState.pool);
      if (!poolState) {
        throw new Error(`Could not fetch whirlpool state with pubkey ${strategyState.pool.toString()}`);
      }
      for (let i = 0; i < 3; i++) {
        if (poolState.rewardInfos[i].tokenMint.toString() != PublicKey.default.toString()) {
          let collateralId = this.getCollateralIdFromMint(poolState.rewardInfos[i].tokenMint, collateralInfos);
          if (collateralId == -1) {
            throw Error(`Could not find collateral id for mint ${poolState.rewardInfos[i].tokenMint.toString()}`);
          }

          let args: UpdateRewardMappingArgs = {
            rewardIndex: 0,
            collateralToken: collateralId,
          };

          let accounts: UpdateRewardMappingAccounts = {
            adminAuthority: strategyOwner,
            globalConfig: strategyState.globalConfig,
            strategy: strategy,
            pool: strategyState.pool,
            rewardMint: poolState.rewardInfos[i].tokenMint,
            rewardVault: poolState.rewardInfos[i].tokenVault,
            baseVaultAuthority: strategyState.baseVaultAuthority,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenInfos: globalConfig.tokenInfos,
          };

          let ix = updateRewardMapping(args, accounts);
          ixs.push(ix);
        }
      }
    } else {
      throw new Error(`Dex ${strategyState.strategyDex} not supported`);
    }
  };
}

export default Kamino;
