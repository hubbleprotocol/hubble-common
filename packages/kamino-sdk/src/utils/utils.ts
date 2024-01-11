import { PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { WhirlpoolStrategy } from '../kamino-client/accounts';
import { WHIRLPOOL_PROGRAM_ID } from '../whirpools-client/programId';
import { PROGRAM_ID as RAYDIUM_PROGRAM_ID } from '../raydium_client/programId';
import Decimal from 'decimal.js';
import {
  DEX,
  DriftDirection,
  DriftDirectionKind,
  RebalanceAutodriftStep,
  RebalanceAutodriftStepKind,
  RebalanceType,
  RebalanceTypeKind,
  StakingRateSource,
  StakingRateSourceKind,
  StrategyConfigOptionKind,
} from '../kamino-client/types';
import {
  UpdateStrategyConfigAccounts,
  UpdateStrategyConfigArgs,
  updateStrategyConfig,
} from '../kamino-client/instructions';
import { SqrtPriceMath } from '@raydium-io/raydium-sdk';
import { token } from '@project-serum/anchor/dist/cjs/utils';
import { RebalanceFieldInfo, RebalanceFieldsDict } from './types';
import BN from 'bn.js';
import { PoolPriceReferenceType, TwapPriceReferenceType } from './priceReferenceTypes';
import { sqrtPriceX64ToPrice } from '@orca-so/whirlpool-sdk';
import { METEORA_PROGRAM_ID } from '../meteora_client/programId';
import { U64_MAX } from '../constants/numericalValues';

export const DolarBasedMintingMethod = new Decimal(0);
export const ProportionalMintingMethod = new Decimal(1);

export const RebalanceParamOffset = new Decimal(256);

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const Dex = ['ORCA', 'RAYDIUM', 'METEORA'] as const;
export type Dex = (typeof Dex)[number];

export const ReferencePriceType = [PoolPriceReferenceType, TwapPriceReferenceType] as const;
export type ReferencePriceType = (typeof ReferencePriceType)[number];

export function dexToNumber(dex: Dex): number {
  for (let i = 0; i < Dex.length; i++) {
    if (Dex[i] === dex) {
      return i;
    }
  }

  throw new Error(`Unknown DEX ${dex}`);
}

export function numberToDex(num: number): Dex {
  const dex = Dex[num];

  if (!dex) {
    throw new Error(`Unknown DEX ${num}`);
  }
  return dex;
}

export function numberToReferencePriceType(num: number): ReferencePriceType {
  let referencePriceType = ReferencePriceType[num];
  if (!referencePriceType) {
    throw new Error(`Strategy has invalid reference price type set: ${num}`);
  }
  return referencePriceType;
}

export function getDexProgramId(strategyState: WhirlpoolStrategy): PublicKey {
  if (strategyState.strategyDex.toNumber() == dexToNumber('ORCA')) {
    return WHIRLPOOL_PROGRAM_ID;
  } else if (strategyState.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
    return RAYDIUM_PROGRAM_ID;
  } else if (strategyState.strategyDex.toNumber() == dexToNumber('METEORA')) {
    return METEORA_PROGRAM_ID;
  } else {
    throw Error(`Invalid DEX ${strategyState.strategyDex.toString()}`);
  }
}

export function getStrategyConfigValue(value: Decimal): number[] {
  let buffer = Buffer.alloc(128);
  writeBNUint64LE(buffer, new BN(value.toString()), 0);
  return [...buffer];
}

export function buildStrategyRebalanceParams(
  params: Array<Decimal>,
  rebalance_type: RebalanceTypeKind,
  tokenADecimals?: number,
  tokenBDecimals?: number
): number[] {
  let buffer = Buffer.alloc(128);
  if (rebalance_type.kind == RebalanceType.Manual.kind) {
    // Manual has no params
  } else if (rebalance_type.kind == RebalanceType.PricePercentage.kind) {
    buffer.writeUint16LE(params[0].toNumber());
    buffer.writeUint16LE(params[1].toNumber(), 2);
  } else if (rebalance_type.kind == RebalanceType.PricePercentageWithReset.kind) {
    buffer.writeUint16LE(params[0].toNumber());
    buffer.writeUint16LE(params[1].toNumber(), 2);
    buffer.writeUint16LE(params[2].toNumber(), 4);
    buffer.writeUint16LE(params[3].toNumber(), 6);
  } else if (rebalance_type.kind == RebalanceType.Drift.kind) {
    buffer.writeInt32LE(params[0].toNumber());
    buffer.writeInt32LE(params[1].toNumber(), 4);
    buffer.writeInt32LE(params[2].toNumber(), 8);
    writeBNUint64LE(buffer, new BN(params[3].toString()), 12);
    buffer.writeUint8(params[4].toNumber(), 20);
  } else if (rebalance_type.kind == RebalanceType.TakeProfit.kind) {
    // TODO: fix this for meteora
    const lowerPrice = SqrtPriceMath.priceToSqrtPriceX64(params[0], tokenADecimals!, tokenBDecimals!);
    const upperPrice = SqrtPriceMath.priceToSqrtPriceX64(params[1], tokenADecimals!, tokenBDecimals!);
    writeBN128LE(buffer, lowerPrice, 0);
    writeBN128LE(buffer, upperPrice, 16);
    buffer.writeUint8(params[2].toNumber(), 32);
  } else if (rebalance_type.kind == RebalanceType.PeriodicRebalance.kind) {
    writeBNUint64LE(buffer, new BN(params[0].toString()), 0);
    buffer.writeUInt16LE(params[1].toNumber(), 8);
    buffer.writeUInt16LE(params[2].toNumber(), 10);
  } else if (rebalance_type.kind == RebalanceType.Expander.kind) {
    buffer.writeUInt16LE(params[0].toNumber(), 0);
    buffer.writeUInt16LE(params[1].toNumber(), 2);
    buffer.writeUInt16LE(params[2].toNumber(), 4);
    buffer.writeUInt16LE(params[3].toNumber(), 6);
    buffer.writeUInt16LE(params[4].toNumber(), 8);
    buffer.writeUInt16LE(params[5].toNumber(), 10);
    buffer.writeUInt8(params[6].toNumber(), 12);
  } else if (rebalance_type.kind == RebalanceType.Autodrift.kind) {
    buffer.writeUInt32LE(params[0].toNumber(), 0);
    buffer.writeInt32LE(params[1].toNumber(), 4);
    buffer.writeInt32LE(params[2].toNumber(), 8);
    buffer.writeUInt16LE(params[3].toNumber(), 12);
    buffer.writeUInt8(params[4].toNumber(), 14);
    buffer.writeUInt8(params[5].toNumber(), 15);
    buffer.writeUInt8(params[6].toNumber(), 16);
  } else {
    throw 'Rebalance type not valid ' + rebalance_type;
  }
  return [...buffer];
}

export function doesStrategyHaveResetRange(rebalanceTypeNumber: number): boolean {
  let rebalanceType = numberToRebalanceType(rebalanceTypeNumber);
  return (
    rebalanceType.kind == RebalanceType.PricePercentageWithReset.kind ||
    rebalanceType.kind == RebalanceType.Expander.kind
  );
}

export function numberToDriftDirection(value: number): DriftDirectionKind {
  if (value == 0) {
    return new DriftDirection.Increasing();
  } else if (value == 1) {
    return new DriftDirection.Decreasing();
  } else {
    throw new Error(`Invalid drift direction ${value.toString()}`);
  }
}

export function numberToStakingRateSource(value: number): StakingRateSourceKind {
  if (value == 0) {
    return new StakingRateSource.Constant();
  } else if (value == 1) {
    return new StakingRateSource.Scope();
  } else {
    throw new Error(`Invalid staking rate source ${value.toString()}`);
  }
}

export function numberToAutodriftStep(value: number): RebalanceAutodriftStepKind {
  if (value == 0) {
    return new RebalanceAutodriftStep.Uninitialized();
  } else if (value == 1) {
    return new RebalanceAutodriftStep.Autodrifting();
  } else {
    throw new Error(`Invalid autodrift step ${value.toString()}`);
  }
}

export function numberToRebalanceType(rebalance_type: number): RebalanceTypeKind {
  if (rebalance_type == 0) {
    return new RebalanceType.Manual();
  } else if (rebalance_type == 1) {
    return new RebalanceType.PricePercentage();
  } else if (rebalance_type == 2) {
    return new RebalanceType.PricePercentageWithReset();
  } else if (rebalance_type == 3) {
    return new RebalanceType.Drift();
  } else if (rebalance_type == 4) {
    return new RebalanceType.TakeProfit();
  } else if (rebalance_type == 5) {
    return new RebalanceType.PeriodicRebalance();
  } else if (rebalance_type == 6) {
    return new RebalanceType.Expander();
  } else if (rebalance_type == 7) {
    return new RebalanceType.Autodrift();
  } else {
    throw new Error(`Invalid rebalance type ${rebalance_type.toString()}`);
  }
}

export async function getUpdateStrategyConfigIx(
  signer: PublicKey,
  globalConfig: PublicKey,
  strategy: PublicKey,
  mode: StrategyConfigOptionKind,
  amount: Decimal,
  newAccount: PublicKey = PublicKey.default
): Promise<TransactionInstruction> {
  let args: UpdateStrategyConfigArgs = {
    mode: mode.discriminator,
    value: getStrategyConfigValue(amount),
  };

  let accounts: UpdateStrategyConfigAccounts = {
    adminAuthority: signer,
    newAccount,
    globalConfig,
    strategy,
    systemProgram: SystemProgram.programId,
  };

  return updateStrategyConfig(args, accounts);
}

export function collToLamportsDecimal(amount: Decimal, decimals: number): Decimal {
  let factor = new Decimal(10).pow(decimals);
  return amount.mul(factor);
}

export function lamportsToNumberDecimal(amount: Decimal.Value, decimals: number): Decimal {
  const factor = new Decimal(10).pow(decimals);
  return new Decimal(amount).div(factor);
}

export function readBigUint128LE(buffer: Buffer, offset: number): bigint {
  return buffer.readBigUInt64LE(offset) + (buffer.readBigUInt64LE(offset + 8) << BigInt(64));
}

export function readPriceOption(buffer: Buffer, offset: number): [number, Decimal] {
  if (buffer.readUint8(offset) == 0) {
    return [offset + 1, new Decimal(0)];
  }
  let value = buffer.readBigUInt64LE(offset + 1);
  let exp = buffer.readBigUInt64LE(offset + 9);
  return [offset + 17, new Decimal(value.toString()).div(new Decimal(10).pow(exp.toString()))];
}

function writeBNUint64LE(buffer: Buffer, value: BN, offset: number) {
  const lower_half = value.maskn(64).toBuffer('le');
  buffer.set(lower_half, offset);
}

function writeBN128LE(buffer: Buffer, value: BN, offset: number) {
  const lower_half = value.maskn(64).toBuffer('le');
  const upper_half = value.shrn(64).toBuffer('le');
  buffer.set(lower_half, offset);
  buffer.set(upper_half, offset + 8);
}

export function rebalanceFieldsDictToInfo(rebalanceFields: RebalanceFieldsDict): RebalanceFieldInfo[] {
  let rebalanceFieldsInfo: RebalanceFieldInfo[] = [];
  for (let key in rebalanceFields) {
    let value = rebalanceFields[key];
    rebalanceFieldsInfo.push({
      label: key,
      type: 'number',
      value: value,
      enabled: false,
    });
  }
  return rebalanceFieldsInfo;
}

export function isVaultInitialized(vault: PublicKey, decimals: BN): boolean {
  return !vault.equals(PublicKey.default) && decimals.toNumber() > 0;
}

export function sqrtPriceToPrice(sqrtPrice: BN, dexNo: number, decimalsA: number, decimalsB: number): Decimal {
  let dex = numberToDex(dexNo);
  if (dex == 'ORCA') {
    return sqrtPriceX64ToPrice(sqrtPrice, decimalsA, decimalsB);
  }
  if (dex == 'RAYDIUM') {
    return SqrtPriceMath.sqrtPriceX64ToPrice(sqrtPrice, decimalsA, decimalsB);
  }
  if (dex == 'METEORA') {
    let price = new Decimal(sqrtPrice.toString());
    return price.div(new Decimal(U64_MAX));
  }
  throw new Error(`Got invalid dex number ${dex}`);
}

// Zero is not a valid TWAP component as that indicates the SOL price
export function stripTwapZeros(chain: number[]): number[] {
  return chain.filter((component) => component > 0);
}

export function percentageToBPS(pct: number): number {
  return pct * 100;
}
