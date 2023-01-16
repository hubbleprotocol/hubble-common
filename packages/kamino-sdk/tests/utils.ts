import { Connection, Keypair, PublicKey, Account } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import {
  CollateralToken,
  ExecutiveWithdrawAction,
  ExecutiveWithdrawActionKind,
  GlobalConfigOptionKind,
  StrategyConfigOptionKind,
} from '../src/kamino-client/types';
import * as Instructions from '../src/kamino-client/instructions';
import {
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { NATIVE_MINT, Token } from '@solana/spl-token';
import { getMintDecimals } from '@project-serum/serum/lib/market';
import * as serumCmn from '@project-serum/common';

export async function deployWhirlpool(wallet: PublicKey) {
  let tickSize = 1;
}

import { Idl, Program, web3 } from '@project-serum/anchor';
import Decimal from 'decimal.js';
import { Whirlpool, WhirlpoolStrategy } from '../src/kamino-client/accounts';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Dex,
  dexToNumber,
  getAssociatedTokenAddress,
  sendTransactionWithLogs,
  sleep,
  TOKEN_PROGRAM_ID,
} from '../src';
import { getTickArrayPubkeysFromRangeRaydium, openLiquidityPositionRaydium } from './raydium_utils';
import { getTickArrayPubkeysFromRangeOrca, openLiquidityPositionOrca } from './orca_utils';
import { Key } from 'readline';
import { TokenInstructions } from '@project-serum/serum';

const GLOBAL_CONFIG_SIZE = 26832;

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

export async function createUser(
  connection: Connection,
  signer: Keypair,
  strategy: PublicKey,
  solAirdropAmount: Decimal,
  aAirdropAmount: Decimal,
  bAirdropAmount: Decimal,
  user?: Keypair
): Promise<User> {
  let wallet = new anchor.Wallet(signer);
  const provider = new anchor.Provider(connection, wallet, anchor.Provider.defaultOptions());
  if (!user) {
    user = new anchor.web3.Keypair();
  }

  if (solAirdropAmount.gt(0)) {
    await solAirdrop(connection, provider, user.publicKey, solAirdropAmount);
    await sleep(1000);
  }

  let whirlpoolStrategyState = await WhirlpoolStrategy.fetch(connection, strategy);
  if (whirlpoolStrategyState == null) {
    throw new Error(`Strategy ${strategy.toString()} does not exist`);
  }

  const aAta = await setupAta(connection, whirlpoolStrategyState.tokenAMint, user);
  const bAta = await setupAta(connection, whirlpoolStrategyState.tokenBMint, user);
  const sharesAta = await setupAta(connection, whirlpoolStrategyState.sharesMint, user);

  let tokenADecimals = await getMintDecimals(connection, whirlpoolStrategyState.tokenAMint);
  let tokenBDecimals = await getMintDecimals(connection, whirlpoolStrategyState.tokenBMint);

  await sleep(2000); // TODO: remove this, ataAccount isn't read by createMintToInstr.
  if (aAirdropAmount.gt(0)) {
    await mintTo(
      connection,
      signer,
      whirlpoolStrategyState.tokenAMint,
      aAta,
      collToLamportsDecimal(aAirdropAmount, tokenADecimals).toNumber()
    );
  }
  if (bAirdropAmount.gt(0)) {
    await mintTo(
      connection,
      signer,
      whirlpoolStrategyState.tokenBMint,
      bAta,
      collToLamportsDecimal(bAirdropAmount, tokenBDecimals).toNumber()
    );
  }

  const testingUser: User = {
    tokenAAta: aAta,
    tokenBAta: bAta,
    sharesAta,
    owner: user,
  };
  return testingUser;
}

export async function solAirdrop(
  connection: Connection,
  provider: anchor.Provider,
  account: PublicKey,
  solAirdrop: Decimal
): Promise<Decimal> {
  const airdropTxnId = await connection.requestAirdrop(account, collToLamportsDecimal(solAirdrop, 9).toNumber());
  await connection.confirmTransaction(airdropTxnId);
  return await getSolBalance(provider, account);
}

export async function mintTo(
  connection: Connection,
  signer: Keypair,
  mintPubkey: PublicKey,
  tokenAccount: PublicKey,
  amount: number
) {
  const tx = new Transaction().add(
    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
      mintPubkey, // mint
      tokenAccount, // receiver (sholud be a token account)
      signer.publicKey, // mint authority
      [], // only multisig account will use. leave it empty now.
      amount // amount. if your decimals is 8, you mint 10^8 for 1 token.
    )
  );

  await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer]);
}

