import { PublicKey, SystemProgram, TransactionInstruction } from '@solana/web3.js';
import { WhirlpoolStrategy } from '../kamino-client/accounts';
import { WHIRLPOOL_PROGRAM_ID } from '../whirpools-client/programId';
import { PROGRAM_ID as RAYDIUM_PROGRAM_ID } from '../raydium_client/programId';
import Decimal from 'decimal.js';
import { RebalanceType, RebalanceTypeKind, StrategyConfigOptionKind } from '../kamino-client/types';
import {
  UpdateStrategyConfigAccounts,
  UpdateStrategyConfigArgs,
  updateStrategyConfig,
} from '../kamino-client/instructions';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const Dex = ['ORCA', 'RAYDIUM', 'CREMA'] as const;
export type Dex = (typeof Dex)[number];

export function dexToNumber(dex: Dex): number {
  for (let i = 0; i < Dex.length; i++) {
    if (Dex[i] === dex) {
      return i;
    }
  }

  throw new Error(`Unknown DEX ${dex}`);
}

export function getDexProgramId(strategyState: WhirlpoolStrategy): PublicKey {
  if (strategyState.strategyDex.toNumber() == dexToNumber('ORCA')) {
    return WHIRLPOOL_PROGRAM_ID;
  } else if (strategyState.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
    return RAYDIUM_PROGRAM_ID;
  } else {
    throw Error(`Invalid DEX ${strategyState.strategyDex.toString()}`);
  }
}

export function getStrategyConfigValue(value: Decimal): number[] {
  let buffer = Buffer.alloc(128);
  buffer.writeBigUInt64LE(BigInt(value.toString()));
  return [...buffer];
}

export function getStrategyRebalanceParams(params: Array<Decimal>, rebalance_type: RebalanceTypeKind): number[] {
  let buffer = Buffer.alloc(128);
  if (rebalance_type.kind == RebalanceType.Manual.kind) {
    // Manual has no params
  } else if (rebalance_type.kind == RebalanceType.PricePercentage.kind) {
    buffer.writeUint16LE(params[0].toNumber());
    buffer.writeUint16LE(params[1].toNumber(), 2);
  } else {
    throw 'Rebalance type not valid ' + rebalance_type;
  }
  return [...buffer];
}

export function numberToRebalanceType(rebalance_type: number): RebalanceTypeKind {
  if (rebalance_type == 0) {
    return new RebalanceType.Manual();
  } else if (rebalance_type == 1) {
    return new RebalanceType.PricePercentage();
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
