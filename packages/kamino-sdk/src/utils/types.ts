import { PublicKey, TransactionInstruction, TransactionMessage } from '@solana/web3.js';
import { WhirlpoolStrategy } from '../kamino-client/accounts';
import { Dex, collToLamportsDecimal } from './utils';
import Decimal from 'decimal.js';
import { RebalanceTypeKind } from '../kamino-client/types';

export const RAYDIUM_DEVNET_PROGRAM_ID = new PublicKey('devi51mZmdwUJGU9hjN27vEz64Gps7uUefqxg27EAtH');

export type StrategyType = 'NON_PEGGED' | 'PEGGED' | 'STABLE';
export type StrategyCreationStatus = 'IGNORED' | 'SHADOW' | 'LIVE' | 'DEPRECATED' | 'STAGING';

export type StrategiesFilters = {
  strategyType?: StrategyType;
  strategyCreationStatus?: StrategyCreationStatus;
  isCommunity?: boolean;
};

export function strategyTypeToBase58(strategyType: StrategyType): string {
  switch (strategyType) {
    case 'NON_PEGGED':
      return '1';
    case 'PEGGED':
      return '2';
    case 'STABLE':
      return '3';
    default:
      throw new Error(`Invalid strategyType ${strategyType}`);
  }
}

export function strategyTypeToNumber(strategyType: StrategyType): number {
  switch (strategyType) {
    case 'NON_PEGGED':
      return 0;
    case 'PEGGED':
      return 1;
    case 'STABLE':
      return 2;
    default:
      throw new Error(`Invalid strategyType ${strategyType}`);
  }
}

export function getStrategyTypeFromStrategy(strategy: WhirlpoolStrategy): StrategyType {
  switch (strategy.strategyType.toNumber()) {
    case 0:
      return 'NON_PEGGED';
    case 1:
      return 'PEGGED';
    case 2:
      return 'STABLE';
    default:
      throw new Error(`Unknown strategyType value ${strategy.strategyType.toNumber()}`);
  }
}

export function strategyCreationStatusToBase58(strategyCreationStatus: StrategyCreationStatus): string {
  switch (strategyCreationStatus) {
    case 'IGNORED':
      return '1';
    case 'SHADOW':
      return '2';
    case 'LIVE':
      return '3';
    case 'DEPRECATED':
      return '4';
    case 'STAGING':
      return '5';
    default:
      throw new Error(`Invalid strategyCreationStatus ${strategyCreationStatus}`);
  }
}

export function strategyCreationStatusToNumber(strategyCreationStatus: StrategyCreationStatus): number {
  switch (strategyCreationStatus) {
    case 'IGNORED':
      return 0;
    case 'SHADOW':
      return 1;
    case 'LIVE':
      return 2;
    case 'DEPRECATED':
      return 3;
    case 'STAGING':
      return 4;
    default:
      throw new Error(`Invalid strategyCreationStatus ${strategyCreationStatus}`);
  }
}

export function getStrategyCreationStatusFromStrategy(strategy: WhirlpoolStrategy): StrategyCreationStatus {
  switch (strategy.creationStatus) {
    case 0:
      return 'IGNORED';
    case 1:
      return 'SHADOW';
    case 2:
      return 'LIVE';
    case 3:
      return 'DEPRECATED';
    case 4:
      return 'STAGING';
    default:
      throw new Error(`Invalid strategyCreationStatus ${strategy.creationStatus}`);
  }
}

export interface GenericPoolInfo {
  dex: Dex;
  address: PublicKey;
  tokenMintA: PublicKey;
  tokenMintB: PublicKey;
  price: Decimal;
  feeRate: Decimal;
  volumeOnLast7d: Decimal | undefined;
  tvl: Decimal | undefined;
  tickSpacing: Decimal;
  positions: Decimal;
}

export interface GenericPositionRangeInfo {
  estimatedApy: Decimal;
  estimatedVolume: Decimal | undefined;
}

