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

export type DeployedPool = {
  pool: PublicKey;
  tokenMintA: PublicKey;
  tokenMintB: PublicKey;
  admin: PublicKey;
};
