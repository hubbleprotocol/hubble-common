import { PROGRAM_ID as RAYDIUM_PROGRAM_ID } from '../src/raydium_client/programId';
import * as anchor from '@project-serum/anchor';
import { PublicKey, Connection, SystemProgram, Transaction, Keypair } from '@solana/web3.js';
import * as RaydiumInstructions from '../src/raydium_client/instructions';
import {
  sendTransactionWithLogs,
  TOKEN_PROGRAM_ID,
} from '../src';
import { accountExist, DeployedPool, getTickArrayPubkeysFromRange } from './utils';
import { SqrtPriceMath, TickMath } from '@raydium-io/raydium-sdk';
import Decimal from 'decimal.js';;
import { PoolState } from '../src/raydium_client';
import { i32ToBytes, TickUtils } from '@raydium-io/raydium-sdk';
import { BN } from 'bn.js';

export const OBSERVATION_STATE_LEN = 52121;
export const AMM_CONFIG_SEED = Buffer.from(anchor.utils.bytes.utf8.encode('amm_config'));
export const POOL_SEED = Buffer.from(anchor.utils.bytes.utf8.encode('pool'));
export const POOL_VAULT_SEED = Buffer.from(anchor.utils.bytes.utf8.encode('pool_vault'));

export async function initializeRaydiumPool(
  connection: Connection,
  signer: Keypair,
  tickSize: number,
  tokenMintA: PublicKey,
  tokenMintB: PublicKey,
  configAcc?: PublicKey,
  observationAcc?: PublicKey,
  initialPrice: number = 1.0
): Promise<DeployedPool> {
  let config = PublicKey.default;
  if (configAcc) {
    config = configAcc;
  } else {
    let [configPk, _] = await getAmmConfigAddress(0, RAYDIUM_PROGRAM_ID);
    if (!(await accountExist(connection, configPk))) {
      await createAmmConfig(connection, signer, configPk, 0, tickSize, 100, 200, 400);
    }

    config = configPk;
  }

  let observation = PublicKey.default;
  if (observationAcc) {
    observation = observationAcc;
  } else {
    const observationPk = new Keypair();
    observation = observationPk.publicKey;
    {
      const createObvIx = SystemProgram.createAccount({
        fromPubkey: signer.publicKey,
        newAccountPubkey: observationPk.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(OBSERVATION_STATE_LEN),
        space: OBSERVATION_STATE_LEN,
        programId: RAYDIUM_PROGRAM_ID,
      });

      const tx = new Transaction();
      let { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.add(createObvIx);

      const txHash = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer, observationPk]);
      console.log('Initialize Observer:', txHash);
    }
  }

  let sqrtPriceX64InitialPrice = SqrtPriceMath.priceToSqrtPriceX64(new Decimal(initialPrice), 6, 6);

  let tokens = orderMints(tokenMintA, tokenMintB);
  tokenMintA = tokens[0];
  tokenMintB = tokens[1];

  const [poolAddress, _bump1] = await getPoolAddress(config, tokenMintA, tokenMintB, RAYDIUM_PROGRAM_ID);

  const [tokenAVault, _bump2] = await getPoolVaultAddress(poolAddress, tokenMintA, RAYDIUM_PROGRAM_ID);
  const [tokenBVault, _bump3] = await getPoolVaultAddress(poolAddress, tokenMintB, RAYDIUM_PROGRAM_ID);

  {
    let createPoolArgs: RaydiumInstructions.CreatePoolArgs = {
      sqrtPriceX64: sqrtPriceX64InitialPrice,
      openTime: new BN(1684953391), // not relevant, it has to be a timestamp < current timestamp
    };
    let createPoolAccounts: RaydiumInstructions.CreatePoolAccounts = {
      poolCreator: signer.publicKey,
      ammConfig: config,
      poolState: poolAddress,
      tokenMint0: tokenMintA,
      tokenMint1: tokenMintB,
      tokenVault0: tokenAVault,
      tokenVault1: tokenBVault,
      observationState: observation,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    };

    const tx = new Transaction();
    let initializeTx = RaydiumInstructions.createPool(createPoolArgs, createPoolAccounts);
    tx.add(initializeTx);

    let sig = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer]);
    console.log('Initialize Raydium pool: ', sig);
  }

  let deployedPool: DeployedPool = {
    pool: poolAddress,
    tokenMintA,
    tokenMintB,
    admin: signer.publicKey,
  };
  return deployedPool;
}