export interface VaultParameters {
  tokenMintA: PublicKey;
  tokenMintB: PublicKey;
  dex: Dex;
  feeTier: Decimal;
  rebalancingParameters: RebalanceFieldInfo[];
}

export interface LiquidityDistribution {
  currentPrice: Decimal;
  currentTickIndex: number;
  distribution: LiquidityForPrice[];
}

export interface LiquidityForPrice {
  price: Decimal;
  liquidity: Decimal;
  tickIndex: number;
}

export interface DepositAmountsForSwap {
  requiredAAmountToDeposit: Decimal;
  requiredBAmountToDeposit: Decimal;
  tokenAToSwapAmount: Decimal;
  tokenBToSwapAmount: Decimal;
}

export function depositAmountsForSwapToLamports(
  depositAmounts: DepositAmountsForSwap,
  tokenADecimals: number,
  tokenBDecimals: number
): DepositAmountsForSwap {
  return {
    requiredAAmountToDeposit: collToLamportsDecimal(depositAmounts.requiredAAmountToDeposit, tokenADecimals),
    requiredBAmountToDeposit: collToLamportsDecimal(depositAmounts.requiredBAmountToDeposit, tokenBDecimals),
    tokenAToSwapAmount: collToLamportsDecimal(depositAmounts.tokenAToSwapAmount, tokenADecimals),
    tokenBToSwapAmount: collToLamportsDecimal(depositAmounts.tokenBToSwapAmount, tokenBDecimals),
  };
}

export interface RebalanceParams {
  rebalanceType: RebalanceTypeKind;
  lowerRangeBps?: Decimal;
  upperRangeBps?: Decimal;
  resetRangeLowerBps?: Decimal;
  resetRangeUpperBps?: Decimal;
  startMidTick?: Decimal;
  ticksBelowMid?: Decimal;
  ticksAboveMid?: Decimal;
  secondsPerTick?: Decimal;
  driftDirection?: Decimal;
  period?: Decimal;
  lowerRangePrice?: Decimal;
  upperRangePrice?: Decimal;
  destinationToken?: Decimal;
}

export interface RebalanceParamsAsPrices {
  rebalanceType: RebalanceTypeKind;
  rangePriceLower: Decimal;
  rangePriceUpper: Decimal;
  resetPriceLower?: Decimal;
  resetPriceUpper?: Decimal;
}

export interface PositionRange {
  lowerPrice: Decimal;
  upperPrice: Decimal;
}

export interface MaybeTokensBalances {
  a?: Decimal;
  b?: Decimal;
}

export interface TokensBalances {
  a: Decimal;
  b: Decimal;
}

export interface SwapperIxBuilder {
  (
    input: DepositAmountsForSwap,
    tokenAMint: PublicKey,
    tokenBMint: PublicKey,
    owner: PublicKey,
    slippage: Decimal,
    allKeys: PublicKey[]
  ): Promise<[TransactionInstruction[], PublicKey[]]>;
}

export interface ProfiledFunctionExecution {
  (promise: Promise<any>, transactionName: string, tags: [string, string][]): Promise<any>;
}

export function noopProfiledFunctionExecution(promise: Promise<any>, transactionName: string): Promise<any> {
  return promise;
}

export interface CreateAta {
  ata: PublicKey;
  createIxns: TransactionInstruction[];
  closeIxns: TransactionInstruction[];
}

export interface DeserializedVersionedTransaction {
  txMessage: TransactionMessage[];
  lookupTablesAddresses: PublicKey[];
}

export interface InstructionsWithLookupTables {
  instructions: TransactionInstruction[];
  lookupTablesAddresses: PublicKey[];
}

export interface PerformanceFees {
  feesFeeBPS: Decimal;
  reward0FeeBPS: Decimal;
  reward1FeeBPS: Decimal;
  reward2FeeBPS: Decimal;
}

export interface RebalanceFieldInfo {
  label: string;
  type: string;
  value: Decimal | string;
  enabled: boolean;
}
