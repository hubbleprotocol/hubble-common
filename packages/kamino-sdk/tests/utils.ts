import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import {
  ExecutiveWithdrawAction,
  ExecutiveWithdrawActionKind,
  GlobalConfigOptionKind,
  StrategyConfigOptionKind,
} from '../src/kamino-client/types';
import * as Instructions from '../src/kamino-client/instructions';
import {
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

export async function deployWhirlpool(wallet: PublicKey) {
  let tickSize = 1;
}

import { Idl, Program, web3 } from '@project-serum/anchor';
import Decimal from 'decimal.js';
import { Whirlpool, WhirlpoolStrategy } from '../src/kamino-client/accounts';
import { Dex, dexToNumber, sendTransactionWithLogs } from '../src';
import { getTickArrayPubkeysFromRangeRaydium, openLiquidityPositionRaydium } from './raydium_utils';
import { getTickArrayPubkeysFromRangeOrca } from './orca_utils';
import { Key } from 'readline';

export async function accountExist(connection: anchor.web3.Connection, account: anchor.web3.PublicKey) {
  console.log('in account exitst');
  const info = await connection.getAccountInfo(account);
  if (info == null || info.data.length == 0) {
    console.log('account exists returns false');
    return false;
  }
  console.log('account exists returns true');
  return true;
}

export function range(start: number, end: number, step: number): number[] {
  if (end === start || step === 0) {
    return [start];
  }
  if (step < 0) {
    step = -step;
  }

  const stepNumOfDecimal = step.toString().split('.')[1]?.length || 0;
  const endNumOfDecimal = end.toString().split('.')[1]?.length || 0;
  const maxNumOfDecimal = Math.max(stepNumOfDecimal, endNumOfDecimal);
  const power = Math.pow(10, maxNumOfDecimal);
  const diff = Math.abs(end - start);
  const count = Math.trunc(diff / step + 1);
  step = end - start > 0 ? step : -step;

  const intStart = Math.trunc(start * power);
  return Array.from(Array(count).keys()).map((x) => {
    const increment = Math.trunc(x * step * power);
    const value = intStart + increment;
    return Math.trunc(value) / power;
  });
}

export async function updateStrategyConfig(
  connection: Connection,
  signer: Keypair,
  strategy: PublicKey,
  mode: StrategyConfigOptionKind,
  amount: Decimal,
  newAccount: PublicKey = PublicKey.default
) {
  let args: Instructions.UpdateStrategyConfigArgs = {
    mode: mode.discriminator,
    value: new anchor.BN(amount.toString()),
  };

  let strategyState = await WhirlpoolStrategy.fetch(connection, strategy);
  if (strategyState == null) {
    throw new Error(`strategy ${strategy} doesn't exist`);
  }

  let accounts: Instructions.UpdateStrategyConfigAccounts = {
    adminAuthority: signer.publicKey,
    newAccount,
    globalConfig: strategyState.globalConfig,
    strategy,
    systemProgram: anchor.web3.SystemProgram.programId,
  };

  const tx = new Transaction();
  let updateCapIx = Instructions.updateStrategyConfig(args, accounts);
  tx.add(updateCapIx);

  let sig = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer]);
  console.log('Update Strategy Config ', mode.toJSON(), sig?.toString());
}

export async function openLiquidityPosition(
  connection: Connection,
  signer: Keypair,
  strategy: PublicKey,
  priceLower: Decimal,
  priceUpper: Decimal
) {
  let strategyState = await WhirlpoolStrategy.fetch(connection, strategy);
  if (strategyState == null) {
    throw new Error(`strategy ${strategy} doesn't exist`);
  }
  if (strategyState.strategyDex.toNumber() == dexToNumber('ORCA')) {
    openLiquidityPositionOrca(connection, signer, strategy, priceLower, priceUpper);
  } else if (strategyState.strategyDex.toNumber() == dexToNumber('RAYDIUM')) {
    openLiquidityPositionRaydium(connection, signer, strategy, priceLower, priceUpper);
  } else {
    throw new Error(`Invalid dex ${strategyState.strategyDex.toString()}`);
  }
}

export async function getTickArrayPubkeysFromRange(
  connection: Connection,
  dex: Dex,
  pool: PublicKey,
  tickLowerIndex: number,
  tickUpperIndex: number
) {
  if (dex == 'ORCA') {
    return getTickArrayPubkeysFromRangeOrca(connection, pool, tickLowerIndex, tickUpperIndex);
  } else if (dex == 'RAYDIUM') {
    return getTickArrayPubkeysFromRangeRaydium(connection, pool, tickLowerIndex, tickUpperIndex);
  } else {
    throw new Error('Invalid dex');
  }
}

export type DeployedPool = {
  pool: PublicKey;
  tokenMintA: PublicKey;
  tokenMintB: PublicKey;
  admin: PublicKey;
};
