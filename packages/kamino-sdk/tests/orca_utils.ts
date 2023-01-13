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
import { DeployedPool, range } from './utils';
import * as WhirlpoolInstructions from '../src/whirpools-client/instructions';
import * as anchor from '@project-serum/anchor';
import { sendTransactionWithLogs, TOKEN_PROGRAM_ID } from '../src';
import { PROGRAM_ID_CLI as WHIRLPOOL_PROGRAM_ID } from '../src/whirpools-client/programId';
import { orderMints } from './raydium_utils';
import Decimal from 'decimal.js';
import { getStartTickIndex, priceToSqrtX64 } from '@orca-so/whirlpool-sdk';
import { Whirlpool } from '../src/whirpools-client/accounts';

export async function initializeWhirlpool(
  connection: Connection,
  signer: Keypair,
  tickSize: number,
  tokenMintA: PublicKey,
  tokenMintB: PublicKey
): Promise<DeployedPool> {
  let config = Keypair.generate();

  {
    let initialiseConfigArgs: WhirlpoolInstructions.InitializeConfigArgs = {
      feeAuthority: signer.publicKey,
      collectProtocolFeesAuthority: signer.publicKey,
      rewardEmissionsSuperAuthority: signer.publicKey,
      defaultProtocolFeeRate: 0,
    };

    let initialiseConfigAccounts: WhirlpoolInstructions.InitializeConfigAccounts = {
      config: config.publicKey,
      funder: signer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    };

    const tx = new Transaction();
    let initializeIx = WhirlpoolInstructions.initializeConfig(initialiseConfigArgs, initialiseConfigAccounts);
    tx.add(initializeIx);

    let sig = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer, config]);
    console.log('InitializeConfig:', sig);
  }

  const [feeTierPk, feeTierBump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('fee_tier'), config.publicKey.toBuffer(), new anchor.BN(tickSize).toArrayLike(Buffer, 'le', 2)],
    WHIRLPOOL_PROGRAM_ID
  );

  {
    let initialiseFeeTierArgs: WhirlpoolInstructions.InitializeFeeTierArgs = {
      tickSpacing: tickSize,
      defaultFeeRate: 0,
    };

    let initialiseFeeTierAccounts: WhirlpoolInstructions.InitializeFeeTierAccounts = {
      config: config.publicKey,
      feeTier: feeTierPk,
      funder: signer.publicKey,
      feeAuthority: signer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    };

    const tx = new Transaction();
    let initializeIx = WhirlpoolInstructions.initializeFeeTier(initialiseFeeTierArgs, initialiseFeeTierAccounts);
    tx.add(initializeIx);

    let sig = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer]);
    console.log('InitializeFeeTier:', sig);
  }

  let tokens = orderMints(tokenMintA, tokenMintB);
  tokenMintA = tokens[0];
  tokenMintB = tokens[1];

  const [whirlpool, whirlpoolBump] = await getWhirlpool(
    WHIRLPOOL_PROGRAM_ID,
    config.publicKey,
    tokenMintA,
    tokenMintB,
    tickSize
  );

  {
    let tokenAVault = Keypair.generate();
    let tokenBVault = Keypair.generate();

    let initialPrice = 1.0;
    let initialisePoolArgs: WhirlpoolInstructions.InitializePoolArgs = {
      tickSpacing: tickSize,
      bumps: { whirlpoolBump: whirlpoolBump },
      initialSqrtPrice: new anchor.BN(priceToSqrtX64(new Decimal(initialPrice), 6, 6)),
    };

    let initializePoolAccounts: WhirlpoolInstructions.InitializePoolAccounts = {
      whirlpoolsConfig: config.publicKey,
      tokenMintA: tokenMintA,
      tokenMintB: tokenMintB,
      funder: signer.publicKey,
      whirlpool: whirlpool,
      tokenVaultA: tokenAVault.publicKey,
      tokenVaultB: tokenBVault.publicKey,
      feeTier: feeTierPk,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    };

    const tx = new Transaction();
    let initializeIx = WhirlpoolInstructions.initializePool(initialisePoolArgs, initializePoolAccounts);
    tx.add(initializeIx);

    let sig = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer, tokenAVault, tokenBVault]);
    console.log('InitializePool:', sig);
  }

  {
    let tx = await initTickArrayForTicks(
      connection,
      signer,
      whirlpool,
      range(-300, 300, 40),
      tickSize,
      WHIRLPOOL_PROGRAM_ID
    );

    let sig = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer]);
    console.log('InitializeTickArray:', sig);
  }

  let pool: DeployedPool = {
    pool: whirlpool,
    tokenMintA,
    tokenMintB,
    admin: signer.publicKey,
  };

  return pool;
}

