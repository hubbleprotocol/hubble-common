import { PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';

export async function deployWhirlpool(wallet: PublicKey) {
  let tickSize = 1;
}

import { Idl, Program, web3 } from '@project-serum/anchor';

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

export type DeployedPool = {
  pool: PublicKey;
  tokenMintA: PublicKey;
  tokenMintB: PublicKey;
  admin: PublicKey;
};
