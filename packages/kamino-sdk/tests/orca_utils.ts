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
import { DeployedPool } from './utils';
import * as WhirlpoolInstructions from '../src/whirpools-client/instructions';
import * as anchor from '@project-serum/anchor';
import { sendTransactionWithLogs, TOKEN_PROGRAM_ID } from '../src';
import { PROGRAM_ID_CLI as WHIRLPOOL_PROGRAM_ID } from '../src/whirpools-client/programId';
import { orderMints } from './raydium_utils';

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

    // let initialPrice = 1.0;
    // let initialisePoolArgs: WhirlpoolInstructions.InitializePoolArgs = {
    //   tickSpacing: tickSize,
    //   bumps: { whirlpoolBump: whirlpoolBump },
    //   initialSqrtPrice: new anchor.BN(priceToSqrtX64(new Decimal(initialPrice), 6, 6)),
    // };

    // let initializePoolAccounts: WhirlpoolInstructions.InitializePoolAccounts = {
    //   whirlpoolsConfig: config.publicKey,
    //   tokenMintA: tokenMintA,
    //   tokenMintB: tokenMintB,
    //   funder: signer.publicKey,
    //   whirlpool: whirlpool,
    //   tokenVaultA: tokenAVault.publicKey,
    //   tokenVaultB: tokenBVault.publicKey,
    //   feeTier: feeTierPk,
    //   tokenProgram: TOKEN_PROGRAM_ID,
    //   systemProgram: anchor.web3.SystemProgram.programId,
    //   rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    // };

    // const tx = new Transaction();
    // let initializeIx = WhirlpoolInstructions.initializePool(initialisePoolArgs, initializePoolAccounts);
    // tx.add(initializeIx);

    // let sig = await sendAndConfirmTransaction(env.provider.connection, signed, [
    //   env.initialMarketOwner,
    //   tokenAVault,
    //   tokenBVault,
    // ]);
    // console.log('InitializePool:', sig);
  }
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
  