async function getWhirlpool(
  programId: PublicKey,
  whirlpoolsConfigKey: PublicKey,
  tokenMintAKey: PublicKey,
  tokenMintBKey: PublicKey,
  tickSpacing: number
): Promise<[anchor.web3.PublicKey, number]> {
  return anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from('whirlpool'),
      whirlpoolsConfigKey.toBuffer(),
      tokenMintAKey.toBuffer(),
      tokenMintBKey.toBuffer(),
      new anchor.BN(tickSpacing).toArrayLike(Buffer, 'le', 2),
    ],
    programId
  );
}

export async function initTickArrayForTicks(
  connection: Connection,
  signer: Keypair,
  whirlpool: PublicKey,
  ticks: number[],
  tickSpacing: number,
  programId: PublicKey
): Promise<Transaction> {
  const startTicks = ticks.map((tick) => getStartTickIndex(tick, tickSpacing));
  const tx = new Transaction();
  const initializedArrayTicks: number[] = [];

  startTicks.forEach(async (startTick) => {
    if (initializedArrayTicks.includes(startTick)) {
      return;
    }
    initializedArrayTicks.push(startTick);
    let initIx = await initTickArrayInstruction(signer, whirlpool, startTick, programId);

    tx.add(initIx);
  });
  return tx;
}

export async function initTickArrayInstruction(
  signer: Keypair,
  whirlpool: PublicKey,
  startTick: number,
  programId: PublicKey
): Promise<TransactionInstruction> {
  const [tickArrayPda, _tickArrayPdaBump] = await getTickArray(programId, whirlpool, startTick);

  let initTickArrayArgs: WhirlpoolInstructions.InitializeTickArrayArgs = {
    startTickIndex: startTick,
  };
  let initTickArrayAccounts: WhirlpoolInstructions.InitializeTickArrayAccounts = {
    whirlpool: whirlpool,
    funder: signer.publicKey,
    tickArray: tickArrayPda,
    systemProgram: anchor.web3.SystemProgram.programId,
  };
  return WhirlpoolInstructions.initializeTickArray(initTickArrayArgs, initTickArrayAccounts);
}

async function getTickArray(
  programId: PublicKey,
  whirlpoolAddress: PublicKey,
  startTick: number
): Promise<[anchor.web3.PublicKey, number]> {
  return anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('tick_array'), whirlpoolAddress.toBuffer(), Buffer.from(startTick.toString())],
    programId
  );
}

export async function getTickArrayPubkeysFromRangeOrca(
  connection: Connection,
  whirlpool: PublicKey,
  tickLowerIndex: number,
  tickUpperIndex: number
) {
  let whirlpoolState = await Whirlpool.fetch(connection, whirlpool);
  if (whirlpoolState == null) {
    throw new Error(`Raydium Pool ${whirlpool} doesn't exist`);
  }

  let startTickIndex = getStartTickIndex(tickLowerIndex, whirlpoolState.tickSpacing, 0);
  let endTickIndex = getStartTickIndex(tickUpperIndex, whirlpoolState.tickSpacing, 0);

  const [startTickIndexPk, _startTickIndexBump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('tick_array'), whirlpool.toBuffer(), Buffer.from(startTickIndex.toString())],
    WHIRLPOOL_PROGRAM_ID
  );
  const [endTickIndexPk, _endTickIndexBump] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from('tick_array'), whirlpool.toBuffer(), Buffer.from(endTickIndex.toString())],
    WHIRLPOOL_PROGRAM_ID
  );
  return [startTickIndexPk, endTickIndexPk];
}