export async function setupAta(connection: Connection, tokenMintAddress: PublicKey, user: Keypair): Promise<PublicKey> {
  const ata = await getAssociatedTokenAddress(user.publicKey, tokenMintAddress);
  if (!(await checkIfAccountExists(connection, ata))) {
    const ix = await createAtaInstruction(user.publicKey, tokenMintAddress, ata);
    const tx = new Transaction().add(ix);
    await connection.sendTransaction(tx, [user]);
  }
  return ata;
}

export async function checkIfAccountExists(connection: Connection, account: PublicKey): Promise<boolean> {
  return (await connection.getAccountInfo(account)) != null;
}

export async function createAtaInstruction(
  owner: PublicKey,
  tokenMintAddress: PublicKey,
  ata: PublicKey
): Promise<TransactionInstruction> {
  return await Token.createAssociatedTokenAccountInstruction(
    ASSOCIATED_TOKEN_PROGRAM_ID, // always ASSOCIATED_TOKEN_PROGRAM_ID
    TOKEN_PROGRAM_ID, // always TOKEN_PROGRAM_ID
    tokenMintAddress, // mint
    ata, // ata
    owner, // owner of token account
    owner // fee payer
  );
}

export async function solAirdropMin(
  provider: anchor.Provider,
  account: PublicKey,
  minSolAirdrop: Decimal
): Promise<Decimal> {
  const airdropBatchAmount = Decimal.max(50, minSolAirdrop);
  let currentBalance = await getSolBalance(provider, account);
  while (currentBalance.lt(minSolAirdrop)) {
    try {
      await provider.connection.requestAirdrop(account, collToLamportsDecimal(airdropBatchAmount, 9).toNumber());
    } catch (e) {
      await sleep(100);
      console.log('Error', e);
    }
    await sleep(100);
    currentBalance = await getSolBalance(provider, account);
  }
  return currentBalance;
}

export async function getSolBalance(provider: anchor.Provider, account: PublicKey): Promise<Decimal> {
  const balance = new Decimal(await getSolBalanceInLamports(provider, account));
  return lamportsToCollDecimal(balance, 9);
}

export async function getSolBalanceInLamports(provider: anchor.Provider, account: PublicKey): Promise<number> {
  let balance: number | undefined = undefined;
  while (balance === undefined) {
    balance = (await provider.connection.getAccountInfo(account))?.lamports;
  }

  return balance;
}

export function lamportsToCollDecimal(amount: Decimal, decimals: number): Decimal {
  let factor = Math.pow(10, decimals);
  return amount.div(factor);
}

export async function createMint(connection: Connection, signer: Keypair, decimals: number = 6): Promise<PublicKey> {
  const mint = anchor.web3.Keypair.generate();
  return await createMintFromKeypair(connection, signer, mint, decimals);
}

export async function createMintFromKeypair(
  connection: Connection,
  signer: Keypair,
  mint: Keypair,
  decimals: number = 6
): Promise<PublicKey> {
  const instructions = await createMintInstructions(connection, signer, mint.publicKey, decimals);

  const tx = new anchor.web3.Transaction();
  tx.add(...instructions);

  await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer, mint]);
  return mint.publicKey;
}

async function createMintInstructions(
  connection: Connection,
  signer: Keypair,
  mint: PublicKey,
  decimals: number
): Promise<TransactionInstruction[]> {
  return [
    anchor.web3.SystemProgram.createAccount({
      fromPubkey: signer.publicKey,
      newAccountPubkey: mint,
      space: 82,
      lamports: await connection.getMinimumBalanceForRentExemption(82),
      programId: TOKEN_PROGRAM_ID,
    }),
    TokenInstructions.initializeMint({
      mint,
      decimals,
      mintAuthority: signer.publicKey,
    }),
  ];
}

export function collToLamportsDecimal(amount: Decimal, decimals: number): Decimal {
  let factor = Math.pow(10, decimals);
  return amount.mul(factor);
}

export type DeployedPool = {
  pool: PublicKey;
  tokenMintA: PublicKey;
  tokenMintB: PublicKey;
  admin: PublicKey;
};

export interface User {
  owner: Keypair;
  tokenAAta: PublicKey;
  tokenBAta: PublicKey;
  sharesAta: PublicKey;
}
