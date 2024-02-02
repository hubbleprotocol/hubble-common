import { getConfigByCluster, HubbleConfig, SolanaCluster } from '@hubbleprotocol/hubble-config';
import {
  AccountInfo,
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
  AddressLookupTableAccount,
  MessageV0,
  TransactionMessage,
  Keypair,
  AddressLookupTableProgram,
  Transaction,
  ParsedAccountData,
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
import {
  initializeTickArray,
  InitializeTickArrayAccounts,
  InitializeTickArrayArgs,
  Position,
  TickArray,
  Whirlpool,
} from './whirpools-client';
import {
  AddLiquidityQuote,
  AddLiquidityQuoteParam,
  defaultSlippagePercentage,
  getNearestValidTickIndexFromTickIndex,
  getNextValidTickIndex,
  getStartTickIndex,
  OrcaNetwork,
  OrcaWhirlpoolClient,
  Percentage,
  priceToTickIndex,
  sqrtPriceX64ToPrice,
  tickIndexToPrice,
} from '@orca-so/whirlpool-sdk';
import { OrcaDAL } from '@orca-so/whirlpool-sdk/dist/dal/orca-dal';
import { OrcaPosition } from '@orca-so/whirlpool-sdk/dist/position/orca-position';
import {
  Data,
  getEmptyShareData,
  Holdings,
  KaminoPosition,
  KaminoStrategyWithShareMint,
  MintToPriceMap,
  ShareData,
  ShareDataWithAddress,
  StrategyBalances,
  StrategyBalanceWithAddress,
  StrategyHolder,
  StrategyProgramAddress,
  StrategyVaultTokens,
  TokenAmounts,
  TokenHoldings,
  TotalStrategyVaultTokens,
  TreasuryFeeVault,
} from './models';
import { PROGRAM_ID_CLI as WHIRLPOOL_PROGRAM_ID, setWhirlpoolsProgramId } from './whirpools-client/programId';
import { OraclePrices, Scope } from '@hubbleprotocol/scope-sdk';
import {
  batchFetch,
  collToLamportsDecimal,
  createAssociatedTokenAccountInstruction,
  DepositAmountsForSwap,
  Dex,
  dexToNumber,
  GenericPoolInfo,
  GenericPositionRangeInfo,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressAndData,
  getDexProgramId,
  getReadOnlyWallet,
  buildStrategyRebalanceParams,
  getUpdateStrategyConfigIx,
  LiquidityDistribution,
  numberToRebalanceType,
  RebalanceFieldInfo,
  sendTransactionWithLogs,
  StrategiesFilters,
  strategyCreationStatusToBase58,
  strategyTypeToBase58,
  VaultParameters,
  ZERO,
  PositionRange,
  numberToDex,
  TokensBalances,
  isSOLMint,
  SwapperIxBuilder,
  lamportsToNumberDecimal,
  DECIMALS_SOL,
  InstructionsWithLookupTables,
  ProfiledFunctionExecution,
  noopProfiledFunctionExecution,
  MaybeTokensBalances,
  ProportionalMintingMethod,
  PerformanceFees,
  PriceReferenceType,
  InputRebalanceFieldInfo,
  getTickArray,
  rebalanceFieldsDictToInfo,
  InitStrategyIxs,
  WithdrawShares,
  MetadataProgramAddressesOrca,
  MetadataProgramAddressesRaydium,
  LowerAndUpperTickPubkeys,
  isVaultInitialized,
  WithdrawAllAndCloseIxns,
  InitPoolTickIfNeeded,
  numberToReferencePriceType,
  stripTwapZeros,
  getTokenNameFromCollateralInfo,
} from './utils';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, MintInfo, MintLayout, u64 } from '@solana/spl-token';
import {
  checkExpectedVaultsBalances,
  CheckExpectedVaultsBalancesAccounts,
  CheckExpectedVaultsBalancesArgs,
  closeStrategy,
  CloseStrategyAccounts,
  collectFeesAndRewards,
  CollectFeesAndRewardsAccounts,
  deposit,
  DepositAccounts,
  DepositArgs,
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
  singleTokenDepositWithMin,
  SingleTokenDepositWithMinAccounts,
  SingleTokenDepositWithMinArgs,
  updateRewardMapping,
  UpdateRewardMappingAccounts,
  UpdateRewardMappingArgs,
  updateStrategyConfig,
  UpdateStrategyConfigAccounts,
  UpdateStrategyConfigArgs,
  withdraw,
  WithdrawAccounts,
  WithdrawArgs,
  withdrawFromTopup,
  WithdrawFromTopupAccounts,
  WithdrawFromTopupArgs,
} from './kamino-client/instructions';
import BN from 'bn.js';
import StrategyWithAddress from './models/StrategyWithAddress';
import { Idl, Program, Provider } from '@project-serum/anchor';
import { Rebalancing, Uninitialized } from './kamino-client/types/StrategyStatus';
import { FRONTEND_KAMINO_STRATEGY_URL, METADATA_PROGRAM_ID, U64_MAX } from './constants';
import {
  CollateralInfo,
  ExecutiveWithdrawActionKind,
  RebalanceType,
  RebalanceTypeKind,
  ReferencePriceTypeKind,
  StrategyConfigOption,
  StrategyStatusKind,
} from './kamino-client/types';
import { AmmConfig, PersonalPositionState, PoolState } from './raydium_client';
import { PROGRAM_ID as RAYDIUM_PROGRAM_ID, setRaydiumProgramId } from './raydium_client/programId';
import {
  getPdaProtocolPositionAddress,
  i32ToBytes,
  LiquidityMath,
  SqrtPriceMath,
  TickMath,
  TickUtils,
} from '@raydium-io/raydium-sdk';

