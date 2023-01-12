import { PROGRAM_ID_CLI as RAYDIUM_PROGRAM_ID } from '../src/raydium_client/programId';
import { Idl, Program, Provider } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import {
  PublicKey,
  AccountInfo,
  Connection,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
  Keypair,
} from '@solana/web3.js';
import * as RaydiumInstructions from '../src/raydium_client/instructions';
import { sendTransactionWithLogs, TOKEN_PROGRAM_ID } from '../src';
import { accountExist, DeployedPool } from './utils';
import { getMintDecimals } from '@project-serum/serum/lib/market';
import { LiquidityMath, SqrtPriceMath, TickMath } from '@raydium-io/raydium-sdk/lib/ammV3/utils/math';
import Decimal from 'decimal.js';
import { ExecutiveWithdrawActionKind } from '../src/kamino-client/types';
import { WhirlpoolStrategy } from '../src/kamino-client/accounts';

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
  console.log('beginning');
  let config = PublicKey.default;
  if (configAcc) {
    console.log('config is present');
    config = configAcc;
  } else {
    let [configPk, index] = await getAmmConfigAddress(0, RAYDIUM_PROGRAM_ID);
    if (!(await accountExist(connection, configPk))) {
      console.log('try to create config');
      await createAmmConfig(connection, signer, configPk, 0, tickSize, 100, 200, 400);
    }

    config = configPk;
  }

  console.log('after config creation');

  let observation = PublicKey.default;
  if (observationAcc) {
    console.log('observation is present');
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
  let decimalsA = await getMintDecimals(connection, tokenMintA);
  let decimalsB = await getMintDecimals(connection, tokenMintB);

  let sqrtPriceX64InitialPrice = SqrtPriceMath.priceToSqrtPriceX64(new Decimal(initialPrice), 6, 6);

  let tokens = orderMints(tokenMintA, tokenMintB);
  tokenMintA = tokens[0];
  tokenMintB = tokens[1];

  const [poolAddress, _bump1] = await getPoolAddress(config, tokenMintA, tokenMintB, RAYDIUM_PROGRAM_ID);

  const [tokenAVault, _bump2] = await getPoolVaultAddress(poolAddress, tokenMintA, RAYDIUM_PROGRAM_ID);
  const [tokenBVault, _bump3] = await getPoolVaultAddress(poolAddress, tokenMintB, RAYDIUM_PROGRAM_ID);

  console.log('before create pool tx');
  {
    let createPoolArgs: RaydiumInstructions.CreatePoolArgs = {
      sqrtPriceX64: sqrtPriceX64InitialPrice,
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
  console.log('in getAmmConfigAddress');
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
  console.log('in createAmmConfig');
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

  console.log('before createAmmConfig IX');
  // todo: not sure if it works, the tx may need to be signed
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

export async function openLiquidityPositionRaydium(
  connection: Connection,
  strategy: PublicKey,
  priceLower: Decimal,
  priceUpper: Decimal
) {
  let positionMint = Keypair.generate();
}

export async function openLiquidityPositionRaydiumIx(
  connection: Connection,
  strategy: PublicKey,
  positionMint: Keypair,
  priceLower: Decimal,
  priceUpper: Decimal,
  strategyCurrentState?: ExecutiveWithdrawActionKind
): Promise<[anchor.web3.TransactionInstruction, PublicKey, PublicKey, PublicKey, PublicKey]> {
  let strategyState = await WhirlpoolStrategy.fetch(connection, strategy);
  if (strategyState == null) {
    throw new Error(`strategy ${strategy} doesn't exist`);
  }

  let poolState: PoolState = await PoolState.fetch(env.provider.connection, strategyState.pool);
}
