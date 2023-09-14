import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  TransactionInstruction,
  VersionedTransaction,
} from '@solana/web3.js';
import {
  Dex,
  DriftRebalanceTypeName,
  ExpanderRebalanceTypeName,
  Kamino,
  ManualRebalanceTypeName,
  PeriodicRebalanceTypeName,
  PricePercentageRebalanceTypeName,
  PricePercentageWithResetRebalanceTypeName,
  TakeProfitRebalanceTypeName,
} from '../src';
import Decimal from 'decimal.js';
import { GlobalConfigMainnet, KaminoProgramIdMainnet } from './utils';
import { expect } from 'chai';
import { WHIRLPOOL_PROGRAM_ID } from '../src/whirpools-client/programId';
import { PROGRAM_ID as RAYDIUM_PROGRAM_ID } from '../src/raydium_client/programId';
import {
  Drift,
  Expander,
  Manual,
  PeriodicRebalance,
  PricePercentage,
  PricePercentageWithReset,
  TakeProfit,
} from '../src/kamino-client/types/RebalanceType';
import { getComputeBudgetAndPriorityFeeIxns } from '../src/utils/transactions';
import { POOL, TWAP } from '../src/kamino-client/types/ReferencePriceType';
import { MAINNET_GLOBAL_LOOKUP_TABLE } from '../src/constants/pubkeys';

