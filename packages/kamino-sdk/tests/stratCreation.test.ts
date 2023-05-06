import {
  Account,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  VersionedTransaction,
} from '@solana/web3.js';
import {
  createAddExtraComputeUnitsTransaction,
  Dex,
  getReadOnlyWallet,
  Kamino,
  numberToRebalanceType,
  sendTransactionWithLogs,
  sleep,
  StrategiesFilters,
} from '../src';
import Decimal from 'decimal.js';
import {
  assignBlockInfoToTransaction,
  createTransactionWithExtraBudget,
  getAssociatedTokenAddressAndData,
} from '../src';
import * as Instructions from '../src/kamino-client/instructions';
import {
  GlobalConfigOption,
  GlobalConfigOptionKind,
  RebalanceType,
  UpdateCollateralInfoMode,
} from '../src/kamino-client/types';
import BN from 'bn.js';
import { initializeRaydiumPool, orderMints } from './raydium_utils';
import { initializeWhirlpool } from './orca_utils';
import {
  createMint,
  createUser,
  DEFAULT_MAX_PRICE_AGE,
  getCollInfoEncodedName,
  mintTo,
  updateCollateralInfo,
  updateStrategyConfig,
  updateTreasuryFeeVault,
  solAirdrop,
} from './utils';
import {
  UpdateRebalanceType,
  UpdateStrategyCreationState,
  UpdateStrategyType,
} from '../src/kamino-client/types/StrategyConfigOption';
import { expect } from 'chai';
import { WHIRLPOOL_PROGRAM_ID } from '../src/whirpools-client/programId';
import * as ed25519 from 'tweetnacl-ts';
import { Provider } from '@project-serum/anchor';
import { PROGRAM_ID as RAYDIUM_PROGRAM_ID } from '../src/raydium_client/programId';
import { Manual, PricePercentage } from '../src/kamino-client/types/RebalanceType';
const GlobalConfigMainnet = new PublicKey('GKnHiWh3RRrE1zsNzWxRkomymHc374TvJPSTv2wPeYdB');
const KaminoProgramIdMainnet = new PublicKey('6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc');
const SOLMintMainnet = new PublicKey('So11111111111111111111111111111111111111112');
const USDCMintMainnet = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