import KaminoIdl from './kamino-client/kamino.json';
import { OrcaService, RaydiumService, Whirlpool as OrcaPool, WhirlpoolAprApy } from './services';
import {
  getAddLiquidityQuote,
  InternalAddLiquidityQuote,
  InternalAddLiquidityQuoteParam,
} from '@orca-so/whirlpool-sdk/dist/position/quotes/add-liquidity';
import { signTerms, SignTermsAccounts, SignTermsArgs } from './kamino-client/instructions';
import { Pool } from './services/RaydiumPoolsResponse';
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
  UpdateLookupTable,
  UpdateDepositMintingMethod,
  UpdateReferencePriceType,
} from './kamino-client/types/StrategyConfigOption';
import {
  DefaultDepositCap,
  DefaultDepositCapPerIx,
  DefaultPerformanceFeeBps,
  DefaultWithdrawFeeBps,
} from './constants/DefaultStrategyConfig';
import {
  DEVNET_GLOBAL_LOOKUP_TABLE,
  MAINNET_GLOBAL_LOOKUP_TABLE,
  STAGING_GLOBAL_CONFIG,
  STAGING_GLOBAL_LOOKUP_TABLE,
  STAGING_KAMINO_PROGRAM_ID,
} from './constants/pubkeys';
import {
  AutodriftMethod,
  DefaultDex,
  DefaultFeeTierOrca,
  DefaultMintTokenA,
  DefaultMintTokenB,
  DefaultTickSpacing,
  DriftRebalanceMethod,
  ExpanderMethod,
  FullBPS,
  FullPercentage,
  ManualRebalanceMethod,
  PeriodicRebalanceMethod,
  PricePercentageRebalanceMethod,
  PricePercentageWithResetRangeRebalanceMethod,
  RebalanceMethod,
  TakeProfitMethod,
} from './utils/CreationParameters';
import { getMintDecimals } from '@project-serum/serum/lib/market';
import { DOLAR_BASED, PROPORTION_BASED } from './constants/deposit_method';
import { JupService } from './services/JupService';
import {
  simulateManualPool,
  simulatePercentagePool,
  SimulationPercentagePoolParameters,
} from './services/PoolSimulationService';
import {
  Expander,
  Manual,
  PricePercentage,
  PricePercentageWithReset,
  Drift,
  TakeProfit,
  PeriodicRebalance,
  Autodrift,
} from './kamino-client/types/RebalanceType';
import {
  checkIfAccountExists,
  createWsolAtaIfMissing,
  decodeSerializedTransaction,
  getAtasWithCreateIxnsIfMissing,
  MAX_ACCOUNTS_PER_TRANSACTION,
  removeBudgetAndAtaIxns,
} from './utils/transactions';
import { RouteInfo } from '@jup-ag/core';
import { SwapResponse } from '@jup-ag/api';
import { StrategyPrices } from './models';
import { getDefaultManualRebalanceFieldInfos, getManualRebalanceFieldInfos } from './rebalance_methods';
import {
  deserializePricePercentageRebalanceFromOnchainParams,
  deserializePricePercentageRebalanceWithStateOverride,
  getDefaultPricePercentageRebalanceFieldInfos,
  getPositionRangeFromPercentageRebalanceParams,
  getPricePercentageRebalanceFieldInfos,
  readPricePercentageRebalanceParamsFromStrategy,
  readRawPricePercentageRebalanceStateFromStrategy,
} from './rebalance_methods';
import {
  deserializePricePercentageWithResetRebalanceFromOnchainParams,
  deserializePricePercentageWithResetRebalanceWithStateOverride,
  getDefaultPricePercentageWithResetRebalanceFieldInfos,
  getPositionRangeFromPricePercentageWithResetParams,
  getPricePercentageWithResetRebalanceFieldInfos,
  readPricePercentageWithResetRebalanceParamsFromStrategy,
  readRawPricePercentageWithResetRebalanceStateFromStrategy,
} from './rebalance_methods';
import {
  deserializeDriftRebalanceFromOnchainParams,
  deserializeDriftRebalanceWithStateOverride,
  getDefaultDriftRebalanceFieldInfos,
  getDriftRebalanceFieldInfos,
  getPositionRangeFromDriftParams,
  readDriftRebalanceParamsFromStrategy,
  readRawDriftRebalanceStateFromStrategy,
} from './rebalance_methods';
import {
  deserializeExpanderRebalanceWithStateOverride,
  deserializePeriodicRebalanceFromOnchainParams,
  deserializeTakeProfitRebalanceFromOnchainParams,
  getDefaultExpanderRebalanceFieldInfos,
  getDefaultPeriodicRebalanceFieldInfos,
  getDefaultTakeProfitRebalanceFieldsInfos,
  getExpanderRebalanceFieldInfos,
  getPeriodicRebalanceRebalanceFieldInfos,
  getPositionRangeFromExpanderParams,
  getPositionRangeFromPeriodicRebalanceParams,
  getTakeProfitRebalanceFieldsInfos,
  readExpanderRebalanceFieldInfosFromStrategy,
  readExpanderRebalanceParamsFromStrategy,
  readPeriodicRebalanceRebalanceParamsFromStrategy,
  readPeriodicRebalanceRebalanceStateFromStrategy,
  readRawExpanderRebalanceStateFromStrategy,
  readTakeProfitRebalanceParamsFromStrategy,
  readTakeProfitRebalanceStateFromStrategy,
} from './rebalance_methods';
import { PoolPriceReferenceType, TwapPriceReferenceType } from './utils/priceReferenceTypes';
import {
  extractPricesFromDeserializedState,
  getRebalanceMethodFromRebalanceFields,
  getRebalanceTypeFromRebalanceFields,
} from './rebalance_methods/utils';
import { RebalanceTypeLabelName } from './rebalance_methods/consts';
import WhirlpoolWithAddress from './models/WhirlpoolWithAddress';
import { PoolSimulationResponse } from './models/PoolSimulationResponseData';
import {
  deserializeAutodriftRebalanceWithStateOverride,
  deserializeAutodriftRebalanceFromOnchainParams,
  readAutodriftRebalanceParamsFromStrategy,
  readRawAutodriftRebalanceStateFromStrategy,
  getAutodriftRebalanceFieldInfos,
  getDefaultAutodriftRebalanceFieldInfos,
  getPositionRangeFromAutodriftParams,
} from './rebalance_methods/autodriftRebalance';
import { KaminoPrices, OraclePricesAndCollateralInfos } from './models';
import { getRemoveLiquidityQuote } from './whirpools-client/shim/remove-liquidity';
import { METEORA_PROGRAM_ID, setMeteoraProgramId } from './meteora_client/programId';
import { computeMeteoraFee, MeteoraPool, MeteoraService } from './services/MeteoraService';
import {
  binIdToBinArrayIndex,
  deriveBinArray,
  getBinFromBinArray,
  getBinFromBinArrays,
  getBinIdFromPriceWithDecimals,
  getPriceOfBinByBinId,
  getPriceOfBinByBinIdWithDecimals,
  MeteoraPosition,
} from './utils/meteora';
import { BinArray, LbPair, PositionV2 } from './meteora_client/accounts';
import LbPairWithAddress from './models/LbPairWithAddress';
import { initializeBinArray, InitializeBinArrayAccounts, InitializeBinArrayArgs } from './meteora_client/instructions';
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
  private readonly _orcaService: OrcaService;
  private readonly _raydiumService: RaydiumService;
  private readonly _meteoraService: MeteoraService;

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
    raydiumProgramId?: PublicKey,
    meteoraProgramId?: PublicKey
  ) {
    this._cluster = cluster;
    this._connection = connection;
    this._config = getConfigByCluster(cluster);

    this._provider = new Provider(connection, getReadOnlyWallet(), {
      commitment: connection.commitment,
    });
    if (programId && programId.equals(STAGING_KAMINO_PROGRAM_ID)) {
      this._kaminoProgramId = programId;
      this._globalConfig = STAGING_GLOBAL_CONFIG;
    } else {
      this._kaminoProgramId = programId ? programId : this._config.kamino.programId;
      this._globalConfig = globalConfig ? globalConfig : new PublicKey(this._config.kamino.globalConfig);
    }
    this._kaminoProgram = new Program(KAMINO_IDL as Idl, this._kaminoProgramId, this._provider);

    this._scope = new Scope(cluster, connection);
    setKaminoProgramId(this._kaminoProgramId);

    if (whirlpoolProgramId) {
      setWhirlpoolsProgramId(whirlpoolProgramId);
    }

    if (cluster === 'localnet') {
      if (raydiumProgramId) {
        setRaydiumProgramId(raydiumProgramId);
      }
    }

    if (meteoraProgramId) {
      setMeteoraProgramId(meteoraProgramId);
    }

    this._orcaService = new OrcaService(connection, cluster, this._globalConfig);
    this._raydiumService = new RaydiumService(connection, cluster);
    this._meteoraService = new MeteoraService(connection, this._globalConfig);
  }

  getConnection = () => this._connection;

  getProgramID = () => this._kaminoProgramId;

  getProgram = () => this._kaminoProgram;

  setGlobalConfig = (globalConfig: PublicKey) => {
    this._globalConfig = globalConfig;
  };

  getGlobalConfig = () => this._globalConfig;

  getDepositableTokens = async (): Promise<CollateralInfo[]> => {
    const collateralInfos = await this.getCollateralInfos();
    return collateralInfos.filter((x) => x.mint.toString() != SystemProgram.programId.toString());
  };

  getCollateralInfos = async () => {
    const config = await GlobalConfig.fetch(this._connection, this._globalConfig, this._kaminoProgramId);
    if (!config) {
      throw Error(`Could not fetch globalConfig with pubkey ${this.getGlobalConfig().toString()}`);
    }
    return this.getCollateralInfo(config.tokenInfos);
  };

  getSupportedDexes = (): Dex[] => ['ORCA', 'RAYDIUM', 'METEORA'];

  // todo: see if we can read this dynamically
  getFeeTiersForDex = (dex: Dex): Decimal[] => {
    if (dex == 'ORCA') {
      return [new Decimal(0.0001), new Decimal(0.0005), new Decimal(0.003), new Decimal(0.01)];
    } else if (dex == 'RAYDIUM') {
      return [new Decimal(0.0001), new Decimal(0.0005), new Decimal(0.0025), new Decimal(0.01)];
    } else if (dex == 'METEORA') {
      return [new Decimal(0.0001), new Decimal(0.0005), new Decimal(0.0025), new Decimal(0.01)];
    } else {
      throw new Error(`Dex ${dex} is not supported`);
    }
  };

  getRebalanceMethods = (): RebalanceMethod[] => {
    return [
      ManualRebalanceMethod,
      PricePercentageRebalanceMethod,
      PricePercentageWithResetRangeRebalanceMethod,
      DriftRebalanceMethod,
      TakeProfitMethod,
      PeriodicRebalanceMethod,
      ExpanderMethod,
      AutodriftMethod,
    ];
  };

  getEnabledRebalanceMethods = (): RebalanceMethod[] => {
    return this.getRebalanceMethods().filter((x) => x.enabled);
  };

  getPriceReferenceTypes = (): PriceReferenceType[] => {
    return [PoolPriceReferenceType, TwapPriceReferenceType];
  };

  getDefaultRebalanceMethod = (): RebalanceMethod => PricePercentageRebalanceMethod;

  getDefaultParametersForNewVault = async (): Promise<VaultParameters> => {
    const dex = DefaultDex;
    const tokenMintA = DefaultMintTokenA;
    const tokenMintB = DefaultMintTokenB;
    const rebalanceMethod = this.getDefaultRebalanceMethod();
    const feeTier = DefaultFeeTierOrca;
    const tickSpacing = DefaultTickSpacing;
    let rebalancingParameters = await this.getDefaultRebalanceFields(
      dex,
      tokenMintA,
      tokenMintB,
      tickSpacing,
      rebalanceMethod
    );
    let defaultParameters: VaultParameters = {
      dex,
      tokenMintA,
      tokenMintB,
      feeTier,
      rebalancingParameters,
    };
    return defaultParameters;
  };

  /**
   * Retunrs what type of rebalance method the fields represent
   */
  getRebalanceTypeFromRebalanceFields = (rebalanceFields: RebalanceFieldInfo[]): RebalanceTypeKind => {
    return getRebalanceTypeFromRebalanceFields(rebalanceFields);
  };

  /**
   * Retunrs the rebalance method the fields represent with more details (description, enabled, etc)
   */
  getRebalanceMethodFromRebalanceFields = (rebalanceFields: RebalanceFieldInfo[]): RebalanceMethod => {
    return getRebalanceMethodFromRebalanceFields(rebalanceFields);
  };

  getReferencePriceTypeForStrategy = async (strategy: PublicKey | StrategyWithAddress): Promise<PriceReferenceType> => {
    const strategyWithAddress = await this.getStrategyStateIfNotFetched(strategy);
    return numberToReferencePriceType(strategyWithAddress.strategy.rebalanceRaw.referencePriceType);
  };

  getFieldsForRebalanceMethod = (
    rebalanceMethod: RebalanceMethod,
    dex: Dex,
    fieldOverrides: RebalanceFieldInfo[],
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    tickSpacing: number,
    poolPrice?: Decimal
  ): Promise<RebalanceFieldInfo[]> => {
    switch (rebalanceMethod) {
      case ManualRebalanceMethod:
        return this.getFieldsForManualRebalanceMethod(dex, fieldOverrides, tokenAMint, tokenBMint, poolPrice);
      case PricePercentageRebalanceMethod:
        return this.getFieldsForPricePercentageMethod(dex, fieldOverrides, tokenAMint, tokenBMint, poolPrice);
      case PricePercentageWithResetRangeRebalanceMethod:
        return this.getFieldsForPricePercentageWithResetMethod(dex, fieldOverrides, tokenAMint, tokenBMint, poolPrice);
      case DriftRebalanceMethod:
        return this.getFieldsForDriftRebalanceMethod(
          dex,
          fieldOverrides,
          tickSpacing,
          tokenAMint,
          tokenBMint,
          poolPrice
        );
      case TakeProfitMethod:
        return this.getFieldsForTakeProfitRebalanceMethod(dex, fieldOverrides, tokenAMint, tokenBMint, poolPrice);
      case PeriodicRebalanceMethod:
        return this.getFieldsForPeriodicRebalanceMethod(dex, fieldOverrides, tokenAMint, tokenBMint, poolPrice);
      case ExpanderMethod:
        return this.getFieldsForExpanderRebalanceMethod(dex, fieldOverrides, tokenAMint, tokenBMint, poolPrice);
      case AutodriftMethod:
        return this.getFieldsForAutodriftRebalanceMethod(
          dex,
          fieldOverrides,
          tokenAMint,
          tokenBMint,
          tickSpacing,
          poolPrice
        );
      default:
        throw new Error(`Rebalance method ${rebalanceMethod} is not supported`);
    }
  };

  getFieldsForManualRebalanceMethod = async (
    dex: Dex,
    fieldOverrides: RebalanceFieldInfo[],
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    poolPrice?: Decimal
  ): Promise<RebalanceFieldInfo[]> => {
    let price = poolPrice ? poolPrice : new Decimal(await this.getPriceForPair(dex, tokenAMint, tokenBMint));

    const defaultFields = getDefaultManualRebalanceFieldInfos(price);

    let lowerPrice = defaultFields.find((x) => x.label == 'rangePriceLower')!.value;
    const lowerPriceInput = fieldOverrides.find((x) => x.label == 'rangePriceLower');
    if (lowerPriceInput) {
      lowerPrice = lowerPriceInput.value;
    }

    let upperPrice = defaultFields.find((x) => x.label == 'rangePriceUpper')!.value;
    const upperPriceInput = fieldOverrides.find((x) => x.label == 'rangePriceUpper');
    if (upperPriceInput) {
      upperPrice = upperPriceInput.value;
    }

    return getManualRebalanceFieldInfos(new Decimal(lowerPrice), new Decimal(upperPrice));
  };

  getFieldsForPricePercentageMethod = async (
    dex: Dex,
    fieldOverrides: RebalanceFieldInfo[],
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    poolPrice?: Decimal
  ): Promise<RebalanceFieldInfo[]> => {
    const price = poolPrice ? poolPrice : new Decimal(await this.getPriceForPair(dex, tokenAMint, tokenBMint));

    const defaultFields = getDefaultPricePercentageRebalanceFieldInfos(price);
    let lowerPriceDifferenceBPS = defaultFields.find((x) => x.label == 'lowerRangeBps')!.value;
    const lowerPriceDifferenceBPSInput = fieldOverrides.find((x) => x.label == 'lowerRangeBps');
    if (lowerPriceDifferenceBPSInput) {
      lowerPriceDifferenceBPS = lowerPriceDifferenceBPSInput.value;
    }

    let upperPriceDifferenceBPS = defaultFields.find((x) => x.label == 'upperRangeBps')!.value;
    const upperPriceDifferenceBPSInput = fieldOverrides.find((x) => x.label == 'upperRangeBps');
    if (upperPriceDifferenceBPSInput) {
      upperPriceDifferenceBPS = upperPriceDifferenceBPSInput.value;
    }

    return getPricePercentageRebalanceFieldInfos(
      price,
      new Decimal(lowerPriceDifferenceBPS),
      new Decimal(upperPriceDifferenceBPS)
    );
  };

  getFieldsForPricePercentageWithResetMethod = async (
    dex: Dex,
    fieldOverrides: RebalanceFieldInfo[],
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    poolPrice?: Decimal
  ): Promise<RebalanceFieldInfo[]> => {
    const price = poolPrice ? poolPrice : new Decimal(await this.getPriceForPair(dex, tokenAMint, tokenBMint));

    const defaultFields = getDefaultPricePercentageWithResetRebalanceFieldInfos(price);

    let lowerPriceDifferenceBPS = defaultFields.find((x) => x.label == 'lowerRangeBps')!.value;
    let lowerPriceDifferenceBPSInput = fieldOverrides.find((x) => x.label == 'lowerRangeBps');
    if (lowerPriceDifferenceBPSInput) {
      lowerPriceDifferenceBPS = lowerPriceDifferenceBPSInput.value;
    }

    let upperPriceDifferenceBPS = defaultFields.find((x) => x.label == 'upperRangeBps')!.value;
    let upperPriceDifferenceBPSInput = fieldOverrides.find((x) => x.label == 'upperRangeBps');
    if (upperPriceDifferenceBPSInput) {
      upperPriceDifferenceBPS = upperPriceDifferenceBPSInput.value;
    }

    let lowerResetPriceDifferenceBPS = defaultFields.find((x) => x.label == 'resetLowerRangeBps')!.value;
    let lowerResetPriceDifferenceBPSInput = fieldOverrides.find((x) => x.label == 'resetLowerRangeBps');
    if (lowerResetPriceDifferenceBPSInput) {
      lowerResetPriceDifferenceBPS = lowerResetPriceDifferenceBPSInput.value;
    }

    let upperResetPriceDifferenceBPS = defaultFields.find((x) => x.label == 'resetUpperRangeBps')!.value;
    let upperResetPriceDifferenceBPSInput = fieldOverrides.find((x) => x.label == 'resetUpperRangeBps');
    if (upperResetPriceDifferenceBPSInput) {
      upperResetPriceDifferenceBPS = upperResetPriceDifferenceBPSInput.value;
    }

    return getPricePercentageWithResetRebalanceFieldInfos(
      price,
      new Decimal(lowerPriceDifferenceBPS),
      new Decimal(upperPriceDifferenceBPS),
      new Decimal(lowerResetPriceDifferenceBPS),
      new Decimal(upperResetPriceDifferenceBPS)
    );
  };

  getFieldsForDriftRebalanceMethod = async (
    dex: Dex,
    fieldOverrides: RebalanceFieldInfo[],
    tickSpacing: number,
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    poolPrice?: Decimal
  ): Promise<RebalanceFieldInfo[]> => {
    const tokenADecimals = await getMintDecimals(this._connection, tokenAMint);
    const tokenBDecimals = await getMintDecimals(this._connection, tokenBMint);
    const price = poolPrice ? poolPrice : new Decimal(await this.getPriceForPair(dex, tokenAMint, tokenBMint));

    const defaultFields = getDefaultDriftRebalanceFieldInfos(dex, tickSpacing, price, tokenADecimals, tokenBDecimals);

    let startMidTick = defaultFields.find((x) => x.label == 'startMidTick')!.value;
    let startMidTickInput = fieldOverrides.find((x) => x.label == 'startMidTick');
    if (startMidTickInput) {
      startMidTick = startMidTickInput.value;
    }

    let ticksBelowMid = defaultFields.find((x) => x.label == 'ticksBelowMid')!.value;
    let ticksBelowMidInput = fieldOverrides.find((x) => x.label == 'ticksBelowMid');
    if (ticksBelowMidInput) {
      ticksBelowMid = ticksBelowMidInput.value;
    }

    let ticksAboveMid = defaultFields.find((x) => x.label == 'ticksAboveMid')!.value;
    let ticksAboveMidInput = fieldOverrides.find((x) => x.label == 'ticksAboveMid');
    if (ticksAboveMidInput) {
      ticksAboveMid = ticksAboveMidInput.value;
    }

    let secondsPerTick = defaultFields.find((x) => x.label == 'secondsPerTick')!.value;
    let secondsPerTickInput = fieldOverrides.find((x) => x.label == 'secondsPerTick');
    if (secondsPerTickInput) {
      secondsPerTick = secondsPerTickInput.value;
    }

    let direction = defaultFields.find((x) => x.label == 'direction')!.value;
    let directionInput = fieldOverrides.find((x) => x.label == 'direction');
    if (directionInput) {
      direction = directionInput.value;
    }

    let fieldInfos = getDriftRebalanceFieldInfos(
      dex,
      tokenADecimals,
      tokenBDecimals,
      tickSpacing,
      new Decimal(startMidTick),
      new Decimal(ticksBelowMid),
      new Decimal(ticksAboveMid),
      new Decimal(secondsPerTick),
      new Decimal(direction)
    );

    return fieldInfos;
  };

  getFieldsForTakeProfitRebalanceMethod = async (
    dex: Dex,
    fieldOverrides: RebalanceFieldInfo[],
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    poolPrice?: Decimal
  ): Promise<RebalanceFieldInfo[]> => {
    const price = poolPrice ? poolPrice : new Decimal(await this.getPriceForPair(dex, tokenAMint, tokenBMint));
    const defaultFields = getDefaultTakeProfitRebalanceFieldsInfos(price);

    let lowerRangePrice = defaultFields.find((x) => x.label == 'rangePriceLower')!.value;
    let lowerRangePriceInput = fieldOverrides.find((x) => x.label == 'rangePriceLower');
    if (lowerRangePriceInput) {
      lowerRangePrice = lowerRangePriceInput.value;
    }

    let upperRangePrice = defaultFields.find((x) => x.label == 'rangePriceUpper')!.value;
    let upperRangePriceInput = fieldOverrides.find((x) => x.label == 'rangePriceUpper');
    if (upperRangePriceInput) {
      upperRangePrice = upperRangePriceInput.value;
    }

    let destinationToken = defaultFields.find((x) => x.label == 'destinationToken')!.value;
    let destinationTokenInput = fieldOverrides.find((x) => x.label == 'destinationToken');
    if (destinationTokenInput) {
      destinationToken = destinationTokenInput.value;
    }

    return getTakeProfitRebalanceFieldsInfos(
      new Decimal(lowerRangePrice),
      new Decimal(upperRangePrice),
      new Decimal(destinationToken),
      true
    );
  };

  getFieldsForPeriodicRebalanceMethod = async (
    dex: Dex,
    fieldOverrides: RebalanceFieldInfo[],
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    poolPrice?: Decimal
  ): Promise<RebalanceFieldInfo[]> => {
    const price = poolPrice ? poolPrice : new Decimal(await this.getPriceForPair(dex, tokenAMint, tokenBMint));
    const defaultFields = getDefaultPeriodicRebalanceFieldInfos(price);

    let period: Decimal = new Decimal(defaultFields.find((x) => x.label == 'period')!.value);
    let periodInput = fieldOverrides.find((x) => x.label == 'period');
    if (periodInput) {
      period = new Decimal(periodInput.value);
    }

    let lowerPriceDifferenceBPS = defaultFields.find((x) => x.label == 'lowerRangeBps')!.value;
    let lowerPriceDifferenceBPSInput = fieldOverrides.find((x) => x.label == 'lowerRangeBps');
    if (lowerPriceDifferenceBPSInput) {
      lowerPriceDifferenceBPS = lowerPriceDifferenceBPSInput.value;
    }

    let upperPriceDifferenceBPS = defaultFields.find((x) => x.label == 'upperRangeBps')!.value;
    let upperPriceDifferenceBPSInput = fieldOverrides.find((x) => x.label == 'upperRangeBps');
    if (upperPriceDifferenceBPSInput) {
      upperPriceDifferenceBPS = upperPriceDifferenceBPSInput.value;
    }

    return getPeriodicRebalanceRebalanceFieldInfos(
      price,
      period,
      new Decimal(lowerPriceDifferenceBPS),
      new Decimal(upperPriceDifferenceBPS)
    );
  };

  getFieldsForExpanderRebalanceMethod = async (
    dex: Dex,
    fieldOverrides: RebalanceFieldInfo[],
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    poolPrice?: Decimal
  ): Promise<RebalanceFieldInfo[]> => {
    const price = poolPrice ? poolPrice : new Decimal(await this.getPriceForPair(dex, tokenAMint, tokenBMint));
    const defaultFields = getDefaultExpanderRebalanceFieldInfos(price);

    let lowerPriceDifferenceBPS = defaultFields.find((x) => x.label == 'lowerRangeBps')!.value;
    let lowerPriceDifferenceBPSInput = fieldOverrides.find((x) => x.label == 'lowerRangeBps');
    if (lowerPriceDifferenceBPSInput) {
      lowerPriceDifferenceBPS = lowerPriceDifferenceBPSInput.value;
    }

    let upperPriceDifferenceBPS = defaultFields.find((x) => x.label == 'upperRangeBps')!.value;
    let upperPriceDifferenceBPSInput = fieldOverrides.find((x) => x.label == 'upperRangeBps');
    if (upperPriceDifferenceBPSInput) {
      upperPriceDifferenceBPS = upperPriceDifferenceBPSInput.value;
    }

    let lowerResetPriceDifferenceBPS = defaultFields.find((x) => x.label == 'resetLowerRangeBps')!.value;
    let lowerResetPriceDifferenceBPSInput = fieldOverrides.find((x) => x.label == 'resetLowerRangeBps');
    if (lowerResetPriceDifferenceBPSInput) {
      lowerResetPriceDifferenceBPS = lowerResetPriceDifferenceBPSInput.value;
    }

    let upperResetPriceDifferenceBPS = defaultFields.find((x) => x.label == 'resetUpperRangeBps')!.value;
    let upperResetPriceDifferenceBPSInput = fieldOverrides.find((x) => x.label == 'resetUpperRangeBps');
    if (upperResetPriceDifferenceBPSInput) {
      upperResetPriceDifferenceBPS = upperResetPriceDifferenceBPSInput.value;
    }

    let expansionBPS = defaultFields.find((x) => x.label == 'expansionBps')!.value;
    let expansionBPSInput = fieldOverrides.find((x) => x.label == 'expansionBps');
    if (expansionBPSInput) {
      expansionBPS = expansionBPSInput.value;
    }

    let maxNumberOfExpansions = defaultFields.find((x) => x.label == 'maxNumberOfExpansions')!.value;
    let maxNumberOfExpansionsInput = fieldOverrides.find((x) => x.label == 'maxNumberOfExpansions');
    if (maxNumberOfExpansionsInput) {
      maxNumberOfExpansions = maxNumberOfExpansionsInput.value;
    }

    let swapUnevenAllowed = defaultFields.find((x) => x.label == 'swapUnevenAllowed')!.value;
    let swapUnevenAllowedInput = fieldOverrides.find((x) => x.label == 'swapUnevenAllowed');
    if (swapUnevenAllowedInput) {
      swapUnevenAllowed = swapUnevenAllowedInput.value;
    }

    return getExpanderRebalanceFieldInfos(
      price,
      new Decimal(lowerPriceDifferenceBPS),
      new Decimal(upperPriceDifferenceBPS),
      new Decimal(lowerResetPriceDifferenceBPS),
      new Decimal(upperResetPriceDifferenceBPS),
      new Decimal(expansionBPS),
      new Decimal(maxNumberOfExpansions),
      new Decimal(swapUnevenAllowed)
    );
  };

  getFieldsForAutodriftRebalanceMethod = async (
    dex: Dex,
    fieldOverrides: RebalanceFieldInfo[],
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    tickSpacing: number,
    poolPrice?: Decimal
  ): Promise<RebalanceFieldInfo[]> => {
    const tokenADecimals = await getMintDecimals(this._connection, tokenAMint);
    const tokenBDecimals = await getMintDecimals(this._connection, tokenBMint);
    const price = poolPrice ? poolPrice : new Decimal(await this.getPriceForPair(dex, tokenAMint, tokenBMint));

    // TODO: maybe we will need to get real staking price instead of pool price for this to be accurate.
    const defaultFields = getDefaultAutodriftRebalanceFieldInfos(
      dex,
      price,
      tokenADecimals,
      tokenBDecimals,
      tickSpacing
    );

    let lastMidTick = defaultFields.find((x) => x.label == 'lastMidTick')!.value;

    let initDriftTicksPerEpoch = defaultFields.find((x) => x.label == 'initDriftTicksPerEpoch')!.value;
    let initDriftTicksPerEpochInput = fieldOverrides.find((x) => x.label == 'initDriftTicksPerEpoch');
    if (initDriftTicksPerEpochInput) {
      initDriftTicksPerEpoch = initDriftTicksPerEpochInput.value;
    }

    let ticksBelowMid = defaultFields.find((x) => x.label == 'ticksBelowMid')!.value;
    let ticksBelowMidInput = fieldOverrides.find((x) => x.label == 'ticksBelowMid');
    if (ticksBelowMidInput) {
      ticksBelowMid = ticksBelowMidInput.value;
    }

    let ticksAboveMid = defaultFields.find((x) => x.label == 'ticksAboveMid')!.value;
    let ticksAboveMidInput = fieldOverrides.find((x) => x.label == 'ticksAboveMid');
    if (ticksAboveMidInput) {
      ticksAboveMid = ticksAboveMidInput.value;
    }

    let frontrunMultiplierBps = defaultFields.find((x) => x.label == 'frontrunMultiplierBps')!.value;
    let frontrunMultiplierBpsInput = fieldOverrides.find((x) => x.label == 'frontrunMultiplierBps');
    if (frontrunMultiplierBpsInput) {
      frontrunMultiplierBps = frontrunMultiplierBpsInput.value;
    }
    let stakingRateASource = defaultFields.find((x) => x.label == 'stakingRateASource')!.value;
    let stakingRateASourceInput = fieldOverrides.find((x) => x.label == 'stakingRateASource');
    if (stakingRateASourceInput) {
      stakingRateASource = stakingRateASourceInput.value;
    }

    let stakingRateBSource = defaultFields.find((x) => x.label == 'stakingRateBSource')!.value;
    let stakingRateBSourceInput = fieldOverrides.find((x) => x.label == 'stakingRateBSource');
    if (stakingRateBSourceInput) {
      stakingRateBSource = stakingRateBSourceInput.value;
    }

    let initialDriftDirection = defaultFields.find((x) => x.label == 'initialDriftDirection')!.value;
    let initialDriftDirectionInput = fieldOverrides.find((x) => x.label == 'initialDriftDirection');
    if (initialDriftDirectionInput) {
      initialDriftDirection = initialDriftDirectionInput.value;
    }

    let fieldInfos = getAutodriftRebalanceFieldInfos(
      dex,
      tokenADecimals,
      tokenBDecimals,
      tickSpacing,
      new Decimal(lastMidTick),
      new Decimal(initDriftTicksPerEpoch),
      new Decimal(ticksBelowMid),
      new Decimal(ticksAboveMid),
      new Decimal(frontrunMultiplierBps),
      new Decimal(stakingRateASource),
      new Decimal(stakingRateBSource),
      new Decimal(initialDriftDirection)
    );

    return fieldInfos;
  };

  /**
   * Get the price for a given pair of tokens in a given dex; The price comes from any pool having those tokens, not a specific one, so the price may not be exactly the same between different pools with the same tokens. For a specific pool price use getPoolPrice
   * @param strategy
   * @param amountA
   */
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
    } else if (dex == 'METEORA') {
      let pools = await this.getMeteoraPoolsForTokens(poolTokenA, poolTokenB);
      if (pools.length == 0) {
        throw new Error(`No pool found for ${poolTokenA.toString()} and ${poolTokenB.toString()}`);
      }
      let decimalsX = await getMintDecimals(this._connection, poolTokenA);
      let decimalsY = await getMintDecimals(this._connection, poolTokenB);
      return getPriceOfBinByBinIdWithDecimals(
        pools[0].pool.activeId,
        pools[0].pool.binStep,
        decimalsX,
        decimalsY
      ).toNumber();
    } else {
      throw new Error(`Dex ${dex} is not supported`);
    }
  };

  getDefaultRebalanceFields = async (
    dex: Dex,
    poolTokenA: PublicKey,
    poolTokenB: PublicKey,
    tickSpacing: number,
    rebalanceMethod: RebalanceMethod
  ): Promise<RebalanceFieldInfo[]> => {
    const price = new Decimal(await this.getPriceForPair(dex, poolTokenA, poolTokenB));
    const tokenADecimals = await getMintDecimals(this._connection, poolTokenA);
    const tokenBDecimals = await getMintDecimals(this._connection, poolTokenB);

    switch (rebalanceMethod) {
      case ManualRebalanceMethod:
        return getDefaultManualRebalanceFieldInfos(price);
      case PricePercentageRebalanceMethod:
        return getDefaultPricePercentageRebalanceFieldInfos(price);
      case PricePercentageWithResetRangeRebalanceMethod:
        return getDefaultPricePercentageWithResetRebalanceFieldInfos(price);
      case DriftRebalanceMethod:
        return getDefaultDriftRebalanceFieldInfos(dex, tickSpacing, price, tokenADecimals, tokenBDecimals);
      case TakeProfitMethod:
        return getDefaultTakeProfitRebalanceFieldsInfos(price);
      case PeriodicRebalanceMethod:
        return getDefaultPeriodicRebalanceFieldInfos(price);
      case ExpanderMethod:
        return getDefaultExpanderRebalanceFieldInfos(price);
      case AutodriftMethod:
        return getDefaultAutodriftRebalanceFieldInfos(dex, price, tokenADecimals, tokenBDecimals, tickSpacing);
      default:
        throw new Error(`Rebalance method ${rebalanceMethod} is not supported`);
    }
  };

  /**
   * Return a the pubkey of the pool in a given dex, for given mints and fee tier; if that pool doesn't exist, return default pubkey
   */
  getPoolInitializedForDexPairTier = async (
    dex: Dex,
    poolTokenA: PublicKey,
    poolTokenB: PublicKey,
    feeBPS: Decimal
  ): Promise<PublicKey> => {
    if (dex == 'ORCA') {
      let pool = PublicKey.default;
      let orcaPools = await this.getOrcaPoolsForTokens(poolTokenA, poolTokenB);
      orcaPools.forEach((element) => {
        if (element.lpFeeRate * FullBPS == feeBPS.toNumber()) {
          pool = new PublicKey(element.address);
        }
      });
      return pool;
    } else if (dex == 'RAYDIUM') {
      let pools: Pool[] = [];
      let raydiumPools = await this.getRaydiumPoolsForTokens(poolTokenA, poolTokenB);
      raydiumPools.forEach((element) => {
        if (new Decimal(element.ammConfig.tradeFeeRate).div(FullBPS).div(FullPercentage).equals(feeBPS.div(FullBPS))) {
          pools.push(element);
        }
      });
      if (pools.length == 0) {
        return PublicKey.default;
      }
      let pool = PublicKey.default;
      let tickSpacing = Number.MAX_VALUE;
      pools.forEach((element) => {
        if (element.ammConfig.tickSpacing < tickSpacing) {
          pool = new PublicKey(element.id);
          tickSpacing = element.ammConfig.tickSpacing;
        }
      });
      return pool;
    } else if (dex == 'METEORA') {
      let pool = PublicKey.default;
      let pools = await this.getMeteoraPoolsForTokens(poolTokenA, poolTokenB);
      pools.forEach((element) => {
        let feeRateBps = element.pool.parameters.baseFactor * element.pool.binStep;
        if (feeRateBps == feeBPS.toNumber()) {
          pool = new PublicKey(element.key);
        }
      });
      return pool;
    } else {
      throw new Error(`Dex ${dex} is not supported`);
    }
  };

  /**
   * Return generic information for all pools in a given dex, for given mints and fee tier
   */
  async getExistentPoolsForPair(dex: Dex, tokenMintA: PublicKey, tokenMintB: PublicKey): Promise<GenericPoolInfo[]> {
    if (dex == 'ORCA') {
      let pools = await this.getOrcaPoolsForTokens(tokenMintA, tokenMintB);
      let genericPoolInfos: GenericPoolInfo[] = await Promise.all(
        pools.map(async (pool: OrcaPool) => {
          let positionsCount = new Decimal(await this.getPositionsCountForPool(dex, new PublicKey(pool.address)));
          // read price from pool
          let poolData = await this._orcaService.getPool(new PublicKey(pool.address));
          if (!poolData) {
            throw new Error(`Pool ${pool.address} not found`);
          }
          let poolInfo: GenericPoolInfo = {
            dex,
            address: new PublicKey(pool.address),
            price: poolData.price,
            tokenMintA: new PublicKey(pool.tokenA.mint),
            tokenMintB: new PublicKey(pool.tokenB.mint),
            tvl: pool.tvl ? new Decimal(pool.tvl) : undefined,
            feeRate: new Decimal(pool.lpFeeRate).mul(FullBPS),
            volumeOnLast7d: pool.volume ? new Decimal(pool.volume.week) : undefined,
            tickSpacing: new Decimal(pool.tickSpacing),
            positions: positionsCount,
          };
          return poolInfo;
        })
      );
      return genericPoolInfos;
    } else if (dex == 'RAYDIUM') {
      let pools = await this.getRaydiumPoolsForTokens(tokenMintA, tokenMintB);
      let genericPoolInfos: GenericPoolInfo[] = await Promise.all(
        pools.map(async (pool: Pool) => {
          let positionsCount = new Decimal(await this.getPositionsCountForPool(dex, new PublicKey(pool.id)));

          let poolInfo: GenericPoolInfo = {
            dex,
            address: new PublicKey(pool.id),
            price: new Decimal(pool.price),
            tokenMintA: new PublicKey(pool.mintA),
            tokenMintB: new PublicKey(pool.mintB),
            tvl: new Decimal(pool.tvl),
            feeRate: new Decimal(pool.ammConfig.tradeFeeRate).div(new Decimal(FullPercentage)),
            volumeOnLast7d: new Decimal(pool.week.volume),
            tickSpacing: new Decimal(pool.ammConfig.tickSpacing),
            positions: positionsCount,
          };
          return poolInfo;
        })
      );

      return genericPoolInfos;
    } else if (dex == 'METEORA') {
      let pools = await this.getMeteoraPoolsForTokens(tokenMintA, tokenMintB);
      let genericPoolInfos: GenericPoolInfo[] = await Promise.all(
        pools.map(async (pool: MeteoraPool) => {
          let positionsCount = new Decimal(await this.getPositionsCountForPool(dex, pool.key));
          let decimalsX = await getMintDecimals(this._connection, pool.pool.tokenXMint);
          let decimalsY = await getMintDecimals(this._connection, pool.pool.tokenYMint);
          let price = getPriceOfBinByBinIdWithDecimals(pool.pool.activeId, pool.pool.binStep, decimalsX, decimalsY);

          let poolInfo: GenericPoolInfo = {
            dex,
            address: pool.key,
            price,
            tokenMintA: pool.pool.tokenXMint,
            tokenMintB: pool.pool.tokenYMint,
            tvl: new Decimal(0),
            feeRate: computeMeteoraFee(pool.pool).div(1e2), // Transform it to rate
            volumeOnLast7d: new Decimal(0),
            tickSpacing: new Decimal(pool.pool.binStep),
            positions: positionsCount,
          };
          return poolInfo;
        })
      );

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

  getMeteoraPoolsForTokens = async (poolTokenA: PublicKey, poolTokenB: PublicKey): Promise<MeteoraPool[]> => {
    let pools: MeteoraPool[] = [];
    let meteoraPools = await this._meteoraService.getMeteoraPools();
    meteoraPools.forEach((element) => {
      if (
        (element.pool.tokenXMint.toString() == poolTokenA.toString() &&
          element.pool.tokenYMint.toString() == poolTokenB.toString()) ||
        (element.pool.tokenXMint.toString() == poolTokenB.toString() &&
          element.pool.tokenYMint.toString() == poolTokenA.toString())
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
    return await batchFetch(strategies, (chunk) =>
      WhirlpoolStrategy.fetchMultiple(this._connection, chunk, this._kaminoProgramId)
    );
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
    const states = await batchFetch(strategies, (chunk) =>
      WhirlpoolStrategy.fetchMultiple(this._connection, chunk, this._kaminoProgramId)
    );
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

    if (strategyFilters.owner) {
      filters.push({
        memcmp: {
          bytes: strategyFilters.owner.toBase58(),
          offset: 8,
        },
      });
    }

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

    if (strategyFilters.isCommunity !== undefined && strategyFilters.isCommunity !== null) {
      let value = !strategyFilters.isCommunity ? '1' : '2';
      filters.push({
        memcmp: {
          bytes: value,
          offset: 1664,
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
  getStrategyByAddress = (address: PublicKey) =>
    WhirlpoolStrategy.fetch(this._connection, address, this._kaminoProgramId);

  /**
   * Get a Kamino whirlpool strategy by its kToken mint address
   * @param kTokenMint - mint address of the kToken
   */
  getStrategyByKTokenMint = async (kTokenMint: PublicKey): Promise<StrategyWithAddress | null> => {
    const matchingStrategies = await this._kaminoProgram.account.whirlpoolStrategy.all([
      {
        memcmp: {
          bytes: kTokenMint.toBase58(),
          offset: 720,
        },
      },
    ]);

    if (matchingStrategies.length === 0) {
      return null;
    }
    if (matchingStrategies.length > 1) {
      throw new Error(
        `Multiple strategies found for kToken mint: ${kTokenMint.toBase58()}. Strategies found: ${matchingStrategies.map(
          (x) => x.publicKey.toBase58()
        )}`
      );
    }
    const decodedStrategy = new WhirlpoolStrategy(matchingStrategies[0].account as WhirlpoolStrategyFields);
    return {
      address: matchingStrategies[0].publicKey,
      strategy: decodedStrategy,
    };
  };

  /**
   * Get the strategy share data (price + balances) of the specified Kamino whirlpool strategy
   * @param strategy
   * @param scopePrices
   */
  getStrategyShareData = async (
    strategy: PublicKey | StrategyWithAddress,
    scopePrices?: OraclePrices
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
    const strategiesWithAddresses = Array.isArray(strategyFilters)
      ? await this.getStrategiesWithAddresses(strategyFilters)
      : await this.getAllStrategiesWithFilters(strategyFilters);
    const fetchBalances: Promise<StrategyBalanceWithAddress>[] = [];
    const allScopePrices = strategiesWithAddresses.map((x) => x.strategy.scopePrices);
    const scopePrices = await this._scope.getMultipleOraclePrices(allScopePrices);
    const scopePricesMap: Record<string, OraclePrices> = scopePrices.reduce((map, [address, price]) => {
      map[address.toBase58()] = price;
      return map;
    }, {});

    const raydiumStrategies = strategiesWithAddresses.filter(
      (x) =>
        x.strategy.strategyDex.toNumber() === dexToNumber('RAYDIUM') && !x.strategy.position.equals(PublicKey.default)
    );
    const raydiumPools = await this.getRaydiumPools(raydiumStrategies.map((x) => x.strategy.pool));
    const raydiumPositions = await this.getRaydiumPositions(raydiumStrategies.map((x) => x.strategy.position));
    const orcaStrategies = strategiesWithAddresses.filter(
      (x) => x.strategy.strategyDex.toNumber() === dexToNumber('ORCA') && !x.strategy.position.equals(PublicKey.default)
    );
    const orcaPools = await this.getWhirlpools(orcaStrategies.map((x) => x.strategy.pool));
    const orcaPositions = await this.getOrcaPositions(orcaStrategies.map((x) => x.strategy.position));
    const meteoraStrategies = strategiesWithAddresses.filter(
      (x) =>
        x.strategy.strategyDex.toNumber() === dexToNumber('METEORA') && !x.strategy.position.equals(PublicKey.default)
    );
    const meteoraPools = await this.getMeteoraPools(meteoraStrategies.map((x) => x.strategy.pool));
    const meteoraPositions = await this.getMeteoraPositions(meteoraStrategies.map((x) => x.strategy.position));

    const inactiveStrategies = strategiesWithAddresses.filter((x) => x.strategy.position.equals(PublicKey.default));
    const collateralInfos = await this.getCollateralInfos();
    for (const { strategy, address } of inactiveStrategies) {
      const strategyPrices = await this.getStrategyPrices(
        strategy,
        collateralInfos,
        scopePricesMap[strategy.scopePrices.toBase58()]
      );
      result.push({
        address,
        strategy,
        shareData: getEmptyShareData({
          ...strategyPrices,
          poolPrice: ZERO,
          upperPrice: ZERO,
          lowerPrice: ZERO,
          twapPrice: ZERO,
          lowerResetPrice: ZERO,
          upperResetPrice: ZERO,
        }),
      });
    }

    fetchBalances.push(
      ...this.getBalance<PoolState, PersonalPositionState>(
        raydiumStrategies,
        raydiumPools,
        raydiumPositions,
        this.getRaydiumBalances,
        collateralInfos,
        scopePricesMap
      )
    );

    fetchBalances.push(
      ...this.getBalance<Whirlpool, Position>(
        orcaStrategies,
        orcaPools,
        orcaPositions,
        this.getOrcaBalances,
        collateralInfos,
        scopePricesMap
      )
    );

    fetchBalances.push(
      ...this.getBalance<LbPair, PositionV2>(
        meteoraStrategies,
        meteoraPools,
        meteoraPositions,
        this.getMeteoraBalances,
        collateralInfos,
        scopePricesMap
      )
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
    pools: Map<string, PoolT | null>,
    positions: (PositionT | null)[],
    fetchBalance: (
      strategy: WhirlpoolStrategy,
      pool: PoolT,
      position: PositionT,
      collateralInfos: CollateralInfo[],
      prices?: OraclePrices
    ) => Promise<StrategyBalances>,
    collateralInfos: CollateralInfo[],
    prices?: Record<string, OraclePrices>
  ): Promise<StrategyBalanceWithAddress>[] => {
    const fetchBalances: Promise<StrategyBalanceWithAddress>[] = [];

    for (let i = 0; i < strategies.length; i++) {
      const { strategy, address } = strategies[i];

      const retrievedPool = { ...pools.get(strategy.pool.toString()) };
      const pool = { ...retrievedPool };
      const position = positions[i];
      if (!pool) {
        throw new Error(`Pool ${strategy.pool.toString()} could not be found.`);
      }
      if (!position) {
        throw new Error(`Position ${strategy.position.toString()} could not be found.`);
      }
      fetchBalances.push(
        fetchBalance(
          strategy,
          pool as PoolT,
          position as PositionT,
          collateralInfos,
          prices ? prices[strategy.scopePrices.toBase58()] : undefined
        ).then((balance) => {
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
    collateralInfos: CollateralInfo[],
    prices?: OraclePrices
  ): Promise<StrategyBalances> => {
    const strategyPrices = await this.getStrategyPrices(strategy, collateralInfos, prices);
    const rebalanceKind = numberToRebalanceType(strategy.rebalanceType);
    const tokenHoldings = this.getRaydiumTokensBalances(strategy, pool, position);

    let computedHoldings: Holdings = this.getStrategyHoldingsUsd(
      tokenHoldings.available.a,
      tokenHoldings.available.b,
      tokenHoldings.invested.a,
      tokenHoldings.invested.b,
      new Decimal(strategy.tokenAMintDecimals.toString()),
      new Decimal(strategy.tokenBMintDecimals.toString()),
      strategyPrices.aPrice,
      strategyPrices.bPrice
    );

    let decimalsA = strategy.tokenAMintDecimals.toNumber();
    let decimalsB = strategy.tokenBMintDecimals.toNumber();

    const poolPrice = SqrtPriceMath.sqrtPriceX64ToPrice(pool.sqrtPriceX64, decimalsA, decimalsB);
    const twapPrice =
      strategyPrices.aTwapPrice !== null && strategyPrices.bTwapPrice !== null
        ? strategyPrices.aTwapPrice.div(strategyPrices.bTwapPrice)
        : null;
    const upperPrice = SqrtPriceMath.sqrtPriceX64ToPrice(
      SqrtPriceMath.getSqrtPriceX64FromTick(position.tickUpperIndex),
      decimalsA,
      decimalsB
    );
    const lowerPrice = SqrtPriceMath.sqrtPriceX64ToPrice(
      SqrtPriceMath.getSqrtPriceX64FromTick(position.tickLowerIndex),
      decimalsA,
      decimalsB
    );
    let lowerResetPrice: Decimal | null = null;
    let upperResetPrice: Decimal | null = null;
    let dex = numberToDex(strategy.strategyDex.toNumber());
    if (rebalanceKind.kind === PricePercentageWithReset.kind) {
      const state = deserializePricePercentageWithResetRebalanceWithStateOverride(
        dex,
        decimalsA,
        decimalsB,
        poolPrice,
        strategy.rebalanceRaw
      );
      [lowerResetPrice, upperResetPrice] = extractPricesFromDeserializedState(state);
    } else if (rebalanceKind.kind === Expander.kind) {
      const state = deserializeExpanderRebalanceWithStateOverride(
        dex,
        decimalsA,
        decimalsB,
        poolPrice,
        strategy.rebalanceRaw
      );
      [lowerResetPrice, upperResetPrice] = extractPricesFromDeserializedState(state);
    }

    const balance: StrategyBalances = {
      computedHoldings,
      prices: { ...strategyPrices, poolPrice, lowerPrice, upperPrice, twapPrice, lowerResetPrice, upperResetPrice },
      tokenAAmounts: tokenHoldings.available.a.plus(tokenHoldings.invested.a),
      tokenBAmounts: tokenHoldings.available.b.plus(tokenHoldings.invested.b),
    };
    return balance;
  };

  private getMeteoraBalances = async (
    strategy: WhirlpoolStrategy,
    pool: LbPair,
    position: PositionV2 | undefined, // the undefined is for scenarios where the position is not initialised yet
    collateralInfos: CollateralInfo[],
    prices?: OraclePrices
  ): Promise<StrategyBalances> => {
    const strategyPricesPromise = this.getStrategyPrices(strategy, collateralInfos, prices);
    const rebalanceKind = numberToRebalanceType(strategy.rebalanceType);
    const tokenHoldingsPromise = this.getMeteoraTokensBalances(strategy);
    let [strategyPrices, tokenHoldings] = await Promise.all([strategyPricesPromise, tokenHoldingsPromise]);

    let computedHoldings: Holdings = this.getStrategyHoldingsUsd(
      tokenHoldings.available.a,
      tokenHoldings.available.b,
      tokenHoldings.invested.a,
      tokenHoldings.invested.b,
      new Decimal(strategy.tokenAMintDecimals.toString()),
      new Decimal(strategy.tokenBMintDecimals.toString()),
      strategyPrices.aPrice,
      strategyPrices.bPrice
    );

    let decimalsA = strategy.tokenAMintDecimals.toNumber();
    let decimalsB = strategy.tokenBMintDecimals.toNumber();

    const twapPrice =
      strategyPrices.aTwapPrice !== null && strategyPrices.bTwapPrice !== null
        ? strategyPrices.aTwapPrice.div(strategyPrices.bTwapPrice)
        : null;
    const poolPrice = getPriceOfBinByBinIdWithDecimals(pool.activeId, pool.binStep, decimalsA, decimalsB);
    let lowerPrice = ZERO;
    let upperPrice = ZERO;
    if (position && position.lowerBinId && position.upperBinId) {
      lowerPrice = getPriceOfBinByBinIdWithDecimals(position.lowerBinId, pool.binStep, decimalsA, decimalsB);
      upperPrice = getPriceOfBinByBinIdWithDecimals(position.upperBinId, pool.binStep, decimalsA, decimalsB);
    }

    let lowerResetPrice: Decimal | null = null;
    let upperResetPrice: Decimal | null = null;
    let dex = numberToDex(strategy.strategyDex.toNumber());
    if (rebalanceKind.kind === PricePercentageWithReset.kind) {
      const state = deserializePricePercentageWithResetRebalanceWithStateOverride(
        dex,
        decimalsA,
        decimalsB,
        poolPrice,
        strategy.rebalanceRaw
      );
      [lowerResetPrice, upperResetPrice] = extractPricesFromDeserializedState(state);
    } else if (rebalanceKind.kind === Expander.kind) {
      const state = deserializeExpanderRebalanceWithStateOverride(
        dex,
        decimalsA,
        decimalsB,
        poolPrice,
        strategy.rebalanceRaw
      );
      [lowerResetPrice, upperResetPrice] = extractPricesFromDeserializedState(state);
    }

    const balance: StrategyBalances = {
      computedHoldings,
      prices: { ...strategyPrices, poolPrice, lowerPrice, upperPrice, twapPrice, lowerResetPrice, upperResetPrice },
      tokenAAmounts: tokenHoldings.available.a.plus(tokenHoldings.invested.a),
      tokenBAmounts: tokenHoldings.available.b.plus(tokenHoldings.invested.b),
    };
    return balance;
  };

  private getRaydiumTokensBalances = (
    strategy: WhirlpoolStrategy,
    pool: PoolState,
    position: PersonalPositionState,
    mode: 'DEPOSIT' | 'WITHDRAW' = 'WITHDRAW'
  ): TokenHoldings => {
    const lowerSqrtPriceX64 = SqrtPriceMath.getSqrtPriceX64FromTick(position.tickLowerIndex);
    const upperSqrtPriceX64 = SqrtPriceMath.getSqrtPriceX64FromTick(position.tickUpperIndex);

    const { amountA, amountB } = LiquidityMath.getAmountsFromLiquidity(
      pool.sqrtPriceX64,
      new BN(lowerSqrtPriceX64),
      new BN(upperSqrtPriceX64),
      position.liquidity,
      mode === 'DEPOSIT'
    );

    const aAvailable = new Decimal(strategy.tokenAAmounts.toString());
    const bAvailable = new Decimal(strategy.tokenBAmounts.toString());
    const aInvested = new Decimal(amountA.toString());
    const bInvested = new Decimal(amountB.toString());

    let holdings: TokenHoldings = {
      available: {
        a: aAvailable,
        b: bAvailable,
      },
      invested: {
        a: aInvested,
        b: bInvested,
      },
    };

    return holdings;
  };

  private getMeteoraTokensBalances = async (strategy: WhirlpoolStrategy): Promise<TokenHoldings> => {
    let aInvested = ZERO;
    let bInvested = ZERO;
    try {
      const userPosition = await this.readMeteoraPosition(strategy.pool, strategy.position);

      if (userPosition && userPosition.amountX && userPosition.amountY) {
        aInvested = userPosition.amountX;
        bInvested = userPosition.amountY;
      }
    } catch (e) {}

    const aAvailable = new Decimal(strategy.tokenAAmounts.toString());
    const bAvailable = new Decimal(strategy.tokenBAmounts.toString());

    let holdings: TokenHoldings = {
      available: {
        a: aAvailable,
        b: bAvailable,
      },
      invested: {
        a: new Decimal(aInvested),
        b: new Decimal(bInvested),
      },
    };

    return holdings;
  };

  private getOrcaBalances = async (
    strategy: WhirlpoolStrategy,
    pool: Whirlpool,
    position: Position,
    collateralInfos: CollateralInfo[],
    prices?: OraclePrices,
    mode: 'DEPOSIT' | 'WITHDRAW' = 'WITHDRAW'
  ): Promise<StrategyBalances> => {
    const strategyPrices = await this.getStrategyPrices(strategy, collateralInfos, prices);
    const rebalanceKind = numberToRebalanceType(strategy.rebalanceType);

    let tokenHoldings = this.getOrcaTokensBalances(strategy, pool, position, mode);
    const computedHoldings: Holdings = this.getStrategyHoldingsUsd(
      tokenHoldings.available.a,
      tokenHoldings.available.b,
      tokenHoldings.invested.a,
      tokenHoldings.invested.b,
      new Decimal(strategy.tokenAMintDecimals.toString()),
      new Decimal(strategy.tokenBMintDecimals.toString()),
      strategyPrices.aPrice,
      strategyPrices.bPrice
    );

    const decimalsA = strategy.tokenAMintDecimals.toNumber();
    const decimalsB = strategy.tokenBMintDecimals.toNumber();

    const poolPrice = sqrtPriceX64ToPrice(pool.sqrtPrice, decimalsA, decimalsB);
    const twapPrice =
      strategyPrices.aTwapPrice !== null && strategyPrices.bTwapPrice !== null
        ? strategyPrices.aTwapPrice.div(strategyPrices.bTwapPrice)
        : null;
    const upperPrice = tickIndexToPrice(position.tickUpperIndex, decimalsA, decimalsB);
    const lowerPrice = tickIndexToPrice(position.tickLowerIndex, decimalsA, decimalsB);
    let lowerResetPrice: Decimal | null = null;
    let upperResetPrice: Decimal | null = null;
    let dex = numberToDex(strategy.strategyDex.toNumber());
    if (rebalanceKind.kind === PricePercentageWithReset.kind) {
      const state = deserializePricePercentageWithResetRebalanceWithStateOverride(
        dex,
        decimalsA,
        decimalsB,
        poolPrice,
        strategy.rebalanceRaw
      );
      [lowerResetPrice, upperResetPrice] = extractPricesFromDeserializedState(state);
    } else if (rebalanceKind.kind === Expander.kind) {
      const state = deserializeExpanderRebalanceWithStateOverride(
        dex,
        decimalsA,
        decimalsB,
        poolPrice,
        strategy.rebalanceRaw
      );
      [lowerResetPrice, upperResetPrice] = extractPricesFromDeserializedState(state);
    }

    const balance: StrategyBalances = {
      computedHoldings,
      prices: { ...strategyPrices, poolPrice, lowerPrice, upperPrice, twapPrice, lowerResetPrice, upperResetPrice },
      tokenAAmounts: tokenHoldings.available.a.plus(tokenHoldings.invested.a),
      tokenBAmounts: tokenHoldings.available.b.plus(tokenHoldings.invested.b),
    };
    return balance;
  };

  private getOrcaTokensBalances = (
    strategy: WhirlpoolStrategy,
    pool: Whirlpool,
    position: Position,
    mode: 'DEPOSIT' | 'WITHDRAW' = 'WITHDRAW'
  ): TokenHoldings => {
    const quote = getRemoveLiquidityQuote(
      {
        positionAddress: strategy.position,
        liquidity: position.liquidity,
        slippageTolerance: Percentage.fromFraction(0, 1000),
        sqrtPrice: pool.sqrtPrice,
        tickLowerIndex: position.tickLowerIndex,
        tickUpperIndex: position.tickUpperIndex,
        tickCurrentIndex: pool.tickCurrentIndex,
      },
      mode === 'DEPOSIT'
    );
    const aAvailable = new Decimal(strategy.tokenAAmounts.toString());
    const bAvailable = new Decimal(strategy.tokenBAmounts.toString());
    const aInvested = new Decimal(quote.estTokenA.toString());
    const bInvested = new Decimal(quote.estTokenB.toString());

    let holdings: TokenHoldings = {
      available: {
        a: aAvailable,
        b: bAvailable,
      },
      invested: {
        a: aInvested,
        b: bInvested,
      },
    };

    return holdings;
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

  /**
   * Get the balance of a token account or 0 if it doesn't exist
   * @param tokenAccount
   */
  private getTokenAccountBalanceOrZero = async (tokenAccount: PublicKey): Promise<Decimal> => {
    let tokenAccountExists = await checkIfAccountExists(this._connection, tokenAccount);
    if (tokenAccountExists) {
      return await this.getTokenAccountBalance(tokenAccount);
    } else {
      return new Decimal(0);
    }
  };

  private getStrategyBalances = async (
    strategy: WhirlpoolStrategy,
    scopePrices?: OraclePrices
  ): Promise<StrategyBalances> => {
    const collateralInfos = await this.getCollateralInfos();
    if (strategy.strategyDex.toNumber() == dexToNumber('ORCA')) {
      return this.getStrategyBalancesOrca(strategy, collateralInfos, scopePrices);
    } else if (strategy.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      return this.getStrategyBalancesRaydium(strategy, collateralInfos, scopePrices);
    } else if (strategy.strategyDex.toNumber() == dexToNumber('METEORA')) {
      return this.getStrategyBalancesMeteora(strategy, collateralInfos, scopePrices);
    } else {
      throw new Error(`Invalid dex ${strategy.strategyDex.toString()}`);
    }
  };

  private getStrategyTokensBalances = async (
    strategy: WhirlpoolStrategy,
    mode: 'DEPOSIT' | 'WITHDRAW' = 'WITHDRAW'
  ): Promise<TokenHoldings> => {
    if (strategy.strategyDex.toNumber() == dexToNumber('ORCA')) {
      const [whirlpoolAcc, positionAcc] = await this.getConnection().getMultipleAccountsInfo([
        strategy.pool,
        strategy.position,
      ]);
      if (!whirlpoolAcc) {
        throw Error(`Could not fetch Orca whirlpool state with pubkey ${strategy.pool.toString()}`);
      }
      if (!positionAcc) {
        throw Error(`Could not fetch Orca whirlpool position state with pubkey ${strategy.position.toString()}`);
      }
      const [whirlpool, position] = await Promise.all([
        Whirlpool.decode(whirlpoolAcc.data),
        Position.decode(positionAcc.data),
      ]);
      return this.getOrcaTokensBalances(strategy, whirlpool, position, mode);
    } else if (strategy.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      const [poolStateAcc, positionAcc] = await this.getConnection().getMultipleAccountsInfo([
        strategy.pool,
        strategy.position,
      ]);
      if (!poolStateAcc) {
        throw Error(`Could not fetch Raydium pool state with pubkey ${strategy.pool.toString()}`);
      }
      if (!positionAcc) {
        throw Error(`Could not fetch Raydium position state with pubkey ${strategy.position.toString()}`);
      }
      const [poolState, position] = await Promise.all([
        PoolState.decode(poolStateAcc.data),
        PersonalPositionState.decode(positionAcc.data),
      ]);
      return this.getRaydiumTokensBalances(strategy, poolState, position, mode);
    } else if (strategy.strategyDex.toNumber() == dexToNumber('METEORA')) {
      return this.getMeteoraTokensBalances(strategy);
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

  private getStrategyBalancesOrca = async (
    strategy: WhirlpoolStrategy,
    collateralInfos: CollateralInfo[],
    scopePrices?: OraclePrices
  ): Promise<StrategyBalances> => {
    const [whirlpoolAcc, positionAcc] = await this.getConnection().getMultipleAccountsInfo([
      strategy.pool,
      strategy.position,
    ]);
    if (!whirlpoolAcc) {
      throw Error(`Could not fetch Orca whirlpool state with pubkey ${strategy.pool.toString()}`);
    }
    if (!positionAcc) {
      throw Error(`Could not fetch Orca whirlpool position state with pubkey ${strategy.position.toString()}`);
    }
    const [whirlpool, position] = await Promise.all([
      Whirlpool.decode(whirlpoolAcc.data),
      Position.decode(positionAcc.data),
    ]);

    return this.getOrcaBalances(strategy, whirlpool, position, collateralInfos, scopePrices);
  };

  private getStrategyBalancesRaydium = async (
    strategy: WhirlpoolStrategy,
    collateralInfos: CollateralInfo[],
    scopePrices?: OraclePrices
  ): Promise<StrategyBalances> => {
    const [poolStateAcc, positionAcc] = await this.getConnection().getMultipleAccountsInfo([
      strategy.pool,
      strategy.position,
    ]);
    if (!poolStateAcc) {
      throw Error(`Could not fetch Raydium pool state with pubkey ${strategy.pool.toString()}`);
    }
    if (!positionAcc) {
      throw Error(`Could not fetch Raydium position state with pubkey ${strategy.position.toString()}`);
    }
    const [poolState, position] = await Promise.all([
      PoolState.decode(poolStateAcc.data),
      PersonalPositionState.decode(positionAcc.data),
    ]);

    return this.getRaydiumBalances(strategy, poolState, position, collateralInfos, scopePrices);
  };

  private getStrategyBalancesMeteora = async (
    strategy: WhirlpoolStrategy,
    collateralInfos: CollateralInfo[],
    scopePrices?: OraclePrices
  ): Promise<StrategyBalances> => {
    const [poolStateAcc, positionAcc] = await this.getConnection().getMultipleAccountsInfo([
      strategy.pool,
      strategy.position,
    ]);
    if (!poolStateAcc) {
      throw Error(`Could not fetch Meteora pool state with pubkey ${strategy.pool.toString()}`);
    }
    if (!positionAcc) {
      throw Error(`Could not fetch Meteora position state with pubkey ${strategy.position.toString()}`);
    }

    try {
      const [poolState, position] = await Promise.all([
        LbPair.decode(poolStateAcc.data),
        PositionV2.decode(positionAcc.data),
      ]);

      return this.getMeteoraBalances(strategy, poolState, position, collateralInfos, scopePrices);
    } catch (e) {
      const poolState = LbPair.decode(poolStateAcc.data);
      return this.getMeteoraBalances(strategy, poolState, undefined, collateralInfos, scopePrices);
    }
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

  getAllOraclePrices = (): Promise<OraclePrices> => this._scope.getOraclePrices();

  /**
   * Get all Kamino token spot and twap prices
   * @param oraclePrices (optional) Scope Oracle prices
   * @param collateralInfos (optional) Kamino Collateral Infos
   */
  getAllPrices = async (oraclePrices?: OraclePrices, collateralInfos?: CollateralInfo[]): Promise<KaminoPrices> => {
    const spotPrices: MintToPriceMap = {};
    const twaps: MintToPriceMap = {};
    ({ oraclePrices, collateralInfos } = await this.getOraclePricesAndCollateralInfos(oraclePrices, collateralInfos));
    for (const collateralInfo of collateralInfos) {
      if (collateralInfo.scopePriceChain && Scope.isScopeChainValid(collateralInfo.scopePriceChain)) {
        const spotPrice = await this._scope.getPriceFromChain(collateralInfo.scopePriceChain, oraclePrices);
        spotPrices[collateralInfo.mint.toString()] = {
          price: spotPrice.price,
          name: getTokenNameFromCollateralInfo(collateralInfo),
        };

        const filteredTwapChain = collateralInfo?.scopeTwapPriceChain?.filter((x) => x > 0);
        if (filteredTwapChain && Scope.isScopeChainValid(filteredTwapChain)) {
          const twap = await this._scope.getPriceFromChain(filteredTwapChain, oraclePrices);
          twaps[collateralInfo.mint.toString()] = {
            price: twap.price,
            name: getTokenNameFromCollateralInfo(collateralInfo),
          };
        }
      }
    }
    return { spot: spotPrices, twap: twaps };
  };

  private async getOraclePricesAndCollateralInfos(
    oraclePrices?: OraclePrices,
    collateralInfos?: CollateralInfo[]
  ): Promise<OraclePricesAndCollateralInfos> {
    if (!oraclePrices) {
      oraclePrices = await this.getAllOraclePrices();
    }
    if (!collateralInfos) {
      collateralInfos = await this.getCollateralInfos();
    }
    return { oraclePrices, collateralInfos };
  }

  /**
   * Get the prices of all tokens in the specified strategy, or null if the reward token does not exist
   * @param strategy
   * @param collateralInfos
   * @param scopePrices
   */
  getStrategyPrices = async (
    strategy: WhirlpoolStrategy,
    collateralInfos: CollateralInfo[],
    scopePrices?: OraclePrices
  ): Promise<StrategyPrices> => {
    const tokenA = collateralInfos[strategy.tokenACollateralId.toNumber()];
    const tokenB = collateralInfos[strategy.tokenBCollateralId.toNumber()];
    const rewardToken0 = collateralInfos[strategy.reward0CollateralId.toNumber()];
    const rewardToken1 = collateralInfos[strategy.reward1CollateralId.toNumber()];
    const rewardToken2 = collateralInfos[strategy.reward2CollateralId.toNumber()];

    let prices: OraclePrices;
    if (scopePrices) {
      prices = scopePrices;
    } else {
      prices = await this._scope.getOraclePrices({ prices: strategy.scopePrices });
    }
    const aPrice = await this._scope.getPriceFromChain(tokenA.scopePriceChain, prices);
    const bPrice = await this._scope.getPriceFromChain(tokenB.scopePriceChain, prices);
    const tokenATwap = stripTwapZeros(tokenA.scopeTwapPriceChain);
    const tokenBTwap = stripTwapZeros(tokenB.scopeTwapPriceChain);
    const aTwapPrice = Scope.isScopeChainValid(tokenATwap)
      ? await this._scope.getPriceFromChain(tokenATwap, prices)
      : null;
    const bTwapPrice = Scope.isScopeChainValid(tokenBTwap)
      ? await this._scope.getPriceFromChain(tokenBTwap, prices)
      : null;

    const reward0Price =
      strategy.reward0Decimals.toNumber() !== 0 && Scope.isScopeChainValid(rewardToken0.scopePriceChain)
        ? await this._scope.getPriceFromChain(rewardToken0.scopePriceChain, prices)
        : null;
    const reward1Price =
      strategy.reward1Decimals.toNumber() !== 0 && Scope.isScopeChainValid(rewardToken1.scopePriceChain)
        ? await this._scope.getPriceFromChain(rewardToken1.scopePriceChain, prices)
        : null;
    const reward2Price =
      strategy.reward2Decimals.toNumber() !== 0 && Scope.isScopeChainValid(rewardToken2.scopePriceChain)
        ? await this._scope.getPriceFromChain(rewardToken2.scopePriceChain, prices)
        : null;

    return {
      aPrice: aPrice.price,
      bPrice: bPrice.price,
      aTwapPrice: aTwapPrice?.price ?? null,
      bTwapPrice: bTwapPrice?.price ?? null,
      reward0Price: reward0Price?.price ?? null,
      reward1Price: reward1Price?.price ?? null,
      reward2Price: reward2Price?.price ?? null,
    };
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
   * Get strategy range in which liquidity is deposited
   */
  getStrategyRange = async (strategy: PublicKey | StrategyWithAddress): Promise<PositionRange> => {
    const stratWithAddress = await this.getStrategyStateIfNotFetched(strategy);

    if (stratWithAddress.strategy.strategyDex.toNumber() == dexToNumber('ORCA')) {
      return this.getStrategyRangeOrca(strategy);
    } else if (stratWithAddress.strategy.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      return this.getStrategyRangeRaydium(strategy);
    } else if (stratWithAddress.strategy.strategyDex.toNumber() == dexToNumber('METEORA')) {
      return this.getStrategyRangeMeteora(strategy);
    } else {
      throw Error(`Dex {stratWithAddress.strategy.strategyDex.toNumber()} not supported`);
    }
  };

  getStrategyRangeOrca = async (strategy: PublicKey | StrategyWithAddress): Promise<PositionRange> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    if (strategyState.position == PublicKey.default) {
      return { lowerPrice: ZERO, upperPrice: ZERO };
    } else {
      return this.getPositionRangeOrca(
        strategyState.position,
        strategyState.tokenAMintDecimals.toNumber(),
        strategyState.tokenBMintDecimals.toNumber()
      );
    }
  };

  getStrategyRangeRaydium = async (strategy: PublicKey | StrategyWithAddress): Promise<PositionRange> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    if (strategyState.position == PublicKey.default) {
      return { lowerPrice: ZERO, upperPrice: ZERO };
    } else {
      return this.getPositionRangeRaydium(
        strategyState.position,
        strategyState.tokenAMintDecimals.toNumber(),
        strategyState.tokenBMintDecimals.toNumber()
      );
    }
  };

  getStrategyRangeMeteora = async (strategy: PublicKey | StrategyWithAddress): Promise<PositionRange> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    if (strategyState.position == PublicKey.default) {
      return { lowerPrice: ZERO, upperPrice: ZERO };
    } else {
      return this.getPositionRangeMeteora(
        strategyState.position,
        strategyState.tokenAMintDecimals.toNumber(),
        strategyState.tokenBMintDecimals.toNumber()
      );
    }
  };

  getPositionRange = async (
    dex: Dex,
    position: PublicKey,
    decimalsA: number,
    decimalsB: number
  ): Promise<PositionRange> => {
    if (dex == 'ORCA') {
      return this.getPositionRangeOrca(position, decimalsA, decimalsB);
    } else if (dex == 'RAYDIUM') {
      return this.getPositionRangeRaydium(position, decimalsA, decimalsB);
    } else if (dex == 'METEORA') {
      return this.getPositionRangeMeteora(position, decimalsA, decimalsB);
    } else {
      throw Error(`Unsupported dex ${dex}`);
    }
  };

  getPositionRangeOrca = async (
    positionPk: PublicKey,
    decimalsA: number,
    decimalsB: number
  ): Promise<PositionRange> => {
    if (positionPk.toString() === PublicKey.default.toString()) {
      return { lowerPrice: ZERO, upperPrice: ZERO };
    }
    let position = await Position.fetch(this._connection, positionPk);
    if (!position) {
      return { lowerPrice: ZERO, upperPrice: ZERO };
    }
    let lowerPrice = tickIndexToPrice(position.tickLowerIndex, decimalsA, decimalsB);
    let upperPrice = tickIndexToPrice(position.tickUpperIndex, decimalsA, decimalsB);

    let positionRange: PositionRange = { lowerPrice, upperPrice };

    return positionRange;
  };

  getPositionRangeRaydium = async (
    positionPk: PublicKey,
    decimalsA: number,
    decimalsB: number
  ): Promise<PositionRange> => {
    if (positionPk.toString() === PublicKey.default.toString()) {
      return { lowerPrice: ZERO, upperPrice: ZERO };
    }
    let position = await PersonalPositionState.fetch(this._connection, positionPk);
    if (!position) {
      return { lowerPrice: ZERO, upperPrice: ZERO };
    }
    let lowerPrice = sqrtPriceX64ToPrice(
      SqrtPriceMath.getSqrtPriceX64FromTick(position.tickLowerIndex),
      decimalsA,
      decimalsB
    );

    let upperPrice = sqrtPriceX64ToPrice(
      SqrtPriceMath.getSqrtPriceX64FromTick(position.tickUpperIndex),
      decimalsA,
      decimalsB
    );

    let positionRange: PositionRange = { lowerPrice, upperPrice };

    return positionRange;
  };

  getPositionRangeMeteora = async (
    positionPk: PublicKey,
    decimalsA: number,
    decimalsB: number
  ): Promise<PositionRange> => {
    if (positionPk.equals(PublicKey.default)) {
      return { lowerPrice: ZERO, upperPrice: ZERO };
    }
    let position = await PositionV2.fetch(this._connection, positionPk);
    if (!position) {
      return { lowerPrice: ZERO, upperPrice: ZERO };
    }
    let pool = await LbPair.fetch(this._connection, position.lbPair);
    if (!pool) {
      return { lowerPrice: ZERO, upperPrice: ZERO };
    }
    let lowerPrice = getPriceOfBinByBinIdWithDecimals(position.lowerBinId, pool.binStep, decimalsA, decimalsB);

    let upperPrice = getPriceOfBinByBinIdWithDecimals(position.upperBinId, pool.binStep, decimalsA, decimalsB);

    let positionRange: PositionRange = { lowerPrice, upperPrice };

    return positionRange;
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
   * Get a list of Orca whirlpools from public keys
   * @param whirlpools
   */
  getWhirlpools = async (whirlpools: PublicKey[]): Promise<Map<string, Whirlpool | null>> => {
    let whirlpoolMap = new Map<string, Whirlpool | null>();

    const whirlpoolStrings = whirlpools.map((whirlpool) => whirlpool.toBase58());
    const uniqueWhirlpools = [...new Set(whirlpoolStrings)].map((value) => new PublicKey(value));
    if (uniqueWhirlpools.length === 1) {
      const whirlpool = await this.getWhirlpoolByAddress(whirlpools[0]);
      whirlpoolMap.set(whirlpools[0].toString(), whirlpool);
      return whirlpoolMap;
    }
    const fetched = await batchFetch(uniqueWhirlpools, (chunk) => Whirlpool.fetchMultiple(this._connection, chunk));
    fetched.reduce((map, whirlpool, i) => {
      whirlpoolMap.set(uniqueWhirlpools[i].toString(), whirlpool);
      map[uniqueWhirlpools[i].toBase58()] = whirlpool;
      return map;
    }, {});
    return whirlpoolMap;
  };

  /**
   * Get a list of Orca positions from public keys
   * @param positions
   */
  getOrcaPositions = async (positions: PublicKey[]): Promise<(Position | null)[]> => {
    const nonDefaults = positions.filter((value) => value.toBase58() !== PublicKey.default.toBase58());
    const fetched = await batchFetch(nonDefaults, (chunk) => Position.fetchMultiple(this._connection, chunk));
    const fetchedMap: Record<string, Position | null> = fetched.reduce((map, position, i) => {
      map[nonDefaults[i].toBase58()] = position;
      return map;
    }, {});
    return positions.map((position) => fetchedMap[position.toBase58()] || null);
  };

  /**
   * Get a list of Raydium positions from public keys
   * @param positions
   */
  getRaydiumPositions = async (positions: PublicKey[]): Promise<(PersonalPositionState | null)[]> => {
    const nonDefaults = positions.filter((value) => value.toBase58() !== PublicKey.default.toBase58());
    const fetched = await batchFetch(nonDefaults, (chunk) =>
      PersonalPositionState.fetchMultiple(this._connection, chunk)
    );
    const fetchedMap: Record<string, PersonalPositionState | null> = fetched.reduce((map, position, i) => {
      map[nonDefaults[i].toBase58()] = position;
      return map;
    }, {});
    return positions.map((position) => fetchedMap[position.toBase58()] || null);
  };

  getMeteoraPositions = async (positions: PublicKey[]): Promise<(PositionV2 | null)[]> => {
    const nonDefaults = positions.filter((value) => !value.equals(PublicKey.default));
    const fetched = await batchFetch(nonDefaults, (chunk) => PositionV2.fetchMultiple(this._connection, chunk));
    const fetchedMap: Record<string, PositionV2 | null> = fetched.reduce((map, position, i) => {
      map[nonDefaults[i].toBase58()] = position;
      return map;
    }, {});
    return positions.map((position) => fetchedMap[position.toBase58()] || null);
  };

  /**
   * Get whirlpool from public key
   * @param whirlpool pubkey of the orca whirlpool
   */
  getWhirlpoolByAddress = (whirlpool: PublicKey) => Whirlpool.fetch(this._connection, whirlpool);

  /**
   * Get a list of Raydium pools from public keys
   * @param pools
   */
  getRaydiumPools = async (pools: PublicKey[]): Promise<Map<string, PoolState | null>> => {
    let poolsMap = new Map<string, PoolState | null>();

    const poolStrings = pools.map((pool) => pool.toBase58());
    const uniquePools = [...new Set(poolStrings)].map((value) => new PublicKey(value));
    if (uniquePools.length === 1) {
      const pool = await this.getRaydiumPoolByAddress(pools[0]);
      poolsMap.set(pools[0].toString(), pool);
    }
    const fetched = await batchFetch(uniquePools, (chunk) => PoolState.fetchMultiple(this._connection, chunk));
    fetched.reduce((map, whirlpool, i) => {
      poolsMap.set(uniquePools[i].toString(), whirlpool);
      return map;
    }, {});
    return poolsMap;
  };

  getMeteoraPools = async (pools: PublicKey[]): Promise<Map<string, LbPair | null>> => {
    let poolsMap = new Map<string, LbPair | null>();

    const poolStrings = pools.map((pool) => pool.toBase58());
    const uniquePools = [...new Set(poolStrings)].map((value) => new PublicKey(value));
    if (uniquePools.length === 1) {
      const pool = await this.getMeteoraPoolByAddress(pools[0]);
      poolsMap.set(pools[0].toString(), pool);
    }
    const fetched = await batchFetch(uniquePools, (chunk) => LbPair.fetchMultiple(this._connection, chunk));
    fetched.reduce((map, whirlpool, i) => {
      poolsMap.set(uniquePools[i].toString(), whirlpool);
      return map;
    }, {});
    return poolsMap;
  };

  getRaydiumAmmConfig = (config: PublicKey) => AmmConfig.fetch(this._connection, config);

  /**
   * Get Raydium pool from public key
   * @param pool pubkey of the orca whirlpool
   */
  getRaydiumPoolByAddress = (pool: PublicKey) => PoolState.fetch(this._connection, pool);

  getMeteoraPoolByAddress = (pool: PublicKey) => LbPair.fetch(this._connection, pool);

  getEventAuthorityPDA = (dex: BN): PublicKey => {
    if (dex.toNumber() == dexToNumber('ORCA') || dex.toNumber() == dexToNumber('RAYDIUM')) {
      return this._kaminoProgramId;
    }

    if (dex.toNumber() == dexToNumber('METEORA')) {
      const [key, _] = PublicKey.findProgramAddressSync([Buffer.from('__event_authority')], METEORA_PROGRAM_ID);
      return key;
    }
    throw new Error('Invalid dex');
  };

  /**
   * Return transaction instruction to withdraw shares from a strategy owner (wallet) and get back token A and token B
   * @param strategy strategy public key
   * @param sharesAmount amount of shares (decimal representation), NOT in lamports
   * @param owner shares owner (wallet with shares)
   * @returns transaction instruction
   */
  withdrawShares = async (
    strategy: PublicKey | StrategyWithAddress,
    sharesAmount: Decimal,
    owner: PublicKey
  ): Promise<WithdrawShares> => {
    if (sharesAmount.lessThanOrEqualTo(0)) {
      throw Error('Shares amount cant be lower than or equal to 0.');
    }
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);

    const eventAuthority = this.getEventAuthorityPDA(strategyState.strategy.strategyDex);
    const { treasuryFeeTokenAVault, treasuryFeeTokenBVault } = this.getTreasuryFeeVaultPDAs(
      strategyState.strategy.tokenAMint,
      strategyState.strategy.tokenBMint
    );

    const sharesAta = getAssociatedTokenAddress(strategyState.strategy.sharesMint, owner);
    const tokenAAta = getAssociatedTokenAddress(strategyState.strategy.tokenAMint, owner);
    const tokenBAta = getAssociatedTokenAddress(strategyState.strategy.tokenBMint, owner);

    const sharesAmountInLamports = sharesAmount.mul(
      new Decimal(10).pow(strategyState.strategy.sharesMintDecimals.toString())
    );

    let programId = getDexProgramId(strategyState.strategy);

    const args: WithdrawArgs = { sharesAmount: new BN(sharesAmountInLamports.floor().toString()) };
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
      tokenAMint: strategyState.strategy.tokenAMint,
      tokenBMint: strategyState.strategy.tokenBMint,
      eventAuthority,
    };

    const withdrawIx = withdraw(args, accounts);
    let collectFeesAndRewardsIxns: TransactionInstruction[] = [];

    //  for Raydium strats we need to collect fees and rewards before withdrawal
    //  add rewards vaults accounts to withdraw
    const isRaydium = strategyState.strategy.strategyDex.toNumber() == dexToNumber('RAYDIUM');
    if (isRaydium) {
      const raydiumPosition = await PersonalPositionState.fetch(this._connection, strategyState.strategy.position);
      if (!raydiumPosition) {
        throw new Error('Position is not found');
      }

      collectFeesAndRewardsIxns = new Decimal(raydiumPosition.liquidity.toString()).gt(ZERO)
        ? [await this.collectFeesAndRewards(strategy, owner)]
        : [];

      const poolState = await this.getRaydiumPoolByAddress(strategyState.strategy.pool);
      if (!poolState) {
        throw new Error('Pool is not found');
      }

      if (strategyState.strategy.reward0Decimals.toNumber() > 0) {
        withdrawIx.keys = withdrawIx.keys.concat([
          { pubkey: poolState.rewardInfos[0].tokenVault, isSigner: false, isWritable: true },
          { pubkey: strategyState.strategy.reward0Vault, isSigner: false, isWritable: true },
        ]);
      }
      if (strategyState.strategy.reward1Decimals.toNumber() > 0) {
        withdrawIx.keys = withdrawIx.keys.concat([
          { pubkey: poolState.rewardInfos[1].tokenVault, isSigner: false, isWritable: true },
          { pubkey: strategyState.strategy.reward1Vault, isSigner: false, isWritable: true },
        ]);
      }
      if (strategyState.strategy.reward2Decimals.toNumber() > 0) {
        withdrawIx.keys = withdrawIx.keys.concat([
          { pubkey: poolState.rewardInfos[2].tokenVault, isSigner: false, isWritable: true },
          { pubkey: strategyState.strategy.reward2Vault, isSigner: false, isWritable: true },
        ]);
      }
    }

    return { prerequisiteIxs: collectFeesAndRewardsIxns, withdrawIx };
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
  ): Promise<TransactionInstruction[]> => {
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
  private getStrategyStateIfNotFetched = async (
    strategy: PublicKey | StrategyWithAddress
  ): Promise<StrategyWithAddress> => {
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

  private getWhirlpoolStateIfNotFetched = async (
    whirlpool: PublicKey | WhirlpoolWithAddress
  ): Promise<WhirlpoolWithAddress> => {
    const hasWhirlpoolBeenFetched = (object: PublicKey | WhirlpoolWithAddress): object is WhirlpoolWithAddress => {
      return 'whirlpool' in object;
    };

    if (hasWhirlpoolBeenFetched(whirlpool)) {
      return whirlpool;
    } else {
      const whirlpoolState = await this.getWhirlpoolByAddress(whirlpool);
      if (!whirlpoolState) {
        throw Error(`Could not fetch whirlpool state with pubkey ${whirlpool.toString()}`);
      }
      return { whirlpool: whirlpoolState, address: whirlpool };
    }
  };

  private getMeteoraStateIfNotFetched = async (lbPair: PublicKey | LbPairWithAddress): Promise<LbPairWithAddress> => {
    const hasLbPairBeenFetched = (object: PublicKey | LbPairWithAddress): object is LbPairWithAddress => {
      return 'lbPair' in object;
    };

    if (hasLbPairBeenFetched(lbPair)) {
      return lbPair;
    } else {
      const lbPairState = await this.getMeteoraPoolByAddress(lbPair);
      if (!lbPairState) {
        throw Error(`Could not fetch meteora lb pair state with pubkey ${lbPair.toString()}`);
      }
      return { pool: lbPairState, address: lbPair };
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
  withdrawAllShares = async (
    strategy: PublicKey | StrategyWithAddress,
    owner: PublicKey
  ): Promise<WithdrawShares | null> => {
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
  deposit = async (
    strategy: PublicKey | StrategyWithAddress,
    amountA: Decimal,
    amountB: Decimal,
    owner: PublicKey
  ): Promise<TransactionInstruction> => {
    if (amountA.lessThanOrEqualTo(0) && amountB.lessThanOrEqualTo(0)) {
      throw Error('Token A and B amount cant be lower than or equal to 0.');
    }
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);

    const globalConfig = await GlobalConfig.fetch(
      this._connection,
      strategyState.strategy.globalConfig,
      this._kaminoProgramId
    );
    if (!globalConfig) {
      throw Error(`Could not fetch global config with pubkey ${strategyState.strategy.globalConfig.toString()}`);
    }

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

    const depositArgs: DepositArgs = {
      tokenMaxA: new BN(lamportsA.floor().toString()),
      tokenMaxB: new BN(lamportsB.floor().toString()),
    };

    const depositAccounts: DepositAccounts = {
      user: owner,
      strategy: strategyState.address,
      globalConfig: strategyState.strategy.globalConfig,
      pool: strategyState.strategy.pool,
      position: strategyState.strategy.position,
      tokenAVault: strategyState.strategy.tokenAVault,
      tokenBVault: strategyState.strategy.tokenBVault,
      baseVaultAuthority: strategyState.strategy.baseVaultAuthority,
      tokenAAta,
      tokenBAta,
      tokenAMint: strategyState.strategy.tokenAMint,
      tokenBMint: strategyState.strategy.tokenBMint,
      userSharesAta: sharesAta,
      sharesMint: strategyState.strategy.sharesMint,
      sharesMintAuthority: strategyState.strategy.sharesMintAuthority,
      scopePrices: strategyState.strategy.scopePrices,
      tokenInfos: globalConfig.tokenInfos,
      tokenProgram: TOKEN_PROGRAM_ID,
      instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
      tickArrayLower: strategyState.strategy.tickArrayLower,
      tickArrayUpper: strategyState.strategy.tickArrayUpper,
    };

    return deposit(depositArgs, depositAccounts);
  };

  singleSidedDepositTokenA = async (
    strategy: PublicKey | StrategyWithAddress,
    amountToDeposit: Decimal,
    owner: PublicKey,
    slippageBps: Decimal,
    profiler: ProfiledFunctionExecution = noopProfiledFunctionExecution,
    swapIxsBuilder?: SwapperIxBuilder,
    initialUserTokenAtaBalances?: TokensBalances,
    priceAInB?: Decimal,
    includeAtaIxns: boolean = true, // if true it includes create and close wsol and token atas,
    onlyDirectRoutes?: boolean
  ): Promise<InstructionsWithLookupTables> => {
    const strategyWithAddress = await this.getStrategyStateIfNotFetched(strategy);

    let userTokenBalances = await profiler(
      this.getInitialUserTokenBalances(
        owner,
        strategyWithAddress.strategy.tokenAMint,
        strategyWithAddress.strategy.tokenBMint,
        initialUserTokenAtaBalances
      ),
      'A-getInitialUserTokenBalances',
      []
    );

    const userTokenBalancesWithoutSolBalanace = {
      a: userTokenBalances.a,
      b: userTokenBalances.b,
    };

    // if any of the tokens is SOL, we need to read how much SOL the user has, not how much wSOL which is what getInitialUserTokenBalances returns
    if (isSOLMint(strategyWithAddress.strategy.tokenAMint)) {
      userTokenBalances.a = userTokenBalances.a?.add(
        lamportsToNumberDecimal(new Decimal(await this._connection.getBalance(owner)), DECIMALS_SOL)
      );
    }

    if (isSOLMint(strategyWithAddress.strategy.tokenBMint)) {
      userTokenBalances.b = userTokenBalances.b?.add(
        lamportsToNumberDecimal(new Decimal(await this._connection.getBalance(owner)), DECIMALS_SOL)
      );
    }

    if (!userTokenBalances.a || !userTokenBalances.b) {
      throw Error('Error reading user token balances');
    }

    let tokenAMinPostDepositBalance = userTokenBalances.a?.sub(amountToDeposit);
    let swapper: SwapperIxBuilder = swapIxsBuilder
      ? swapIxsBuilder
      : (
          input: DepositAmountsForSwap,
          tokenAMint: PublicKey,
          tokenBMint: PublicKey,
          user: PublicKey,
          slippageBps: Decimal,
          allAccounts: PublicKey[]
        ) =>
          this.getJupSwapIxsV6(
            input,
            tokenAMint,
            tokenBMint,
            user,
            slippageBps,
            false,
            allAccounts,
            profiler,
            onlyDirectRoutes
          );

    console.log('single sided deposit tokenA tokenAMinPostDepositBalance', tokenAMinPostDepositBalance);
    console.log('single sided deposit tokenA userTokenBalances.b', userTokenBalances.b);
    return await profiler(
      this.getSingleSidedDepositIxs(
        strategyWithAddress,
        collToLamportsDecimal(tokenAMinPostDepositBalance, strategyWithAddress.strategy.tokenAMintDecimals.toNumber()),
        collToLamportsDecimal(userTokenBalances.b, strategyWithAddress.strategy.tokenBMintDecimals.toNumber()),
        owner,
        slippageBps,
        swapper,
        profiler,
        userTokenBalancesWithoutSolBalanace,
        priceAInB,
        includeAtaIxns
      ),
      'A-getSingleSidedDepositIxs',
      []
    );
  };

  singleSidedDepositTokenB = async (
    strategy: PublicKey | StrategyWithAddress,
    amountToDeposit: Decimal,
    owner: PublicKey,
    slippageBps: Decimal,
    profiler: ProfiledFunctionExecution = noopProfiledFunctionExecution,
    swapIxsBuilder?: SwapperIxBuilder,
    initialUserTokenAtaBalances?: TokensBalances,
    priceAInB?: Decimal,
    includeAtaIxns: boolean = true, // if true it includes create and close wsol and token atas,
    onlyDirectRoutes?: boolean
  ): Promise<InstructionsWithLookupTables> => {
    const strategyWithAddress = await this.getStrategyStateIfNotFetched(strategy);

    let userTokenBalances = await profiler(
      this.getInitialUserTokenBalances(
        owner,
        strategyWithAddress.strategy.tokenAMint,
        strategyWithAddress.strategy.tokenBMint,
        initialUserTokenAtaBalances
      ),
      'A-getInitialUserTokenBalances',
      []
    );

    const userTokenBalancesWithoutSolBalanace = {
      a: userTokenBalances.a,
      b: userTokenBalances.b,
    };

    // if any of the tokens is SOL, we need to read how much SOL the user has, not how much wSOL which is what getInitialUserTokenBalances returns
    if (isSOLMint(strategyWithAddress.strategy.tokenAMint)) {
      userTokenBalances.a = userTokenBalances.a?.add(
        lamportsToNumberDecimal(new Decimal(await this._connection.getBalance(owner)), DECIMALS_SOL)
      );
    }

    if (isSOLMint(strategyWithAddress.strategy.tokenBMint)) {
      userTokenBalances.b = userTokenBalances.b?.add(
        lamportsToNumberDecimal(new Decimal(await this._connection.getBalance(owner)), DECIMALS_SOL)
      );
    }

    if (!userTokenBalances.a || !userTokenBalances.b) {
      throw Error('Error reading user token balances');
    }
    let tokenBMinPostDepositBalance = userTokenBalances.b.sub(amountToDeposit);
    let swapper: SwapperIxBuilder = swapIxsBuilder
      ? swapIxsBuilder
      : (
          input: DepositAmountsForSwap,
          tokenAMint: PublicKey,
          tokenBMint: PublicKey,
          user: PublicKey,
          slippageBps: Decimal,
          allAccounts: PublicKey[]
        ) =>
          this.getJupSwapIxsV6(
            input,
            tokenAMint,
            tokenBMint,
            user,
            slippageBps,
            false,
            allAccounts,
            profiler,
            onlyDirectRoutes
          );

    return await profiler(
      this.getSingleSidedDepositIxs(
        strategyWithAddress,
        collToLamportsDecimal(userTokenBalances.a, strategyWithAddress.strategy.tokenAMintDecimals.toNumber()),
        collToLamportsDecimal(tokenBMinPostDepositBalance, strategyWithAddress.strategy.tokenBMintDecimals.toNumber()),
        owner,
        slippageBps,
        swapper,
        profiler,
        userTokenBalancesWithoutSolBalanace,
        priceAInB,
        includeAtaIxns
      ),
      'A-getSingleSidedDepositIxs',
      []
    );
  };

  getInitialUserTokenBalances = async (
    owner: PublicKey,
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    initialUserTokenBalances?: MaybeTokensBalances
  ): Promise<TokensBalances> => {
    let initialUserTokenABalance = new Decimal(0);
    let initialUserTokenBBalance = new Decimal(0);

    if (initialUserTokenBalances?.a) {
      initialUserTokenABalance = initialUserTokenBalances.a;
    } else {
      const [tokenAAta] = await getAssociatedTokenAddressAndData(this._connection, tokenAMint, owner);

      let ataExists = await checkIfAccountExists(this._connection, tokenAAta);
      if (!ataExists) {
        initialUserTokenABalance = new Decimal(0);
      } else {
        initialUserTokenABalance = await this.getTokenAccountBalance(tokenAAta);
      }
    }

    if (initialUserTokenBalances?.b) {
      initialUserTokenBBalance = initialUserTokenBalances.b;
    } else {
      const [tokenBAta] = await getAssociatedTokenAddressAndData(this._connection, tokenBMint, owner);

      let ataExists = await checkIfAccountExists(this._connection, tokenBAta);
      if (!ataExists) {
        initialUserTokenBBalance = new Decimal(0);
      } else {
        initialUserTokenBBalance = await this.getTokenAccountBalance(tokenBAta);
      }
    }

    return { a: initialUserTokenABalance, b: initialUserTokenBBalance };
  };

  private getSingleSidedDepositIxs = async (
    strategy: PublicKey | StrategyWithAddress,
    tokenAMinPostDepositBalanceLamports: Decimal,
    tokenBMinPostDepositBalanceLamports: Decimal,
    owner: PublicKey,
    swapSlippageBps: Decimal,
    swapIxsBuilder: SwapperIxBuilder,
    profiler: ProfiledFunctionExecution,
    initialUserTokenAtaBalances: TokensBalances,
    priceAInB?: Decimal, // not mandatory as it will be fetched from Jupyter
    includeAtaIxns: boolean = true // if true it includes create and close wsol and token atas,
  ): Promise<InstructionsWithLookupTables> => {
    const strategyWithAddress = await this.getStrategyStateIfNotFetched(strategy);
    const strategyState = strategyWithAddress.strategy;

    let realTokenAMinPostDepositBalanceLamports = tokenAMinPostDepositBalanceLamports;
    let realTokenBMinPostDepositBalanceLamports = tokenBMinPostDepositBalanceLamports;
    if (
      (tokenAMinPostDepositBalanceLamports.lessThan(0) && !isSOLMint(strategyState.tokenAMint)) ||
      (tokenBMinPostDepositBalanceLamports.lessThan(0) && !isSOLMint(strategyState.tokenBMint))
    ) {
      throw Error('Token A or B post deposit amount cant be lower than 0.');
    }

    const sharesAta = getAssociatedTokenAddress(strategyState.sharesMint, owner);
    const tokenAAta = getAssociatedTokenAddress(strategyState.tokenAMint, owner);
    const tokenBAta = getAssociatedTokenAddress(strategyState.tokenBMint, owner);

    let tokenAAtaBalance = initialUserTokenAtaBalances.a;
    let tokenBAtaBalance = initialUserTokenAtaBalances.b;

    let aToDeposit = collToLamportsDecimal(tokenAAtaBalance, strategyState.tokenAMintDecimals.toNumber()).sub(
      tokenAMinPostDepositBalanceLamports
    );
    let bToDeposit = collToLamportsDecimal(tokenBAtaBalance, strategyState.tokenBMintDecimals.toNumber()).sub(
      tokenBMinPostDepositBalanceLamports
    );

    let cleanupIxs: TransactionInstruction[] = [];
    let createWsolAtasIxns: TransactionInstruction[] = [];

    if (isSOLMint(strategyState.tokenAMint)) {
      // read how much SOL the user has and calculate the amount to deposit and balance based on it
      let solBalance = new Decimal(await this._connection.getBalance(owner));
      let tokenAAtaBalanceLamports = collToLamportsDecimal(
        tokenAAtaBalance,
        strategyState.tokenAMintDecimals.toNumber()
      );
      let availableSol = solBalance.add(tokenAAtaBalanceLamports);
      let solToDeposit = availableSol.sub(tokenAMinPostDepositBalanceLamports);

      aToDeposit = solToDeposit;
      if (!aToDeposit.eq(ZERO)) {
        if (tokenAAtaBalanceLamports.lessThan(aToDeposit)) {
          tokenAAtaBalance = lamportsToNumberDecimal(aToDeposit, DECIMALS_SOL);
        }
      }

      let createWSolAtaIxns = await createWsolAtaIfMissing(
        this._connection,
        new Decimal(lamportsToNumberDecimal(solToDeposit, DECIMALS_SOL)),
        owner
      );

      // if the wSOL ata is not created, expect to have 0 remaining after the deposit
      let wSolAtaExists = await checkIfAccountExists(this._connection, createWSolAtaIxns.ata);
      if (!wSolAtaExists) {
        realTokenAMinPostDepositBalanceLamports = new Decimal(0);
      } else {
        if (solToDeposit.greaterThanOrEqualTo(tokenAAtaBalanceLamports)) {
          realTokenAMinPostDepositBalanceLamports = ZERO;
        } else {
          realTokenAMinPostDepositBalanceLamports = tokenAAtaBalanceLamports.sub(solToDeposit);
        }
      }

      if (includeAtaIxns) {
        createWsolAtasIxns.push(...createWSolAtaIxns.createIxns);
        cleanupIxs.push(...createWSolAtaIxns.closeIxns);
      }
    }

    if (isSOLMint(strategyState.tokenBMint)) {
      let solBalance = new Decimal(await this._connection.getBalance(owner));
      let tokenBAtaBalanceLamports = collToLamportsDecimal(
        tokenBAtaBalance,
        strategyState.tokenBMintDecimals.toNumber()
      );
      let availableSol = solBalance.add(tokenBAtaBalanceLamports);
      let solToDeposit = availableSol.sub(tokenBMinPostDepositBalanceLamports);
      availableSol;

      bToDeposit = solToDeposit;

      if (!bToDeposit.eq(ZERO)) {
        if (tokenBAtaBalanceLamports.lessThan(bToDeposit)) {
          tokenBAtaBalance = lamportsToNumberDecimal(bToDeposit, DECIMALS_SOL);
        }
      }

      let createWSolAtaIxns = await createWsolAtaIfMissing(
        this._connection,
        new Decimal(lamportsToNumberDecimal(solToDeposit, DECIMALS_SOL)),
        owner
      );

      let wSolAtaExists = await checkIfAccountExists(this._connection, createWSolAtaIxns.ata);
      if (!wSolAtaExists) {
        realTokenBMinPostDepositBalanceLamports = new Decimal(0);
      } else {
        if (solToDeposit.greaterThanOrEqualTo(tokenBAtaBalanceLamports)) {
          realTokenBMinPostDepositBalanceLamports = ZERO;
        } else {
          realTokenBMinPostDepositBalanceLamports = tokenBAtaBalanceLamports.sub(solToDeposit);
        }
      }

      if (includeAtaIxns) {
        createWsolAtasIxns.push(...createWSolAtaIxns.createIxns);
        cleanupIxs.push(...createWSolAtaIxns.closeIxns);
      }
    }

    let amountsToDepositWithSwapPromise = this.calculateAmountsToBeDepositedWithSwap(
      strategyWithAddress,
      aToDeposit,
      bToDeposit,
      profiler,
      priceAInB
    );

    if (aToDeposit.lessThan(0) || bToDeposit.lessThan(0)) {
      throw Error(
        `Token A or B to deposit amount cannot be lower than 0; aToDeposit=${aToDeposit.toString()} bToDeposit=${bToDeposit.toString()}`
      );
    }

    const createAtaList = [strategyState.sharesMint];
    if (!tokenAAtaBalance.greaterThan(0)) {
      createAtaList.push(strategyState.tokenAMint);
    }

    if (!tokenBAtaBalance.greaterThan(0)) {
      createAtaList.push(strategyState.tokenBMint);
    }

    const createAtasIxnsPromise = getAtasWithCreateIxnsIfMissing(
      this._connection,
      createAtaList.filter((mint) => !isSOLMint(mint)),
      owner
    );

    const getGlobalConfigPromise = GlobalConfig.fetch(
      this._connection,
      strategyState.globalConfig,
      this._kaminoProgramId
    );
    const [createAtasIxns, amountsToDepositWithSwap, globalConfig] = await Promise.all([
      createAtasIxnsPromise,
      amountsToDepositWithSwapPromise,
      getGlobalConfigPromise,
    ]);

    let checkExpectedVaultsBalancesIx = await profiler(
      this.getCheckExpectedVaultsBalancesIx(strategyWithAddress, owner, tokenAAta, tokenBAta, {
        a: tokenAAtaBalance,
        b: tokenBAtaBalance,
      }),
      'B-getCheckExpectedVaultsBalancesIx',
      []
    );

    let poolProgram = getDexProgramId(strategyState);

    const args: SingleTokenDepositWithMinArgs = {
      tokenAMinPostDepositBalance: new BN(realTokenAMinPostDepositBalanceLamports.floor().toString()),
      tokenBMinPostDepositBalance: new BN(realTokenBMinPostDepositBalanceLamports.floor().toString()),
    };

    const accounts: SingleTokenDepositWithMinAccounts = {
      user: owner,
      strategy: strategyWithAddress.address,
      globalConfig: strategyState.globalConfig,
      pool: strategyState.pool,
      position: strategyState.position,
      tokenAVault: strategyState.tokenAVault,
      tokenBVault: strategyState.tokenBVault,
      baseVaultAuthority: strategyState.baseVaultAuthority,
      tokenAAta,
      tokenBAta,
      tokenAMint: strategyState.tokenAMint,
      tokenBMint: strategyState.tokenBMint,
      userSharesAta: sharesAta,
      sharesMint: strategyState.sharesMint,
      sharesMintAuthority: strategyState.sharesMintAuthority,
      scopePrices: strategyState.scopePrices,
      tokenInfos: globalConfig!.tokenInfos,
      tokenProgram: TOKEN_PROGRAM_ID,
      instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
      tickArrayLower: strategyWithAddress.strategy.tickArrayLower,
      tickArrayUpper: strategyWithAddress.strategy.tickArrayUpper,
    };

    let singleSidedDepositIx = singleTokenDepositWithMin(args, accounts);

    let result: TransactionInstruction[] = [];
    if (includeAtaIxns) {
      result.push(...createAtasIxns, ...createWsolAtasIxns);
    }

    // get all unique accounts in the tx so we can use the remaining space (MAX_ACCOUNTS_PER_TRANSACTION - accounts_used) for the swap
    const extractKeys = (ixs: any[]) => ixs.flatMap((ix) => ix.keys?.map((key) => key.pubkey) || []);

    const allKeys = [
      ...extractKeys(result),
      ...extractKeys([checkExpectedVaultsBalancesIx]),
      ...extractKeys([singleSidedDepositIx]),
      ...extractKeys(cleanupIxs),
    ];

    // if we have no tokens to sell skip the jup tx
    if (
      amountsToDepositWithSwap.tokenAToSwapAmount.gte(ZERO) &&
      amountsToDepositWithSwap.tokenBToSwapAmount.gte(ZERO)
    ) {
      result = result.concat([checkExpectedVaultsBalancesIx, singleSidedDepositIx, ...cleanupIxs]);
      return { instructions: result, lookupTablesAddresses: [] };
    }

    let [jupSwapIxs, lookupTablesAddresses] = await profiler(
      Kamino.retryAsync(async () =>
        profiler(
          swapIxsBuilder(
            amountsToDepositWithSwap,
            strategyState.tokenAMint,
            strategyState.tokenBMint,
            owner,
            swapSlippageBps,
            allKeys
          ),
          'B-swapIxsBuilder',
          [
            ['tokenAMint', strategyState.tokenAMint.toString()],
            ['tokenBMint', strategyState.tokenBMint.toString()],
          ]
        )
      ),
      'B-retryAsync',
      []
    );

    result = result.concat([checkExpectedVaultsBalancesIx, ...jupSwapIxs, singleSidedDepositIx, ...cleanupIxs]);
    return { instructions: result, lookupTablesAddresses };
  };

  static async retryAsync(fn: () => Promise<any>, retriesLeft = 5, interval = 2000): Promise<any> {
    try {
      return await fn();
    } catch (error) {
      if (retriesLeft) {
        await new Promise((resolve) => setTimeout(resolve, interval));
        return await Kamino.retryAsync(fn, retriesLeft - 1, interval);
      }
      throw error;
    }
  }

  /**
   * Get transaction instruction to deposit SOL into topup vault.
   * @param owner Owner (wallet, shareholder) public key
   * @param amountLamports Amount of SOL to deposit into topup vault
   * @returns transaction instruction for adding SOL to topup vault
   */
  upkeepTopupVault = (owner: PublicKey, amountLamports: Decimal): TransactionInstruction => {
    if (amountLamports.lessThanOrEqualTo(0)) {
      throw Error('Must deposit a positive amount of SOL.');
    }
    const topupVault = this.getUserTopupVault(owner);
    const ix = SystemProgram.transfer({
      fromPubkey: owner,
      toPubkey: topupVault,
      lamports: BigInt(amountLamports.floor().toString()),
    });
    return ix;
  };

  /**
   * Get the topup vault balance in SOL.
   * @param owner Owner (wallet, shareholder) public key
   * @returns SOL amount in topup vault
   */
  topupVaultBalance = async (owner: PublicKey): Promise<Decimal> => {
    let topupVault = this.getUserTopupVault(owner);
    return lamportsToNumberDecimal(new Decimal(await this._connection.getBalance(topupVault)), DECIMALS_SOL);
  };

  /**
   * Get transaction instruction to withdraw SOL from the topup vault.
   * @param owner Owner (wallet, shareholder) public key
   * @param amount Amount of SOL to withdraw from the topup vault
   * @returns transaction instruction for removing SOL from the topup vault
   */
  withdrawTopupVault = async (owner: PublicKey, amount: Decimal): Promise<TransactionInstruction> => {
    if (amount.lessThanOrEqualTo(0)) {
      throw Error('Must withdraw a positive amount of SOL.');
    }
    const topupVault = this.getUserTopupVault(owner);

    const solBalance = await this._connection.getBalance(topupVault);

    let solToWithdraw: Decimal;
    if (amount.eq(new Decimal(U64_MAX))) {
      solToWithdraw = new Decimal(await this._connection.getBalance(topupVault));
    } else {
      solToWithdraw = collToLamportsDecimal(amount, DECIMALS_SOL);
    }

    const args: WithdrawFromTopupArgs = {
      amount: new BN(solToWithdraw.toString()),
    };

    const accounts: WithdrawFromTopupAccounts = {
      adminAuthority: owner,
      topupVault,
      system: SystemProgram.programId,
    };

    let withdrawIxn = withdrawFromTopup(args, accounts);
    return withdrawIxn;
  };

  getJupSwapIxsWithMaxAccounts = async (
    input: DepositAmountsForSwap,
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    owner: PublicKey,
    slippageBps: Decimal,
    useOnlyLegacyTransaction: boolean,
    existingAccounts: PublicKey[],
    maxAccounts: number,
    profiler: ProfiledFunctionExecution = noopProfiledFunctionExecution,
    onlyDirectRoutes?: boolean
  ): Promise<[TransactionInstruction[], PublicKey[]]> => {
    let jupiterQuote: SwapResponse = input.tokenAToSwapAmount.lt(ZERO)
      ? await profiler(
          JupService.getBestRouteV6(
            owner,
            input.tokenAToSwapAmount.abs(),
            tokenAMint,
            tokenBMint,
            slippageBps.toNumber(),
            useOnlyLegacyTransaction,
            maxAccounts,
            onlyDirectRoutes
          ),
          'C-getBestRouteV6',
          []
        )
      : await profiler(
          JupService.getBestRouteV6(
            owner,
            input.tokenBToSwapAmount.abs(),
            tokenBMint,
            tokenAMint,
            slippageBps.toNumber(),
            useOnlyLegacyTransaction,
            maxAccounts,
            onlyDirectRoutes
          ),
          'C-getBestRouteV6',
          []
        );

    let { txMessage, lookupTablesAddresses } = await profiler(
      JupService.deserealizeVersionedTransactions(this._connection, [jupiterQuote.swapTransaction]),
      'C-deserealizeVersionedTransactions',
      []
    );

    let allJupIxs = [
      ...removeBudgetAndAtaIxns(txMessage[0].instructions, [tokenAMint.toString(), tokenBMint.toString()]),
    ];

    let allJupAccounts = allJupIxs.flatMap((ix) => ix.keys?.map((key) => key.pubkey) || []);
    let allAccounts = new Set<PublicKey>([...existingAccounts, ...allJupAccounts]);

    let prefix = 'getSingleSidedJupRoute:';
    console.log(`${prefix} All distinct existing accounts number ${new Set<PublicKey>(existingAccounts).size}`);
    console.log(`${prefix} All distinct Jup accounts number ${new Set<PublicKey>(allJupAccounts).size}`);
    console.log(`${prefix} All accounts number ${allAccounts.size}`);

    if (allAccounts.size < MAX_ACCOUNTS_PER_TRANSACTION) {
      return [allJupIxs, lookupTablesAddresses];
    }

    // if none of the swap TXs returned by Jup have less than max allowed accounts throw error as the tx will fail because we lock too many accounts
    throw new Error('All Jupiter swap routes have too many accounts in the instructions');
  };

  getJupSwapIxsV6 = async (
    input: DepositAmountsForSwap,
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    owner: PublicKey,
    slippageBps: Decimal,
    useOnlyLegacyTransaction: boolean,
    existingAccounts: PublicKey[],
    profiledFunctionExecution: ProfiledFunctionExecution = noopProfiledFunctionExecution,
    onlyDirectRoutes?: boolean
  ): Promise<[TransactionInstruction[], PublicKey[]]> => {
    console.log('getJupSwapIxsV6', JSON.stringify(input));

    let extraAccountsBuffer = 5;

    const currentAccounts = new Set<PublicKey>(existingAccounts).size;
    const duplicatedAccounts =
      1 + // tokenProgram
      1 + // systemProgram
      1 + // tokenAMint
      1 + // tokenBMint
      1 + // tokenAAta
      1; // tokenBAta

    while (extraAccountsBuffer < 30) {
      const maxAccounts = MAX_ACCOUNTS_PER_TRANSACTION - (currentAccounts - duplicatedAccounts) - extraAccountsBuffer;
      try {
        const result = await this.getJupSwapIxsWithMaxAccounts(
          input,
          tokenAMint,
          tokenBMint,
          owner,
          slippageBps,
          useOnlyLegacyTransaction,
          existingAccounts,
          maxAccounts,
          profiledFunctionExecution,
          onlyDirectRoutes
        );

        return result;
      } catch (error) {
        extraAccountsBuffer += 2;
        console.log(`getJupSwapIxs: ${error}`);
      }
    }

    console.log('getJupSwapIxs: Could not find a route with less than 64 total accounts');
    throw new Error(`Oops. Failed to find a route. Try again or unselect single-sided deposit.`);
  };

  getCheckExpectedVaultsBalancesIx = async (
    strategy: StrategyWithAddress,
    user: PublicKey,
    tokenAAta: PublicKey,
    tokenBAta: PublicKey,
    expectedTokensBalances?: MaybeTokensBalances
  ): Promise<TransactionInstruction> => {
    const { strategy: strategyState, address: _ } = strategy;

    let expectedABalance: Decimal;
    if (expectedTokensBalances && expectedTokensBalances.a) {
      expectedABalance = expectedTokensBalances.a;
    } else {
      expectedABalance = await this.getTokenAccountBalanceOrZero(tokenAAta);
    }

    let expectedBBalance: Decimal;
    if (expectedTokensBalances && expectedTokensBalances.b) {
      expectedBBalance = expectedTokensBalances.b;
    } else {
      expectedBBalance = await this.getTokenAccountBalanceOrZero(tokenBAta);
    }

    let expectedALamportsDecimal = collToLamportsDecimal(expectedABalance, strategyState.tokenAMintDecimals.toNumber());
    let expectedBLamportsDecimal = collToLamportsDecimal(expectedBBalance, strategyState.tokenBMintDecimals.toNumber());
    console.log('expectedALamportsDecimal ', expectedALamportsDecimal.toString());
    console.log('expectedBLamportsDecimal ', expectedBLamportsDecimal.toString());
    let expectedALamports = expectedALamportsDecimal.floor();
    let expectedBLamports = expectedBLamportsDecimal.floor();

    const args: CheckExpectedVaultsBalancesArgs = {
      tokenAAtaBalance: new BN(expectedALamports.toString()),
      tokenBAtaBalance: new BN(expectedBLamports.toString()),
    };

    const accounts: CheckExpectedVaultsBalancesAccounts = {
      user,
      tokenAAta,
      tokenBAta,
    };

    return checkExpectedVaultsBalances(args, accounts);
  };

  /**
   * Get transaction instruction to create a new Kamino strategy.
   * Current limitations:
   *   - strategy can only be created by the owner (admin) of the global config, we will need to allow non-admins to bypass this check
   *   - after the strategy is created, only the owner (admin) can update the treasury fee vault with token A/B, we need to allow non-admins to be able to do (and require) this as well
   * @param strategy public key of the new strategy to create
   * @param pool public key of the CLMM pool (either Orca or Raydium)
   * @param owner public key of the strategy owner (admin authority)
   * @param dex decentralized exchange specifier
   * @returns transaction instruction for Kamino strategy creation
   */
  createStrategy = async (
    strategy: PublicKey,
    pool: PublicKey,
    owner: PublicKey,
    dex: Dex
  ): Promise<TransactionInstruction> => {
    let tokenAMint = PublicKey.default;
    let tokenBMint = PublicKey.default;
    if (dex == 'ORCA') {
      const whirlpoolState = await Whirlpool.fetch(this._connection, pool);
      if (!whirlpoolState) {
        throw Error(`Could not fetch whirlpool state with pubkey ${pool.toString()}`);
      }
      tokenAMint = whirlpoolState.tokenMintA;
      tokenBMint = whirlpoolState.tokenMintB;
    } else if (dex == 'RAYDIUM') {
      const raydiumPoolState = await PoolState.fetch(this._connection, pool);
      if (!raydiumPoolState) {
        throw Error(`Could not fetch Raydium pool state with pubkey ${pool.toString()}`);
      }
      tokenAMint = raydiumPoolState.tokenMint0;
      tokenBMint = raydiumPoolState.tokenMint1;
    } else if (dex == 'METEORA') {
      const meteoraPoolState = await LbPair.fetch(this._connection, pool);
      if (!meteoraPoolState) {
        throw Error(`Could not fetch Meteora pool state with pubkey ${pool.toString()}`);
      }
      tokenAMint = meteoraPoolState.tokenXMint;
      tokenBMint = meteoraPoolState.tokenYMint;
    }

    let config = await GlobalConfig.fetch(this._connection, this._globalConfig, this._kaminoProgramId);
    if (!config) {
      throw Error(`Could not fetch globalConfig  with pubkey ${this.getGlobalConfig().toString()}`);
    }
    const collateralInfos = await this.getCollateralInfo(config.tokenInfos);
    const tokenACollateralId = collateralInfos.findIndex((x) => x.mint.toString() === tokenAMint.toString());
    if (tokenACollateralId === -1) {
      throw Error(`Could not find token A (mint ${tokenAMint}) in collateral infos`);
    }
    const tokenBCollateralId = collateralInfos.findIndex((x) => x.mint.toString() === tokenBMint.toString());
    if (tokenBCollateralId === -1) {
      throw Error(`Could not find token A (mint ${tokenAMint}) in collateral infos`);
    }

    const programAddresses = await this.getStrategyProgramAddresses(strategy, tokenAMint, tokenBMint);

    const strategyArgs: InitializeStrategyArgs = {
      tokenACollateralId: new BN(tokenACollateralId),
      tokenBCollateralId: new BN(tokenBCollateralId),
      strategyType: new BN(dexToNumber(dex)),
    };

    const strategyAccounts: InitializeStrategyAccounts = {
      adminAuthority: owner,
      strategy,
      globalConfig: this._globalConfig,
      pool,
      tokenAMint,
      tokenBMint,
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
    };

    return initializeStrategy(strategyArgs, strategyAccounts);
  };

  /**
   * Get transaction instruction to close Kamino strategy, including its position if there is any
   * and strategy token accounts.
   * @param strategy public key of the strategy
   * @returns instruction to close the strategy
   */
  withdrawAllAndCloseStrategy = async (strategy: PublicKey): Promise<WithdrawAllAndCloseIxns | null> => {
    const { address: _strategyPubkey, strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
    let withdrawIxns = await this.withdrawAllShares(strategy, strategyState.adminAuthority);
    if (withdrawIxns == null) {
      return null;
    }
    let closeIxn = await this.closeStrategy(strategy);
    return {
      withdrawIxns: [...withdrawIxns.prerequisiteIxs, withdrawIxns.withdrawIx],
      closeIxn,
    };
  };

  /**
   * Get transaction instruction to close Kamino strategy, including its position if there is any
   * and strategy token accounts.
   * @param strategy public key of the strategy
   * @returns instruction to close the strategy
   */
  closeStrategy = async (strategy: PublicKey) => {
    const { address: _strategyPubkey, strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
    let collInfos = await this.getCollateralInfos();

    const eventAuthority = this.getEventAuthorityPDA(strategyState.strategyDex);
    const poolProgram = getDexProgramId(strategyState);
    let oldPositionOrBaseVaultAuthority = strategyState.baseVaultAuthority;
    let oldPositionMintOrBaseVaultAuthority = strategyState.baseVaultAuthority;
    let oldPositionTokenAccountOrBaseVaultAuthority = strategyState.baseVaultAuthority;
    let oldTickArrayLowerOrBaseVaultAuthority = strategyState.baseVaultAuthority;
    let oldTickArrayUpperOrBaseVaultAuthority = strategyState.baseVaultAuthority;
    if (!strategyState.position.equals(PublicKey.default)) {
      oldPositionOrBaseVaultAuthority = strategyState.position;
      oldPositionMintOrBaseVaultAuthority = strategyState.positionMint;
      oldPositionTokenAccountOrBaseVaultAuthority = strategyState.positionTokenAccount;
      oldTickArrayLowerOrBaseVaultAuthority = strategyState.tickArrayLower;
      oldTickArrayUpperOrBaseVaultAuthority = strategyState.tickArrayUpper;
    }
    let userTokenAAta = getAssociatedTokenAddress(strategyState.tokenAMint, strategyState.adminAuthority);
    let userTokenBAta = getAssociatedTokenAddress(strategyState.tokenBMint, strategyState.adminAuthority);
    let reward0Vault = strategyState.baseVaultAuthority;
    let userReward0Ata = strategyState.baseVaultAuthority;
    if (isVaultInitialized(strategyState.reward0Vault, strategyState.reward0Decimals)) {
      reward0Vault = strategyState.reward0Vault;
      userReward0Ata = getAssociatedTokenAddress(
        collInfos[strategyState.reward0CollateralId.toNumber()].mint,
        strategyState.adminAuthority
      );
    }
    let reward1Vault = strategyState.baseVaultAuthority;
    let userReward1Ata = strategyState.baseVaultAuthority;
    if (isVaultInitialized(strategyState.reward1Vault, strategyState.reward1Decimals)) {
      reward1Vault = strategyState.reward1Vault;
      userReward1Ata = getAssociatedTokenAddress(
        collInfos[strategyState.reward1CollateralId.toNumber()].mint,
        strategyState.adminAuthority
      );
    }
    let reward2Vault = strategyState.baseVaultAuthority;
    let userReward2Ata = strategyState.baseVaultAuthority;
    if (isVaultInitialized(strategyState.reward2Vault, strategyState.reward2Decimals)) {
      reward2Vault = strategyState.reward2Vault;
      userReward2Ata = getAssociatedTokenAddress(
        collInfos[strategyState.reward2CollateralId.toNumber()].mint,
        strategyState.adminAuthority
      );
    }
    let kaminoReward0Vault = strategyState.baseVaultAuthority;
    let userKaminoReward0Ata = strategyState.baseVaultAuthority;
    if (isVaultInitialized(strategyState.kaminoRewards[0].rewardVault, strategyState.kaminoRewards[0].decimals)) {
      kaminoReward0Vault = strategyState.kaminoRewards[0].rewardVault;
      userKaminoReward0Ata = getAssociatedTokenAddress(
        strategyState.kaminoRewards[0].rewardMint,
        strategyState.adminAuthority
      );
    }
    let kaminoReward1Vault = strategyState.baseVaultAuthority;
    let userKaminoReward1Ata = strategyState.baseVaultAuthority;
    if (isVaultInitialized(strategyState.kaminoRewards[1].rewardVault, strategyState.kaminoRewards[1].decimals)) {
      kaminoReward1Vault = strategyState.kaminoRewards[1].rewardVault;
      userKaminoReward1Ata = getAssociatedTokenAddress(
        strategyState.kaminoRewards[1].rewardMint,
        strategyState.adminAuthority
      );
    }
    let kaminoReward2Vault = strategyState.baseVaultAuthority;
    let userKaminoReward2Ata = strategyState.baseVaultAuthority;
    if (isVaultInitialized(strategyState.kaminoRewards[2].rewardVault, strategyState.kaminoRewards[2].decimals)) {
      kaminoReward2Vault = strategyState.kaminoRewards[2].rewardVault;
      userKaminoReward2Ata = getAssociatedTokenAddress(
        strategyState.kaminoRewards[2].rewardMint,
        strategyState.adminAuthority
      );
    }

    const strategyAccounts: CloseStrategyAccounts = {
      adminAuthority: strategyState.adminAuthority,
      strategy,
      oldPositionOrBaseVaultAuthority,
      oldPositionMintOrBaseVaultAuthority,
      oldPositionTokenAccountOrBaseVaultAuthority,
      tokenAVault: strategyState.tokenAVault,
      tokenBVault: strategyState.tokenBVault,
      baseVaultAuthority: strategyState.baseVaultAuthority,
      system: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      poolProgram: poolProgram,
      userTokenAAta,
      userTokenBAta,
      reward0Vault,
      reward1Vault,
      reward2Vault,
      kaminoReward0Vault,
      kaminoReward1Vault,
      kaminoReward2Vault,
      userReward0Ata,
      userReward1Ata,
      userReward2Ata,
      userKaminoReward0Ata,
      userKaminoReward1Ata,
      userKaminoReward2Ata,
      oldTickArrayLowerOrBaseVaultAuthority,
      oldTickArrayUpperOrBaseVaultAuthority,
      pool: strategyState.pool,
      eventAuthority,
    };

    return closeStrategy(strategyAccounts);
  };

  getUserTopupVault = (user: PublicKey): PublicKey => {
    const [topupVault, _topupVaultBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('topup_vault'), user.toBuffer()],
      this.getProgramID()
    );
    return topupVault;
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
  createStrategyAccount = async (payer: PublicKey, newStrategy: PublicKey): Promise<TransactionInstruction> => {
    const accountSize = this._kaminoProgram.account.whirlpoolStrategy.size;
    return this.createAccountRentExempt(payer, newStrategy, accountSize);
  };

  createAccountRentExempt = async (
    payer: PublicKey,
    newAccountPubkey: PublicKey,
    size: number
  ): Promise<TransactionInstruction> => {
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
   * @param owner signer of the tx
   * @returns transaction instruction to collect strategy fees and rewards
   */
  collectFeesAndRewards = async (
    strategy: PublicKey | StrategyWithAddress,
    owner?: PublicKey
  ): Promise<TransactionInstruction> => {
    const { address: strategyPubkey, strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    const eventAuthority = this.getEventAuthorityPDA(strategyState.strategyDex);
    const { treasuryFeeTokenAVault, treasuryFeeTokenBVault, treasuryFeeVaultAuthority } = this.getTreasuryFeeVaultPDAs(
      strategyState.tokenAMint,
      strategyState.tokenBMint
    );

    let programId = WHIRLPOOL_PROGRAM_ID;

    let poolRewardVault0 = PublicKey.default;
    let poolRewardVault1 = PublicKey.default;
    let poolRewardVault2 = PublicKey.default;
    let rewardMint0 = PublicKey.default;
    let rewardMint1 = PublicKey.default;
    let rewardMint2 = PublicKey.default;
    if (strategyState.strategyDex.toNumber() == dexToNumber('ORCA')) {
      const whirlpool = await Whirlpool.fetch(this._connection, strategyState.pool);
      if (!whirlpool) {
        throw Error(`Could not fetch whirlpool state with pubkey ${strategyState.pool.toString()}`);
      }

      poolRewardVault0 = whirlpool.rewardInfos[0].vault;
      poolRewardVault1 = whirlpool.rewardInfos[1].vault;
      poolRewardVault2 = whirlpool.rewardInfos[2].vault;
      rewardMint0 = whirlpool.rewardInfos[0].mint;
      rewardMint1 = whirlpool.rewardInfos[1].mint;
      rewardMint2 = whirlpool.rewardInfos[2].mint;
    } else if (strategyState.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      programId = RAYDIUM_PROGRAM_ID;

      const poolState = await PoolState.fetch(this._connection, strategyState.pool);
      if (!poolState) {
        throw Error(`Could not fetch Raydium pool state with pubkey ${strategyState.pool.toString()}`);
      }
      poolRewardVault0 = poolState.rewardInfos[0].tokenVault;
      poolRewardVault1 = poolState.rewardInfos[1].tokenVault;
      poolRewardVault2 = poolState.rewardInfos[2].tokenVault;
      rewardMint0 = poolState.rewardInfos[0].tokenMint;
      rewardMint1 = poolState.rewardInfos[1].tokenMint;
      rewardMint2 = poolState.rewardInfos[2].tokenMint;
    } else if (strategyState.strategyDex.toNumber() == dexToNumber('METEORA')) {
      programId = METEORA_PROGRAM_ID;

      const poolState = await LbPair.fetch(this._connection, strategyState.pool);
      if (!poolState) {
        throw Error(`Could not fetch Meteora pool state with pubkey ${strategyState.pool.toString()}`);
      }
      poolRewardVault0 = poolState.rewardInfos[0].vault;
      poolRewardVault1 = poolState.rewardInfos[1].vault;
      rewardMint0 = poolState.rewardInfos[0].mint;
      rewardMint1 = poolState.rewardInfos[1].mint;
    }

    const accounts: CollectFeesAndRewardsAccounts = {
      user: owner || strategyState.adminAuthority,
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
      reward2Vault: strategyState.baseVaultAuthority,
      poolRewardVault0:
        strategyState.reward0Decimals.toNumber() > 0 ? poolRewardVault0 : strategyState.baseVaultAuthority,
      poolRewardVault1:
        strategyState.reward1Decimals.toNumber() > 0 ? poolRewardVault1 : strategyState.baseVaultAuthority,
      poolRewardVault2: strategyState.baseVaultAuthority,
      tickArrayLower: strategyState.tickArrayLower,
      tickArrayUpper: strategyState.tickArrayUpper,
      raydiumProtocolPositionOrBaseVaultAuthority: strategyState.raydiumProtocolPositionOrBaseVaultAuthority,
      tokenProgram: TOKEN_PROGRAM_ID,
      poolProgram: programId,
      instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
      reward0Mint: strategyState.reward0Decimals.toNumber() > 0 ? rewardMint0 : this._kaminoProgramId,
      reward1Mint: strategyState.reward1Decimals.toNumber() > 0 ? rewardMint1 : this._kaminoProgramId,
      reward2Mint: this._kaminoProgramId,
      eventAuthority,
    };

    return collectFeesAndRewards(accounts);
  };

  /**
   * Get orca position metadata program addresses
   * @param positionMint mint account of the position
   */
  getMetadataProgramAddressesOrca = (positionMint: PublicKey): MetadataProgramAddressesOrca => {
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
  ): MetadataProgramAddressesRaydium => {
    const { publicKey: protocolPosition, nonce: protocolPositionBump } = getPdaProtocolPositionAddress(
      RAYDIUM_PROGRAM_ID,
      pool,
      tickLowerIndex,
      tickUpperIndex
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
      protocolPositionBump,
      positionMetadata,
      positionMetadataBump,
    };
  };

  private getStartEndTicketIndexProgramAddressesOrca = (
    whirlpool: PublicKey,
    whirlpoolState: Whirlpool,
    tickLowerIndex: number,
    tickUpperIndex: number
  ): LowerAndUpperTickPubkeys => {
    const startTickIndex = getStartTickIndex(tickLowerIndex, whirlpoolState.tickSpacing, 0);
    const endTickIndex = getStartTickIndex(tickUpperIndex, whirlpoolState.tickSpacing, 0);

    const [lowerTickPubkey, lowerTickBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('tick_array'), whirlpool.toBuffer(), Buffer.from(startTickIndex.toString())],
      WHIRLPOOL_PROGRAM_ID
    );
    const [upperTickPubkey, upperTickBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('tick_array'), whirlpool.toBuffer(), Buffer.from(endTickIndex.toString())],
      WHIRLPOOL_PROGRAM_ID
    );
    return {
      lowerTick: lowerTickPubkey,
      lowerTickBump,
      upperTick: upperTickPubkey,
      upperTickBump,
    };
  };

  private getStartEndTicketIndexProgramAddressesRaydium = (
    pool: PublicKey,
    poolState: PoolState,
    tickLowerIndex: number,
    tickUpperIndex: number
  ): LowerAndUpperTickPubkeys => {
    const startTickIndex = TickUtils.getTickArrayStartIndexByTick(tickLowerIndex, poolState.tickSpacing);
    const endTickIndex = TickUtils.getTickArrayStartIndexByTick(tickUpperIndex, poolState.tickSpacing);

    const [lowerTickPubkey, lowerTickBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('tick_array'), pool.toBuffer(), i32ToBytes(startTickIndex)],
      RAYDIUM_PROGRAM_ID
    );
    const [upperTickPubkey, upperTickBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('tick_array'), pool.toBuffer(), i32ToBytes(endTickIndex)],
      RAYDIUM_PROGRAM_ID
    );
    return {
      lowerTick: lowerTickPubkey,
      lowerTickBump,
      upperTick: upperTickPubkey,
      upperTickBump,
    };
  };

  private readMeteoraPosition = async (poolPk: PublicKey, positionPk: PublicKey): Promise<MeteoraPosition> => {
    let pool = await LbPair.fetch(this._connection, poolPk);
    let position = await PositionV2.fetch(this._connection, positionPk);
    if (!pool || !position) {
      return {
        publicKey: positionPk,
        amountX: new Decimal(0),
        amountY: new Decimal(0),
      };
    }

    let { lowerTick: lowerTickPk, upperTick: upperTickPk } = this.getStartEndTicketIndexProgramAddressesMeteora(
      poolPk,
      position.lowerBinId
    );
    let lowerBinArray = await BinArray.fetch(this._connection, lowerTickPk);
    let upperBinArray = await BinArray.fetch(this._connection, upperTickPk);
    if (!lowerBinArray || !upperBinArray) {
      return {
        publicKey: positionPk,
        amountX: new Decimal(0),
        amountY: new Decimal(0),
      };
    }
    let binArrays = [lowerBinArray, upperBinArray];
    let totalAmountX = new Decimal(0);
    let totalAmountY = new Decimal(0);
    for (let idx = position.lowerBinId; idx <= position.upperBinId; idx++) {
      let bin = getBinFromBinArrays(idx, binArrays);
      if (bin) {
        const binX = new Decimal(bin.amountX.toString());
        const binY = new Decimal(bin.amountY.toString());
        const binLiq = new Decimal(bin.liquiditySupply.toString());
        if (binX && binX.gt(ZERO) && binY && binY.gt(ZERO) && binLiq && binLiq.gt(ZERO)) {
          const positionLiqNumber = position.liquidityShares[idx - position.lowerBinId].toNumber();
          if (position.liquidityShares[idx - position.lowerBinId] && positionLiqNumber > 0) {
            const positionLiq = new Decimal(position.liquidityShares[idx - position.lowerBinId].toString());

            if (binLiq && binLiq.gt(ZERO)) {
              totalAmountX = totalAmountX.add(binX.mul(positionLiq).div(binLiq));
              totalAmountY = totalAmountY.add(binY.mul(positionLiq).div(binLiq));
            }
          }
        }
      }
    }

    return {
      publicKey: positionPk,
      amountX: totalAmountX,
      amountY: totalAmountY,
    };
  };

  private getStartEndTicketIndexProgramAddressesMeteora = (
    pool: PublicKey,
    tickLowerIndex: number
  ): LowerAndUpperTickPubkeys => {
    const meteoraProgramId = METEORA_PROGRAM_ID;

    const lowerBinArrayIndex = binIdToBinArrayIndex(new BN(tickLowerIndex));
    const [lowerTick, lowerTickBump] = deriveBinArray(pool, lowerBinArrayIndex, meteoraProgramId);

    const upperBinArrayIndex = lowerBinArrayIndex.add(new BN(1));

    const [upperTick, upperTickBump] = deriveBinArray(pool, upperBinArrayIndex, meteoraProgramId);

    return {
      lowerTick,
      lowerTickBump,
      upperTick,
      upperTickBump,
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
    strategy: PublicKey | StrategyWithAddress,
    positionMint: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    status: StrategyStatusKind = new Uninitialized()
  ): Promise<TransactionInstruction> => {
    const { strategy: strategyState, address: strategyAddress } = await this.getStrategyStateIfNotFetched(strategy);
    if (!strategyState) {
      throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
    }
    const eventAuthority = this.getEventAuthorityPDA(strategyState.strategyDex);

    if (strategyState.strategyDex.toNumber() == dexToNumber('ORCA')) {
      return this.openPositionOrca(
        strategyState.adminAuthority,
        strategyAddress,
        strategyState.baseVaultAuthority,
        strategyState.pool,
        positionMint,
        priceLower,
        priceUpper,
        strategyState.tokenAVault,
        strategyState.tokenBVault,
        strategyState.tokenAMint,
        strategyState.tokenBMint,
        strategyState.position,
        strategyState.positionMint,
        strategyState.positionTokenAccount,
        strategyState.tickArrayLower,
        strategyState.tickArrayUpper,
        eventAuthority,
        status
      );
    } else if (strategyState.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      let reward0Vault: PublicKey | undefined = undefined;
      let reward1Vault: PublicKey | undefined = undefined;
      let reward2Vault: PublicKey | undefined = undefined;
      if (strategyState.reward0Decimals.toNumber() > 0) {
        reward0Vault = strategyState.reward0Vault;
      }
      if (strategyState.reward1Decimals.toNumber() > 0) {
        reward1Vault = strategyState.reward1Vault;
      }
      if (strategyState.reward2Decimals.toNumber() > 0) {
        reward2Vault = strategyState.reward2Vault;
      }

      return this.openPositionRaydium(
        strategyState.adminAuthority,
        strategyAddress,
        strategyState.baseVaultAuthority,
        strategyState.pool,
        positionMint,
        priceLower,
        priceUpper,
        strategyState.tokenAVault,
        strategyState.tokenBVault,
        strategyState.tokenAMint,
        strategyState.tokenBMint,
        strategyState.tickArrayLower,
        strategyState.tickArrayUpper,
        strategyState.position,
        strategyState.positionMint,
        strategyState.positionTokenAccount,
        strategyState.raydiumProtocolPositionOrBaseVaultAuthority,
        eventAuthority,
        status,
        reward0Vault,
        reward1Vault,
        reward2Vault
      );
    } else if (strategyState.strategyDex.toNumber() == dexToNumber('METEORA')) {
      return this.openPositionMeteora(
        strategyState.adminAuthority,
        strategyAddress,
        strategyState.baseVaultAuthority,
        strategyState.pool,
        positionMint,
        priceLower,
        priceUpper,
        strategyState.tokenAVault,
        strategyState.tokenBVault,
        strategyState.tokenAMint,
        strategyState.tokenBMint,
        strategyState.position,
        strategyState.positionMint,
        strategyState.positionTokenAccount,
        strategyState.tickArrayLower,
        strategyState.tickArrayUpper,
        eventAuthority,
        status
      );
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
    adminAuthority: PublicKey,
    strategy: PublicKey,
    baseVaultAuthority: PublicKey,
    pool: PublicKey,
    positionMint: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    tokenAVault: PublicKey,
    tokenBVault: PublicKey,
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    oldPositionOrBaseVaultAuthority: PublicKey,
    oldPositionMintOrBaseVaultAuthority: PublicKey,
    oldPositionTokenAccountOrBaseVaultAuthority: PublicKey,
    oldTickArrayLowerOrBaseVaultAuthority: PublicKey,
    oldTickArrayUpperOrBaseVaultAuthority: PublicKey,
    eventAuthority: PublicKey,
    status: StrategyStatusKind = new Uninitialized()
  ): Promise<TransactionInstruction> => {
    const whirlpool = await Whirlpool.fetch(this._connection, pool);
    if (!whirlpool) {
      throw Error(`Could not fetch whirlpool state with pubkey ${pool.toString()}`);
    }

    const isRebalancing = status.discriminator === Rebalancing.discriminator;
    let decimalsA = await getMintDecimals(this._connection, whirlpool.tokenMintA);
    let decimalsB = await getMintDecimals(this._connection, whirlpool.tokenMintB);

    const tickLowerIndex = getNextValidTickIndex(
      priceToTickIndex(priceLower, decimalsA, decimalsB),
      whirlpool.tickSpacing
    );
    const tickUpperIndex = getNextValidTickIndex(
      priceToTickIndex(priceUpper, decimalsA, decimalsB),
      whirlpool.tickSpacing
    );

    const { position, positionBump, positionMetadata } = this.getMetadataProgramAddressesOrca(positionMint);

    const positionTokenAccount = getAssociatedTokenAddress(positionMint, baseVaultAuthority);

    const args: OpenLiquidityPositionArgs = {
      tickLowerIndex: new BN(tickLowerIndex),
      tickUpperIndex: new BN(tickUpperIndex),
      bump: positionBump,
    };

    const { lowerTick: startTickIndex, upperTick: endTickIndex } = this.getStartEndTicketIndexProgramAddressesOrca(
      pool,
      whirlpool,
      tickLowerIndex,
      tickUpperIndex
    );

    const globalConfig = await GlobalConfig.fetch(this._connection, this._globalConfig, this._kaminoProgramId);
    if (!globalConfig) {
      throw Error(`Could not fetch global config with pubkey ${this._globalConfig.toString()}`);
    }

    const accounts: OpenLiquidityPositionAccounts = {
      adminAuthority: adminAuthority,
      strategy,
      pool: pool,
      tickArrayLower: startTickIndex,
      tickArrayUpper: endTickIndex,
      baseVaultAuthority: baseVaultAuthority,
      position,
      positionMint,
      positionMetadataAccount: positionMetadata,
      positionTokenAccount,
      rent: SYSVAR_RENT_PUBKEY,
      system: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      poolProgram: WHIRLPOOL_PROGRAM_ID,
      oldPositionOrBaseVaultAuthority: isRebalancing ? oldPositionOrBaseVaultAuthority : baseVaultAuthority,
      oldPositionMintOrBaseVaultAuthority: isRebalancing ? oldPositionMintOrBaseVaultAuthority : positionMint,
      oldPositionTokenAccountOrBaseVaultAuthority: isRebalancing
        ? oldPositionTokenAccountOrBaseVaultAuthority
        : positionTokenAccount,
      globalConfig: this._globalConfig,
      oldTickArrayLowerOrBaseVaultAuthority: isRebalancing ? oldTickArrayLowerOrBaseVaultAuthority : baseVaultAuthority,
      oldTickArrayUpperOrBaseVaultAuthority: isRebalancing ? oldTickArrayUpperOrBaseVaultAuthority : baseVaultAuthority,
      tokenAVault,
      tokenBVault,
      poolTokenVaultA: whirlpool.tokenVaultA,
      poolTokenVaultB: whirlpool.tokenVaultB,
      scopePrices: globalConfig.scopePriceId,
      tokenInfos: globalConfig.tokenInfos,
      tokenAMint,
      tokenBMint,
      eventAuthority,
    };

    let ixn = openLiquidityPosition(args, accounts);
    const accountIndex = ixn.keys.findIndex((accs) => accs.pubkey.equals(positionMint));
    ixn.keys[accountIndex].isSigner = true;
    return ixn;
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
    adminAuthority: PublicKey,
    strategy: PublicKey,
    baseVaultAuthority: PublicKey,
    pool: PublicKey,
    positionMint: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    tokenAVault: PublicKey,
    tokenBVault: PublicKey,
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    oldTickArrayLowerOrBaseVaultAuthority: PublicKey,
    oldTickArrayUpperOrBaseVaultAuthority: PublicKey,
    oldPositionOrBaseVaultAuthority: PublicKey,
    oldPositionMintOrBaseVaultAuthority: PublicKey,
    oldPositionTokenAccountOrBaseVaultAuthority: PublicKey,
    oldProtocolPositionOrBaseVaultAuthority: PublicKey,
    eventAuthority: PublicKey,
    status: StrategyStatusKind = new Uninitialized(),
    strategyRewardOVault?: PublicKey,
    strategyReward1Vault?: PublicKey,
    strategyReward2Vault?: PublicKey
  ): Promise<TransactionInstruction> => {
    const poolState = await PoolState.fetch(this._connection, pool);
    if (!poolState) {
      throw Error(`Could not fetch Raydium pool state with pubkey ${pool.toString()}`);
    }

    const isRebalancing = status.discriminator === Rebalancing.discriminator;

    let decimalsA = await getMintDecimals(this._connection, poolState.tokenMint0);
    let decimalsB = await getMintDecimals(this._connection, poolState.tokenMint1);

    let tickLowerIndex = TickMath.getTickWithPriceAndTickspacing(
      TickMath.roundPriceWithTickspacing(priceLower, poolState.tickSpacing, decimalsA, decimalsB),
      poolState.tickSpacing,
      decimalsA,
      decimalsB
    );

    let tickUpperIndex = TickMath.getTickWithPriceAndTickspacing(
      TickMath.roundPriceWithTickspacing(priceUpper, poolState.tickSpacing, decimalsA, decimalsB),
      poolState.tickSpacing,
      decimalsA,
      decimalsB
    );

    const { position, positionBump, protocolPosition, positionMetadata } = this.getMetadataProgramAddressesRaydium(
      positionMint,
      pool,
      tickLowerIndex,
      tickUpperIndex
    );

    const positionTokenAccount = getAssociatedTokenAddress(positionMint, baseVaultAuthority);

    const args: OpenLiquidityPositionArgs = {
      tickLowerIndex: new BN(tickLowerIndex),
      tickUpperIndex: new BN(tickUpperIndex),
      bump: positionBump,
    };

    const { lowerTick: startTickIndex, upperTick: endTickIndex } = this.getStartEndTicketIndexProgramAddressesRaydium(
      pool,
      poolState,
      tickLowerIndex,
      tickUpperIndex
    );

    const globalConfig = await GlobalConfig.fetch(this._connection, this._globalConfig, this._kaminoProgramId);
    if (!globalConfig) {
      throw Error(`Could not fetch global config with pubkey ${this._globalConfig.toString()}`);
    }
    const accounts: OpenLiquidityPositionAccounts = {
      adminAuthority: adminAuthority,
      strategy,
      pool: pool,
      tickArrayLower: startTickIndex,
      tickArrayUpper: endTickIndex,
      baseVaultAuthority: baseVaultAuthority,
      position,
      positionMint,
      positionMetadataAccount: positionMetadata,
      positionTokenAccount,
      rent: SYSVAR_RENT_PUBKEY,
      system: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      poolProgram: RAYDIUM_PROGRAM_ID,
      oldPositionOrBaseVaultAuthority: isRebalancing ? oldPositionOrBaseVaultAuthority : baseVaultAuthority,
      oldPositionMintOrBaseVaultAuthority: isRebalancing ? oldPositionMintOrBaseVaultAuthority : positionMint,
      oldPositionTokenAccountOrBaseVaultAuthority: isRebalancing
        ? oldPositionTokenAccountOrBaseVaultAuthority
        : positionTokenAccount,
      globalConfig: this._globalConfig,
      oldTickArrayLowerOrBaseVaultAuthority: isRebalancing ? oldTickArrayLowerOrBaseVaultAuthority : baseVaultAuthority,
      oldTickArrayUpperOrBaseVaultAuthority: isRebalancing ? oldTickArrayUpperOrBaseVaultAuthority : baseVaultAuthority,
      tokenAVault: tokenAVault,
      tokenBVault: tokenBVault,
      poolTokenVaultA: poolState.tokenVault0,
      poolTokenVaultB: poolState.tokenVault1,
      scopePrices: globalConfig.scopePriceId,
      tokenInfos: globalConfig.tokenInfos,
      tokenAMint,
      tokenBMint,
      eventAuthority,
    };

    let ix = openLiquidityPosition(args, accounts);

    ix.keys = ix.keys.concat([
      { pubkey: protocolPosition, isSigner: false, isWritable: true },
      { pubkey: oldProtocolPositionOrBaseVaultAuthority, isSigner: false, isWritable: true },
      { pubkey: METADATA_PROGRAM_ID, isSigner: false, isWritable: false },
    ]);
    if (strategyRewardOVault) {
      ix.keys = ix.keys.concat([
        { pubkey: poolState.rewardInfos[0].tokenVault, isSigner: false, isWritable: true },
        { pubkey: strategyRewardOVault, isSigner: false, isWritable: true },
      ]);
    }
    if (strategyReward1Vault) {
      ix.keys = ix.keys.concat([
        { pubkey: poolState.rewardInfos[1].tokenVault, isSigner: false, isWritable: true },
        { pubkey: strategyReward1Vault, isSigner: false, isWritable: true },
      ]);
    }
    if (strategyReward2Vault) {
      ix.keys = ix.keys.concat([
        { pubkey: poolState.rewardInfos[2].tokenVault, isSigner: false, isWritable: true },
        { pubkey: strategyReward2Vault, isSigner: false, isWritable: true },
      ]);
    }
    const accountIndex = ix.keys.findIndex((accs) => accs.pubkey.equals(positionMint));
    ix.keys[accountIndex].isSigner = true;
    return ix;
  };

  /**
   * Get a transaction to open liquidity position for a Kamino strategy
   * @param strategy strategy you want to open liquidity position for
   * @param positionMint new liquidity position account pubkey
   * @param priceLower new position's lower price of the range
   * @param priceUpper new position's upper price of the range
   * @param status strategy status
   */
  openPositionMeteora = async (
    adminAuthority: PublicKey,
    strategy: PublicKey,
    baseVaultAuthority: PublicKey,
    pool: PublicKey,
    position: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    tokenAVault: PublicKey,
    tokenBVault: PublicKey,
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    oldPositionOrBaseVaultAuthority: PublicKey,
    oldPositionMintOrBaseVaultAuthority: PublicKey,
    oldPositionTokenAccountOrBaseVaultAuthority: PublicKey,
    oldTickArrayLowerOrBaseVaultAuthority: PublicKey,
    oldTickArrayUpperOrBaseVaultAuthority: PublicKey,
    eventAuthority: PublicKey,
    status: StrategyStatusKind = new Uninitialized()
  ): Promise<TransactionInstruction> => {
    const lbPair = await LbPair.fetch(this._connection, pool);
    if (!lbPair) {
      throw Error(`Could not fetch meteora lbpair state with pubkey ${pool.toString()}`);
    }

    const isRebalancing = status.discriminator === Rebalancing.discriminator;
    let decimalsA = await getMintDecimals(this._connection, lbPair.tokenXMint);
    let decimalsB = await getMintDecimals(this._connection, lbPair.tokenYMint);

    let tickLowerIndex = getBinIdFromPriceWithDecimals(priceLower, lbPair.binStep, true, decimalsA, decimalsB);
    let tickUpperIndex = getBinIdFromPriceWithDecimals(priceUpper, lbPair.binStep, true, decimalsA, decimalsB);

    const { position: positionMint, positionBump, positionMetadata } = this.getMetadataProgramAddressesOrca(position);

    const positionTokenAccount = getAssociatedTokenAddress(position, baseVaultAuthority);

    const args: OpenLiquidityPositionArgs = {
      tickLowerIndex: new BN(tickLowerIndex),
      tickUpperIndex: new BN(tickUpperIndex),
      bump: positionBump,
    };

    const { lowerTick: startTickIndex, upperTick: endTickIndex } = this.getStartEndTicketIndexProgramAddressesMeteora(
      pool,
      tickLowerIndex
    );

    const globalConfig = await GlobalConfig.fetch(this._connection, this._globalConfig, this._kaminoProgramId);
    if (!globalConfig) {
      throw Error(`Could not fetch global config with pubkey ${this._globalConfig.toString()}`);
    }

    const accounts: OpenLiquidityPositionAccounts = {
      adminAuthority: adminAuthority,
      strategy,
      pool: pool,
      tickArrayLower: startTickIndex,
      tickArrayUpper: endTickIndex,
      baseVaultAuthority: baseVaultAuthority,
      position,
      positionMint,
      positionMetadataAccount: positionMetadata,
      positionTokenAccount,
      rent: SYSVAR_RENT_PUBKEY,
      system: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      poolProgram: WHIRLPOOL_PROGRAM_ID,
      oldPositionOrBaseVaultAuthority: isRebalancing ? oldPositionOrBaseVaultAuthority : baseVaultAuthority,
      oldPositionMintOrBaseVaultAuthority: isRebalancing ? oldPositionMintOrBaseVaultAuthority : positionMint,
      oldPositionTokenAccountOrBaseVaultAuthority: isRebalancing
        ? oldPositionTokenAccountOrBaseVaultAuthority
        : positionTokenAccount,
      globalConfig: this._globalConfig,
      oldTickArrayLowerOrBaseVaultAuthority: isRebalancing ? oldTickArrayLowerOrBaseVaultAuthority : baseVaultAuthority,
      oldTickArrayUpperOrBaseVaultAuthority: isRebalancing ? oldTickArrayUpperOrBaseVaultAuthority : baseVaultAuthority,
      tokenAVault,
      tokenBVault,
      poolTokenVaultA: lbPair.reserveX,
      poolTokenVaultB: lbPair.reserveY,
      scopePrices: globalConfig.scopePriceId,
      tokenInfos: globalConfig.tokenInfos,
      tokenAMint,
      tokenBMint,
      eventAuthority,
    };

    let ixn = openLiquidityPosition(args, accounts);
    const accountIndex = ixn.keys.findIndex((accs) => accs.pubkey.equals(position));
    ixn.keys[accountIndex].isSigner = true;
    return ixn;
  };

  /**
   * Get a transaction for executive withdrawal from a Kamino strategy.
   * @param strategy strategy pubkey or object
   * @param action withdrawal action
   * @returns transaction for executive withdrawal
   */
  executiveWithdraw = async (
    strategy: PublicKey | StrategyWithAddress,
    action: ExecutiveWithdrawActionKind
  ): Promise<TransactionInstruction> => {
    const { address: strategyPubkey, strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
    const eventAuthority = this.getEventAuthorityPDA(strategyState.strategyDex);

    let globalConfig = await GlobalConfig.fetch(this._connection, strategyState.globalConfig, this._kaminoProgramId);
    if (globalConfig == null) {
      throw new Error(`Unable to fetch GlobalConfig with Pubkey ${strategyState.globalConfig}`);
    }
    const args: ExecutiveWithdrawArgs = {
      action: action.discriminator,
    };

    let programId = getDexProgramId(strategyState);

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
      eventAuthority,
    };

    let executiveWithdrawIx = executiveWithdraw(args, accounts);

    //  for Raydium strats we need to collect fees and rewards before withdrawal
    //  add rewards vaults accounts to withdraw
    const isRaydium = strategyState.strategyDex.toNumber() == dexToNumber('RAYDIUM');
    if (isRaydium) {
      const poolState = await this.getRaydiumPoolByAddress(strategyState.pool);
      if (!poolState) {
        throw new Error('Pool is not found');
      }

      if (strategyState.reward0Decimals.toNumber() > 0) {
        executiveWithdrawIx.keys = executiveWithdrawIx.keys.concat([
          { pubkey: poolState.rewardInfos[0].tokenVault, isSigner: false, isWritable: true },
          { pubkey: strategyState.reward0Vault, isSigner: false, isWritable: true },
        ]);
      }
      if (strategyState.reward1Decimals.toNumber() > 0) {
        executiveWithdrawIx.keys = executiveWithdrawIx.keys.concat([
          { pubkey: poolState.rewardInfos[1].tokenVault, isSigner: false, isWritable: true },
          { pubkey: strategyState.reward1Vault, isSigner: false, isWritable: true },
        ]);
      }
      if (strategyState.reward2Decimals.toNumber() > 0) {
        executiveWithdrawIx.keys = executiveWithdrawIx.keys.concat([
          { pubkey: poolState.rewardInfos[2].tokenVault, isSigner: false, isWritable: true },
          { pubkey: strategyState.reward2Vault, isSigner: false, isWritable: true },
        ]);
      }
    }

    return executiveWithdrawIx;
  };

  /**
   * Get a an instruction to update the reference price type of a strategy
   * @param strategy strategy pubkey or object
   * @param referencePriceType new reference price type
   */
  getUpdateReferencePriceTypeIx = async (
    strategy: PublicKey | StrategyWithAddress,
    referencePriceType: ReferencePriceTypeKind
  ): Promise<TransactionInstruction> => {
    const { address, strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    return getUpdateStrategyConfigIx(
      strategyState.adminAuthority,
      this._globalConfig,
      address,
      new UpdateReferencePriceType(),
      new Decimal(referencePriceType.discriminator)
    );
  };

  /**
   * Get a transaction to invest funds from the Kamino vaults and put them into the DEX pool as liquidity.
   * @param strategy strategy pubkey or object
   * @param payer transaction payer
   */
  invest = async (strategy: PublicKey, payer: PublicKey): Promise<TransactionInstruction> => {
    const strategyState: WhirlpoolStrategy | null = await this.getStrategyByAddress(strategy);
    if (!strategyState) {
      throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
    }

    const globalConfig = await GlobalConfig.fetch(this._connection, strategyState.globalConfig, this._kaminoProgramId);
    if (!globalConfig) {
      throw Error(`Could not fetch global config with pubkey ${strategyState.globalConfig.toString()}`);
    }

    let programId = getDexProgramId(strategyState);
    const eventAuthority = this.getEventAuthorityPDA(strategyState.strategyDex);

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
      tokenAMint: strategyState.tokenAMint,
      tokenBMint: strategyState.tokenBMint,
      eventAuthority,
    };

    return invest(accounts);
  };

  /**
   * Get a list of instructions to collect the pending fees and invest them into the Kamino strategy's position.
   * @param strategy strategy pubkey or object
   * @param payer transaction payer
   */
  compound = async (strategy: PublicKey, payer: PublicKey): Promise<TransactionInstruction[]> => {
    // fetch here so the underluing instructions won't need to fetch
    const strategyWithAddress = await this.getStrategyStateIfNotFetched(strategy);
    if (!strategyWithAddress) {
      throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
    }

    let collectFeesAndRewardsIx = this.collectFeesAndRewards(strategyWithAddress, payer);
    let investIx = this.invest(strategy, payer);

    return Promise.all([collectFeesAndRewardsIx, investIx]);
  };

  getUpdateRebalancingParamsFromRebalanceFieldsIx = async (
    strategyAdmin: PublicKey,
    strategy: PublicKey,
    rebalanceFieldInfos: RebalanceFieldInfo[]
  ): Promise<TransactionInstruction> => {
    let rebalanceType = getRebalanceTypeFromRebalanceFields(rebalanceFieldInfos);
    const strategyState: WhirlpoolStrategy | null = await this.getStrategyByAddress(strategy);
    if (!strategyState) {
      throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
    }

    let rebalanceParams = rebalanceFieldInfos
      .filter((x) => x.label != RebalanceTypeLabelName && x.enabled)
      .map((f) => new Decimal(f.value));
    return this.getUpdateRebalancingParmsIxns(
      strategyAdmin,
      strategy,
      rebalanceParams,
      rebalanceType,
      strategyState.tokenAMintDecimals.toNumber(),
      strategyState.tokenBMintDecimals.toNumber()
    );
  };

  processRebalanceParams = async (
    dex: Dex,
    pool: PublicKey | WhirlpoolWithAddress,
    rebalanceType: Decimal,
    rebalanceParams: Decimal[]
  ): Promise<Decimal[]> => {
    let processedRebalanceParams = [...rebalanceParams];
    let rebalanceTypeKind = numberToRebalanceType(rebalanceType.toNumber());
    if (dex == 'ORCA') {
      const { address, whirlpool: whilrpoolState } = await this.getWhirlpoolStateIfNotFetched(pool);
      if (rebalanceTypeKind.kind == RebalanceType.Drift.kind) {
        processedRebalanceParams[0] = new Decimal(
          getNearestValidTickIndexFromTickIndex(rebalanceParams[0].toNumber(), whilrpoolState.tickSpacing)
        );
      }
    }

    return processedRebalanceParams;
  };

  getUpdateRebalancingParmsIxns = async (
    strategyAdmin: PublicKey,
    strategy: PublicKey,
    rebalanceParams: Decimal[],
    rebalanceType?: RebalanceTypeKind,
    tokenADecimals?: number,
    tokenBDecimals?: number
  ): Promise<TransactionInstruction> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
    if (!rebalanceType) {
      rebalanceType = numberToRebalanceType(strategyState.rebalanceType);
    }
    tokenADecimals = strategyState.tokenAMintDecimals.toNumber();
    tokenBDecimals = strategyState.tokenBMintDecimals.toNumber();

    const processedRebalanceParams = await this.processRebalanceParams(
      numberToDex(strategyState.strategyDex.toNumber()),
      strategyState.pool,
      new Decimal(rebalanceType.discriminator),
      rebalanceParams
    );

    const value = buildStrategyRebalanceParams(processedRebalanceParams, rebalanceType, tokenADecimals, tokenBDecimals);
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

  getUpdateRebalancingParamsForUninitializedStratIx = async (
    strategyAdmin: PublicKey,
    strategy: PublicKey,
    rebalanceParams: Decimal[],
    rebalanceType: RebalanceTypeKind,
    tokenADecimals: number,
    tokenBDecimals: number
  ): Promise<TransactionInstruction> => {
    const value = buildStrategyRebalanceParams(rebalanceParams, rebalanceType, tokenADecimals, tokenBDecimals);
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

  buildStrategyRebalanceParams = async (strategy: PublicKey | StrategyWithAddress): Promise<number[]> => {
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);

    let params = strategyState.strategy.rebalanceRaw.params.map((p) => new Decimal(p.toString()));
    return buildStrategyRebalanceParams(params, numberToRebalanceType(strategyState.strategy.rebalanceType));
  };

  /**
   * Get a list of instructions to initialize and set up a strategy
   * @param dex the dex to use (Orca or Raydium)
   * @param feeTierBps which fee tier for that specific pair should be used (in BPS)
   * @param tokenAMint the mint of TokenA in the pool
   * @param tokenBMint the mint of TokenB in the pool
   * @param depositCap the maximum amount in USD in lamports (6 decimals) that can be deposited into the strategy
   * @param depositCapPerIx the maximum amount in USD in lamports (6 decimals) that can be deposited into the strategy per instruction
   */
  getBuildStrategyIxns = async (
    dex: Dex,
    feeTierBps: Decimal,
    strategy: PublicKey,
    positionMint: PublicKey,
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
  ): Promise<InitStrategyIxs> => {
    let feeTier: Decimal = feeTierBps.div(FullBPS);
    // check both tokens exist in collateralInfo
    let config = await GlobalConfig.fetch(this._connection, this._globalConfig, this._kaminoProgramId);
    if (!config) {
      throw Error(`Could not fetch globalConfig  with pubkey ${this.getGlobalConfig().toString()}`);
    }
    const collateralInfos = await this.getCollateralInfo(config.tokenInfos);
    if (!this.mintIsSupported(collateralInfos, tokenAMint) || !this.mintIsSupported(collateralInfos, tokenBMint)) {
      throw Error(`Token mint ${tokenAMint.toString()} is not supported`);
    }

    let pool = await this.getPoolInitializedForDexPairTier(dex, tokenAMint, tokenBMint, feeTier.mul(FullBPS));
    if (pool == PublicKey.default) {
      throw Error(
        `Pool for tokens ${tokenAMint.toString()} and ${tokenBMint.toString()} for feeTier ${feeTier.toString()} does not exist`
      );
    }

    const processedRebalanceParams = await this.processRebalanceParams(dex, pool, rebalanceType, rebalanceParams);

    let price = await this.getCurrentPriceFromPool(dex, pool);

    let tokenMintA: PublicKey;
    let tokenMintB: PublicKey;
    let tickSpacing: number;
    if (dex == 'ORCA') {
      const whirlpoolState = await Whirlpool.fetch(this._connection, pool);
      if (!whirlpoolState) {
        throw Error(`Could not fetch whirlpool state with pubkey ${pool.toString()}`);
      }
      tokenMintA = whirlpoolState.tokenMintA;
      tokenMintB = whirlpoolState.tokenMintB;
      tickSpacing = whirlpoolState.tickSpacing;
    } else if (dex == 'RAYDIUM') {
      const raydiumPoolState = await PoolState.fetch(this._connection, pool);
      if (!raydiumPoolState) {
        throw Error(`Could not fetch Raydium pool state with pubkey ${pool.toString()}`);
      }
      tokenMintA = raydiumPoolState.tokenMint0;
      tokenMintB = raydiumPoolState.tokenMint1;
      tickSpacing = raydiumPoolState.tickSpacing;
    } else if (dex == 'METEORA') {
      const meteoraPoolState = await LbPair.fetch(this._connection, pool);
      if (!meteoraPoolState) {
        throw Error(`Could not fetch Meteora pool state with pubkey ${pool.toString()}`);
      }
      tokenMintA = meteoraPoolState.tokenXMint;
      tokenMintB = meteoraPoolState.tokenYMint;
      tickSpacing = meteoraPoolState.binStep;
    } else {
      throw new Error(`Dex ${dex} is not supported`);
    }

    let initStrategyIx: TransactionInstruction = await this.createStrategy(strategy, pool, strategyAdmin, dex);

    let tokenADecimals = await getMintDecimals(this._connection, tokenMintA);
    let tokenBDecimals = await getMintDecimals(this._connection, tokenMintB);
    let rebalanceKind = numberToRebalanceType(rebalanceType.toNumber());

    let updateRebalanceParamsIx = await this.getUpdateRebalancingParamsForUninitializedStratIx(
      strategyAdmin,
      strategy,
      processedRebalanceParams,
      rebalanceKind,
      tokenADecimals,
      tokenBDecimals
    );

    let updateStrategyParamsIxs = await this.getUpdateStrategyParamsIxs(
      strategyAdmin,
      strategy,
      rebalanceType,
      withdrawFeeBps,
      performanceFeeBps
    );

    let programAddresses = await this.getStrategyProgramAddresses(strategy, tokenMintA, tokenMintB);
    let baseVaultAuthority = programAddresses.baseVaultAuthority;
    let tokenAVault = programAddresses.tokenAVault;
    let tokenBVault = programAddresses.tokenBVault;

    let { lowerPrice, upperPrice } = await this.getRebalancePositionRange(
      dex,
      price,
      tokenAMint,
      tokenBMint,
      tickSpacing,
      rebalanceKind,
      rebalanceParams
    );

    let openPositionIxs: TransactionInstruction[] = [];
    const eventAuthority = this.getEventAuthorityPDA(new BN(dexToNumber(dex)));
    if (dex == 'ORCA') {
      const whirlpoolWithAddress = await this.getWhirlpoolStateIfNotFetched(pool);
      if (!whirlpoolWithAddress) {
        throw Error(`Could not fetch whirlpool state with pubkey ${pool.toString()}`);
      }
      const initLowerTickIfNeeded = await this.initializeTickForOrcaPool(strategyAdmin, pool, lowerPrice);
      const initUpperTickIfNeeded = await this.initializeTickForOrcaPool(strategyAdmin, pool, upperPrice);

      const openPositionIx = await this.openPositionOrca(
        strategyAdmin,
        strategy,
        baseVaultAuthority,
        pool,
        positionMint,
        lowerPrice,
        upperPrice,
        tokenAVault,
        tokenBVault,
        tokenAMint,
        tokenBMint,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority,
        eventAuthority
      );
      if (initLowerTickIfNeeded.initTickIx) {
        openPositionIxs.push(initLowerTickIfNeeded.initTickIx);
      }
      if (initUpperTickIfNeeded.initTickIx) {
        openPositionIxs.push(initUpperTickIfNeeded.initTickIx);
      }
      openPositionIxs.push(openPositionIx);
    } else if (dex == 'RAYDIUM') {
      const openPositionIx = await this.openPositionRaydium(
        strategyAdmin,
        strategy,
        baseVaultAuthority,
        pool,
        positionMint,
        lowerPrice,
        upperPrice,
        tokenAVault,
        tokenBVault,
        tokenAMint,
        tokenBMint,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority,
        eventAuthority
      );

      openPositionIxs.push(openPositionIx);
    } else if (dex == 'METEORA') {
      const lbPair = await this.getMeteoraStateIfNotFetched(pool);
      if (!lbPair) {
        throw Error(`Could not fetch whirlpool state with pubkey ${pool.toString()}`);
      }
      const initLowerTickIfNeeded = await this.initializeTickForMeteoraPool(strategyAdmin, pool, lowerPrice);
      const initUpperTickIfNeeded = await this.initializeTickForMeteoraPool(strategyAdmin, pool, upperPrice);

      const openPositionIx = await this.openPositionMeteora(
        strategyAdmin,
        strategy,
        baseVaultAuthority,
        pool,
        positionMint,
        lowerPrice,
        upperPrice,
        tokenAVault,
        tokenBVault,
        tokenAMint,
        tokenBMint,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority,
        eventAuthority
      );
      if (initLowerTickIfNeeded.initTickIx) {
        openPositionIxs.push(initLowerTickIfNeeded.initTickIx);
      }
      if (initUpperTickIfNeeded.initTickIx) {
        openPositionIxs.push(initUpperTickIfNeeded.initTickIx);
      }
      openPositionIxs.push(openPositionIx);
    } else {
      throw new Error(`Dex ${dex} is not supported`);
    }

    return {
      initStrategyIx,
      updateStrategyParamsIxs,
      updateRebalanceParamsIx,
      openPositionIxs,
    };
  };

  async getNewPositionRange(
    strategy: PublicKey | StrategyWithAddress,
    rebalanceKind: RebalanceTypeKind,
    rebalanceParams: Decimal[]
  ): Promise<PositionRange> {
    const strategyState = await this.getStrategyStateIfNotFetched(strategy);
    const dex = numberToDex(strategyState.strategy.strategyDex.toNumber());
    const tokenAMint = strategyState.strategy.tokenAMint;
    const tokenBMint = strategyState.strategy.tokenBMint;
    let price = await this.getCurrentPriceFromPool(dex, strategyState.strategy.pool);
    let tickSpacing = await this.getPoolTickSpacing(dex, strategyState.strategy.pool);

    return this.getRebalancePositionRange(
      dex,
      price,
      tokenAMint,
      tokenBMint,
      tickSpacing,
      rebalanceKind,
      rebalanceParams
    );
  }

  private async getRebalancePositionRange(
    dex: Dex,
    price: Decimal,
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    tickSpacing: number,
    rebalanceKind: RebalanceTypeKind,
    rebalanceParams: Decimal[]
  ): Promise<PositionRange> {
    const tokenADecimals = await getMintDecimals(this._connection, tokenAMint);
    const tokenBDecimals = await getMintDecimals(this._connection, tokenBMint);
    switch (rebalanceKind.kind) {
      case RebalanceType.Manual.kind:
        return { lowerPrice: rebalanceParams[0], upperPrice: rebalanceParams[1] };
      case RebalanceType.TakeProfit.kind:
        return { lowerPrice: rebalanceParams[0], upperPrice: rebalanceParams[1] };

      case RebalanceType.PricePercentage.kind:
        return getPositionRangeFromPercentageRebalanceParams(price, rebalanceParams[0], rebalanceParams[1]);

      case RebalanceType.PricePercentageWithReset.kind:
        return getPositionRangeFromPricePercentageWithResetParams(price, rebalanceParams[0], rebalanceParams[1]);

      case RebalanceType.Drift.kind:
        return getPositionRangeFromDriftParams(
          dex,
          tickSpacing,
          tokenADecimals,
          tokenBDecimals,
          rebalanceParams[0],
          rebalanceParams[1],
          rebalanceParams[2]
        );

      case RebalanceType.PeriodicRebalance.kind:
        return getPositionRangeFromPeriodicRebalanceParams(price, rebalanceParams[1], rebalanceParams[2]);

      case RebalanceType.Expander.kind:
        return getPositionRangeFromExpanderParams(price, rebalanceParams[0], rebalanceParams[1]);

      case RebalanceType.Autodrift.kind:
        const currentTickIndex = priceToTickIndex(price, tokenADecimals, tokenBDecimals);
        const startMidTick = new Decimal(currentTickIndex);
        return getPositionRangeFromAutodriftParams(
          dex,
          tokenADecimals,
          tokenBDecimals,
          startMidTick,
          rebalanceParams[1],
          rebalanceParams[2],
          tickSpacing
        );

      default:
        throw new Error(`Rebalance type ${rebalanceKind} is not supported`);
    }
  }

  async getCurrentPrice(strategy: PublicKey | StrategyWithAddress): Promise<Decimal> {
    const strategyWithAddress = await this.getStrategyStateIfNotFetched(strategy);
    const pool = strategyWithAddress.strategy.pool;
    const dex = numberToDex(strategyWithAddress.strategy.strategyDex.toNumber());

    return this.getCurrentPriceFromPool(dex, pool);
  }

  async getCurrentPriceFromPool(dex: Dex, pool: PublicKey): Promise<Decimal> {
    if (dex == 'ORCA') {
      return this.getOrcaPoolPrice(pool);
    } else if (dex == 'RAYDIUM') {
      return this.getRaydiumPoolPrice(pool);
    } else if (dex == 'METEORA') {
      return this.getMeteoraPoolPrice(pool);
    } else {
      throw new Error(`Dex ${dex} is not supported`);
    }
  }

  async getPoolTickSpacing(dex: Dex, pool: PublicKey): Promise<number> {
    if (dex == 'ORCA') {
      const whirlpoolState = await Whirlpool.fetch(this._connection, pool);
      if (!whirlpoolState) {
        throw Error(`Could not fetch whirlpool state with pubkey ${pool.toString()}`);
      }
      return whirlpoolState.tickSpacing;
    } else if (dex == 'RAYDIUM') {
      const raydiumPoolState = await PoolState.fetch(this._connection, pool);
      if (!raydiumPoolState) {
        throw Error(`Could not fetch Raydium pool state with pubkey ${pool.toString()}`);
      }
      return raydiumPoolState.tickSpacing;
    } else if (dex == 'METEORA') {
      const meteoraPoolState = await LbPair.fetch(this._connection, pool);
      if (!meteoraPoolState) {
        throw Error(`Could not fetch Meteora pool state with pubkey ${pool.toString()}`);
      }
      return meteoraPoolState.binStep;
    } else {
      throw new Error(`Dex ${dex} is not supported`);
    }
  }

  async getPriceRangePercentageBasedFromPool(
    dex: Dex,
    pool: PublicKey,
    lowerPriceBpsDifference: Decimal,
    upperPriceBpsDifference: Decimal
  ): Promise<[Decimal, Decimal]> {
    let poolPrice: Decimal;
    if (dex == 'ORCA') {
      poolPrice = await this.getOrcaPoolPrice(pool);
    } else if (dex == 'RAYDIUM') {
      poolPrice = await this.getRaydiumPoolPrice(pool);
    } else if (dex == 'METEORA') {
      poolPrice = await this.getMeteoraPoolPrice(pool);
    } else {
      throw new Error(`Invalid dex ${dex}`);
    }

    return this.getPriceRangePercentageBasedFromPrice(poolPrice, lowerPriceBpsDifference, upperPriceBpsDifference);
  }

  /**
   * Get the raw rebalancing params given the strategy type
   */
  async readRebalancingParamsFromChain(strategy: PublicKey | StrategyWithAddress): Promise<RebalanceFieldInfo[]> {
    const strategyWithAddress = await this.getStrategyStateIfNotFetched(strategy);
    let rebalanceKind = numberToRebalanceType(strategyWithAddress.strategy.rebalanceType);

    let rebalanceFields: RebalanceFieldInfo[];
    if (rebalanceKind.kind === Manual.kind) {
      rebalanceFields = [];
    } else if (rebalanceKind.kind === PricePercentage.kind) {
      rebalanceFields = readPricePercentageRebalanceParamsFromStrategy(strategyWithAddress.strategy.rebalanceRaw);
    } else if (rebalanceKind.kind === PricePercentageWithReset.kind) {
      rebalanceFields = readPricePercentageWithResetRebalanceParamsFromStrategy(
        strategyWithAddress.strategy.rebalanceRaw
      );
    } else if (rebalanceKind.kind === Drift.kind) {
      rebalanceFields = rebalanceFieldsDictToInfo(
        readDriftRebalanceParamsFromStrategy(strategyWithAddress.strategy.rebalanceRaw)
      );
    } else if (rebalanceKind.kind === TakeProfit.kind) {
      let tokenADecimals = await getMintDecimals(this._connection, strategyWithAddress.strategy.tokenAMint);
      let tokenBDecimals = await getMintDecimals(this._connection, strategyWithAddress.strategy.tokenBMint);
      rebalanceFields = rebalanceFieldsDictToInfo(
        readTakeProfitRebalanceParamsFromStrategy(
          tokenADecimals,
          tokenBDecimals,
          strategyWithAddress.strategy.rebalanceRaw
        )
      );
    } else if (rebalanceKind.kind === PeriodicRebalance.kind) {
      rebalanceFields = rebalanceFieldsDictToInfo(
        readPeriodicRebalanceRebalanceParamsFromStrategy(strategyWithAddress.strategy.rebalanceRaw)
      );
    } else if (rebalanceKind.kind === Expander.kind) {
      rebalanceFields = readExpanderRebalanceParamsFromStrategy(strategyWithAddress.strategy.rebalanceRaw);
    } else if (rebalanceKind.kind === Autodrift.kind) {
      rebalanceFields = rebalanceFieldsDictToInfo(
        readAutodriftRebalanceParamsFromStrategy(strategyWithAddress.strategy.rebalanceRaw)
      );
    } else {
      throw new Error(`Rebalance type ${rebalanceKind} is not supported`);
    }
    return rebalanceFields;
  }

  /**
   * Get the raw rebalancing params given the strategy type
   */
  async readRebalancingStateFromChain(strategy: PublicKey | StrategyWithAddress): Promise<RebalanceFieldInfo[]> {
    const strategyWithAddress = await this.getStrategyStateIfNotFetched(strategy);
    let rebalanceKind = numberToRebalanceType(strategyWithAddress.strategy.rebalanceType);

    let rebalanceFields: RebalanceFieldInfo[];
    if (rebalanceKind.kind === Manual.kind) {
      rebalanceFields = [];
    } else if (rebalanceKind.kind === PricePercentage.kind) {
      rebalanceFields = readRawPricePercentageRebalanceStateFromStrategy(strategyWithAddress.strategy.rebalanceRaw);
    } else if (rebalanceKind.kind === PricePercentageWithReset.kind) {
      rebalanceFields = readRawPricePercentageWithResetRebalanceStateFromStrategy(
        strategyWithAddress.strategy.rebalanceRaw
      );
    } else if (rebalanceKind.kind === Drift.kind) {
      rebalanceFields = rebalanceFieldsDictToInfo(
        readRawDriftRebalanceStateFromStrategy(strategyWithAddress.strategy.rebalanceRaw)
      );
    } else if (rebalanceKind.kind === TakeProfit.kind) {
      rebalanceFields = rebalanceFieldsDictToInfo(
        readTakeProfitRebalanceStateFromStrategy(strategyWithAddress.strategy.rebalanceRaw)
      );
    } else if (rebalanceKind.kind === PeriodicRebalance.kind) {
      rebalanceFields = rebalanceFieldsDictToInfo(
        readPeriodicRebalanceRebalanceStateFromStrategy(strategyWithAddress.strategy.rebalanceRaw)
      );
    } else if (rebalanceKind.kind === Expander.kind) {
      rebalanceFields = rebalanceFieldsDictToInfo(
        readRawExpanderRebalanceStateFromStrategy(strategyWithAddress.strategy.rebalanceRaw)
      );
    } else if (rebalanceKind.kind === Autodrift.kind) {
      rebalanceFields = rebalanceFieldsDictToInfo(
        readRawAutodriftRebalanceStateFromStrategy(strategyWithAddress.strategy.rebalanceRaw)
      );
    } else {
      throw new Error(`Rebalance type ${rebalanceKind} is not supported`);
    }
    return rebalanceFields;
  }

  /**
   * Get the prices for rebalancing params (range and reset range, if strategy involves a reset range)
   */
  async readRebalancingParams(strategy: PublicKey | StrategyWithAddress): Promise<RebalanceFieldInfo[]> {
    const strategyWithAddress = await this.getStrategyStateIfNotFetched(strategy);
    let rebalanceKind = numberToRebalanceType(strategyWithAddress.strategy.rebalanceType);

    if (rebalanceKind.kind === Manual.kind) {
      let positionRange = await this.getStrategyRange(strategyWithAddress);
      return getManualRebalanceFieldInfos(positionRange.lowerPrice, positionRange.upperPrice);
    } else if (rebalanceKind.kind === PricePercentage.kind) {
      let price = await this.getCurrentPrice(strategyWithAddress);
      return deserializePricePercentageRebalanceFromOnchainParams(price, strategyWithAddress.strategy.rebalanceRaw);
    } else if (rebalanceKind.kind === PricePercentageWithReset.kind) {
      let price = await this.getCurrentPrice(strategyWithAddress);
      return deserializePricePercentageWithResetRebalanceFromOnchainParams(
        price,
        strategyWithAddress.strategy.rebalanceRaw
      );
    } else if (rebalanceKind.kind === Drift.kind) {
      let dex = numberToDex(strategyWithAddress.strategy.strategyDex.toNumber());
      let tokenADecimals = await getMintDecimals(this._connection, strategyWithAddress.strategy.tokenAMint);
      let tokenBDecimals = await getMintDecimals(this._connection, strategyWithAddress.strategy.tokenBMint);
      let tickSpacing = await this.getPoolTickSpacing(dex, strategyWithAddress.strategy.pool);
      return deserializeDriftRebalanceFromOnchainParams(
        dex,
        tickSpacing,
        tokenADecimals,
        tokenBDecimals,
        strategyWithAddress.strategy.rebalanceRaw
      );
    } else if (rebalanceKind.kind === TakeProfit.kind) {
      let tokenADecimals = await getMintDecimals(this._connection, strategyWithAddress.strategy.tokenAMint);
      let tokenBDecimals = await getMintDecimals(this._connection, strategyWithAddress.strategy.tokenBMint);
      return deserializeTakeProfitRebalanceFromOnchainParams(
        tokenADecimals,
        tokenBDecimals,
        strategyWithAddress.strategy.rebalanceRaw
      );
    } else if (rebalanceKind.kind === PeriodicRebalance.kind) {
      let price = await this.getCurrentPrice(strategyWithAddress);
      return deserializePeriodicRebalanceFromOnchainParams(price, strategyWithAddress.strategy.rebalanceRaw);
    } else if (rebalanceKind.kind === Expander.kind) {
      let price = await this.getCurrentPrice(strategyWithAddress);
      return readExpanderRebalanceFieldInfosFromStrategy(price, strategyWithAddress.strategy.rebalanceRaw);
    } else if (rebalanceKind.kind === Autodrift.kind) {
      let dex = numberToDex(strategyWithAddress.strategy.strategyDex.toNumber());
      let tokenADecimals = await getMintDecimals(this._connection, strategyWithAddress.strategy.tokenAMint);
      let tokenBDecimals = await getMintDecimals(this._connection, strategyWithAddress.strategy.tokenBMint);
      let tickSpacing = await this.getPoolTickSpacing(dex, strategyWithAddress.strategy.pool);
      return deserializeAutodriftRebalanceFromOnchainParams(
        dex,
        tokenADecimals,
        tokenBDecimals,
        tickSpacing,
        strategyWithAddress.strategy.rebalanceRaw
      );
    } else {
      throw new Error(`Rebalance type ${rebalanceKind} is not supported`);
    }
  }

  /**
   * Get the rebalancing params from chain, alongside the current details of the position, reset range, etc
   */
  async readRebalancingParamsWithState(strategy: PublicKey | StrategyWithAddress): Promise<RebalanceFieldInfo[]> {
    const strategyWithAddress = await this.getStrategyStateIfNotFetched(strategy);
    let rebalanceKind = numberToRebalanceType(strategyWithAddress.strategy.rebalanceType);
    let dex = numberToDex(strategyWithAddress.strategy.strategyDex.toNumber());
    let tokenADecimals = strategyWithAddress.strategy.tokenAMintDecimals.toNumber();
    let tokenBDecimals = strategyWithAddress.strategy.tokenBMintDecimals.toNumber();

    if (rebalanceKind.kind === Manual.kind) {
      let positionRange = await this.getStrategyRange(strategyWithAddress);
      return getManualRebalanceFieldInfos(positionRange.lowerPrice, positionRange.upperPrice);
    } else if (rebalanceKind.kind === PricePercentage.kind) {
      let price = await this.getCurrentPrice(strategyWithAddress);
      return deserializePricePercentageRebalanceWithStateOverride(
        dex,
        tokenADecimals,
        tokenBDecimals,
        price,
        strategyWithAddress.strategy.rebalanceRaw
      );
    } else if (rebalanceKind.kind === PricePercentageWithReset.kind) {
      let price = await this.getCurrentPrice(strategyWithAddress);
      return deserializePricePercentageWithResetRebalanceWithStateOverride(
        dex,
        tokenADecimals,
        tokenBDecimals,
        price,
        strategyWithAddress.strategy.rebalanceRaw
      );
    } else if (rebalanceKind.kind === Drift.kind) {
      let dex = numberToDex(strategyWithAddress.strategy.strategyDex.toNumber());
      let tokenADecimals = await getMintDecimals(this._connection, strategyWithAddress.strategy.tokenAMint);
      let tokenBDecimals = await getMintDecimals(this._connection, strategyWithAddress.strategy.tokenBMint);
      let tickSpacing = await this.getPoolTickSpacing(dex, strategyWithAddress.strategy.pool);
      return deserializeDriftRebalanceWithStateOverride(
        dex,
        tickSpacing,
        tokenADecimals,
        tokenBDecimals,
        strategyWithAddress.strategy.rebalanceRaw
      );
    } else if (rebalanceKind.kind === TakeProfit.kind) {
      let tokenADecimals = await getMintDecimals(this._connection, strategyWithAddress.strategy.tokenAMint);
      let tokenBDecimals = await getMintDecimals(this._connection, strategyWithAddress.strategy.tokenBMint);
      return deserializeTakeProfitRebalanceFromOnchainParams(
        tokenADecimals,
        tokenBDecimals,
        strategyWithAddress.strategy.rebalanceRaw
      );
    } else if (rebalanceKind.kind === PeriodicRebalance.kind) {
      let price = await this.getCurrentPrice(strategyWithAddress);
      return deserializePeriodicRebalanceFromOnchainParams(price, strategyWithAddress.strategy.rebalanceRaw);
    } else if (rebalanceKind.kind === Expander.kind) {
      let price = await this.getCurrentPrice(strategyWithAddress);
      return deserializeExpanderRebalanceWithStateOverride(
        dex,
        tokenADecimals,
        tokenBDecimals,
        price,
        strategyWithAddress.strategy.rebalanceRaw
      );
    } else if (rebalanceKind.kind === Autodrift.kind) {
      let dex = numberToDex(strategyWithAddress.strategy.strategyDex.toNumber());
      let tokenADecimals = await getMintDecimals(this._connection, strategyWithAddress.strategy.tokenAMint);
      let tokenBDecimals = await getMintDecimals(this._connection, strategyWithAddress.strategy.tokenBMint);
      let tickSpacing = await this.getPoolTickSpacing(dex, strategyWithAddress.strategy.pool);
      return deserializeAutodriftRebalanceWithStateOverride(
        dex,
        tokenADecimals,
        tokenBDecimals,
        tickSpacing,
        strategyWithAddress.strategy.rebalanceRaw
      );
    } else {
      throw new Error(`Rebalance type ${rebalanceKind} is not supported`);
    }
  }

  /**
   * Get a list of updated rebalance field infos.
   * @param initialRebalanceFieldInfos the initial list of rebalance field infos
   * @param updatedFields the fields to be updated, with label and value
   * @returns list of RebalanceFieldInfo with updated values
   */
  getUpdatedRebalanceFieldInfos(
    initialRebalanceFieldInfos: RebalanceFieldInfo[],
    updatedFields: InputRebalanceFieldInfo[]
  ): RebalanceFieldInfo[] {
    let newRebalanceFieldInfos = initialRebalanceFieldInfos.map((f) => {
      let updatedField = updatedFields.find((x) => x.label == f.label);
      if (updatedField) {
        return { ...f, value: updatedField.value };
      } else {
        return f;
      }
    });
    return newRebalanceFieldInfos;
  }

  getPriceRangePercentageBasedFromPrice(
    price: Decimal,
    lowerPriceBpsDifference: Decimal,
    upperPriceBpsDifference: Decimal
  ): [Decimal, Decimal] {
    let fullBPSDecimal = new Decimal(FullBPS);
    const lowerPrice = price.mul(fullBPSDecimal.sub(lowerPriceBpsDifference)).div(fullBPSDecimal);
    const upperPrice = price.mul(fullBPSDecimal.add(upperPriceBpsDifference)).div(fullBPSDecimal);

    return [lowerPrice, upperPrice];
  }

  /**
   * Read the pool price for a specific dex and pool
   */
  async getPoolPrice(dex: Dex, pool: PublicKey): Promise<Decimal> {
    if (dex == 'ORCA') {
      return this.getOrcaPoolPrice(pool);
    } else if (dex == 'RAYDIUM') {
      return this.getRaydiumPoolPrice(pool);
    } else if (dex == 'METEORA') {
      return this.getMeteoraPoolPrice(pool);
    } else {
      throw new Error(`Invalid dex ${dex}`);
    }
  }

  async getOrcaPoolPrice(pool: PublicKey): Promise<Decimal> {
    const orca = new OrcaWhirlpoolClient({
      connection: this._connection,
      network: this._cluster === 'mainnet-beta' ? OrcaNetwork.MAINNET : OrcaNetwork.DEVNET,
    });

    const poolData = await orca.getPool(pool);
    if (!poolData) {
      throw Error(`Could not fetch Whirlpool data for ${pool.toString()}`);
    }

    return poolData.price;
  }

  async getRaydiumPoolPrice(pool: PublicKey): Promise<Decimal> {
    const poolState = await PoolState.fetch(this._connection, pool);
    if (!poolState) {
      throw new Error(`Raydium poolState ${pool.toString()} is not found`);
    }

    let price = SqrtPriceMath.sqrtPriceX64ToPrice(
      poolState.sqrtPriceX64,
      poolState.mintDecimals0,
      poolState.mintDecimals1
    );
    return price;
  }

  async getMeteoraPoolPrice(pool: PublicKey): Promise<Decimal> {
    const poolState = await LbPair.fetch(this._connection, pool);
    if (!poolState) {
      throw new Error(`Meteora poolState ${pool.toString()} is not found`);
    }
    let decimalsX = await getMintDecimals(this._connection, poolState.tokenXMint);
    let decimalsY = await getMintDecimals(this._connection, poolState.tokenYMint);
    return getPriceOfBinByBinIdWithDecimals(poolState.activeId, poolState.binStep, decimalsX, decimalsY);
  }

  async getGenericPoolInfo(dex: Dex, pool: PublicKey): Promise<GenericPoolInfo> {
    let poolInfo: GenericPoolInfo;
    if (dex == 'ORCA') {
      poolInfo = await this._orcaService.getGenericPoolInfo(pool);
    } else if (dex == 'RAYDIUM') {
      poolInfo = await this._raydiumService.getGenericPoolInfo(pool);
    } else if (dex == 'METEORA') {
      poolInfo = await this._meteoraService.getGenericPoolInfo(pool);
    } else {
      throw new Error(`Invalid dex ${dex}`);
    }

    return poolInfo;
  }

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

  getMainLookupTable = async (): Promise<AddressLookupTableAccount | undefined> => {
    if (this._kaminoProgramId.equals(STAGING_KAMINO_PROGRAM_ID)) {
      const lookupTableAccount = await this._connection
        .getAddressLookupTable(STAGING_GLOBAL_LOOKUP_TABLE)
        .then((res) => res.value);
      if (!lookupTableAccount) {
        throw new Error(`Could not get lookup table ${STAGING_GLOBAL_LOOKUP_TABLE}`);
      }
      return lookupTableAccount;
    } else if (this._cluster == 'mainnet-beta') {
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
      return undefined;
    }
  };

  getInitLookupTableIx = async (authority: PublicKey, slot?: number): Promise<[TransactionInstruction, PublicKey]> => {
    let recentSlot = slot;
    if (!recentSlot) {
      recentSlot = await this._connection.getSlot();
    }
    const slots = await this._connection.getBlocks(recentSlot - 20, recentSlot, 'confirmed');
    return AddressLookupTableProgram.createLookupTable({
      authority,
      payer: authority,
      recentSlot: slots[0],
    });
  };

  getPopulateLookupTableIxs = async (
    authority: PublicKey,
    lookupTable: PublicKey,
    strategy: PublicKey | StrategyWithAddress
  ): Promise<TransactionInstruction[]> => {
    const { strategy: strategyState, address } = await this.getStrategyStateIfNotFetched(strategy);
    if (!strategyState) {
      throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
    }
    let programId = getDexProgramId(strategyState);
    const { treasuryFeeTokenAVault, treasuryFeeTokenBVault, treasuryFeeVaultAuthority } = this.getTreasuryFeeVaultPDAs(
      strategyState.tokenAMint,
      strategyState.tokenBMint
    );

    let accountsToBeInserted: PublicKey[] = [
      address,
      strategyState.adminAuthority,
      strategyState.baseVaultAuthority,
      strategyState.pool,
      strategyState.tokenAMint,
      strategyState.tokenBMint,
      strategyState.tokenAVault,
      strategyState.tokenBVault,
      strategyState.poolTokenVaultA,
      strategyState.poolTokenVaultB,
      strategyState.tokenAMint,
      strategyState.sharesMint,
      strategyState.sharesMintAuthority,
      treasuryFeeTokenAVault,
      treasuryFeeTokenBVault,
      treasuryFeeVaultAuthority,
    ];

    return this.getAddLookupTableEntriesIxs(authority, lookupTable, accountsToBeInserted);
  };

  getAddLookupTableEntriesIxs = (
    authority: PublicKey,
    lookupTable: PublicKey,
    entries: PublicKey[]
  ): TransactionInstruction[] => {
    const chunkSize = 20;
    const txs: TransactionInstruction[] = [];
    for (let i = 0; i < entries.length; i += chunkSize) {
      const chunk = entries.slice(i, i + chunkSize);
      txs.push(
        AddressLookupTableProgram.extendLookupTable({
          payer: authority,
          authority,
          lookupTable,
          addresses: chunk,
        })
      );
    }
    return txs;
  };

  getLookupTable = async (tablePk: PublicKey): Promise<AddressLookupTableAccount> => {
    const lookupTableAccount = await this._connection.getAddressLookupTable(tablePk).then((res) => res.value);
    if (!lookupTableAccount) {
      throw new Error(`Could not get lookup table ${tablePk.toString()}`);
    }
    return lookupTableAccount;
  };

  setupStrategyLookupTable = async (authority: Keypair, strategy: PublicKey, slot?: number): Promise<PublicKey> => {
    let [createLookupTableIx, lookupTable] = await this.getInitLookupTableIx(authority.publicKey, slot);
    let populateLookupTableIx = await this.getPopulateLookupTableIxs(authority.publicKey, lookupTable, strategy);

    let getUpdateStrategyLookupTableIx = await getUpdateStrategyConfigIx(
      authority.publicKey,
      this._globalConfig,
      strategy,
      new UpdateLookupTable(),
      new Decimal(0),
      lookupTable
    );

    const createTableTx = new Transaction().add(createLookupTableIx);
    await sendTransactionWithLogs(this._connection, createTableTx, authority.publicKey, [authority]);
    for (let ix of populateLookupTableIx) {
      const populateLookupTableTx = new Transaction().add(ix);
      await sendTransactionWithLogs(this._connection, populateLookupTableTx, authority.publicKey, [authority]);
    }

    const updateStrategyLookupTableTx = new Transaction().add(getUpdateStrategyLookupTableIx);
    await sendTransactionWithLogs(this._connection, updateStrategyLookupTableTx, authority.publicKey, [authority]);

    return lookupTable;
  };

  // the optional param is a list of pubkeys of lookup tables and they will be read from chain and used in the tx
  getTransactionV2Message = async (
    payer: PublicKey,
    instructions: Array<TransactionInstruction>,
    lookupTables?: Array<PublicKey>
  ): Promise<MessageV0> => {
    let lookupTable = await this.getMainLookupTable();

    let allLookupTables: AddressLookupTableAccount[] = [];
    if (lookupTable) {
      allLookupTables.push(lookupTable);
    }
    if (lookupTables) {
      for (let table of lookupTables) {
        let lookupTableData = await this.getLookupTable(table);
        allLookupTables.push(lookupTableData);
      }
    }
    return await this.getTransactionV2MessageWithFetchedLookupTables(payer, instructions, allLookupTables);
  };

  // the optional param is the lookup table list of the tables that are already feteched from chain
  getTransactionV2MessageWithFetchedLookupTables = async (
    payer: PublicKey,
    instructions: Array<TransactionInstruction>,
    lookupTables?: Array<AddressLookupTableAccount>
  ): Promise<MessageV0> => {
    let lookupTable = await this.getMainLookupTable();
    let blockhash = await this._connection.getLatestBlockhash();

    let allLookupTables: AddressLookupTableAccount[] = [];
    if (lookupTables) {
      allLookupTables.push(...lookupTables);
    }

    if (lookupTable) {
      allLookupTables.push(lookupTable);
    }

    const v2Tx = new TransactionMessage({
      payerKey: payer,
      recentBlockhash: blockhash.blockhash,
      instructions: instructions,
    }).compileToV0Message(allLookupTables);
    return v2Tx;
  };

  // todo(silviu): implement this
  getEstimatedApyAndVolumeOnRange = async (
    dex: Dex,
    pool: PublicKey,
    lowerPrice: Decimal,
    upperPrice: Decimal,
    _startDate: Date,
    _endDate: Date
  ): Promise<GenericPositionRangeInfo> => {
    if (dex == 'ORCA') {
      return this.getEstimatedApyAndVolumeOnRangeOrca(pool, lowerPrice, upperPrice);
    } else if (dex == 'RAYDIUM') {
      return this.getEstimatedApyAndVolumeOnRangeRaydium(pool, lowerPrice, upperPrice);
    } else if (dex == 'METEORA') {
      return this.getEstimatedApyAndVolumeOnRangeMeteora(pool, lowerPrice, upperPrice);
    } else {
      throw new Error(`Dex ${dex} is not supported`);
    }
  };

  getEstimatedApyAndVolumeOnRangeOrca = async (
    pool: PublicKey,
    lowerPrice: Decimal,
    upperPrice: Decimal
  ): Promise<GenericPositionRangeInfo> => {
    return {
      estimatedApy: new Decimal(0),
      estimatedVolume: new Decimal(0),
    };
  };

  getEstimatedApyAndVolumeOnRangeRaydium = async (
    pool: PublicKey,
    lowerPrice: Decimal,
    upperPrice: Decimal
  ): Promise<GenericPositionRangeInfo> => {
    return {
      estimatedApy: new Decimal(0),
      estimatedVolume: new Decimal(0),
    };
  };

  getEstimatedApyAndVolumeOnRangeMeteora = async (
    pool: PublicKey,
    lowerPrice: Decimal,
    upperPrice: Decimal
  ): Promise<GenericPositionRangeInfo> => {
    return {
      estimatedApy: new Decimal(0),
      estimatedVolume: new Decimal(0),
    };
  };

  getManualPoolSimulatedValues = async (params: {
    pool: PublicKey;
    priceLower: Decimal;
    priceUpper: Decimal;
    startDate: string;
    endDate: string;
  }): Promise<PoolSimulationResponse> => {
    const { pool, startDate, endDate, priceLower, priceUpper } = params;
    return simulateManualPool({ poolAddress: pool, priceUpper, priceLower, depositDate: startDate, endDate });
  };

  getPercentagePoolSimulatedValues = async (
    params: SimulationPercentagePoolParameters
  ): Promise<PoolSimulationResponse> => {
    const { resetRangeWidthPercLower = 1, resetRangeWidthPercUpper = 1, ...rest } = params;
    return simulatePercentagePool({ resetRangeWidthPercLower, resetRangeWidthPercUpper, ...rest });
  };

  /**
   * Get a list of transactions to rebalance a Kamino strategy.
   * @param strategy strategy pubkey or object
   * @param newPosition new liquidity position account pubkey
   * @param priceLower new position's lower price of the range
   * @param priceUpper new position's upper price of the range
   * @returns list of transactions to rebalance (executive withdraw, collect fees/rewards, open new position, invest)
   */
  rebalance = async (
    strategy: PublicKey | StrategyWithAddress,
    newPosition: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal
  ): Promise<TransactionInstruction[]> => {
    // todo: refactor this to return an object, not a list
    const strategyWithAddress = await this.getStrategyStateIfNotFetched(strategy);

    let ixs: TransactionInstruction[] = [];

    // if there are no invested tokens we don't need to collect fees and rewards
    const stratTokenBalances = await this.getStrategyTokensBalances(strategyWithAddress.strategy);
    if (
      strategyWithAddress.strategy.strategyDex.toNumber() == dexToNumber('ORCA') ||
      stratTokenBalances.invested.a.greaterThan(ZERO) ||
      stratTokenBalances.invested.b.greaterThan(ZERO)
    ) {
      ixs.push(await this.collectFeesAndRewards(strategyWithAddress));
    }

    ixs.push(await this.openPosition(strategyWithAddress, newPosition, priceLower, priceUpper, new Rebalancing()));

    return ixs;
  };

  /**
   * Deserialize a buffer to MintInfo
   * @param data Buffer
   * @returns
   */
  _deserializeMint(data: Buffer): MintInfo {
    if (data.length !== MintLayout.span) {
      throw new Error('Not a valid Mint');
    }

    const mintInfo = MintLayout.decode(data);

    if (mintInfo.mintAuthorityOption === 0) {
      mintInfo.mintAuthority = null;
    } else {
      mintInfo.mintAuthority = new PublicKey(mintInfo.mintAuthority);
    }

    mintInfo.supply = u64.fromBuffer(mintInfo.supply);
    mintInfo.isInitialized = mintInfo.isInitialized !== 0;

    if (mintInfo.freezeAuthorityOption === 0) {
      mintInfo.freezeAuthority = null;
    } else {
      mintInfo.freezeAuthority = new PublicKey(mintInfo.freezeAuthority);
    }

    return mintInfo;
  }

  /**
   * Get a list of user's Kamino strategy positions
   * @param wallet user wallet address
   * @param strategyFilters
   * @returns list of kamino strategy positions
   */
  getUserPositions = async (
    wallet: PublicKey,
    strategyFilters: StrategiesFilters = { strategyCreationStatus: 'LIVE' }
  ): Promise<KaminoPosition[]> => {
    const userTokenAccounts = await this.getAllTokenAccounts(wallet);
    const liveStrategies = await this.getAllStrategiesWithFilters(strategyFilters);
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
          strategyDex: numberToDex(strategy.strategy.strategyDex.toNumber()),
        });
      }
    }
    return positions;
  };

  /**
   * Get a list of user's Kamino strategy positions
   * @param wallet user wallet address
   * @returns list of kamino strategy positions
   */
  getUserPositionsByStrategiesMap = async (
    wallet: PublicKey,
    strategiesWithShareMintsMap: Map<string, KaminoStrategyWithShareMint>
  ): Promise<KaminoPosition[]> => {
    const accounts = await this._connection.getParsedTokenAccountsByOwner(wallet, {
      programId: TOKEN_PROGRAM_ID,
    });

    const mints = accounts.value.map((accountInfo) => {
      return new PublicKey(accountInfo.account.data.parsed.info.mint);
    });
    const mintInfos = await batchFetch(mints, (chunk) => this.getConnection().getMultipleAccountsInfo(chunk));

    const kaminoStrategyAdresses: PublicKey[] = [];
    const kaminoAccountInfos: Array<AccountInfo<ParsedAccountData>> = [];

    for (const index of mints.keys()) {
      const mint = mints[index];
      const mintInfo = mintInfos[index];
      const accountInfo = accounts.value[index];

      if (!mint || !mintInfo || !accountInfo) continue;

      const [expectedMintAuthority] = PublicKey.findProgramAddressSync(
        [Buffer.from('authority'), mint.toBuffer()],
        this.getProgramID()
      );

      const mintData = this._deserializeMint(mintInfo.data);

      if (mintData.mintAuthority !== null && mintData.mintAuthority.equals(expectedMintAuthority)) {
        const shareMintAddress = accounts.value[index].account.data.parsed.info.mint;
        const address = strategiesWithShareMintsMap.get(shareMintAddress)?.address;

        if (!address) continue;

        kaminoStrategyAdresses.push(new PublicKey(address));
        kaminoAccountInfos.push(accountInfo.account);
      }
    }

    const strategies = await batchFetch(kaminoStrategyAdresses, (chunk) => this.getStrategies(chunk));

    const positions: KaminoPosition[] = [];

    for (const index of strategies.keys()) {
      const strategy = strategies[index];
      const accountData = kaminoAccountInfos[index];
      const address = kaminoStrategyAdresses[index];

      if (!strategy || !accountData) {
        continue;
      }

      positions.push({
        shareMint: strategy.sharesMint,
        strategy: address,
        sharesAmount: new Decimal(accountData.data.parsed.info.tokenAmount.uiAmountString),
        strategyDex: numberToDex(strategy.strategyDex.toNumber()),
      });
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
    const isMeteora = dexToNumber('METEORA') === dex;
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
      return this._orcaService.getStrategyWhirlpoolPoolAprApy(strategyState, prices, orcaPools);
    }
    if (isRaydium) {
      return this._raydiumService.getStrategyWhirlpoolPoolAprApy(strategyState, raydiumPools);
    }
    if (isMeteora) {
      const prices = await this.getAllPrices();
      return this._meteoraService.getStrategyMeteoraPoolAprApy(strategyState, prices);
    }
    throw Error(`Strategy dex ${dex} not supported`);
  };

  getStrategyPerformanceFees = async (
    strategy: PublicKey | StrategyWithAddress,
    globalConfig?: GlobalConfig
  ): Promise<PerformanceFees> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    const globalConfigState =
      globalConfig || (await GlobalConfig.fetch(this._connection, strategyState.globalConfig, this._kaminoProgramId));

    if (globalConfigState == null) {
      throw new Error(`Unable to fetch GlobalConfig with Pubkey ${strategyState.globalConfig}`);
    }
    let globalConfigMinPerformanceFee = new Decimal(globalConfigState.minPerformanceFeeBps.toString());

    let strategyFeesFee = new Decimal(strategyState.feesFee.toString());
    let strategyReward0Fee = new Decimal(strategyState.reward0Fee.toString());
    let strategyReward1Fee = new Decimal(strategyState.reward1Fee.toString());
    let strategyReward2Fee = new Decimal(strategyState.reward2Fee.toString());

    return {
      feesFeeBPS: Decimal.max(strategyFeesFee, globalConfigMinPerformanceFee),
      reward0FeeBPS: Decimal.max(strategyReward0Fee, globalConfigMinPerformanceFee),
      reward1FeeBPS: Decimal.max(strategyReward1Fee, globalConfigMinPerformanceFee),
      reward2FeeBPS: Decimal.max(strategyReward2Fee, globalConfigMinPerformanceFee),
    };
  };

  getLiquidityDistributionRaydiumPool = (
    pool: PublicKey,
    keepOrder: boolean = true,
    lowestTick?: number,
    highestTick?: number
  ): Promise<LiquidityDistribution> => {
    return this._raydiumService.getRaydiumPoolLiquidityDistribution(pool, keepOrder, lowestTick, highestTick);
  };

  getLiquidityDistributionMeteoraPool = (
    pool: PublicKey,
    keepOrder: boolean = true,
    lowestTick?: number,
    highestTick?: number
  ): Promise<LiquidityDistribution> => {
    return this._meteoraService.getMeteoraLiquidityDistribution(pool, keepOrder, lowestTick, highestTick);
  };

  getLiquidityDistributionOrcaWhirlpool = (
    pool: PublicKey,
    keepOrder: boolean = true,
    lowestTick?: number,
    highestTick?: number
  ): Promise<LiquidityDistribution> => {
    return this._orcaService.getWhirlpoolLiquidityDistribution(pool, keepOrder, lowestTick, highestTick);
  };

  getLiquidityDistribution = async (
    dex: Dex,
    pool: PublicKey,
    keepOrder: boolean = true,
    lowestTick?: number,
    highestTick?: number
  ): Promise<LiquidityDistribution> => {
    if (dex == 'ORCA') {
      return this.getLiquidityDistributionOrcaWhirlpool(pool, keepOrder, lowestTick, highestTick);
    } else if (dex == 'RAYDIUM') {
      return this.getLiquidityDistributionRaydiumPool(pool, keepOrder, lowestTick, highestTick);
    } else if (dex == 'METEORA') {
      return this.getLiquidityDistributionMeteoraPool(pool, keepOrder, lowestTick, highestTick);
    } else {
      throw Error(`Dex ${dex} not supported`);
    }
  };

  getPositionsCountForPool = async (dex: Dex, pool: PublicKey): Promise<number> => {
    if (dex == 'ORCA') {
      return this._orcaService.getPositionsCountByPool(pool);
    } else if (dex == 'RAYDIUM') {
      return this._raydiumService.getPositionsCountByPool(pool);
    } else if (dex == 'METEORA') {
      return this._meteoraService.getPositionsCountByPool(pool);
    } else {
      throw Error(`Dex ${dex} not supported`);
    }
  };

  getStrategyTokensHoldings = async (
    strategy: PublicKey | StrategyWithAddress,
    mode: 'DEPOSIT' | 'WITHDRAW' = 'WITHDRAW'
  ): Promise<TokenAmounts> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    const holdings = await this.getStrategyTokensBalances(strategyState, mode);

    const totalA = holdings.available.a.add(holdings.invested.a);
    const totalB = holdings.available.b.add(holdings.invested.b);

    return { a: totalA, b: totalB };
  };

  /**
   * Get ratio of total_a_in_strategy/total_b_in_strategy; if the total_b_in_strategy is 0 throws;
   * @param strategy
   * @param amountA
   */
  getStrategyTokensRatio = async (strategy: PublicKey | StrategyWithAddress): Promise<Decimal> => {
    let totalHoldings = await this.getStrategyTokensHoldings(strategy);
    return totalHoldings.a.div(totalHoldings.b);
  };

  calculateAmountsToBeDepositedWithSwap = async (
    strategy: PublicKey | StrategyWithAddress,
    tokenAAmountUserDeposit: Decimal,
    tokenBAmountUserDeposit: Decimal,
    profiler: ProfiledFunctionExecution = noopProfiledFunctionExecution,
    priceAInB?: Decimal
  ): Promise<DepositAmountsForSwap> => {
    const strategyWithAddress = await this.getStrategyStateIfNotFetched(strategy);
    const strategyState = strategyWithAddress.strategy;

    if (!priceAInB) {
      priceAInB = await this.getCurrentPrice(strategyWithAddress);
    }
    const priceBInA = new Decimal(1).div(priceAInB);

    let tokenADecimals = strategyState.tokenAMintDecimals.toNumber();
    let tokenBDecimals = strategyState.tokenBMintDecimals.toNumber();
    let tokenADecimalsDiff = tokenADecimals - tokenBDecimals;
    const tokenAAddDecimals = tokenADecimalsDiff > 0 ? 0 : Math.abs(tokenADecimalsDiff);
    const tokenBAddDecimals = tokenADecimalsDiff > 0 ? Math.abs(tokenADecimalsDiff) : 0;

    let aAmount = tokenAAmountUserDeposit;
    let bAmount = tokenBAmountUserDeposit;

    let [aAmounts, bAmounts] = await profiler(
      this.calculateAmountsRatioToBeDeposited(strategyWithAddress, undefined, profiler),
      'C-calculateDepositRatio',
      []
    );

    let orcaAmountA = aAmounts.div(new Decimal(10).pow(tokenADecimals));
    let orcaAmountB = bAmounts.div(new Decimal(10).pow(tokenBDecimals));

    // multiply by tokens delta to make sure that both values uses the same about of decimals
    let totalUserDepositInA = aAmount
      .mul(10 ** tokenAAddDecimals)
      .add(bAmount.mul(10 ** tokenBAddDecimals).mul(priceBInA));

    // if the strategy is out of range we will deposit only one token so we will need to swap everything to that token
    if (orcaAmountA.eq(ZERO)) {
      let requiredAAmountToDeposit = ZERO;
      let requiredBAmountToDeposit = totalUserDepositInA.mul(priceAInB);

      let tokenAToSwapAmount = requiredAAmountToDeposit.sub(tokenAAmountUserDeposit);
      let tokenBToSwapAmount = requiredBAmountToDeposit.sub(tokenBAmountUserDeposit);

      let depositAmountsForSwap: DepositAmountsForSwap = {
        requiredAAmountToDeposit,
        requiredBAmountToDeposit,
        tokenAToSwapAmount,
        tokenBToSwapAmount,
      };

      return depositAmountsForSwap;
    }

    if (orcaAmountB.eq(ZERO)) {
      let requiredAAmountToDeposit = totalUserDepositInA;
      let requiredBAmountToDeposit = ZERO;

      let tokenAToSwapAmount = requiredAAmountToDeposit.sub(tokenAAmountUserDeposit);
      let tokenBToSwapAmount = requiredBAmountToDeposit.sub(tokenBAmountUserDeposit);

      let depositAmountsForSwap: DepositAmountsForSwap = {
        requiredAAmountToDeposit,
        requiredBAmountToDeposit,
        tokenAToSwapAmount,
        tokenBToSwapAmount,
      };

      return depositAmountsForSwap;
    }
    let ratio = orcaAmountA.div(orcaAmountB);
    ratio = ratio.div(priceBInA);

    let requiredAAmountToDeposit = totalUserDepositInA
      .mul(ratio)
      .div(ratio.add(1))
      .div(10 ** tokenAAddDecimals);
    let requiredBAmountToDeposit = totalUserDepositInA
      .sub(requiredAAmountToDeposit.mul(10 ** tokenAAddDecimals))
      .div(10 ** tokenBAddDecimals)
      .mul(priceAInB);

    let tokenAToSwapAmount = requiredAAmountToDeposit.sub(tokenAAmountUserDeposit);
    let tokenBToSwapAmount = requiredBAmountToDeposit.sub(tokenBAmountUserDeposit);

    let depositAmountsForSwap: DepositAmountsForSwap = {
      requiredAAmountToDeposit,
      requiredBAmountToDeposit,
      tokenAToSwapAmount,
      tokenBToSwapAmount,
    };

    return depositAmountsForSwap;
  };

  /**
   * @deprecated The method should not be used
   */
  calculateAmountsDistributionWithPriceRange = async (
    dex: Dex,
    pool: PublicKey,
    lowerPrice: Decimal,
    upperPrice: Decimal
  ): Promise<[Decimal, Decimal]> => {
    let tokenAAmountToDeposit = new Decimal(100.0);

    if (dex == 'RAYDIUM') {
      const poolState = await PoolState.fetch(this._connection, pool);
      if (!poolState) {
        throw new Error(`Raydium poolState ${pool.toString()} is not found`);
      }
      let decimalsA = poolState.mintDecimals0;
      let decimalsB = poolState.mintDecimals1;

      const { amountA, amountB } = LiquidityMath.getAmountsFromLiquidity(
        poolState.sqrtPriceX64,
        SqrtPriceMath.priceToSqrtPriceX64(lowerPrice, decimalsA, decimalsB),
        SqrtPriceMath.priceToSqrtPriceX64(upperPrice, decimalsA, decimalsB),
        new BN(100_000_000),
        true
      );

      const amountADecimal = new Decimal(amountA.toString());
      const amountBDecimal = new Decimal(amountB.toString());
      return [lamportsToNumberDecimal(amountADecimal, decimalsA), lamportsToNumberDecimal(amountBDecimal, decimalsB)];
    } else if (dex == 'ORCA') {
      let whirlpoolState = await Whirlpool.fetch(this._connection, pool);
      if (!whirlpoolState) {
        throw new Error(`Raydium poolState ${pool.toString()} is not found`);
      }
      let tokenMintA = whirlpoolState.tokenMintA;
      let tokenMintB = whirlpoolState.tokenMintB;
      let decimalsA = await getMintDecimals(this._connection, tokenMintA);
      let decimalsB = await getMintDecimals(this._connection, tokenMintB);

      let tickLowerIndex = getNearestValidTickIndexFromTickIndex(
        priceToTickIndex(lowerPrice, decimalsA, decimalsB),
        whirlpoolState.tickSpacing
      );
      let tickUpperIndex = getNearestValidTickIndexFromTickIndex(
        priceToTickIndex(upperPrice, decimalsA, decimalsB),
        whirlpoolState.tickSpacing
      );

      const params: InternalAddLiquidityQuoteParam = {
        tokenMintA,
        tokenMintB,
        tickCurrentIndex: whirlpoolState.tickCurrentIndex,
        sqrtPrice: whirlpoolState.sqrtPrice,
        inputTokenMint: tokenMintA,
        inputTokenAmount: new BN(collToLamportsDecimal(tokenAAmountToDeposit, decimalsA).toString()),
        tickLowerIndex,
        tickUpperIndex,
        slippageTolerance: defaultSlippagePercentage,
      };

      const addLiqResult: InternalAddLiquidityQuote = getAddLiquidityQuote(params);
      return [
        lamportsToNumberDecimal(addLiqResult.estTokenA.toNumber(), decimalsA),
        lamportsToNumberDecimal(addLiqResult.estTokenB.toNumber(), decimalsB),
      ];
    } else if (dex == 'METEORA') {
      let poolState = await LbPair.fetch(this._connection, pool);
      if (!poolState) {
        throw new Error(`Meteora poolState ${pool.toString()} is not found`);
      }
      let tokenMintA = poolState.tokenXMint;
      let tokenMintB = poolState.tokenYMint;
      let decimalsA = await getMintDecimals(this._connection, tokenMintA);
      let decimalsB = await getMintDecimals(this._connection, tokenMintB);

      return [new Decimal(0), new Decimal(0)];
    } else {
      throw new Error('Invalid dex, use RAYDIUM or ORCA or METEORA');
    }
  };

  calculateAmountsToBeDeposited = async (
    strategy: PublicKey | StrategyWithAddress,
    tokenAAmount?: Decimal,
    tokenBAmount?: Decimal,
    profiledFunctionExecution: ProfiledFunctionExecution = noopProfiledFunctionExecution
  ): Promise<[Decimal, Decimal]> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
    if (strategyState.shareCalculationMethod === DOLAR_BASED) {
      return this.calculateDepostAmountsDollarBased(strategy, tokenAAmount, tokenBAmount, profiledFunctionExecution);
    } else if (strategyState.shareCalculationMethod === PROPORTION_BASED) {
      return this.calculateDepositAmountsProportional(strategy, tokenAAmount, tokenBAmount, profiledFunctionExecution);
    } else {
      throw new Error('Invalid share calculation method');
    }
  };

  /// Returns an amount of tokenA and an amount of tokenB that define the ratio of the amounts that can be deposited
  calculateAmountsRatioToBeDeposited = async (
    strategy: PublicKey | StrategyWithAddress,
    holdings?: TokenAmounts,
    profiler: ProfiledFunctionExecution = noopProfiledFunctionExecution
  ): Promise<[Decimal, Decimal]> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
    if (strategyState.shareCalculationMethod === DOLAR_BASED) {
      return this.calculateDepostAmountsDollarBased(strategy, new Decimal(100), undefined, profiler);
    } else if (strategyState.shareCalculationMethod === PROPORTION_BASED) {
      let tokenHoldings = holdings;
      if (!tokenHoldings) {
        tokenHoldings = await profiler(this.getStrategyTokensHoldings(strategy), 'getStrategyTokensHoldings', []);
      }
      const { a, b } = tokenHoldings;
      return [a, b];
    } else {
      throw new Error('Invalid share calculation method');
    }
  };

  calculateDepositAmountsProportional = async (
    strategy: PublicKey | StrategyWithAddress,
    tokenAAmount?: Decimal,
    tokenBAmount?: Decimal,
    profiler: ProfiledFunctionExecution = noopProfiledFunctionExecution
  ): Promise<[Decimal, Decimal]> => {
    if (!tokenAAmount && !tokenBAmount) {
      return [new Decimal(0), new Decimal(0)];
    }

    let totalHoldings = await profiler(this.getStrategyTokensHoldings(strategy), 'getStrategyTokensHoldings', []);
    // if we have no holdings, on the initial deposit we use the old method
    if (totalHoldings.a.eq(ZERO) && totalHoldings.b.eq(ZERO)) {
      return await this.calculateDepostAmountsDollarBased(strategy, tokenAAmount, tokenBAmount);
    }
    return await profiler(
      this.calculateDepositAmountsProportionalWithTotalTokens(totalHoldings, tokenAAmount, tokenBAmount),
      'C-calculateDepositAmountsProportionalWithTotalTokens',
      []
    );
  };

  private calculateDepositAmountsProportionalWithTotalTokens = async (
    totalTokens: TokenAmounts,
    tokenAAmount?: Decimal,
    tokenBAmount?: Decimal
  ): Promise<[Decimal, Decimal]> => {
    if (totalTokens.a.eq(ZERO)) {
      return [ZERO, tokenBAmount ? tokenBAmount : new Decimal(Number.MAX_VALUE)];
    }
    if (totalTokens.b.eq(ZERO)) {
      return [tokenAAmount ? tokenAAmount : new Decimal(Number.MAX_VALUE), ZERO];
    }
    const tokensRatio = totalTokens.a.div(totalTokens.b);
    if (tokenAAmount) {
      const requiredBAmount = tokenAAmount.div(tokensRatio);
      if (!tokenBAmount || tokenBAmount.gt(requiredBAmount)) {
        return [tokenAAmount, requiredBAmount];
      } else {
        const requiredAAmount = tokenBAmount.mul(tokensRatio);
        return [requiredAAmount, tokenBAmount];
      }
    } else if (tokenBAmount) {
      const requiredAMount = tokenBAmount.mul(tokensRatio);
      return [requiredAMount, tokenBAmount];
    } else {
      throw new Error('Invalid params, one of tokenAAmount or tokenBAmount must be provided');
    }
  };

  calculateDepostAmountsDollarBased = async (
    strategy: PublicKey | StrategyWithAddress,
    tokenAAmount?: Decimal,
    tokenBAmount?: Decimal,
    profiledFunctionExecution: ProfiledFunctionExecution = noopProfiledFunctionExecution
  ): Promise<[Decimal, Decimal]> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
    const dex = Number(strategyState.strategyDex);
    const isOrca = dexToNumber('ORCA') === dex;
    const isRaydium = dexToNumber('RAYDIUM') === dex;
    const isMeteora = dexToNumber('METEORA') === dex;
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
    } else if (isMeteora) {
      return this.calculateAmountsMeteora({ strategyState, tokenAAmount, tokenBAmount });
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

    if (tokenAAmount && tokenBAmount && tokenAAmount.gt(0) && tokenBAmount.gt(0)) {
      const liquidity = LiquidityMath.getLiquidityFromTokenAmounts(
        poolState.sqrtPriceX64,
        SqrtPriceMath.getSqrtPriceX64FromTick(position.tickLowerIndex),
        SqrtPriceMath.getSqrtPriceX64FromTick(position.tickUpperIndex),
        new BN(tokenAAmount.toString()),
        new BN(tokenBAmount.toString())
      );

      const { amountA, amountB } = LiquidityMath.getAmountsFromLiquidity(
        poolState.sqrtPriceX64,
        SqrtPriceMath.getSqrtPriceX64FromTick(position.tickLowerIndex),
        SqrtPriceMath.getSqrtPriceX64FromTick(position.tickUpperIndex),
        liquidity,
        true
      );

      return [new Decimal(amountA.toString()), new Decimal(amountB.toString())];
    } else {
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

      const amountADecimal = new Decimal(amountA.toString());
      const amountBDecimal = new Decimal(amountB.toString());
      const ratio = amountADecimal.div(amountBDecimal);
      if (tokenAAmount === undefined || tokenAAmount.eq(ZERO)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return [tokenBAmount!.mul(ratio), tokenBAmount!];
      }

      if (tokenBAmount === undefined || tokenBAmount.eq(ZERO)) {
        return [tokenAAmount, tokenAAmount.div(ratio)];
      }
    }

    return [new Decimal(0), new Decimal(0)];
  };

  calculateAmountsMeteora = async ({
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

    const poolState = await LbPair.fetch(this._connection, strategyState.pool);
    if (!poolState) {
      throw new Error(`poolState ${strategyState.pool.toString()} is not found`);
    }

    // TODO: this is just a simple approximation, but it's used only for the first deposit.
    if (tokenAAmount && tokenBAmount && tokenAAmount.gt(0) && tokenBAmount.gt(0)) {
      // Use everything that is given in case there are both tokens
      return [tokenAAmount, tokenBAmount];
    } else {
      const binArrayIndex = binIdToBinArrayIndex(new BN(poolState.activeId));
      const [binArrayPk] = deriveBinArray(strategyState.pool, binArrayIndex, METEORA_PROGRAM_ID);
      const binArray = await BinArray.fetch(this._connection, binArrayPk);
      if (!binArray) {
        throw new Error(`bin array ${binArrayPk.toString()} is not found`);
      }
      const bin = getBinFromBinArray(poolState.activeId, binArray);
      let amountADecimal = new Decimal(0);
      let amountBDecimal = new Decimal(0);
      if (bin) {
        if (!bin.amountX.eq(new BN(0))) {
          amountADecimal = new Decimal(bin.amountX.toString());
        }
        if (!bin.amountY.eq(new BN(0))) {
          amountBDecimal = new Decimal(bin.amountY.toString());
        }
      } else {
        throw new Error(`bin ${poolState.activeId.toString()} is not found`);
      }

      if (amountADecimal.eq(ZERO) && amountBDecimal.eq(ZERO)) {
        const decimalsA = await getMintDecimals(this._connection, strategyState.tokenAMint);
        const decimalsB = await getMintDecimals(this._connection, strategyState.tokenBMint);
        const poolPrice = getPriceOfBinByBinIdWithDecimals(poolState.activeId, poolState.binStep, decimalsA, decimalsB);
        return [tokenAAmount || tokenBAmount!.div(poolPrice), tokenBAmount || tokenAAmount!.mul(poolPrice)];
      }

      if (amountBDecimal.eq(ZERO)) {
        return [tokenAAmount!, ZERO];
      }

      if (amountADecimal.eq(ZERO)) {
        return [ZERO, tokenBAmount!];
      }

      const ratio = amountADecimal.div(amountBDecimal);
      if (tokenAAmount === undefined || tokenAAmount.eq(ZERO)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        let amountA = tokenBAmount!.mul(ratio) || new Decimal(0);
        return [amountA, tokenBAmount!];
      }

      if (tokenBAmount === undefined || tokenBAmount.eq(ZERO)) {
        let amountB = tokenAAmount.div(ratio) || new Decimal(0);
        return [tokenAAmount, amountB];
      }
    }

    return [new Decimal(0), new Decimal(0)];
  };

  /**
   * @deprecated The method should not be used
   */
  getDepositRatioFromTokenA = async (
    strategy: PublicKey | StrategyWithAddress,
    amountA: BN
  ): Promise<{ amountSlippageA: BN; amountSlippageB: BN }> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
    const dex = Number(strategyState.strategyDex);

    const isOrca = dexToNumber('ORCA') === dex;
    const isRaydium = dexToNumber('RAYDIUM') === dex;
    const isMeteora = dexToNumber('METEORA') === dex;

    if (isOrca) {
      return this.getDepositRatioFromAOrca(strategy, amountA);
    }
    if (isRaydium) {
      return this.getDepositRatioFromARaydium(strategy, amountA);
    }
    if (isMeteora) {
      return this.getDepositRatioFromAMeteora(strategy, amountA);
    }
    throw Error(`Strategy dex ${dex} not supported`);
  };

  /**
   * @deprecated The method should not be used
   */
  getDepositRatioFromTokenB = async (
    strategy: PublicKey | StrategyWithAddress,
    amountB: BN
  ): Promise<{ amountSlippageA: BN; amountSlippageB: BN }> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
    const dex = Number(strategyState.strategyDex);

    const isOrca = dexToNumber('ORCA') === dex;
    const isRaydium = dexToNumber('RAYDIUM') === dex;
    const isMeteora = dexToNumber('METEORA') === dex;

    if (isOrca) {
      return this.getDepositRatioFromBOrca(strategy, amountB);
    }
    if (isRaydium) {
      return this.getDepositRatioFromBRaydium(strategy, amountB);
    }
    if (isMeteora) {
      return this.getDepositRatioFromBMeteora(strategy, amountB);
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

    return await TermsSignature.fetch(this._connection, signatureStateKey, this._kaminoProgramId);
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

  private async getDepositRatioFromAMeteora(
    strategy: PublicKey | StrategyWithAddress,
    amountA: BN
  ): Promise<{ amountSlippageA: BN; amountSlippageB: BN }> {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    const poolStatePromise = LbPair.fetch(this._connection, strategyState.pool);
    const positionPromise = PositionV2.fetch(this._connection, strategyState.position);

    let [poolState, _position] = await Promise.all([poolStatePromise, positionPromise]);
    if (!poolState) {
      throw Error(`Could not fetch lb pair state with pubkey ${strategyState.pool.toString()}`);
    }

    return { amountSlippageA: new BN(0), amountSlippageB: new BN(0) };
  }

  private async getDepositRatioFromBMeteora(
    strategy: PublicKey | StrategyWithAddress,
    amountA: BN
  ): Promise<{ amountSlippageA: BN; amountSlippageB: BN }> {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    const poolStatePromise = await LbPair.fetch(this._connection, strategyState.pool);
    const positionPromise = await PositionV2.fetch(this._connection, strategyState.position);
    let [poolState, _position] = await Promise.all([poolStatePromise, positionPromise]);

    if (!poolState) {
      throw Error(`Could not fetch lb pair state with pubkey ${strategyState.pool.toString()}`);
    }

    return { amountSlippageA: new BN(0), amountSlippageB: new BN(0) };
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
    const collateralInfos = await CollateralInfos.fetch(this._connection, collateralInfo, this._kaminoProgramId);
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

    let updateWithdrawalFeeIx: TransactionInstruction | null = null;
    if (withdrawFeeBps) {
      updateWithdrawalFeeIx = await getUpdateStrategyConfigIx(
        strategyAdmin,
        this._globalConfig,
        strategy,
        new UpdateWithdrawFee(),
        withdrawFeeBps
      );
    }

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

    let ixs = [updateRebalanceTypeIx, updateFeesFeeIx, updateRewards0FeeIx, updateRewards1FeeIx, updateRewards2FeeIx];
    if (updateWithdrawalFeeIx) {
      ixs.push(updateWithdrawalFeeIx);
    }
    return ixs;
  };

  getUpdateRewardsIxs = async (
    strategyOwner: PublicKey,
    strategy: PublicKey
  ): Promise<[TransactionInstruction, Keypair][]> => {
    let strategyState = await WhirlpoolStrategy.fetch(this._connection, strategy, this._kaminoProgramId);
    if (!strategyState) {
      throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
    }
    let globalConfig = await GlobalConfig.fetch(this._connection, strategyState.globalConfig, this._kaminoProgramId);
    if (!globalConfig) {
      throw Error(`Could not fetch global config with pubkey ${strategyState.globalConfig.toString()}`);
    }
    let collateralInfos = await this.getCollateralInfo(globalConfig.tokenInfos);
    let result: [TransactionInstruction, Keypair][] = [];
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

          let rewardVault = Keypair.generate();
          let args: UpdateRewardMappingArgs = {
            rewardIndex: i,
            collateralToken: collateralId,
          };

          let accounts: UpdateRewardMappingAccounts = {
            payer: strategyOwner,
            globalConfig: strategyState.globalConfig,
            strategy: strategy,
            pool: strategyState.pool,
            rewardMint: whirlpool.rewardInfos[i].mint,
            rewardVault: rewardVault.publicKey,
            baseVaultAuthority: strategyState.baseVaultAuthority,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenInfos: globalConfig.tokenInfos,
          };

          let ix = updateRewardMapping(args, accounts);
          result.push([ix, rewardVault]);
        }
      }
      return result;
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

          let rewardVault = Keypair.generate();
          let args: UpdateRewardMappingArgs = {
            rewardIndex: i,
            collateralToken: collateralId,
          };

          let accounts: UpdateRewardMappingAccounts = {
            payer: strategyOwner,
            globalConfig: strategyState.globalConfig,
            strategy: strategy,
            pool: strategyState.pool,
            rewardMint: poolState.rewardInfos[i].tokenMint,
            rewardVault: rewardVault.publicKey,
            baseVaultAuthority: strategyState.baseVaultAuthority,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenInfos: globalConfig.tokenInfos,
          };

          let ix = updateRewardMapping(args, accounts);
          result.push([ix, rewardVault]);
        }
      }
      return result;
    } else if (strategyState.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      const poolState = await LbPair.fetch(this._connection, strategyState.pool);
      if (!poolState) {
        throw new Error(`Could not fetch meteora state with pubkey ${strategyState.pool.toString()}`);
      }
      for (let i = 0; i < 2; i++) {
        if (poolState.rewardInfos[i].mint.toString() != PublicKey.default.toString()) {
          let collateralId = this.getCollateralIdFromMint(poolState.rewardInfos[i].mint, collateralInfos);
          if (collateralId == -1) {
            throw Error(`Could not find collateral id for mint ${poolState.rewardInfos[i].mint.toString()}`);
          }

          let rewardVault = Keypair.generate();
          let args: UpdateRewardMappingArgs = {
            rewardIndex: i,
            collateralToken: collateralId,
          };

          let accounts: UpdateRewardMappingAccounts = {
            payer: strategyOwner,
            globalConfig: strategyState.globalConfig,
            strategy: strategy,
            pool: strategyState.pool,
            rewardMint: poolState.rewardInfos[i].mint,
            rewardVault: rewardVault.publicKey,
            baseVaultAuthority: strategyState.baseVaultAuthority,
            systemProgram: SystemProgram.programId,
            rent: SYSVAR_RENT_PUBKEY,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenInfos: globalConfig.tokenInfos,
          };

          let ix = updateRewardMapping(args, accounts);
          result.push([ix, rewardVault]);
        }
      }
      return result;
    } else {
      throw new Error(`Dex ${strategyState.strategyDex} not supported`);
    }
  };

  /**
   * Get the instruction to create an Orca Whirlpool tick, if it does not exist
   * @param payer
   * @param pool
   * @param price
   * @return tickPubkey, (tickInstruction | undefined)
   */
  initializeTickForOrcaPool = async (
    payer: PublicKey,
    pool: PublicKey | WhirlpoolWithAddress,
    price: Decimal
  ): Promise<InitPoolTickIfNeeded> => {
    const { address: poolAddress, whirlpool: whilrpoolState } = await this.getWhirlpoolStateIfNotFetched(pool);

    const decimalsA = await getMintDecimals(this._connection, whilrpoolState.tokenMintA);
    const decimalsB = await getMintDecimals(this._connection, whilrpoolState.tokenMintB);
    const tickIndex = getNextValidTickIndex(priceToTickIndex(price, decimalsA, decimalsB), whilrpoolState.tickSpacing);
    const startTickIndex = getStartTickIndex(tickIndex, whilrpoolState.tickSpacing);

    const [startTickIndexPk, _startTickIndexBump] = getTickArray(WHIRLPOOL_PROGRAM_ID, poolAddress, startTickIndex);
    let tick = await TickArray.fetch(this._connection, startTickIndexPk);
    // initialize tick if it doesn't exist
    if (!tick) {
      let initTickArrayArgs: InitializeTickArrayArgs = {
        startTickIndex,
      };
      let initTickArrayAccounts: InitializeTickArrayAccounts = {
        whirlpool: poolAddress,
        funder: payer,
        tickArray: startTickIndexPk,
        systemProgram: SystemProgram.programId,
      };
      return {
        tick: startTickIndexPk,
        initTickIx: initializeTickArray(initTickArrayArgs, initTickArrayAccounts),
      };
    }
    return {
      tick: startTickIndexPk,
      initTickIx: undefined,
    };
  };

  initializeTickForMeteoraPool = async (
    payer: PublicKey,
    pool: PublicKey | LbPairWithAddress,
    price: Decimal
  ): Promise<InitPoolTickIfNeeded> => {
    const { address: poolAddress, pool: poolState } = await this.getMeteoraStateIfNotFetched(pool);

    const decimalsA = await getMintDecimals(this._connection, poolState.tokenXMint);
    const decimalsB = await getMintDecimals(this._connection, poolState.tokenYMint);
    const binArray = getBinIdFromPriceWithDecimals(price, poolState.binStep, true, decimalsA, decimalsB);
    const binArrayIndex = binIdToBinArrayIndex(new BN(binArray));

    const [startTickIndexPk, _startTickIndexBump] = deriveBinArray(poolAddress, binArrayIndex, METEORA_PROGRAM_ID);
    let tick = await TickArray.fetch(this._connection, startTickIndexPk);
    // initialize tick if it doesn't exist
    if (!tick) {
      let initTickArrayArgs: InitializeBinArrayArgs = {
        index: new BN(binArrayIndex),
      };
      let initTickArrayAccounts: InitializeBinArrayAccounts = {
        funder: payer,
        binArray: startTickIndexPk,
        systemProgram: SystemProgram.programId,
        lbPair: poolAddress,
      };
      return {
        tick: startTickIndexPk,
        initTickIx: initializeBinArray(initTickArrayArgs, initTickArrayAccounts),
      };
    }
    return {
      tick: startTickIndexPk,
      initTickIx: undefined,
    };
  };
}

export default Kamino;