describe('Kamino strategy creation SDK Tests', () => {
  let connection: Connection;
  const cluster = 'mainnet-beta';

  const clusterUrl: string = 'https://api.mainnet-beta.solana.com';

  connection = new Connection(clusterUrl, 'processed');

  // use your private key here
  const signerPrivateKey = [];
  const signer = Keypair.fromSecretKey(Uint8Array.from(signerPrivateKey));

  it.skip('build manual strategy Raydium SOL-USDC', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    const newStrategy = Keypair.generate();
    let newPosition = Keypair.generate();
    const createRaydiumStrategyAccountIx = await kamino.createStrategyAccount(signer.publicKey, newStrategy.publicKey);
    console.log('newStrategy.publicKey', newStrategy.publicKey.toString());

    let priceLower = new Decimal(15.0);
    let priceUpper = new Decimal(21.0);
    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      'RAYDIUM',
      new Decimal('5'),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(Manual.discriminator),
      [priceLower, priceUpper],
      new PublicKey('So11111111111111111111111111111111111111112'),
      new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createRaydiumStrategyAccountIx);
    ixs.push(buildNewStrategyIxs[0]);
    console.log('ixs', ixs.length);
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

    // after strategy creation we have to set the reward mappings so it autocompounds
    let updateRewardMappingIxs = await kamino.getUpdateRewardsIxs(signer.publicKey, newStrategy.publicKey);
    console.log('updateRewardMappingIxs', updateRewardMappingIxs.length);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    for (let ix of updateRewardMappingIxs) {
      const updateRewardMappingTx = await kamino.getTransactionV2Message(
        signer.publicKey,
        [ix[0]],
        [strategyLookupTable]
      );
      const updateRewardMappingsTransactionV0 = new VersionedTransaction(updateRewardMappingTx);
      updateRewardMappingsTransactionV0.sign([signer, ix[1]]);
      //@ts-ignore
      txHash = await sendAndConfirmTransaction(kamino._connection, updateRewardMappingsTransactionV0);
      console.log('setup strategy reward mapping', txHash);
    }

    // open position
    const openPositionIxn = buildNewStrategyIxs[3];
    const openPositionMessage = await kamino.getTransactionV2Message(signer.publicKey, [
      ...getComputeBudgetAndPriorityFeeIxns(1_400_000),
      openPositionIxn,
    ]);
    const openPositionTx = new VersionedTransaction(openPositionMessage);
    openPositionTx.sign([signer, newPosition]);

    //@ts-ignore
    const openPositionTxId = await sendAndConfirmTransaction(kamino._connection, openPositionTx);
    console.log('openPositionTxId', openPositionTxId);

    let stratFields = await kamino.readRebalancingParams(newStrategy.publicKey);
    expect(stratFields.length == 3);
    expect(stratFields[0]['label'] == 'rebalanceType');
    expect(stratFields[0]['value'] == ManualRebalanceTypeName);
    expect(stratFields[1]['label'] == 'priceLower');
    expect(stratFields[1]['value'].toString() == priceLower.toString());
    expect(stratFields[2]['label'] == 'priceUpper');
    expect(stratFields[2]['value'] == priceUpper.toString());

    // update the rebalance params with new values; in the UI these should come from the user
    let newPriceLower = new Decimal(17.3);
    let newPriceUpper = new Decimal(30.0);
    let newPriceLowerInput = { label: 'priceLower', value: newPriceLower };
    let newPriceUpperInput = { label: 'priceUpper', value: newPriceUpper };
    const updateStratFields = kamino.updateRebalanceFieldInfos(stratFields, [newPriceLowerInput, newPriceUpperInput]);

    expect(updateStratFields.length == 3);
    expect(updateStratFields[0]['label'] == 'rebalanceType');
    expect(updateStratFields[0]['value'] == ManualRebalanceTypeName);
    expect(updateStratFields[1]['label'] == 'priceLower');
    expect(updateStratFields[1]['value'].toString() == newPriceLower.toString());
    expect(updateStratFields[2]['label'] == 'priceUpper');
    expect(updateStratFields[2]['value'] == newPriceUpper.toString());

    let updateStratIx = await kamino.getUpdateRebalancingParamsFromRebalanceFieldsIx(
      signer.publicKey,
      newStrategy.publicKey,
      updateStratFields
    );

    const updateStratTx = await kamino.getTransactionV2Message(signer.publicKey, [updateStratIx]);
    const updateStratTransactionV0 = new VersionedTransaction(updateStratTx);
    updateStratTransactionV0.sign([signer]);
    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, updateStratTransactionV0);
    console.log('update strategy rebalance params tx hash', txHash);

    // rebalance with new range
    newPosition = Keypair.generate();
    const rebalanceIxns = await kamino.rebalance(
      newStrategy.publicKey,
      newPosition.publicKey,
      newPriceLower,
      newPriceUpper,
      signer.publicKey
    );
    const rebalanceMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...getComputeBudgetAndPriorityFeeIxns(1_400_000), ...rebalanceIxns],
      [MAINNET_GLOBAL_LOOKUP_TABLE, strategyLookupTable]
    );
    const rebalanceTx = new VersionedTransaction(rebalanceMessage);
    rebalanceTx.sign([signer, newPosition]);

    //@ts-ignore
    const rebalanceTxId = await sendAndConfirmTransaction(kamino._connection, rebalanceTx);
    console.log('rebalanceTxId', rebalanceTxId);

    stratFields = await kamino.readRebalancingParams(newStrategy.publicKey);
    expect(stratFields.length == 3);
    expect(stratFields[0]['label'] == 'rebalanceType');
    expect(stratFields[0]['value'] == ManualRebalanceTypeName);
    expect(stratFields[1]['label'] == 'priceLower');
    expect(stratFields[1]['value'].toString() == newPriceLower.toString());
    expect(stratFields[2]['label'] == 'priceUpper');
    expect(stratFields[2]['value'] == newPriceUpper.toString());
  });

  it.skip('build percentage strategy Orca SOL-USDC', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    const newStrategy = Keypair.generate();
    let newPosition = Keypair.generate();
    const createStrategyAccountIx = await kamino.createStrategyAccount(signer.publicKey, newStrategy.publicKey);
    console.log('newStrategy.publicKey', newStrategy.publicKey.toString());

    let lowerRangeBPS = new Decimal(200.0);
    let upperRangeBPS = new Decimal(300.0);
    let dex: Dex = 'ORCA';
    let tokenAMint = new PublicKey('So11111111111111111111111111111111111111112');
    let tokenBMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      dex,
      new Decimal('5'),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(PricePercentage.discriminator),
      [lowerRangeBPS, upperRangeBPS],
      tokenAMint,
      tokenBMint
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createStrategyAccountIx);
    ixs.push(buildNewStrategyIxs[0]);
    console.log('ixs', ixs.length);
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

    // after strategy creation we have to set the reward mappings so it autocompounds
    let updateRewardMappingIxs = await kamino.getUpdateRewardsIxs(signer.publicKey, newStrategy.publicKey);
    console.log('updateRewardMappingIxs', updateRewardMappingIxs.length);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    for (let ix of updateRewardMappingIxs) {
      const updateRewardMappingTx = await kamino.getTransactionV2Message(
        signer.publicKey,
        [ix[0]],
        [strategyLookupTable]
      );
      const updateRewardMappingsTransactionV0 = new VersionedTransaction(updateRewardMappingTx);
      updateRewardMappingsTransactionV0.sign([signer, ix[1]]);
      //@ts-ignore
      txHash = await sendAndConfirmTransaction(kamino._connection, updateRewardMappingsTransactionV0);
      console.log('setup strategy reward mapping', txHash);
    }

    // open position
    const openPositionIxn = buildNewStrategyIxs[3];
    const openPositionMessage = await kamino.getTransactionV2Message(signer.publicKey, [
      ...getComputeBudgetAndPriorityFeeIxns(1_400_000),
      openPositionIxn,
    ]);
    const openPositionTx = new VersionedTransaction(openPositionMessage);
    openPositionTx.sign([signer, newPosition]);

    //@ts-ignore
    const openPositionTxId = await sendAndConfirmTransaction(kamino._connection, openPositionTx);
    console.log('openPositionTxId', openPositionTxId);

    let poolPrice = new Decimal(await kamino.getPriceForPair('ORCA', tokenAMint, tokenBMint));

    let stratFields = await kamino.readRebalancingParams(newStrategy.publicKey);
    console.log("stratFields[3]['value'].toString()", stratFields[3]['value'].toString());
    console.log("stratFields[4]['value'].toString()", stratFields[4]['value'].toString());

    expect(stratFields.length == 5).to.be.true;
    expect(stratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(stratFields[0]['value'] == PricePercentageRebalanceTypeName).to.be.true;
    expect(stratFields[1]['label'] == 'lowerRangeBps').to.be.true;
    expect(stratFields[1]['value'].toString() == lowerRangeBPS.toString()).to.be.true;
    expect(stratFields[2]['label'] == 'upperRangeBps').to.be.true;
    expect(stratFields[2]['value'] == upperRangeBPS.toString()).to.be.true;
    expect(stratFields[3]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(stratFields[3]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[4]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(stratFields[4]['value'].toString()).greaterThan(poolPrice)).to.be.true;

    // update the rebalance params with new values; in the UI these should come from the user
    let newLowerRangeBPS = new Decimal(800.0);
    let newUpperRangeBPS = new Decimal(1000.0);
    let newPriceLowerRangeBPSInput = { label: 'lowerRangeBps', value: newLowerRangeBPS };
    let newPriceUpperRangeBPSInput = { label: 'upperRangeBps', value: newUpperRangeBPS };
    const updateStratFields = kamino.updateRebalanceFieldInfos(stratFields, [
      newPriceLowerRangeBPSInput,
      newPriceUpperRangeBPSInput,
    ]);

    expect(updateStratFields.length == 5).to.be.true;
    expect(updateStratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(updateStratFields[0]['value'] == PricePercentageRebalanceTypeName).to.be.true;
    expect(updateStratFields[1]['label'] == 'lowerRangeBps').to.be.true;
    expect(updateStratFields[1]['value'].toString() == newLowerRangeBPS.toString()).to.be.true;
    expect(updateStratFields[2]['label'] == 'upperRangeBps').to.be.true;
    expect(updateStratFields[2]['value'] == newUpperRangeBPS.toString()).to.be.true;
    expect(updateStratFields[3]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(updateStratFields[3]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(updateStratFields[4]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(updateStratFields[4]['value'].toString()).greaterThan(poolPrice)).to.be.true;

    let updateStratIx = await kamino.getUpdateRebalancingParamsFromRebalanceFieldsIx(
      signer.publicKey,
      newStrategy.publicKey,
      updateStratFields
    );

    const updateStratTx = await kamino.getTransactionV2Message(signer.publicKey, [updateStratIx]);
    const updateStratTransactionV0 = new VersionedTransaction(updateStratTx);
    updateStratTransactionV0.sign([signer]);
    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, updateStratTransactionV0);
    console.log('update strategy rebalance params tx hash', txHash);

    // rebalance with new range; the range is calculated using `getFieldsForRebalanceMethod` as it returns the range for all strategies
    // if `rebalanceMethod` is available it can be used directly, otherwise we can get it from the fields
    let rebalanceMethod = kamino.getRebalanceMethodFromRebalanceFields(updateStratFields);

    // read the pool price so we calculate the position based on the exact pool price; this is needed when the rebalance strategy relies on pool price
    poolPrice = await kamino.getCurrentPrice(newStrategy.publicKey);
    let updatedAllRebalanceFieldInfos = await kamino.getFieldsForRebalanceMethod(
      rebalanceMethod,
      dex,
      updateStratFields,
      tokenAMint,
      tokenBMint,
      poolPrice
    );

    let newPriceLower = new Decimal(updatedAllRebalanceFieldInfos.find((field) => field.label === 'priceLower')!.value);
    let newPriceUpper = new Decimal(updatedAllRebalanceFieldInfos.find((field) => field.label === 'priceUpper')!.value);
    console.log('newPriceLower.toString()', newPriceLower.toString());
    console.log('newPriceUpper.toString()', newPriceUpper.toString());

    newPosition = Keypair.generate();
    const rebalanceIxns = await kamino.rebalance(
      newStrategy.publicKey,
      newPosition.publicKey,
      newPriceLower,
      newPriceUpper,
      signer.publicKey
    );
    const rebalanceMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...getComputeBudgetAndPriorityFeeIxns(1_400_000), ...rebalanceIxns],
      [MAINNET_GLOBAL_LOOKUP_TABLE, strategyLookupTable]
    );
    const rebalanceTx = new VersionedTransaction(rebalanceMessage);
    rebalanceTx.sign([signer, newPosition]);

    //@ts-ignore
    const rebalanceTxId = await sendAndConfirmTransaction(kamino._connection, rebalanceTx);
    console.log('rebalanceTxId', rebalanceTxId);

    stratFields = await kamino.readRebalancingParams(newStrategy.publicKey);
    console.log("stratFields[3]['value'].toString()", stratFields[3]['value'].toString());
    console.log("stratFields[4]['value'].toString()", stratFields[4]['value'].toString());

    expect(stratFields.length == 5).to.be.true;
    expect(stratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(stratFields[0]['value'] == PricePercentageRebalanceTypeName).to.be.true;
    expect(stratFields[1]['label'] == 'lowerRangeBps').to.be.true;
    expect(stratFields[1]['value'].toString() == newLowerRangeBPS.toString()).to.be.true;
    expect(stratFields[2]['label'] == 'upperRangeBps').to.be.true;
    expect(stratFields[2]['value'] == newUpperRangeBPS.toString()).to.be.true;
    expect(stratFields[3]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(stratFields[3]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[4]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(stratFields[4]['value'].toString()).greaterThan(poolPrice)).to.be.true;
  });

  it.skip('build percentage with reset range Orca SOL-USDC', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    const newStrategy = Keypair.generate();
    let newPosition = Keypair.generate();
    const createStrategyAccountIx = await kamino.createStrategyAccount(signer.publicKey, newStrategy.publicKey);
    console.log('newStrategy.publicKey', newStrategy.publicKey.toString());

    let lowerRangeBPS = new Decimal(1000.0);
    let upperRangeBPS = new Decimal(2000.0);
    let resetLowerRangeBPS = new Decimal(500.0);
    let resetUpperRangeBPS = new Decimal(300.0);

    let tokenAMint = new PublicKey('So11111111111111111111111111111111111111112');
    let tokenBMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    let dex: Dex = 'ORCA';

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      dex,
      new Decimal('5'),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(PricePercentageWithReset.discriminator),
      [lowerRangeBPS, upperRangeBPS, resetLowerRangeBPS, resetUpperRangeBPS],
      tokenAMint,
      tokenBMint
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createStrategyAccountIx);
    ixs.push(buildNewStrategyIxs[0]);
    console.log('ixs', ixs.length);
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

    // after strategy creation we have to set the reward mappings so it autocompounds
    let updateRewardMappingIxs = await kamino.getUpdateRewardsIxs(signer.publicKey, newStrategy.publicKey);
    console.log('updateRewardMappingIxs', updateRewardMappingIxs.length);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    for (let ix of updateRewardMappingIxs) {
      const updateRewardMappingTx = await kamino.getTransactionV2Message(
        signer.publicKey,
        [ix[0]],
        [strategyLookupTable]
      );
      const updateRewardMappingsTransactionV0 = new VersionedTransaction(updateRewardMappingTx);
      updateRewardMappingsTransactionV0.sign([signer, ix[1]]);
      //@ts-ignore
      txHash = await sendAndConfirmTransaction(kamino._connection, updateRewardMappingsTransactionV0);
      console.log('setup strategy reward mapping', txHash);
    }

    // open position
    const openPositionIxn = buildNewStrategyIxs[3];
    const openPositionMessage = await kamino.getTransactionV2Message(signer.publicKey, [
      ...getComputeBudgetAndPriorityFeeIxns(1_400_000),
      openPositionIxn,
    ]);
    const openPositionTx = new VersionedTransaction(openPositionMessage);
    openPositionTx.sign([signer, newPosition]);

    //@ts-ignore
    const openPositionTxId = await sendAndConfirmTransaction(kamino._connection, openPositionTx);
    console.log('openPositionTxId', openPositionTxId);

    let poolPrice = new Decimal(
      await kamino.getPriceForPair(
        'ORCA',
        new PublicKey('So11111111111111111111111111111111111111112'),
        new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
      )
    );

    let stratFields = await kamino.readRebalancingParams(newStrategy.publicKey);

    console.log('price lower', stratFields[5]['value'].toString());
    console.log('price upper', stratFields[6]['value'].toString());
    console.log('reset price upper', stratFields[7]['value'].toString());
    console.log('reset price upper', stratFields[8]['value'].toString());

    expect(stratFields.length == 9).to.be.true;
    expect(stratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(stratFields[0]['value'] == PricePercentageWithResetRebalanceTypeName).to.be.true;
    expect(stratFields[1]['label'] == 'lowerRangeBps').to.be.true;
    expect(stratFields[1]['value'].toString() == lowerRangeBPS.toString()).to.be.true;
    expect(stratFields[2]['label'] == 'upperRangeBps').to.be.true;
    expect(stratFields[2]['value'].toString() == upperRangeBPS.toString()).to.be.true;
    expect(stratFields[3]['label'] == 'resetLowerRangeBps').to.be.true;
    expect(stratFields[3]['value'].toString() == resetLowerRangeBPS.toString()).to.be.true;
    expect(stratFields[4]['label'] == 'resetUpperRangeBps').to.be.true;
    expect(stratFields[4]['value'].toString() == resetUpperRangeBPS.toString()).to.be.true;
    expect(stratFields[5]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(stratFields[5]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[6]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(stratFields[6]['value'].toString()).greaterThan(poolPrice)).to.be.true;
    expect(stratFields[7]['label'] == 'resetPriceLower').to.be.true;
    expect(new Decimal(stratFields[7]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[8]['label'] == 'resetPriceUpper').to.be.true;
    expect(new Decimal(stratFields[8]['value'].toString()).greaterThan(poolPrice)).to.be.true;

    // update the rebalance params with new values; in the UI these should come from the user
    let newLowerRangeBPS = new Decimal(500.0);
    let newUpperRangeBPS = new Decimal(700.0);
    let newResetLowerRangeBPS = new Decimal(1000.0);
    let newResetUpperRangeBPS = new Decimal(2000.0);
    let newPriceLowerRangeBPSInput = { label: 'lowerRangeBps', value: newLowerRangeBPS };
    let newPriceUpperRangeBPSInput = { label: 'upperRangeBps', value: newUpperRangeBPS };
    let newResetPriceLowerRangeBPSInput = { label: 'resetLowerRangeBps', value: newResetLowerRangeBPS };
    let newResetPriceUpperRangeBPSInput = { label: 'resetUpperRangeBps', value: newResetUpperRangeBPS };

    const updateStratFields = kamino.updateRebalanceFieldInfos(stratFields, [
      newPriceLowerRangeBPSInput,
      newPriceUpperRangeBPSInput,
      newResetPriceLowerRangeBPSInput,
      newResetPriceUpperRangeBPSInput,
    ]);

    expect(updateStratFields.length == 9).to.be.true;
    expect(updateStratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(updateStratFields[0]['value'] == PricePercentageWithResetRebalanceTypeName).to.be.true;
    expect(updateStratFields[1]['label'] == 'lowerRangeBps').to.be.true;
    expect(updateStratFields[1]['value'].toString() == newLowerRangeBPS.toString()).to.be.true;
    expect(updateStratFields[2]['label'] == 'upperRangeBps').to.be.true;
    expect(updateStratFields[2]['value'].toString() == newUpperRangeBPS.toString()).to.be.true;
    expect(updateStratFields[3]['label'] == 'resetLowerRangeBps').to.be.true;
    expect(updateStratFields[3]['value'].toString() == newResetLowerRangeBPS.toString()).to.be.true;
    expect(updateStratFields[4]['label'] == 'resetUpperRangeBps').to.be.true;
    expect(updateStratFields[4]['value'].toString() == newResetUpperRangeBPS.toString()).to.be.true;
    expect(updateStratFields[5]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(updateStratFields[5]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(updateStratFields[6]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(updateStratFields[6]['value'].toString()).greaterThan(poolPrice)).to.be.true;
    expect(updateStratFields[7]['label'] == 'resetPriceLower').to.be.true;
    expect(new Decimal(updateStratFields[7]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(updateStratFields[8]['label'] == 'resetPriceUpper').to.be.true;
    expect(new Decimal(stratFields[8]['value'].toString()).greaterThan(poolPrice)).to.be.true;

    let updateStratIx = await kamino.getUpdateRebalancingParamsFromRebalanceFieldsIx(
      signer.publicKey,
      newStrategy.publicKey,
      updateStratFields
    );

    const updateStratTx = await kamino.getTransactionV2Message(signer.publicKey, [updateStratIx]);
    const updateStratTransactionV0 = new VersionedTransaction(updateStratTx);
    updateStratTransactionV0.sign([signer]);
    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, updateStratTransactionV0);
    console.log('update strategy rebalance params tx hash', txHash);

    let rebalanceMethod = kamino.getRebalanceMethodFromRebalanceFields(updateStratFields);
    // read the pool price so we calculate the position based on the exact pool price; this is needed when the rebalance strategy relies on pool price
    poolPrice = await kamino.getCurrentPrice(newStrategy.publicKey);
    let updatedAllRebalanceFieldInfos = await kamino.getFieldsForRebalanceMethod(
      rebalanceMethod,
      dex,
      updateStratFields,
      tokenAMint,
      tokenBMint,
      poolPrice
    );
    let newPriceLower = new Decimal(updatedAllRebalanceFieldInfos.find((field) => field.label === 'priceLower')!.value);
    let newPriceUpper = new Decimal(updatedAllRebalanceFieldInfos.find((field) => field.label === 'priceUpper')!.value);
    newPosition = Keypair.generate();
    const rebalanceIxns = await kamino.rebalance(
      newStrategy.publicKey,
      newPosition.publicKey,
      newPriceLower,
      newPriceUpper,
      signer.publicKey
    );
    const rebalanceMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...getComputeBudgetAndPriorityFeeIxns(1_400_000), ...rebalanceIxns],
      [MAINNET_GLOBAL_LOOKUP_TABLE, strategyLookupTable]
    );
    const rebalanceTx = new VersionedTransaction(rebalanceMessage);
    rebalanceTx.sign([signer, newPosition]);

    //@ts-ignore
    const rebalanceTxId = await sendAndConfirmTransaction(kamino._connection, rebalanceTx);
    console.log('rebalanceTxId', rebalanceTxId);

    // read the updated strat fields
    stratFields = await kamino.readRebalancingParams(newStrategy.publicKey);
    expect(stratFields.length == 9).to.be.true;
    expect(stratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(stratFields[0]['value'] == PricePercentageWithResetRebalanceTypeName).to.be.true;
    expect(stratFields[1]['label'] == 'lowerRangeBps').to.be.true;
    expect(stratFields[1]['value'].toString() == newLowerRangeBPS.toString()).to.be.true;
    expect(stratFields[2]['label'] == 'upperRangeBps').to.be.true;
    expect(stratFields[2]['value'].toString() == newUpperRangeBPS.toString()).to.be.true;
    expect(stratFields[3]['label'] == 'resetLowerRangeBps').to.be.true;
    expect(stratFields[3]['value'].toString() == newResetLowerRangeBPS.toString()).to.be.true;
    expect(stratFields[4]['label'] == 'resetUpperRangeBps').to.be.true;
    expect(stratFields[4]['value'].toString() == newResetUpperRangeBPS.toString()).to.be.true;
    expect(stratFields[5]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(stratFields[5]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[6]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(stratFields[6]['value'].toString()).greaterThan(poolPrice)).to.be.true;
    expect(stratFields[7]['label'] == 'resetPriceLower').to.be.true;
    expect(new Decimal(stratFields[7]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[8]['label'] == 'resetPriceUpper').to.be.true;
  });

  it.skip('build percentage with periodic rebalance Orca SOL-USDC', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    const newStrategy = Keypair.generate();
    let newPosition = Keypair.generate();
    const createStrategyAccountIx = await kamino.createStrategyAccount(signer.publicKey, newStrategy.publicKey);
    console.log('newStrategy.publicKey', newStrategy.publicKey.toString());

    let period = new Decimal(600.0);
    let lowerRangeBPS = new Decimal(345.0);
    let upperRangeBPS = new Decimal(500.0);
    let dex: Dex = 'ORCA';
    let tokenAMint = new PublicKey('So11111111111111111111111111111111111111112');
    let tokenBMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      dex,
      new Decimal('5'),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(PeriodicRebalance.discriminator),
      [period, lowerRangeBPS, upperRangeBPS],
      tokenAMint,
      tokenBMint
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createStrategyAccountIx);
    ixs.push(buildNewStrategyIxs[0]);
    console.log('ixs', ixs.length);
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

    // after strategy creation we have to set the reward mappings so it autocompounds
    let updateRewardMappingIxs = await kamino.getUpdateRewardsIxs(signer.publicKey, newStrategy.publicKey);
    console.log('updateRewardMappingIxs', updateRewardMappingIxs.length);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    for (let ix of updateRewardMappingIxs) {
      const updateRewardMappingTx = await kamino.getTransactionV2Message(
        signer.publicKey,
        [ix[0]],
        [strategyLookupTable]
      );
      const updateRewardMappingsTransactionV0 = new VersionedTransaction(updateRewardMappingTx);
      updateRewardMappingsTransactionV0.sign([signer, ix[1]]);
      //@ts-ignore
      txHash = await sendAndConfirmTransaction(kamino._connection, updateRewardMappingsTransactionV0);
      console.log('setup strategy reward mapping', txHash);
    }

    // open position
    const openPositionIxn = buildNewStrategyIxs[3];
    const openPositionMessage = await kamino.getTransactionV2Message(signer.publicKey, [
      ...getComputeBudgetAndPriorityFeeIxns(1_400_000),
      openPositionIxn,
    ]);
    const openPositionTx = new VersionedTransaction(openPositionMessage);
    openPositionTx.sign([signer, newPosition]);

    try {
      //@ts-ignore
      const openPositionTxId = await sendAndConfirmTransaction(kamino._connection, openPositionTx);
      console.log('openPositionTxId', openPositionTxId);
    } catch (e) {
      console.log('error', e);
    }

    let poolPrice = new Decimal(await kamino.getPriceForPair('ORCA', tokenAMint, tokenBMint));

    let stratFields = await kamino.readRebalancingParams(newStrategy.publicKey);

    console.log('price lower', stratFields[4]['value'].toString());
    console.log('price upper', stratFields[5]['value'].toString());

    expect(stratFields.length == 6).to.be.true;
    expect(stratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(stratFields[0]['value'] == PeriodicRebalanceTypeName).to.be.true;
    expect(stratFields[1]['label'] == 'period').to.be.true;
    expect(stratFields[1]['value'] == period.toString()).to.be.true;
    expect(stratFields[2]['label'] == 'lowerRangeBps').to.be.true;
    expect(stratFields[2]['value'].toString() == lowerRangeBPS.toString()).to.be.true;
    expect(stratFields[3]['label'] == 'upperRangeBps').to.be.true;
    expect(stratFields[3]['value'].toString() == upperRangeBPS.toString()).to.be.true;
    expect(stratFields[4]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(stratFields[4]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[5]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(stratFields[5]['value'].toString()).greaterThan(poolPrice)).to.be.true;

    // update the rebalance params with new values; in the UI these should come from the user
    let newPeriod = new Decimal(1000.0);
    let newLowerRangeBPS = new Decimal(400.0);
    let newUpperRangeBPS = new Decimal(500.0);
    let newPriceLowerRangeBPSInput = { label: 'lowerRangeBps', value: newLowerRangeBPS };
    let newPriceUpperRangeBPSInput = { label: 'upperRangeBps', value: newUpperRangeBPS };
    let newPeriodInput = { label: 'period', value: newPeriod };
    const updateStratFields = kamino.updateRebalanceFieldInfos(stratFields, [
      newPriceLowerRangeBPSInput,
      newPriceUpperRangeBPSInput,
      newPeriodInput,
    ]);

    expect(updateStratFields.length == 6).to.be.true;
    expect(updateStratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(updateStratFields[0]['value'] == PeriodicRebalanceTypeName).to.be.true;
    expect(updateStratFields[1]['label'] == 'period').to.be.true;
    expect(updateStratFields[1]['value'] == period.toString()).to.be.true;
    expect(updateStratFields[2]['label'] == 'lowerRangeBps').to.be.true;
    expect(updateStratFields[2]['value'].toString() == lowerRangeBPS.toString()).to.be.true;
    expect(updateStratFields[3]['label'] == 'upperRangeBps').to.be.true;
    expect(updateStratFields[3]['value'].toString() == upperRangeBPS.toString()).to.be.true;
    expect(updateStratFields[4]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(updateStratFields[4]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(updateStratFields[5]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(updateStratFields[5]['value'].toString()).greaterThan(poolPrice)).to.be.true;

    let updateStratIx = await kamino.getUpdateRebalancingParamsFromRebalanceFieldsIx(
      signer.publicKey,
      newStrategy.publicKey,
      updateStratFields
    );

    const updateStratTx = await kamino.getTransactionV2Message(signer.publicKey, [updateStratIx]);
    const updateStratTransactionV0 = new VersionedTransaction(updateStratTx);
    updateStratTransactionV0.sign([signer]);
    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, updateStratTransactionV0);
    console.log('update strategy rebalance params tx hash', txHash);

    // rebalance with new range; the range is calculated using `getFieldsForRebalanceMethod` as it returns the range for all strategies
    // if `rebalanceMethod` is available it can be used directly, otherwise we can get it from the fields
    let rebalanceMethod = kamino.getRebalanceMethodFromRebalanceFields(updateStratFields);

    // read the pool price so we calculate the position based on the exact pool price; this is needed when the rebalance strategy relies on pool price
    poolPrice = await kamino.getCurrentPrice(newStrategy.publicKey);
    let updatedAllRebalanceFieldInfos = await kamino.getFieldsForRebalanceMethod(
      rebalanceMethod,
      dex,
      updateStratFields,
      tokenAMint,
      tokenBMint,
      poolPrice
    );

    let newPriceLower = new Decimal(updatedAllRebalanceFieldInfos.find((field) => field.label === 'priceLower')!.value);
    let newPriceUpper = new Decimal(updatedAllRebalanceFieldInfos.find((field) => field.label === 'priceUpper')!.value);
    console.log('newPriceLower.toString()', newPriceLower.toString());
    console.log('newPriceUpper.toString()', newPriceUpper.toString());

    newPosition = Keypair.generate();
    const rebalanceIxns = await kamino.rebalance(
      newStrategy.publicKey,
      newPosition.publicKey,
      newPriceLower,
      newPriceUpper,
      signer.publicKey
    );
    const rebalanceMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...getComputeBudgetAndPriorityFeeIxns(1_400_000), ...rebalanceIxns],
      [MAINNET_GLOBAL_LOOKUP_TABLE, strategyLookupTable]
    );
    const rebalanceTx = new VersionedTransaction(rebalanceMessage);
    rebalanceTx.sign([signer, newPosition]);

    //@ts-ignore
    const rebalanceTxId = await sendAndConfirmTransaction(kamino._connection, rebalanceTx);
    console.log('rebalanceTxId', rebalanceTxId);

    stratFields = await kamino.readRebalancingParams(newStrategy.publicKey);

    expect(stratFields.length == 6).to.be.true;
    expect(stratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(stratFields[0]['value'] == PeriodicRebalanceTypeName).to.be.true;
    expect(stratFields[1]['label'] == 'period').to.be.true;
    expect(stratFields[1]['value'] == period.toString()).to.be.true;
    expect(stratFields[2]['label'] == 'lowerRangeBps').to.be.true;
    expect(stratFields[2]['value'].toString() == lowerRangeBPS.toString()).to.be.true;
    expect(stratFields[3]['label'] == 'upperRangeBps').to.be.true;
    expect(stratFields[3]['value'].toString() == upperRangeBPS.toString()).to.be.true;
    expect(stratFields[4]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(stratFields[4]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[5]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(stratFields[5]['value'].toString()).greaterThan(poolPrice)).to.be.true;
  });

  it.skip('build takeProfit Raydium USDT-USDC', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    const newStrategy = Keypair.generate();
    let newPosition = Keypair.generate();
    const createStrategyAccountIx = await kamino.createStrategyAccount(signer.publicKey, newStrategy.publicKey);
    console.log('newStrategy.publicKey', newStrategy.publicKey.toString());

    let lowerPrice = new Decimal(0.96);
    let upperPrice = new Decimal(1.03);
    let destinationToken = new Decimal(0);
    let dex: Dex = 'ORCA';
    let tokenAMint = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB');
    let tokenBMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      dex,
      new Decimal('1'),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(TakeProfit.discriminator),
      [lowerPrice, upperPrice, destinationToken],
      tokenAMint,
      tokenBMint
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createStrategyAccountIx);
    ixs.push(buildNewStrategyIxs[0]);
    console.log('ixs', ixs.length);
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

    // after strategy creation we have to set the reward mappings so it autocompounds
    let updateRewardMappingIxs = await kamino.getUpdateRewardsIxs(signer.publicKey, newStrategy.publicKey);
    console.log('updateRewardMappingIxs', updateRewardMappingIxs.length);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    for (let ix of updateRewardMappingIxs) {
      const updateRewardMappingTx = await kamino.getTransactionV2Message(
        signer.publicKey,
        [ix[0]],
        [strategyLookupTable]
      );
      const updateRewardMappingsTransactionV0 = new VersionedTransaction(updateRewardMappingTx);
      updateRewardMappingsTransactionV0.sign([signer, ix[1]]);
      //@ts-ignore
      txHash = await sendAndConfirmTransaction(kamino._connection, updateRewardMappingsTransactionV0);
      console.log('setup strategy reward mapping', txHash);
    }

    // open position
    const openPositionIxn = buildNewStrategyIxs[3];
    const openPositionMessage = await kamino.getTransactionV2Message(signer.publicKey, [
      ...getComputeBudgetAndPriorityFeeIxns(1_400_000),
      openPositionIxn,
    ]);
    const openPositionTx = new VersionedTransaction(openPositionMessage);
    openPositionTx.sign([signer, newPosition]);

    //@ts-ignore
    const openPositionTxId = await sendAndConfirmTransaction(kamino._connection, openPositionTx);
    console.log('openPositionTxId', openPositionTxId);

    let poolPrice = new Decimal(await kamino.getPriceForPair(dex, tokenAMint, tokenBMint));

    let stratFields = await kamino.readRebalancingParams(newStrategy.publicKey);

    console.log('price lower', stratFields[1]['value'].toString());
    console.log('price upper', stratFields[2]['value'].toString());

    expect(stratFields.length == 4).to.be.true;
    expect(stratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(stratFields[0]['value'] == TakeProfitRebalanceTypeName).to.be.true;
    expect(stratFields[1]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(stratFields[1]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[2]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(stratFields[2]['value'].toString()).greaterThan(poolPrice)).to.be.true;
    expect(stratFields[3]['label'] == 'destinationToken').to.be.true;
    expect(stratFields[3]['value'].toString() == destinationToken.toString()).to.be.true;

    // update the rebalance params with new values; in the UI these should come from the user
    let newPriceLower = new Decimal(0.98);
    let newPriceUpper = new Decimal(1.01);
    let newDestinationToken = new Decimal(1);
    let newPriceLowerInput = { label: 'priceLower', value: newPriceLower };
    let newPriceUpperInput = { label: 'priceUpper', value: newPriceUpper };
    let newDestinationTokenInput = { label: 'destinationToken', value: newDestinationToken };
    const updateStratFields = kamino.updateRebalanceFieldInfos(stratFields, [
      newPriceLowerInput,
      newPriceUpperInput,
      newDestinationTokenInput,
    ]);

    expect(updateStratFields.length == 4).to.be.true;
    expect(updateStratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(updateStratFields[0]['value'] == TakeProfitRebalanceTypeName).to.be.true;
    expect(updateStratFields[1]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(updateStratFields[1]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(updateStratFields[2]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(updateStratFields[2]['value'].toString()).greaterThan(poolPrice)).to.be.true;
    expect(updateStratFields[3]['label'] == 'destinationToken').to.be.true;
    expect(updateStratFields[3]['value'].toString() == newDestinationToken.toString()).to.be.true;

    let updateStratIx = await kamino.getUpdateRebalancingParamsFromRebalanceFieldsIx(
      signer.publicKey,
      newStrategy.publicKey,
      updateStratFields
    );

    const updateStratTx = await kamino.getTransactionV2Message(signer.publicKey, [updateStratIx]);
    const updateStratTransactionV0 = new VersionedTransaction(updateStratTx);
    updateStratTransactionV0.sign([signer]);
    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, updateStratTransactionV0);
    console.log('update strategy rebalance params tx hash', txHash);

    newPosition = Keypair.generate();
    const rebalanceIxns = await kamino.rebalance(
      newStrategy.publicKey,
      newPosition.publicKey,
      newPriceLower,
      newPriceUpper,
      signer.publicKey
    );
    const rebalanceMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...getComputeBudgetAndPriorityFeeIxns(1_400_000), ...rebalanceIxns],
      [MAINNET_GLOBAL_LOOKUP_TABLE, strategyLookupTable]
    );
    const rebalanceTx = new VersionedTransaction(rebalanceMessage);
    rebalanceTx.sign([signer, newPosition]);

    //@ts-ignore
    const rebalanceTxId = await sendAndConfirmTransaction(kamino._connection, rebalanceTx);
    console.log('rebalanceTxId', rebalanceTxId);

    stratFields = await kamino.readRebalancingParams(newStrategy.publicKey);
    expect(stratFields.length == 4).to.be.true;
    expect(stratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(stratFields[0]['value'] == TakeProfitRebalanceTypeName).to.be.true;
    expect(stratFields[1]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(stratFields[1]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[2]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(stratFields[2]['value'].toString()).greaterThan(poolPrice)).to.be.true;
    expect(stratFields[3]['label'] == 'destinationToken').to.be.true;
    expect(stratFields[3]['value'].toString() == newDestinationToken.toString()).to.be.true;
  });

  it.skip('build expander Orca SOL-USDC', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    const newStrategy = Keypair.generate();
    let newPosition = Keypair.generate();
    const createStrategyAccountIx = await kamino.createStrategyAccount(signer.publicKey, newStrategy.publicKey);
    console.log('newStrategy.publicKey', newStrategy.publicKey.toString());

    let lowerRangeBPS = new Decimal(300.0);
    let upperRangeBPS = new Decimal(800.0);
    let resetLowerRangeBPS = new Decimal(4000.0);
    let resetUpperRangeBPS = new Decimal(6000.0);
    let expansionBPS = new Decimal(400.0);
    let maxNumberOfExpansions = new Decimal(8);
    let swapUnevenAllowed = new Decimal(1);
    let dex: Dex = 'ORCA';
    let tokenAMint = new PublicKey('So11111111111111111111111111111111111111112');
    let tokenBMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      dex,
      new Decimal('5'),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(Expander.discriminator),
      [
        lowerRangeBPS,
        upperRangeBPS,
        resetLowerRangeBPS,
        resetUpperRangeBPS,
        expansionBPS,
        maxNumberOfExpansions,
        swapUnevenAllowed,
      ],
      tokenAMint,
      tokenBMint
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createStrategyAccountIx);
    ixs.push(buildNewStrategyIxs[0]);
    console.log('ixs', ixs.length);
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
    try {
      //@ts-ignore
      txHash = await sendAndConfirmTransaction(kamino._connection, setupStratFeesTransactionV0);
      console.log('setup strategy fees tx hash', txHash);
    } catch (e) {
      console.log(e);
    }

    // after strategy creation we have to set the reward mappings so it autocompounds
    let updateRewardMappingIxs = await kamino.getUpdateRewardsIxs(signer.publicKey, newStrategy.publicKey);
    console.log('updateRewardMappingIxs', updateRewardMappingIxs.length);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    for (let ix of updateRewardMappingIxs) {
      const updateRewardMappingTx = await kamino.getTransactionV2Message(
        signer.publicKey,
        [ix[0]],
        [strategyLookupTable]
      );
      const updateRewardMappingsTransactionV0 = new VersionedTransaction(updateRewardMappingTx);
      updateRewardMappingsTransactionV0.sign([signer, ix[1]]);
      //@ts-ignore
      txHash = await sendAndConfirmTransaction(kamino._connection, updateRewardMappingsTransactionV0);
      console.log('setup strategy reward mapping', txHash);
    }

    // open position
    const openPositionIxn = buildNewStrategyIxs[3];
    const openPositionMessage = await kamino.getTransactionV2Message(signer.publicKey, [
      ...getComputeBudgetAndPriorityFeeIxns(1_400_000),
      openPositionIxn,
    ]);
    const openPositionTx = new VersionedTransaction(openPositionMessage);
    openPositionTx.sign([signer, newPosition]);

    //@ts-ignore
    const openPositionTxId = await sendAndConfirmTransaction(kamino._connection, openPositionTx);
    console.log('openPositionTxId', openPositionTxId);

    let poolPrice = new Decimal(await kamino.getPriceForPair(dex, tokenAMint, tokenBMint));

    let stratFields = await kamino.readRebalancingParams(newStrategy.publicKey);

    expect(stratFields.length == 12).to.be.true;
    expect(stratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(stratFields[0]['value'] == ExpanderRebalanceTypeName).to.be.true;
    expect(stratFields[1]['label'] == 'lowerRangeBps').to.be.true;
    expect(stratFields[1]['value'].toString() == lowerRangeBPS.toString()).to.be.true;
    expect(stratFields[2]['label'] == 'upperRangeBps').to.be.true;
    expect(stratFields[2]['value'].toString() == upperRangeBPS.toString()).to.be.true;
    expect(stratFields[3]['label'] == 'resetLowerRangeBps').to.be.true;
    expect(stratFields[3]['value'].toString() == resetLowerRangeBPS.toString()).to.be.true;
    expect(stratFields[4]['label'] == 'resetUpperRangeBps').to.be.true;
    expect(stratFields[4]['value'].toString() == resetUpperRangeBPS.toString()).to.be.true;
    expect(stratFields[5]['label'] == 'expansionBps').to.be.true;
    expect(stratFields[5]['value'].toString() == expansionBPS.toString()).to.be.true;
    expect(stratFields[6]['label'] == 'maxNumberOfExpansions').to.be.true;
    expect(stratFields[6]['value'].toString() == maxNumberOfExpansions.toString()).to.be.true;
    expect(stratFields[7]['label'] == 'swapUnevenAllowed').to.be.true;
    expect(stratFields[7]['value'].toString() == swapUnevenAllowed.toString()).to.be.true;
    expect(stratFields[8]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(stratFields[8]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[9]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(stratFields[9]['value'].toString()).greaterThan(poolPrice)).to.be.true;
    expect(stratFields[10]['label'] == 'resetPriceLower').to.be.true;
    expect(new Decimal(stratFields[10]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[11]['label'] == 'resetPriceUpper').to.be.true;
    expect(new Decimal(stratFields[11]['value'].toString()).greaterThan(poolPrice)).to.be.true;

    // update the rebalance params with new values; in the UI these should come from the user
    let newLowerRangeBPS = new Decimal(800.0);
    let newUpperRangeBPS = new Decimal(1000.0);
    let newResetLowerRangeBPS = new Decimal(400.0);
    let newResetUpperRangeBPS = new Decimal(600.0);
    let newExpansionBPS = new Decimal(200.0);
    let newMaxNumberOfExpansions = new Decimal(10);
    let newSwapUnevenAllowed = new Decimal(0);
    let newPriceLowerRangeBPSInput = { label: 'lowerRangeBps', value: newLowerRangeBPS };
    let newPriceUpperRangeBPSInput = { label: 'upperRangeBps', value: newUpperRangeBPS };
    let newResetLowerRangeBPSInput = { label: 'resetLowerRangeBps', value: newResetLowerRangeBPS };
    let newResetUpperRangeBPSInput = { label: 'resetUpperRangeBps', value: newResetUpperRangeBPS };
    let newExpansionBPSInput = { label: 'expansionBps', value: newExpansionBPS };
    let newMaxNumberOfExpansionsInput = { label: 'maxNumberOfExpansions', value: newMaxNumberOfExpansions };
    let newSwapUnevenAllowedInput = { label: 'swapUnevenAllowed', value: newSwapUnevenAllowed };
    const updateStratFields = kamino.updateRebalanceFieldInfos(stratFields, [
      newPriceLowerRangeBPSInput,
      newPriceUpperRangeBPSInput,
      newResetLowerRangeBPSInput,
      newResetUpperRangeBPSInput,
      newExpansionBPSInput,
      newMaxNumberOfExpansionsInput,
      newSwapUnevenAllowedInput,
    ]);

    expect(updateStratFields.length == 12).to.be.true;
    expect(updateStratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(updateStratFields[0]['value'] == ExpanderRebalanceTypeName).to.be.true;
    expect(updateStratFields[1]['label'] == 'lowerRangeBps').to.be.true;
    expect(updateStratFields[1]['value'].toString() == newLowerRangeBPS.toString()).to.be.true;
    expect(updateStratFields[2]['label'] == 'upperRangeBps').to.be.true;
    expect(updateStratFields[2]['value'].toString() == newUpperRangeBPS.toString()).to.be.true;
    expect(updateStratFields[3]['label'] == 'resetLowerRangeBps').to.be.true;
    expect(updateStratFields[3]['value'].toString() == newResetLowerRangeBPS.toString()).to.be.true;
    expect(updateStratFields[4]['label'] == 'resetUpperRangeBps').to.be.true;
    expect(updateStratFields[4]['value'].toString() == newResetUpperRangeBPS.toString()).to.be.true;
    expect(updateStratFields[5]['label'] == 'expansionBps').to.be.true;
    expect(updateStratFields[5]['value'].toString() == newExpansionBPS.toString()).to.be.true;
    expect(updateStratFields[6]['label'] == 'maxNumberOfExpansions').to.be.true;
    expect(updateStratFields[6]['value'].toString() == newMaxNumberOfExpansions.toString()).to.be.true;
    expect(updateStratFields[7]['label'] == 'swapUnevenAllowed').to.be.true;
    expect(updateStratFields[7]['value'].toString() == newSwapUnevenAllowed.toString()).to.be.true;
    expect(stratFields[8]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(stratFields[8]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[9]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(stratFields[9]['value'].toString()).greaterThan(poolPrice)).to.be.true;
    expect(stratFields[10]['label'] == 'resetPriceLower').to.be.true;
    expect(new Decimal(stratFields[10]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[11]['label'] == 'resetPriceUpper').to.be.true;
    expect(new Decimal(stratFields[11]['value'].toString()).greaterThan(poolPrice)).to.be.true;

    let updateStratIx = await kamino.getUpdateRebalancingParamsFromRebalanceFieldsIx(
      signer.publicKey,
      newStrategy.publicKey,
      updateStratFields
    );

    const updateStratTx = await kamino.getTransactionV2Message(signer.publicKey, [updateStratIx]);
    const updateStratTransactionV0 = new VersionedTransaction(updateStratTx);
    updateStratTransactionV0.sign([signer]);
    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, updateStratTransactionV0);
    console.log('update strategy rebalance params tx hash', txHash);

    // rebalance with new range; the range is calculated using `getFieldsForRebalanceMethod` as it returns the range for all strategies
    // if `rebalanceMethod` is available it can be used directly, otherwise we can get it from the fields
    let rebalanceMethod = kamino.getRebalanceMethodFromRebalanceFields(updateStratFields);

    // read the pool price so we calculate the position based on the exact pool price; this is needed when the rebalance strategy relies on pool price
    poolPrice = await kamino.getCurrentPrice(newStrategy.publicKey);
    let updatedAllRebalanceFieldInfos = await kamino.getFieldsForRebalanceMethod(
      rebalanceMethod,
      dex,
      updateStratFields,
      tokenAMint,
      tokenBMint,
      poolPrice
    );

    let newPriceLower = new Decimal(updatedAllRebalanceFieldInfos.find((field) => field.label === 'priceLower')!.value);
    let newPriceUpper = new Decimal(updatedAllRebalanceFieldInfos.find((field) => field.label === 'priceUpper')!.value);
    newPosition = Keypair.generate();
    const rebalanceIxns = await kamino.rebalance(
      newStrategy.publicKey,
      newPosition.publicKey,
      newPriceLower,
      newPriceUpper,
      signer.publicKey
    );
    const rebalanceMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...getComputeBudgetAndPriorityFeeIxns(1_400_000), ...rebalanceIxns],
      [MAINNET_GLOBAL_LOOKUP_TABLE, strategyLookupTable]
    );
    const rebalanceTx = new VersionedTransaction(rebalanceMessage);
    rebalanceTx.sign([signer, newPosition]);

    try {
      //@ts-ignore
      const rebalanceTxId = await sendAndConfirmTransaction(kamino._connection, rebalanceTx);
      console.log('rebalanceTxId', rebalanceTxId);
    } catch (e) {
      console.log(e);
    }

    stratFields = await kamino.readRebalancingParams(newStrategy.publicKey);
    expect(stratFields.length == 12).to.be.true;
    expect(stratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(stratFields[0]['value'] == ExpanderRebalanceTypeName).to.be.true;
    expect(stratFields[1]['label'] == 'lowerRangeBps').to.be.true;
    expect(stratFields[1]['value'].toString() == newLowerRangeBPS.toString()).to.be.true;
    expect(stratFields[2]['label'] == 'upperRangeBps').to.be.true;
    expect(stratFields[2]['value'].toString() == newUpperRangeBPS.toString()).to.be.true;
    expect(stratFields[3]['label'] == 'resetLowerRangeBps').to.be.true;
    expect(stratFields[3]['value'].toString() == newResetLowerRangeBPS.toString()).to.be.true;
    expect(stratFields[4]['label'] == 'resetUpperRangeBps').to.be.true;
    expect(stratFields[4]['value'].toString() == newResetUpperRangeBPS.toString()).to.be.true;
    expect(stratFields[5]['label'] == 'expansionBps').to.be.true;
    expect(stratFields[5]['value'].toString() == newExpansionBPS.toString()).to.be.true;
    expect(stratFields[6]['label'] == 'maxNumberOfExpansions').to.be.true;
    expect(stratFields[6]['value'].toString() == newMaxNumberOfExpansions.toString()).to.be.true;
    expect(stratFields[7]['label'] == 'swapUnevenAllowed').to.be.true;
    expect(stratFields[7]['value'].toString() == newSwapUnevenAllowed.toString()).to.be.true;
    expect(stratFields[8]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(stratFields[8]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[9]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(stratFields[9]['value'].toString()).greaterThan(poolPrice)).to.be.true;
    expect(stratFields[10]['label'] == 'resetPriceLower').to.be.true;
    expect(new Decimal(stratFields[10]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[11]['label'] == 'resetPriceUpper').to.be.true;
    expect(new Decimal(stratFields[11]['value'].toString()).greaterThan(poolPrice)).to.be.true;
  });

  it.skip('build drift Orca SOL-MSOL', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    const newStrategy = Keypair.generate();
    let newPosition = Keypair.generate();
    const createStrategyAccountIx = await kamino.createStrategyAccount(signer.publicKey, newStrategy.publicKey);
    console.log('newStrategy.publicKey', newStrategy.publicKey.toString());

    let startMidTick = new Decimal(-1257.0);
    let ticksBelowMid = new Decimal(10.0);
    let ticksAboveMid = new Decimal(5.0);
    let secondsPerTick = new Decimal(6000.0);
    let direction = new Decimal(1.0);
    let dex: Dex = 'ORCA';
    let tokenAMint = new PublicKey('So11111111111111111111111111111111111111112');
    let tokenBMint = new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So');

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      dex,
      new Decimal('1'),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(Drift.discriminator),
      [startMidTick, ticksBelowMid, ticksAboveMid, secondsPerTick, direction],
      tokenAMint,
      tokenBMint
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createStrategyAccountIx);
    ixs.push(buildNewStrategyIxs[0]);
    console.log('ixs', ixs.length);
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
    try {
      //@ts-ignore
      txHash = await sendAndConfirmTransaction(kamino._connection, setupStratFeesTransactionV0);
      console.log('setup strategy fees tx hash', txHash);
    } catch (e) {
      console.log(e);
    }

    // after strategy creation we have to set the reward mappings so it autocompounds
    let updateRewardMappingIxs = await kamino.getUpdateRewardsIxs(signer.publicKey, newStrategy.publicKey);
    console.log('updateRewardMappingIxs', updateRewardMappingIxs.length);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    for (let ix of updateRewardMappingIxs) {
      const updateRewardMappingTx = await kamino.getTransactionV2Message(
        signer.publicKey,
        [ix[0]],
        [strategyLookupTable]
      );
      const updateRewardMappingsTransactionV0 = new VersionedTransaction(updateRewardMappingTx);
      updateRewardMappingsTransactionV0.sign([signer, ix[1]]);
      //@ts-ignore
      txHash = await sendAndConfirmTransaction(kamino._connection, updateRewardMappingsTransactionV0);
      console.log('setup strategy reward mapping', txHash);
    }

    // open position
    const openPositionIxn = buildNewStrategyIxs[3];
    const openPositionMessage = await kamino.getTransactionV2Message(signer.publicKey, [
      ...getComputeBudgetAndPriorityFeeIxns(1_400_000),
      openPositionIxn,
    ]);
    const openPositionTx = new VersionedTransaction(openPositionMessage);
    openPositionTx.sign([signer, newPosition]);

    //@ts-ignore
    const openPositionTxId = await sendAndConfirmTransaction(kamino._connection, openPositionTx);
    console.log('openPositionTxId', openPositionTxId);

    let poolPrice = new Decimal(await kamino.getPriceForPair(dex, tokenAMint, tokenBMint));

    let stratFields = await kamino.readRebalancingParams(newStrategy.publicKey);

    expect(stratFields.length == 8).to.be.true;
    expect(stratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(stratFields[0]['value'] == DriftRebalanceTypeName).to.be.true;
    expect(stratFields[1]['label'] == 'startMidTick').to.be.true;
    expect(stratFields[1]['value'].toString() == startMidTick.toString()).to.be.true;
    expect(stratFields[2]['label'] == 'ticksBelowMid').to.be.true;
    expect(stratFields[2]['value'].toString() == ticksBelowMid.toString()).to.be.true;
    expect(stratFields[3]['label'] == 'ticksAboveMid').to.be.true;
    expect(stratFields[3]['value'].toString() == ticksAboveMid.toString()).to.be.true;
    expect(stratFields[4]['label'] == 'secondsPerTick').to.be.true;
    expect(stratFields[4]['value'].toString() == secondsPerTick.toString()).to.be.true;
    expect(stratFields[5]['label'] == 'direction').to.be.true;
    expect(stratFields[5]['value'].toString() == direction.toString()).to.be.true;
    expect(stratFields[6]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(stratFields[6]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[7]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(stratFields[7]['value'].toString()).greaterThan(poolPrice)).to.be.true;

    // update the rebalance params with new values; in the UI these should come from the user
    let newStartMidTick = startMidTick.add(1);
    let newTicksBelowMid = ticksBelowMid.add(10);
    let newTicksAboveMid = ticksAboveMid.add(5);
    let newSecondsPerTick = secondsPerTick.add(6000);
    let newDirection = new Decimal(0);
    let newStartMidTickInput = { label: 'startMidTick', value: newStartMidTick };
    let newTickBelowMidInput = { label: 'ticksBelowMid', value: newTicksBelowMid };
    let newTickAboveMidInput = { label: 'ticksAboveMid', value: newTicksAboveMid };
    let newSecondsPerTickInput = { label: 'secondsPerTick', value: newSecondsPerTick };
    let newDirectionInput = { label: 'direction', value: newDirection };

    const updateStratFields = kamino.updateRebalanceFieldInfos(stratFields, [
      newStartMidTickInput,
      newTickBelowMidInput,
      newTickAboveMidInput,
      newSecondsPerTickInput,
      newDirectionInput,
    ]);

    expect(updateStratFields.length == 8).to.be.true;
    expect(updateStratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(updateStratFields[0]['value'] == DriftRebalanceTypeName).to.be.true;
    expect(updateStratFields[1]['label'] == 'startMidTick').to.be.true;
    expect(updateStratFields[1]['value'].toString() == newStartMidTick.toString()).to.be.true;
    expect(updateStratFields[2]['label'] == 'ticksBelowMid').to.be.true;
    expect(updateStratFields[2]['value'].toString() == newTicksBelowMid.toString()).to.be.true;
    expect(updateStratFields[3]['label'] == 'ticksAboveMid').to.be.true;
    expect(updateStratFields[3]['value'].toString() == newTicksAboveMid.toString()).to.be.true;
    expect(updateStratFields[4]['label'] == 'secondsPerTick').to.be.true;
    expect(updateStratFields[4]['value'].toString() == newSecondsPerTick.toString()).to.be.true;
    expect(updateStratFields[5]['label'] == 'direction').to.be.true;
    expect(updateStratFields[5]['value'].toString() == newDirection.toString()).to.be.true;
    expect(updateStratFields[6]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(updateStratFields[6]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(updateStratFields[7]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(updateStratFields[7]['value'].toString()).greaterThan(poolPrice)).to.be.true;

    let updateStratIx = await kamino.getUpdateRebalancingParamsFromRebalanceFieldsIx(
      signer.publicKey,
      newStrategy.publicKey,
      updateStratFields
    );

    const updateStratTx = await kamino.getTransactionV2Message(signer.publicKey, [updateStratIx]);
    const updateStratTransactionV0 = new VersionedTransaction(updateStratTx);
    updateStratTransactionV0.sign([signer]);
    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, updateStratTransactionV0);
    console.log('update strategy rebalance params tx hash', txHash);

    // rebalance with new range; the range is calculated using `getFieldsForRebalanceMethod` as it returns the range for all strategies
    // if `rebalanceMethod` is available it can be used directly, otherwise we can get it from the fields
    let rebalanceMethod = kamino.getRebalanceMethodFromRebalanceFields(updateStratFields);
    let updatedAllRebalanceFieldInfos = await kamino.getFieldsForRebalanceMethod(
      rebalanceMethod,
      dex,
      updateStratFields,
      tokenAMint,
      tokenBMint
    );

    let newPriceLower = new Decimal(updatedAllRebalanceFieldInfos.find((field) => field.label === 'priceLower')!.value);
    let newPriceUpper = new Decimal(updatedAllRebalanceFieldInfos.find((field) => field.label === 'priceUpper')!.value);

    newPosition = Keypair.generate();
    const rebalanceIxns = await kamino.rebalance(
      newStrategy.publicKey,
      newPosition.publicKey,
      newPriceLower,
      newPriceUpper,
      signer.publicKey
    );
    const rebalanceMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...getComputeBudgetAndPriorityFeeIxns(1_400_000), ...rebalanceIxns],
      [MAINNET_GLOBAL_LOOKUP_TABLE, strategyLookupTable]
    );
    const rebalanceTx = new VersionedTransaction(rebalanceMessage);
    rebalanceTx.sign([signer, newPosition]);

    //@ts-ignore
    const rebalanceTxId = await sendAndConfirmTransaction(kamino._connection, rebalanceTx);
    console.log('rebalanceTxId', rebalanceTxId);

    stratFields = await kamino.readRebalancingParams(newStrategy.publicKey);

    expect(stratFields.length == 8).to.be.true;
    expect(stratFields[0]['label'] == 'rebalanceType').to.be.true;
    expect(stratFields[0]['value'] == DriftRebalanceTypeName).to.be.true;
    expect(stratFields[1]['label'] == 'startMidTick').to.be.true;
    expect(stratFields[1]['value'].toString() == newStartMidTick.toString()).to.be.true;
    expect(stratFields[2]['label'] == 'ticksBelowMid').to.be.true;
    expect(stratFields[2]['value'].toString() == newTicksBelowMid.toString()).to.be.true;
    expect(stratFields[3]['label'] == 'ticksAboveMid').to.be.true;
    expect(stratFields[3]['value'].toString() == newTicksAboveMid.toString()).to.be.true;
    expect(stratFields[4]['label'] == 'secondsPerTick').to.be.true;
    expect(stratFields[4]['value'].toString() == newSecondsPerTick.toString()).to.be.true;
    expect(stratFields[5]['label'] == 'direction').to.be.true;
    expect(stratFields[5]['value'].toString() == newDirection.toString()).to.be.true;
    expect(stratFields[6]['label'] == 'priceLower').to.be.true;
    expect(new Decimal(stratFields[6]['value'].toString()).lessThan(poolPrice)).to.be.true;
    expect(stratFields[7]['label'] == 'priceUpper').to.be.true;
    expect(new Decimal(stratFields[7]['value'].toString()).greaterThan(poolPrice)).to.be.true;
  });

  it.skip('update price reference type', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    const newStrategy = Keypair.generate();
    const newPosition = Keypair.generate();
    const createRaydiumStrategyAccountIx = await kamino.createStrategyAccount(signer.publicKey, newStrategy.publicKey);
    console.log('newStrategy.publicKey', newStrategy.publicKey.toString());

    let priceLower = new Decimal(15.0);
    let priceUpper = new Decimal(21.0);
    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      'RAYDIUM',
      new Decimal('5'),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(Manual.discriminator),
      [priceLower, priceUpper],
      new PublicKey('So11111111111111111111111111111111111111112'),
      new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createRaydiumStrategyAccountIx);
    ixs.push(buildNewStrategyIxs[0]);
    console.log('ixs', ixs.length);
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

    // after strategy creation we have to set the reward mappings so it autocompounds
    let updateRewardMappingIxs = await kamino.getUpdateRewardsIxs(signer.publicKey, newStrategy.publicKey);
    console.log('updateRewardMappingIxs', updateRewardMappingIxs.length);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    for (let ix of updateRewardMappingIxs) {
      const updateRewardMappingTx = await kamino.getTransactionV2Message(
        signer.publicKey,
        [ix[0]],
        [strategyLookupTable]
      );
      const updateRewardMappingsTransactionV0 = new VersionedTransaction(updateRewardMappingTx);
      updateRewardMappingsTransactionV0.sign([signer, ix[1]]);
      //@ts-ignore
      txHash = await sendAndConfirmTransaction(kamino._connection, updateRewardMappingsTransactionV0);
      console.log('setup strategy reward mapping', txHash);
    }

    // open position
    const openPositionIxn = buildNewStrategyIxs[3];
    const openPositionMessage = await kamino.getTransactionV2Message(signer.publicKey, [
      ...getComputeBudgetAndPriorityFeeIxns(1_400_000),
      openPositionIxn,
    ]);
    const openPositionTx = new VersionedTransaction(openPositionMessage);
    openPositionTx.sign([signer, newPosition]);

    //@ts-ignore
    const openPositionTxId = await sendAndConfirmTransaction(kamino._connection, openPositionTx);
    console.log('openPositionTxId', openPositionTxId);

    let strategyState = (await kamino.getStrategies([newStrategy.publicKey]))[0];
    if (!strategyState) {
      throw new Error('strategy not found');
    }

    expect(strategyState!.rebalanceRaw.referencePriceType).to.be.eq(POOL.discriminator);

    let updatePriceReferenceTypeIx = await kamino.getUpdateReferencePriceTypeIx(newStrategy.publicKey, new TWAP());
    let updatePriceReferenceTypeTxMsg = await kamino.getTransactionV2Message(signer.publicKey, [
      updatePriceReferenceTypeIx,
    ]);
    let updatePriceReferenceTypeTx = new VersionedTransaction(updatePriceReferenceTypeTxMsg);
    updatePriceReferenceTypeTx.sign([signer]);

    //@ts-ignore
    let updatePriceReferenceTypeTxId = await sendAndConfirmTransaction(kamino._connection, updatePriceReferenceTypeTx);
    console.log('update reference price to TWAP tx', updatePriceReferenceTypeTxId);

    strategyState = (await kamino.getStrategies([newStrategy.publicKey]))[0];
    if (!strategyState) {
      throw new Error('strategy not found');
    }
    expect(strategyState!.rebalanceRaw.referencePriceType).to.be.eq(TWAP.discriminator);

    updatePriceReferenceTypeIx = await kamino.getUpdateReferencePriceTypeIx(newStrategy.publicKey, new POOL());
    updatePriceReferenceTypeTxMsg = await kamino.getTransactionV2Message(signer.publicKey, [
      updatePriceReferenceTypeIx,
    ]);
    updatePriceReferenceTypeTx = new VersionedTransaction(updatePriceReferenceTypeTxMsg);
    updatePriceReferenceTypeTx.sign([signer]);

    //@ts-ignore
    updatePriceReferenceTypeTxId = await sendAndConfirmTransaction(kamino._connection, updatePriceReferenceTypeTx);
    console.log('update reference price to POOL tx', updatePriceReferenceTypeTxId);

    strategyState = (await kamino.getStrategies([newStrategy.publicKey]))[0];
    if (!strategyState) {
      throw new Error('strategy not found');
    }
    expect(strategyState!.rebalanceRaw.referencePriceType).to.be.eq(POOL.discriminator);
  });
});