describe('Kamino strategy creation SDK Tests', () => {
  let connection: Connection;
  const cluster = 'mainnet-beta';
  const clusterUrl: string = 'https://api.mainnet-beta.solana.com';
  connection = new Connection(clusterUrl, 'processed');

  // use your private key here
  const signerPrivateKey = [];
  const signer = Keypair.fromSecretKey(Uint8Array.from(signerPrivateKey));

  it.skip('create new manual strategy on existing whirlpool', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    const newStrategy = Keypair.generate();
    const createRaydiumStrategyAccountIx = await kamino.createStrategyAccount(signer.publicKey, newStrategy.publicKey);
    console.log('newStrategy.publicKey', newStrategy.publicKey.toString());

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      'ORCA',
      new Decimal(0.0005),
      newStrategy.publicKey,
      signer.publicKey,
      new Decimal(Manual.discriminator),
      [], // not needed used for manual
      SOLMintMainnet,
      USDCMintMainnet
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createRaydiumStrategyAccountIx);
    ixs.push(buildNewStrategyIxs[0]);
    const createStratTx = await kamino.getTransactionV2Message(signer.publicKey, ixs);
    const createStratTransactionV0 = new VersionedTransaction(createStratTx);
    createStratTransactionV0.sign([newStrategy, signer]);
    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, createStratTransactionV0);
    console.log('create strategy tx hash', txHash);

    let strategySetupIxs: TransactionInstruction[] = [];

    buildNewStrategyIxs[1].slice(0, 4).map((ix) => strategySetupIxs.push(ix));
    const setupStratTx = await kamino.getTransactionV2Message(signer.publicKey, strategySetupIxs);
    const setupStratTransactionV0 = new VersionedTransaction(setupStratTx);
    setupStratTransactionV0.sign([signer]);

    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, setupStratTransactionV0);
    console.log('setup strategy tx hash', txHash);

    let strategySetupFeesIxs: TransactionInstruction[] = [];
    console.log(' buildNewStrategyIxs[1].length()', buildNewStrategyIxs[1].length);
    buildNewStrategyIxs[1].slice(4).map((ix) => strategySetupFeesIxs.push(ix));
    strategySetupFeesIxs.push(buildNewStrategyIxs[2]);
    const setupStratFeesTx = await kamino.getTransactionV2Message(signer.publicKey, strategySetupFeesIxs);
    const setupStratFeesTransactionV0 = new VersionedTransaction(setupStratFeesTx);
    setupStratFeesTransactionV0.sign([signer]);
    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, setupStratFeesTransactionV0);
    console.log('setup strategy fees tx hash', txHash);

    // after strategy creation we have to set the reward mappings so it autocompounds
    let updateRewardMappingIxs = kamino.getUpdateRewardsIxs(signer.publicKey, newStrategy.publicKey);
  });

  it.skip('create new percentage strategy on existing whirlpool', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    const newStrategy = Keypair.generate();
    const createRaydiumStrategyAccountIx = await kamino.createStrategyAccount(signer.publicKey, newStrategy.publicKey);
    console.log('newStrategy.publicKey', newStrategy.publicKey.toString());

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      'ORCA',
      new Decimal(0.0005),
      newStrategy.publicKey,
      signer.publicKey,
      new Decimal(PricePercentage.discriminator),
      [new Decimal(100.0), new Decimal(100.0)],
      SOLMintMainnet,
      USDCMintMainnet
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createRaydiumStrategyAccountIx);
    ixs.push(buildNewStrategyIxs[0]);
    const createStratTx = await kamino.getTransactionV2Message(signer.publicKey, ixs);
    const createStratTransactionV0 = new VersionedTransaction(createStratTx);
    createStratTransactionV0.sign([newStrategy, signer]);
    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, createStratTransactionV0);
    console.log('create strategy tx hash', txHash);

    let strategySetupIxs: TransactionInstruction[] = [];
    buildNewStrategyIxs[1].slice(0, 4).map((ix) => strategySetupIxs.push(ix));
    const setupStratTx = await kamino.getTransactionV2Message(signer.publicKey, strategySetupIxs);
    const setupStratTransactionV0 = new VersionedTransaction(setupStratTx);
    setupStratTransactionV0.sign([signer]);

    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, setupStratTransactionV0);
    console.log('setup strategy tx hash', txHash);

    let strategySetupFeesIxs: TransactionInstruction[] = [];
    buildNewStrategyIxs[1].slice(4).map((ix) => strategySetupFeesIxs.push(ix));
    strategySetupFeesIxs.push(buildNewStrategyIxs[2]);
    const setupStratFeesTx = await kamino.getTransactionV2Message(signer.publicKey, strategySetupFeesIxs);
    const setupStratFeesTransactionV0 = new VersionedTransaction(setupStratFeesTx);
    setupStratFeesTransactionV0.sign([signer]);
    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, setupStratFeesTransactionV0);
    console.log('setup strategy fees tx hash', txHash);
  });

  it.skip('create new percentage strategy on existing whirlpool', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    const newStrategy = Keypair.generate();
    const createRaydiumStrategyAccountIx = await kamino.createStrategyAccount(signer.publicKey, newStrategy.publicKey);
    console.log('newStrategy.publicKey', newStrategy.publicKey.toString());

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      'ORCA',
      new Decimal(0.0005),
      newStrategy.publicKey,
      signer.publicKey,
      new Decimal(PricePercentage.discriminator),
      [new Decimal(100.0), new Decimal(100.0)],
      SOLMintMainnet,
      USDCMintMainnet
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createRaydiumStrategyAccountIx);
    ixs.push(buildNewStrategyIxs[0]);
    const createStratTx = await kamino.getTransactionV2Message(signer.publicKey, ixs);
    const createStratTransactionV0 = new VersionedTransaction(createStratTx);
    createStratTransactionV0.sign([newStrategy, signer]);
    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, createStratTransactionV0);
    console.log('create strategy tx hash', txHash);

    let strategySetupIxs: TransactionInstruction[] = [];
    buildNewStrategyIxs[1].slice(0, 4).map((ix) => strategySetupIxs.push(ix));
    const setupStratTx = await kamino.getTransactionV2Message(signer.publicKey, strategySetupIxs);
    const setupStratTransactionV0 = new VersionedTransaction(setupStratTx);
    setupStratTransactionV0.sign([signer]);

    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, setupStratTransactionV0);
    console.log('setup strategy tx hash', txHash);

    let strategySetupFeesIxs: TransactionInstruction[] = [];
    buildNewStrategyIxs[1].slice(4).map((ix) => strategySetupFeesIxs.push(ix));
    strategySetupFeesIxs.push(buildNewStrategyIxs[2]);
    const setupStratFeesTx = await kamino.getTransactionV2Message(signer.publicKey, strategySetupFeesIxs);
    const setupStratFeesTransactionV0 = new VersionedTransaction(setupStratFeesTx);
    setupStratFeesTransactionV0.sign([signer]);
    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, setupStratFeesTransactionV0);
    console.log('setup strategy fees tx hash', txHash);

    // update rebalance params
    let updateRebalanceParamsIx = await kamino.getUpdateRebalancingParmsIxns(signer.publicKey, newStrategy.publicKey, [
      new Decimal(10.0),
      new Decimal(24.0),
    ]);
    let tx = createTransactionWithExtraBudget(signer.publicKey);
    tx.add(updateRebalanceParamsIx);
    let updateRebalanceParamsTxHash = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer]);
    console.log('update Rebalance Params Tx Hash ', updateRebalanceParamsTxHash);

    let strategyData = await kamino.getStrategies([newStrategy.publicKey]);
    expect(strategyData[0]?.rebalanceRaw[0] == 10.0);
    expect(strategyData[0]?.rebalanceRaw[2] == 24.0);

    // update rebalance method to manual
    await updateStrategyConfig(
      connection,
      signer,
      newStrategy.publicKey,
      new UpdateRebalanceType(),
      new Decimal(Manual.discriminator)
    );

    strategyData = await kamino.getStrategies([newStrategy.publicKey]);
    expect(strategyData[0]?.rebalanceType == Manual.discriminator);
  });
});
