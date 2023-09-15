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
  getNextValidTickIndex,
  getPrevValidTickIndex,
  getRemoveLiquidityQuote,
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
  RebalanceParamOffset,
  sendTransactionWithLogs,
  StrategiesFilters,
  strategyCreationStatusToBase58,
  strategyTypeToBase58,
  VaultParameters,
  ZERO,
  PositionRange,
  RebalanceParamsAsPrices,
  RebalanceParams,
  numberToDex,
  TokensBalances,
  isSOLMint,
  readBigUint128LE,
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
} from './utils';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  checkExpectedVaultsBalances,
  CheckExpectedVaultsBalancesAccounts,
  CheckExpectedVaultsBalancesArgs,
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
} from './kamino-client/instructions';
import BN from 'bn.js';
import StrategyWithAddress from './models/StrategyWithAddress';
import { Idl, Program, Provider } from '@project-serum/anchor';
import { Rebalancing, Uninitialized } from './kamino-client/types/StrategyStatus';
import { FRONTEND_KAMINO_STRATEGY_URL, METADATA_PROGRAM_ID } from './constants';
import {
  CollateralInfo,
  ExecutiveWithdrawActionKind,
  RebalanceType,
  RebalanceTypeKind,
  ReferencePriceType,
  ReferencePriceTypeKind,
  StrategyConfigOption,
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
import { StrategyPrices } from './models/StrategyPrices';
import { getDefaultManualRebalanceFieldInfos, getManualRebalanceFieldInfos } from './rebalance_methods/manualRebalance';
import {
  deserializePricePercentageRebalanceFromOnchainParams,
  getDefaultPricePercentageRebalanceFieldInfos,
  getPositionRangeFromPercentageRebalanceParams,
  getPricePercentageRebalanceFieldInfos,
} from './rebalance_methods/pricePercentageRebalance';
import {
  deserializePricePercentageWithResetRebalanceFromOnchainParams,
  getDefaultPricePercentageWithResetRebalanceFieldInfos,
  getPositionRangeFromPricePercentageWithResetParams,
  getPricePercentageWithResetRebalanceFieldInfos,
} from './rebalance_methods/pricePercentageWithResetRebalance';
import {
  deserializeDriftRebalanceFromOnchainParams,
  getDefaultDriftRebalanceFieldInfos,
  getDriftRebalanceFieldInfos,
  getPositionRangeFromDriftParams,
} from './rebalance_methods/driftRebalance';
import {
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
} from './rebalance_methods';
import { PoolPriceReferenceType, TwapPriceReferenceType } from './utils/priceReferenceTypes';
import { getRebalanceMethodFromRebalanceFields, getRebalanceTypeFromRebalanceFields } from './rebalance_methods/utils';
import { RebalanceTypeLabelName } from './rebalance_methods/consts';
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
  private readonly _jupService: JupService;

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

    if (cluster === 'localnet') {
      if (raydiumProgramId) {
        setRaydiumProgramId(raydiumProgramId);
      }
    }

    this._orcaService = new OrcaService(connection, cluster, this._globalConfig);
    this._raydiumService = new RaydiumService(connection, cluster);
    this._jupService = new JupService(connection, cluster);
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
    const config = await GlobalConfig.fetch(this._connection, this._globalConfig);
    if (!config) {
      throw Error(`Could not fetch globalConfig with pubkey ${this.getGlobalConfig().toString()}`);
    }
    return this.getCollateralInfo(config.tokenInfos);
  };

  getSupportedDexes = (): Dex[] => ['ORCA', 'RAYDIUM'];

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
    return [
      ManualRebalanceMethod,
      PricePercentageRebalanceMethod,
      PricePercentageWithResetRangeRebalanceMethod,
      DriftRebalanceMethod,
      TakeProfitMethod,
      PeriodicRebalanceMethod,
      ExpanderMethod,
    ];
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

  getRebalanceTypeFromRebalanceFields = (rebalanceFields: RebalanceFieldInfo[]): RebalanceTypeKind => {
    return getRebalanceTypeFromRebalanceFields(rebalanceFields);
  };

  getRebalanceMethodFromRebalanceFields = (rebalanceFields: RebalanceFieldInfo[]): RebalanceMethod => {
    return getRebalanceMethodFromRebalanceFields(rebalanceFields);
  };

  getFieldsForRebalanceMethod = (
    rebalanceMethod: RebalanceMethod,
    dex: Dex,
    fieldOverrides: RebalanceFieldInfo[],
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
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
        return this.getFieldsForDriftRebalanceMethod(dex, fieldOverrides, tokenAMint, tokenBMint, poolPrice);
      case TakeProfitMethod:
        return this.getFieldsForTakeProfitRebalanceMethod(dex, fieldOverrides, tokenAMint, tokenBMint, poolPrice);
      case PeriodicRebalanceMethod:
        return this.getFieldsForPeriodicRebalanceMethod(dex, fieldOverrides, tokenAMint, tokenBMint, poolPrice);
      case ExpanderMethod:
        return this.getFieldsForExpanderRebalanceMethod(dex, fieldOverrides, tokenAMint, tokenBMint, poolPrice);
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

    let lowerPrice = defaultFields.find((x) => x.label == 'priceLower')!.value;
    const lowerPriceInput = fieldOverrides.find((x) => x.label == 'priceLower');
    if (lowerPriceInput) {
      lowerPrice = lowerPriceInput.value;
    }

    let upperPrice = defaultFields.find((x) => x.label == 'priceUpper')!.value;
    const upperPriceInput = fieldOverrides.find((x) => x.label == 'priceUpper');
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
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    poolPrice?: Decimal
  ): Promise<RebalanceFieldInfo[]> => {
    const tokenADecimals = await getMintDecimals(this._connection, tokenAMint);
    const tokenBDecimals = await getMintDecimals(this._connection, tokenBMint);
    const price = poolPrice ? poolPrice : new Decimal(await this.getPriceForPair(dex, tokenAMint, tokenBMint));

    const defaultFields = getDefaultDriftRebalanceFieldInfos(dex, price, tokenADecimals, tokenBDecimals);

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

    // pub lower_range_price: u128,
    // pub upper_range_price: u128,
    // // Which token we want the full amount in
    // // Will wait until the position is fully in this token (0 or 1, representing A or B)
    // pub destination_token: RebalanceTakeProfitToken,

    let lowerRangePrice = defaultFields.find((x) => x.label == 'priceLower')!.value;
    let lowerRangePriceInput = fieldOverrides.find((x) => x.label == 'priceLower');
    if (lowerRangePriceInput) {
      lowerRangePrice = lowerRangePriceInput.value;
    }

    let upperRangePrice = defaultFields.find((x) => x.label == 'priceUpper')!.value;
    let upperRangePriceInput = fieldOverrides.find((x) => x.label == 'priceUpper');
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
    let price = new Decimal(await this.getPriceForPair(dex, poolTokenA, poolTokenB));

    switch (rebalanceMethod) {
      case ManualRebalanceMethod:
        return getDefaultManualRebalanceFieldInfos(price);
      case PricePercentageRebalanceMethod:
        return getDefaultPricePercentageRebalanceFieldInfos(price);
      case PricePercentageWithResetRangeRebalanceMethod:
        return getDefaultPricePercentageWithResetRebalanceFieldInfos(price);
      case DriftRebalanceMethod:
        let tokenADecimals = await getMintDecimals(this._connection, poolTokenA);
        let tokenBDecimals = await getMintDecimals(this._connection, poolTokenB);
        return getDefaultDriftRebalanceFieldInfos(dex, price, tokenADecimals, tokenBDecimals);
      case TakeProfitMethod:
        return getDefaultTakeProfitRebalanceFieldsInfos(price);
      case PeriodicRebalanceMethod:
        return getDefaultPeriodicRebalanceFieldInfos(price);
      case ExpanderMethod:
        return getDefaultExpanderRebalanceFieldInfos(price);
      default:
        throw new Error(`Rebalance method ${rebalanceMethod} is not supported`);
    }
  };

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
      let pool = PublicKey.default;
      let raydiumPools = await this.getRaydiumPoolsForTokens(poolTokenA, poolTokenB);
      raydiumPools.forEach((element) => {
        if (new Decimal(element.ammConfig.tradeFeeRate).div(FullBPS).div(FullPercentage).equals(feeBPS.div(FullBPS))) {
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
  getStrategyByAddress = (address: PublicKey) => WhirlpoolStrategy.fetch(this._connection, address);

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
      collateralInfos: CollateralInfo[],
      prices?: OraclePrices
    ) => Promise<StrategyBalances>,
    collateralInfos: CollateralInfo[],
    prices?: Record<string, OraclePrices>
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
  ) => {
    const strategyPrices = await this.getStrategyPrices(strategy, collateralInfos, prices);
    const tokenHoldings = await this.getRaydiumTokensBalances(strategy, pool, position);

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

    const balance: StrategyBalances = {
      computedHoldings,
      prices: { ...strategyPrices, poolPrice, lowerPrice, upperPrice },
      tokenAAmounts: tokenHoldings.available.a.plus(tokenHoldings.invested.a),
      tokenBAmounts: tokenHoldings.available.b.plus(tokenHoldings.invested.b),
    };
    return balance;
  };

  private getRaydiumTokensBalances = async (
    strategy: WhirlpoolStrategy,
    pool: PoolState,
    position: PersonalPositionState
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

  private getOrcaBalances = async (
    strategy: WhirlpoolStrategy,
    pool: Whirlpool,
    position: Position,
    collateralInfos: CollateralInfo[],
    prices?: OraclePrices
  ) => {
    const strategyPrices = await this.getStrategyPrices(strategy, collateralInfos, prices);

    let tokenHoldings = await this.getOrcaTokensBalances(strategy, pool, position);
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
    const upperPrice = tickIndexToPrice(position.tickUpperIndex, decimalsA, decimalsB);
    const lowerPrice = tickIndexToPrice(position.tickLowerIndex, decimalsA, decimalsB);

    const balance: StrategyBalances = {
      computedHoldings,
      prices: { ...strategyPrices, poolPrice, upperPrice, lowerPrice },
      tokenAAmounts: tokenHoldings.available.a.plus(tokenHoldings.invested.a),
      tokenBAmounts: tokenHoldings.available.b.plus(tokenHoldings.invested.b),
    };
    return balance;
  };

  private getOrcaTokensBalances = async (
    strategy: WhirlpoolStrategy,
    pool: Whirlpool,
    position: Position
  ): Promise<TokenHoldings> => {
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

  // getTokenAccountBalanceOrZero return 0 if the token balance is not initialized
  private getTokenAccountBalanceOrZero = async (tokenAccount: PublicKey): Promise<Decimal> => {
    let tokenAccountExists = await checkIfAccountExists(this._connection, tokenAccount);
    if (tokenAccountExists) {
      return await this.getTokenAccountBalance(tokenAccount);
    } else {
      return new Decimal(0);
    }
  };

  private getStrategyBalances = async (strategy: WhirlpoolStrategy, scopePrices?: OraclePrices) => {
    const collateralInfos = await this.getCollateralInfos();
    if (strategy.strategyDex.toNumber() == dexToNumber('ORCA')) {
      return this.getStrategyBalancesOrca(strategy, collateralInfos, scopePrices);
    } else if (strategy.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      return this.getStrategyBalancesRaydium(strategy, collateralInfos, scopePrices);
    } else {
      throw new Error(`Invalid dex ${strategy.strategyDex.toString()}`);
    }
  };

  private getStrategyTokensBalances = async (strategy: WhirlpoolStrategy): Promise<TokenHoldings> => {
    if (strategy.strategyDex.toNumber() == dexToNumber('ORCA')) {
      const [whirlpool, position] = await Promise.all([
        Whirlpool.fetch(this._connection, strategy.pool),
        Position.fetch(this._connection, strategy.position),
      ]);
      if (!whirlpool) {
        throw Error(`Could not fetch whirlpool state with pubkey ${strategy.pool.toString()}`);
      }
      if (!position) {
        throw Error(`Could not fetch position state with pubkey ${strategy.position.toString()}`);
      }
      return this.getOrcaTokensBalances(strategy, whirlpool, position);
    } else if (strategy.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
      const [poolState, position] = await Promise.all([
        PoolState.fetch(this._connection, strategy.pool),
        PersonalPositionState.fetch(this._connection, strategy.position),
      ]);
      if (!poolState) {
        throw Error(`Could not fetch Raydium pool state with pubkey ${strategy.pool.toString()}`);
      }
      if (!position) {
        throw Error(`Could not fetch position state with pubkey ${strategy.position.toString()}`);
      }
      return this.getRaydiumTokensBalances(strategy, poolState, position);
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
  ) => {
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

    return this.getOrcaBalances(strategy, whirlpool, position, collateralInfos, scopePrices);
  };

  private getStrategyBalancesRaydium = async (
    strategy: WhirlpoolStrategy,
    collateralInfos: CollateralInfo[],
    scopePrices?: OraclePrices
  ) => {
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

    return this.getRaydiumBalances(strategy, poolState, positionState, collateralInfos, scopePrices);
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

  getAllPrices = (): Promise<OraclePrices> => this._scope.getOraclePrices();

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

    const reward0Price =
      strategy.reward0Decimals.toNumber() !== 0
        ? await this._scope.getPriceFromChain(rewardToken0.scopePriceChain, prices)
        : null;
    const reward1Price =
      strategy.reward1Decimals.toNumber() !== 0
        ? await this._scope.getPriceFromChain(rewardToken1.scopePriceChain, prices)
        : null;
    const reward2Price =
      strategy.reward2Decimals.toNumber() !== 0
        ? await this._scope.getPriceFromChain(rewardToken2.scopePriceChain, prices)
        : null;

    return {
      aPrice,
      bPrice,
      reward0Price,
      reward1Price,
      reward2Price,
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
    } else {
      throw Error(`Unsupported dex ${dex}`);
    }
  };

  getPositionRangeOrca = async (
    positionPk: PublicKey,
    decimalsA: number,
    decimalsB: number
  ): Promise<PositionRange> => {
    let position = await Position.fetch(this._connection, positionPk);
    if (!position) {
      throw Error(`Could not find Orca position ${positionPk}`);
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
    let position = await PersonalPositionState.fetch(this._connection, positionPk);
    if (!position) {
      throw Error(`Could not find Orca position ${positionPk}`);
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
  getRaydiumPoolByAddress = (pool: PublicKey) => PoolState.fetch(this._connection, pool);

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

    const { treasuryFeeTokenAVault, treasuryFeeTokenBVault } = this.getTreasuryFeeVaultPDAs(
      strategyState.strategy.tokenAMint,
      strategyState.strategy.tokenBMint
    );

    const sharesAta = await getAssociatedTokenAddress(strategyState.strategy.sharesMint, owner);
    const tokenAAta = await getAssociatedTokenAddress(strategyState.strategy.tokenAMint, owner);
    const tokenBAta = await getAssociatedTokenAddress(strategyState.strategy.tokenBMint, owner);

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
    };

    const withdrawIxn = withdraw(args, accounts);
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
        withdrawIxn.keys = withdrawIxn.keys.concat([
          { pubkey: poolState.rewardInfos[0].tokenVault, isSigner: false, isWritable: true },
          { pubkey: strategyState.strategy.reward0Vault, isSigner: false, isWritable: true },
        ]);
      }
      if (strategyState.strategy.reward1Decimals.toNumber() > 0) {
        withdrawIxn.keys = withdrawIxn.keys.concat([
          { pubkey: poolState.rewardInfos[1].tokenVault, isSigner: false, isWritable: true },
          { pubkey: strategyState.strategy.reward1Vault, isSigner: false, isWritable: true },
        ]);
      }
      if (strategyState.strategy.reward2Decimals.toNumber() > 0) {
        withdrawIxn.keys = withdrawIxn.keys.concat([
          { pubkey: poolState.rewardInfos[2].tokenVault, isSigner: false, isWritable: true },
          { pubkey: strategyState.strategy.reward2Vault, isSigner: false, isWritable: true },
        ]);
      }
    }

    return [...collectFeesAndRewardsIxns, withdrawIxn];
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

    let poolProgram = getDexProgramId(strategyState.strategy);
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
      tokenProgram: TOKEN_PROGRAM_ID,
      instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
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
    priceAInB?: Decimal
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
        ) => this.getJupSwapIxsV6(input, tokenAMint, tokenBMint, user, slippageBps, false, allAccounts, profiler);

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
        priceAInB
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
    priceAInB?: Decimal
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
        ) => this.getJupSwapIxsV6(input, tokenAMint, tokenBMint, user, slippageBps, false, allAccounts, profiler);

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
        priceAInB
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
    priceAInB?: Decimal // not mandatory as it will be fetched from Jupyter
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

      createWsolAtasIxns.push(...createWSolAtaIxns.createIxns);
      cleanupIxs.push(...createWSolAtaIxns.closeIxns);
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

      createWsolAtasIxns.push(...createWSolAtaIxns.createIxns);
      cleanupIxs.push(...createWSolAtaIxns.closeIxns);
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

    const getGlobalConfigPromise = GlobalConfig.fetch(this._connection, strategyState.globalConfig);
    const [createAtasIxns, amountsToDepositWithSwap, globalConfig] = await profiler(
      Promise.all([createAtasIxnsPromise, amountsToDepositWithSwapPromise, getGlobalConfigPromise]),
      'B-promiseAll(createAtasIxns, amountsToDepositWithSwap)',
      []
    );

    let checkExpectedVaultsBalancesIx = await profiler(
      this.getCheckExpectedVaultsBalancesIx(strategyWithAddress, owner, tokenAAta, tokenBAta, {
        a: tokenAAtaBalance,
        b: tokenBAtaBalance,
      }),
      'B-getCheckExpectedVaultsBalancesIx',
      []
    );

    let poolProgram = getDexProgramId(strategyState);

    const { treasuryFeeTokenAVault, treasuryFeeTokenBVault } = this.getTreasuryFeeVaultPDAs(
      strategyState.tokenAMint,
      strategyState.tokenBMint
    );

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
      treasuryFeeTokenAVault,
      treasuryFeeTokenBVault,
      tokenAAta,
      tokenBAta,
      tokenAMint: strategyState.tokenAMint,
      tokenBMint: strategyState.tokenBMint,
      userSharesAta: sharesAta,
      sharesMint: strategyState.sharesMint,
      sharesMintAuthority: strategyState.sharesMintAuthority,
      scopePrices: strategyState.scopePrices,
      tokenInfos: globalConfig.tokenInfos,
      tokenProgram: TOKEN_PROGRAM_ID,
      instructionSysvarAccount: SYSVAR_INSTRUCTIONS_PUBKEY,
    };

    let singleSidedDepositIx = singleTokenDepositWithMin(args, accounts);

    let result: TransactionInstruction[] = [];
    result.push(...createAtasIxns, ...createWsolAtasIxns);

    // get all unique accounts in the tx so we can use the remaining space (MAX_ACCOUNTS_PER_TRANSACTION - accounts_used) for the swap
    const extractKeys = (ixs: any[]) => ixs.flatMap((ix) => ix.keys?.map((key) => key.pubkey) || []);

    const allKeys = [
      ...extractKeys(result),
      ...extractKeys([checkExpectedVaultsBalancesIx]),
      ...extractKeys([singleSidedDepositIx]),
      ...extractKeys(cleanupIxs),
    ];

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

  getJupSwapIxsWithMaxAccounts = async (
    input: DepositAmountsForSwap,
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    owner: PublicKey,
    slippageBps: Decimal,
    useOnlyLegacyTransaction: boolean,
    existingAccounts: PublicKey[],
    maxAccounts: number,
    profiler: ProfiledFunctionExecution = noopProfiledFunctionExecution
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
            maxAccounts
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
            maxAccounts
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

  getJupSwapIxsV4 = async (
    input: DepositAmountsForSwap,
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    owner: PublicKey,
    slippageBps: Decimal,
    useOnlyLegacyTransaction: boolean,
    existingAccounts: PublicKey[],
    profiler: ProfiledFunctionExecution = noopProfiledFunctionExecution
  ): Promise<[TransactionInstruction[], PublicKey[]]> => {
    console.log('getJupSwapIxsV4', JSON.stringify(input));
    let jupiterRoutesPromises: Promise<RouteInfo[]> = input.tokenAToSwapAmount.lt(ZERO)
      ? JupService.getAllRoutesV4(
          input.tokenAToSwapAmount.abs(),
          tokenAMint,
          tokenBMint,
          slippageBps.toNumber(),
          'ExactIn',
          useOnlyLegacyTransaction
        )
      : JupService.getAllRoutesV4(
          input.tokenBToSwapAmount.abs(),
          tokenBMint,
          tokenAMint,
          slippageBps.toNumber(),
          'ExactIn',
          useOnlyLegacyTransaction
        );

    const jupiterRoutes = await profiler(jupiterRoutesPromises, 'getAllRoutesV4', []);

    for (let route of jupiterRoutes) {
      const {
        setupTransaction,
        swapTransaction,
        cleanupTransaction,
      }: {
        setupTransaction: string | undefined;
        swapTransaction: string;
        cleanupTransaction: string | undefined;
      } = await JupService.getSwapTransactions(route, owner, false, false);

      // remove budget and atas ixns from jup transaction because we manage it ourself
      const decodedSetupTx = decodeSerializedTransaction(setupTransaction);
      let clearedSwapSetupIxs: TransactionInstruction[] = [];
      if (decodedSetupTx) {
        clearedSwapSetupIxs = removeBudgetAndAtaIxns(decodedSetupTx.instructions, [
          tokenAMint.toString(),
          tokenBMint.toString(),
        ]);
      }

      // remove budget and atas ixns from jup transaction because we manage it ourself
      const decodedCleanupTx = decodeSerializedTransaction(cleanupTransaction);
      let clearedCleanupIxns: TransactionInstruction[] = [];
      if (decodedCleanupTx) {
        clearedCleanupIxns = removeBudgetAndAtaIxns(decodedCleanupTx.instructions, [
          tokenAMint.toString(),
          tokenBMint.toString(),
        ]);
      }

      let { txMessage, lookupTablesAddresses } = await JupService.deserealizeVersionedTransactions(this._connection, [
        swapTransaction,
      ]);

      let clearedSwapIxs = [
        ...removeBudgetAndAtaIxns(txMessage[0].instructions, [tokenAMint.toString(), tokenBMint.toString()]),
      ];

      let allJupIxs = [...clearedSwapSetupIxs, ...clearedSwapIxs, ...clearedCleanupIxns];
      let allJupAccounts = allJupIxs.flatMap((ix) => ix.keys?.map((key) => key.pubkey) || []);
      let allAccounts = new Set<PublicKey>([...existingAccounts, ...allJupAccounts]);

      let prefix = 'getSingleSidedJupRoute:';
      console.log(`${prefix} All distinct existing accounts number ${new Set<PublicKey>(existingAccounts).size}`);
      console.log(`${prefix} All distinct Jup accounts number ${new Set<PublicKey>(allJupAccounts).size}`);
      console.log(`${prefix} All accounts number ${allAccounts.size}`);

      if (allAccounts.size < MAX_ACCOUNTS_PER_TRANSACTION) {
        return [allJupIxs, lookupTablesAddresses];
      }
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
    profiledFunctionExecution: ProfiledFunctionExecution = noopProfiledFunctionExecution
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
          profiledFunctionExecution
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
  ) => {
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

    let expectedALamports = collToLamportsDecimal(expectedABalance, strategyState.tokenAMintDecimals.toNumber());
    let expectedBLamports = collToLamportsDecimal(expectedBBalance, strategyState.tokenBMintDecimals.toNumber());

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
  createStrategy = async (strategy: PublicKey, pool: PublicKey, owner: PublicKey, dex: Dex) => {
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
    } else {
      throw new Error(`Invalid dex ${dex.toString()}`);
    }

    let config = await GlobalConfig.fetch(this._connection, this._globalConfig);
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
   * @param owner signer of the tx
   * @returns transaction instruction to collect strategy fees and rewards
   */
  collectFeesAndRewards = async (strategy: PublicKey | StrategyWithAddress, owner?: PublicKey) => {
    const { address: strategyPubkey, strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    const { treasuryFeeTokenAVault, treasuryFeeTokenBVault, treasuryFeeVaultAuthority } = this.getTreasuryFeeVaultPDAs(
      strategyState.tokenAMint,
      strategyState.tokenBMint
    );

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
        strategyState.position,
        strategyState.positionMint,
        strategyState.positionTokenAccount,
        strategyState.tickArrayLower,
        strategyState.tickArrayUpper,
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
        strategyState.tickArrayLower,
        strategyState.tickArrayUpper,
        strategyState.position,
        strategyState.positionMint,
        strategyState.positionTokenAccount,
        strategyState.raydiumProtocolPositionOrBaseVaultAuthority,
        status,
        reward0Vault,
        reward1Vault,
        reward2Vault
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
    oldPositionOrBaseVaultAuthority: PublicKey,
    oldPositionMintOrBaseVaultAuthority: PublicKey,
    oldPositionTokenAccountOrBaseVaultAuthority: PublicKey,
    oldTickArrayLowerOrBaseVaultAuthority: PublicKey,
    oldTickArrayUpperOrBaseVaultAuthority: PublicKey,
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

    const { startTickIndex, endTickIndex } = this.getStartEndTicketIndexProgramAddressesOrca(
      pool,
      whirlpool,
      tickLowerIndex,
      tickUpperIndex
    );

    const globalConfig = await GlobalConfig.fetch(this._connection, this._globalConfig);
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
    adminAuthority: PublicKey,
    strategy: PublicKey,
    baseVaultAuthority: PublicKey,
    pool: PublicKey,
    positionMint: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    tokenAVault: PublicKey,
    tokenBVault: PublicKey,
    oldTickArrayLowerOrBaseVaultAuthority: PublicKey,
    oldTickArrayUpperOrBaseVaultAuthority: PublicKey,
    oldPositionOrBaseVaultAuthority: PublicKey,
    oldPositionMintOrBaseVaultAuthority: PublicKey,
    oldPositionTokenAccountOrBaseVaultAuthority: PublicKey,
    oldProtocolPositionOrBaseVaultAuthority: PublicKey,
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
      priceLower,
      poolState.tickSpacing,
      decimalsA,
      decimalsB
    );

    let tickUpperIndex = TickMath.getTickWithPriceAndTickspacing(
      priceUpper,
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

    const positionTokenAccount = await getAssociatedTokenAddress(positionMint, baseVaultAuthority);

    const args: OpenLiquidityPositionArgs = {
      tickLowerIndex: new BN(tickLowerIndex),
      tickUpperIndex: new BN(tickUpperIndex),
      bump: positionBump,
    };

    const { startTickIndex, endTickIndex } = this.getStartEndTicketIndexProgramAddressesRaydium(
      pool,
      poolState,
      tickLowerIndex,
      tickUpperIndex
    );

    const globalConfig = await GlobalConfig.fetch(this._connection, this._globalConfig);
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
    return ix;
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

    let globalConfig = await GlobalConfig.fetch(this._connection, strategyState.globalConfig);
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

    const globalConfig = await GlobalConfig.fetch(this._connection, strategyState.globalConfig);
    if (!globalConfig) {
      throw Error(`Could not fetch global config with pubkey ${strategyState.globalConfig.toString()}`);
    }

    let programId = getDexProgramId(strategyState);

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

  getUpdateRebalancingParmsIxns = async (
    strategyAdmin: PublicKey,
    strategy: PublicKey,
    rebalanceParams: Decimal[],
    rebalanceType?: RebalanceTypeKind,
    tokenADecimals?: number,
    tokenBDecimals?: number
  ): Promise<TransactionInstruction> => {
    if (!rebalanceType) {
      const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
      rebalanceType = numberToRebalanceType(strategyState.rebalanceType);
    }

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
  ): Promise<[TransactionInstruction, TransactionInstruction[], TransactionInstruction, TransactionInstruction]> => {
    let feeTier: Decimal = feeTierBps.div(FullBPS);
    // check both tokens exist in collateralInfo
    let config = await GlobalConfig.fetch(this._connection, this._globalConfig);
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

    let price = await this.getCurrentPriceFromPool(dex, pool);

    let tokenMintA: PublicKey;
    let tokenMintB: PublicKey;
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
      throw new Error(`Dex ${dex} is not supported`);
    }

    let initStrategyIx: TransactionInstruction = await this.createStrategy(strategy, pool, strategyAdmin, dex);

    let tokenADecimals = await getMintDecimals(this._connection, tokenMintA);
    let tokenBDecimals = await getMintDecimals(this._connection, tokenMintB);
    let rebalanceKind = numberToRebalanceType(rebalanceType.toNumber());
    let updateRebalanceParamsIx = await this.getUpdateRebalancingParamsForUninitializedStratIx(
      strategyAdmin,
      strategy,
      rebalanceParams,
      rebalanceKind,
      tokenADecimals,
      tokenBDecimals
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

    let programAddresses = await this.getStrategyProgramAddresses(strategy, tokenMintA, tokenMintB);
    let baseVaultAuthority = programAddresses.baseVaultAuthority;
    let tokenAVault = programAddresses.tokenAVault;
    let tokenBVault = programAddresses.tokenBVault;

    let { lowerPrice, upperPrice } = await this.getRebalancePositionRange(
      dex,
      price,
      tokenAMint,
      tokenBMint,
      rebalanceKind,
      rebalanceParams
    );

    let openPositionIx: TransactionInstruction;
    if (dex == 'ORCA') {
      openPositionIx = await this.openPositionOrca(
        strategyAdmin,
        strategy,
        baseVaultAuthority,
        pool,
        positionMint,
        lowerPrice,
        upperPrice,
        tokenAVault,
        tokenBVault,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority
      );
    } else if (dex == 'RAYDIUM') {
      openPositionIx = await this.openPositionRaydium(
        strategyAdmin,
        strategy,
        baseVaultAuthority,
        pool,
        positionMint,
        lowerPrice,
        upperPrice,
        tokenAVault,
        tokenBVault,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority,
        baseVaultAuthority
      );
    } else {
      throw new Error(`Dex ${dex} is not supported`);
    }

    return [initStrategyIx, updateStrategyParamsIx, updateRebalanceParamsIx, openPositionIx];
  };

  private async getRebalancePositionRange(
    dex: Dex,
    price: Decimal,
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    rebalanceKind: RebalanceTypeKind,
    rebalanceParams: Decimal[]
  ): Promise<PositionRange> {
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
        let tokenADecimals = await getMintDecimals(this._connection, tokenAMint);
        let tokenBDecimals = await getMintDecimals(this._connection, tokenBMint);
        return getPositionRangeFromDriftParams(
          dex,
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
    } else {
      throw new Error(`Invalid dex ${dex}`);
    }

    return this.getPriceRangePercentageBasedFromPrice(poolPrice, lowerPriceBpsDifference, upperPriceBpsDifference);
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
      return deserializeDriftRebalanceFromOnchainParams(
        dex,
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
    } else {
      throw new Error(`Rebalance type ${rebalanceKind} is not supported`);
    }
  }

  updateRebalanceFieldInfos(
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

  async getGenericPoolInfo(dex: Dex, pool: PublicKey): Promise<GenericPoolInfo> {
    let poolInfo: GenericPoolInfo;
    if (dex == 'ORCA') {
      poolInfo = await this._orcaService.getGenericPoolInfo(pool);
    } else if (dex == 'RAYDIUM') {
      poolInfo = await this._raydiumService.getGenericPoolInfo(pool);
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
  ) => {
    if (dex == 'ORCA') {
      return this.getEstimatedApyAndVolumeOnRangeOrca(pool, lowerPrice, upperPrice);
    } else if (dex == 'RAYDIUM') {
      return this.getEstimatedApyAndVolumeOnRangeRaydium(pool, lowerPrice, upperPrice);
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

  getManualPoolSimulatedValues = async (params: {
    pool: PublicKey;
    priceLower: Decimal;
    priceUpper: Decimal;
    startDate: string;
    endDate: string;
  }) => {
    const { pool, startDate, endDate, priceLower, priceUpper } = params;
    return simulateManualPool({ poolAddress: pool, priceUpper, priceLower, depositDate: startDate, endDate });
  };

  getPercentagePoolSimulatedValues = async (params: SimulationPercentagePoolParameters) => {
    const { resetRangeWidthPercLower = 1, resetRangeWidthPercUpper = 1, ...rest } = params;
    return simulatePercentagePool({ resetRangeWidthPercLower, resetRangeWidthPercUpper, ...rest });
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
    strategy: PublicKey | StrategyWithAddress,
    newPosition: PublicKey,
    priceLower: Decimal,
    priceUpper: Decimal,
    payer: PublicKey
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

  getStrategyPerformanceFees = async (
    strategy: PublicKey | StrategyWithAddress,
    globalConfig?: GlobalConfig
  ): Promise<PerformanceFees> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    const globalConfigState = globalConfig || (await GlobalConfig.fetch(this._connection, strategyState.globalConfig));

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
    } else {
      throw Error(`Dex ${dex} not supported`);
    }
  };

  getPositionsCountForPool = async (dex: Dex, pool: PublicKey): Promise<number> => {
    if (dex == 'ORCA') {
      return this._orcaService.getPositionsCountByPool(pool);
    } else if (dex == 'RAYDIUM') {
      return this._raydiumService.getPositionsCountByPool(pool);
    } else {
      throw Error(`Dex ${dex} not supported`);
    }
  };

  getStrategyTokensHoldings = async (strategy: PublicKey | StrategyWithAddress): Promise<TokenAmounts> => {
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);

    const holdings = await this.getStrategyTokensBalances(strategyState);

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
    const { strategy: strategyState } = await this.getStrategyStateIfNotFetched(strategy);
    let tokenAMint = strategyState.tokenAMint;
    let tokenBMint = strategyState.tokenBMint;

    if (!priceAInB) {
      priceAInB = new Decimal(await this._jupService.getPrice(tokenAMint, tokenBMint));
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
      this.calculateAmountsToBeDeposited(
        strategy,
        collToLamportsDecimal(new Decimal(100.0), tokenADecimals),
        undefined,
        profiler
      ),
      'C-calculateAmountsToBeDeposited',
      []
    );

    let orcaAmountA = aAmounts.div(new Decimal(10).pow(tokenADecimals));
    let orcaAmountB = bAmounts.div(new Decimal(10).pow(tokenBDecimals));

    let ratio = orcaAmountA.div(orcaAmountB);
    ratio = ratio.div(priceBInA);

    // multiply by tokens delta to make sure that both values uses the same about of decimals
    let totalUserDepositInA = aAmount
      .mul(10 ** tokenAAddDecimals)
      .add(bAmount.mul(10 ** tokenBAddDecimals).mul(priceBInA));

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
    } else {
      throw new Error('Invalid dex, use RAYDIUM or ORCA');
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

    let updateDepositFeeIx: TransactionInstruction | undefined;
    if (depositFeeBps && depositFeeBps.gt(0)) {
      updateDepositFeeIx = await getUpdateStrategyConfigIx(
        strategyAdmin,
        this._globalConfig,
        strategy,
        new UpdateDepositFee(),
        depositFeeBps
      );
    }

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
    let updateMintingMethodToProportionalIx = await getUpdateStrategyConfigIx(
      strategyAdmin,
      this._globalConfig,
      strategy,
      new UpdateDepositMintingMethod(),
      ProportionalMintingMethod
    );

    let ixs = [
      updateRebalanceTypeIx,
      updateDepositCapIx,
      updateDepositCapPerIxnIx,
      updateWithdrawalFeeIx,
      updateFeesFeeIx,
      updateRewards0FeeIx,
      updateRewards1FeeIx,
      updateRewards2FeeIx,
      updateMintingMethodToProportionalIx,
    ];
    if (updateDepositFeeIx) {
      ixs.push(updateDepositFeeIx);
    }

    return ixs;
  };

  getUpdateRewardsIxs = async (
    strategyOwner: PublicKey,
    strategy: PublicKey
  ): Promise<[TransactionInstruction, Keypair][]> => {
    let strategyState = await WhirlpoolStrategy.fetch(this._connection, strategy);
    if (!strategyState) {
      throw Error(`Could not fetch strategy state with pubkey ${strategy.toString()}`);
    }
    let globalConfig = await GlobalConfig.fetch(this._connection, strategyState.globalConfig);
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
    } else {
      throw new Error(`Dex ${strategyState.strategyDex} not supported`);
    }
  };
}

export default Kamino;