export async function getAmmConfigAddress(index: number, programId: PublicKey): Promise<[PublicKey, number]> {
  const [address, bump] = await PublicKey.findProgramAddress([AMM_CONFIG_SEED, u16ToBytes(index)], programId);
  console.log('config address ', address.toString());
  return [address, bump];
}

export function u16ToBytes(num: number) {
  const arr = new ArrayBuffer(2);
  const view = new DataView(arr);
  view.setUint16(0, num, false);
  return new Uint8Array(arr);
}

async function createAmmConfig(
  connection: Connection,
  signer: Keypair,
  config: PublicKey,
  index: number,
  tickSpacing: number,
  tradeFeeRate: number,
  protocolFeeRate: number,
  fundFeeRate: number
) {
  let initConfigArgs: RaydiumInstructions.CreateAmmConfigArgs = {
    index: index,
    tickSpacing: tickSpacing,
    tradeFeeRate: tradeFeeRate,
    protocolFeeRate: protocolFeeRate,
    fundFeeRate: fundFeeRate,
  };
  let initConfigAccounts: RaydiumInstructions.CreateAmmConfigAccounts = {
    owner: signer.publicKey,
    ammConfig: config,
    systemProgram: anchor.web3.SystemProgram.programId,
  };

  const tx = new Transaction();
  let initializeTx = RaydiumInstructions.createAmmConfig(initConfigArgs, initConfigAccounts);
  let { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = signer.publicKey;
  tx.add(initializeTx);

  let sig = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer]);
  console.log('InitializeConfig:', sig);
}

export function orderMints(mintX: PublicKey, mintY: PublicKey): [PublicKey, PublicKey] {
  let mintA, mintB;
  if (Buffer.compare(mintX.toBuffer(), mintY.toBuffer()) < 0) {
    mintA = mintX;
    mintB = mintY;
  } else {
    mintA = mintY;
    mintB = mintX;
  }

  return [mintA, mintB];
}

export async function getPoolAddress(
  ammConfig: PublicKey,
  tokenMint0: PublicKey,
  tokenMint1: PublicKey,
  programId: PublicKey
): Promise<[PublicKey, number]> {
  const [address, bump] = await PublicKey.findProgramAddress(
    [POOL_SEED, ammConfig.toBuffer(), tokenMint0.toBuffer(), tokenMint1.toBuffer()],
    programId
  );
  return [address, bump];
}

export async function getPoolVaultAddress(
  pool: PublicKey,
  vaultTokenMint: PublicKey,
  programId: PublicKey
): Promise<[PublicKey, number]> {
  const [address, bump] = await PublicKey.findProgramAddress(
    [POOL_VAULT_SEED, pool.toBuffer(), vaultTokenMint.toBuffer()],
    programId
  );
  return [address, bump];
}

export async function getTickArrayPubkeysFromRangeRaydium(
  connection: Connection,
  pool: PublicKey,
  tickLowerIndex: number,
  tickUpperIndex: number
) {
  let poolState = await PoolState.fetch(connection, pool);
  if (poolState == null) {
    throw new Error(`Error fetching ${poolState}`);
  }

  let startTickIndex = TickUtils.getTickArrayStartIndexByTick(tickLowerIndex, poolState.tickSpacing);
  let endTickIndex = TickUtils.getTickArrayStartIndexByTick(tickUpperIndex, poolState.tickSpacing);

  const [startTickIndexPk, _startTickIndexBump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('tick_array'), pool.toBuffer(), i32ToBytes(startTickIndex)],
    RAYDIUM_PROGRAM_ID
  );
  const [endTickIndexPk, _endTickIndexBump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('tick_array'), pool.toBuffer(), i32ToBytes(endTickIndex)],
    RAYDIUM_PROGRAM_ID
  );

  return [startTickIndexPk, endTickIndexPk];
}
