import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  TransactionInstruction,
  VersionedTransaction,
} from '@solana/web3.js';
import {
  createAddExtraComputeUnitsIx,
  createAddExtraComputeUnitsTransaction,
  getAssociatedTokenAddressAndData,
  Kamino,
  OrcaService,
  RaydiumService,
  sendTransactionWithLogs,
  sleep,
  U64_MAX,
} from '../src';
import Decimal from 'decimal.js';
import { createTransactionWithExtraBudget } from '../src';
import {
  balance,
  GlobalConfigMainnet,
  KaminoProgramIdMainnet,
  SOLMintMainnet,
  toJson,
  updateStrategyConfig,
  USDCMintMainnet,
} from './utils';
import { UpdateRebalanceType } from '../src/kamino-client/types/StrategyConfigOption';
import { expect } from 'chai';
import { WHIRLPOOL_PROGRAM_ID } from '../src/whirpools-client/programId';
import { PROGRAM_ID as RAYDIUM_PROGRAM_ID } from '../src/raydium_client/programId';
import { Manual, PricePercentage, PricePercentageWithReset } from '../src/kamino-client/types/RebalanceType';
import { createWsolAtaIfMissing, getComputeBudgetAndPriorityFeeIxns } from '../src/utils/transactions';
import { JupService } from '../src/services/JupService';
import {
  MAINNET_GLOBAL_LOOKUP_TABLE,
  STAGING_GLOBAL_CONFIG,
  STAGING_KAMINO_PROGRAM_ID,
} from '../src/constants/pubkeys';
import { METEORA_PROGRAM_ID } from '../src/meteora_client/programId';

describe('Kamino strategy creation SDK Tests', () => {
  let connection: Connection;
  const cluster = 'mainnet-beta';

  const clusterUrl: string = 'https://api.mainnet-beta.solana.com';

  connection = new Connection(clusterUrl, 'processed');

  // use your private key here
  const signerPrivateKey = [];
  const signer = Keypair.fromSecretKey(Uint8Array.from(signerPrivateKey));

  it.skip('withdraw topup vault', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    const upkeepIxn = await kamino.withdrawTopupVault(
      new PublicKey('HzZH5jHVUPsw3qawUcQXG1SZJqNom3gt94eFHCWhq1KF'),
      new Decimal(U64_MAX)
    );

    let ixs: TransactionInstruction[] = [upkeepIxn];
    console.log('ixs', ixs.length);
    const createStratTx = await kamino.getTransactionV2Message(signer.publicKey, ixs);
    const createStratTransactionV0 = new VersionedTransaction(createStratTx);
    createStratTransactionV0.sign([signer]);
    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, createStratTransactionV0);
    console.log('create strategy tx hash', txHash);
  });

  it('read generic pool Meteora', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID,
      METEORA_PROGRAM_ID
    );

    const poolInfo = await kamino.getGenericPoolInfo(
      'METEORA',
      new PublicKey('FoSDw2L5DmTuQTFe55gWPDXf88euaxAEKFre74CnvQbX')
    );
    console.log('poolInfo', poolInfo);
  });

  it('read pool price Meteora', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID,
      METEORA_PROGRAM_ID
    );

    let price = await kamino.getMeteoraPoolPrice(new PublicKey('FoSDw2L5DmTuQTFe55gWPDXf88euaxAEKFre74CnvQbX'));
    console.log('pool price', price);
  });

  it('create Kamino staging', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      STAGING_GLOBAL_CONFIG,
      STAGING_KAMINO_PROGRAM_ID,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID,
      METEORA_PROGRAM_ID
    );

    const globalConfig = kamino.getGlobalConfig();
    expect(globalConfig.equals(STAGING_GLOBAL_CONFIG)).to.be.true;

    let kamino2 = new Kamino(
      cluster,
      connection,
      undefined,
      STAGING_KAMINO_PROGRAM_ID,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID,
      METEORA_PROGRAM_ID
    );

    const globalConfig2 = kamino.getGlobalConfig();
    expect(globalConfig2.equals(STAGING_GLOBAL_CONFIG)).to.be.true;
  });

  it('both sides deposit in Meteora strategy', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      STAGING_GLOBAL_CONFIG,
      STAGING_KAMINO_PROGRAM_ID,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID,
      METEORA_PROGRAM_ID
    );

    let strategy = new PublicKey('6cM3MGNaJBfpBQy1P9oiZkDDzcWgSxjMaj6iWtz8ydSk');
    let amountAToDeposit = new Decimal(0.01);
    let amountBToDeposit = new Decimal(1.0);

    let strategyState = (await kamino.getStrategies([strategy]))[0];
    if (!strategyState) {
      throw new Error('strategy not found');
    }

    let depositIx = await kamino.deposit(
      { strategy: strategyState!, address: strategy },
      amountAToDeposit,
      amountBToDeposit,
      signer.publicKey
    );
    console.log('depositIxs', depositIx);

    const [sharesAta, sharesMintData] = await getAssociatedTokenAddressAndData(
      connection,
      strategyState.sharesMint,
      signer.publicKey
    );
    const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(
      connection,
      strategyState.tokenAMint,
      signer.publicKey
    );
    const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(
      connection,
      strategyState.tokenBMint,
      signer.publicKey
    );

    let strategyWithAddres = { address: strategy, strategy: strategyState };
    const ataInstructions = await kamino.getCreateAssociatedTokenAccountInstructionsIfNotExist(
      signer.publicKey,
      strategyWithAddres,
      tokenAData,
      tokenAAta,
      tokenBData,
      tokenBAta,
      sharesMintData,
      sharesAta
    );

    const increaseBudgetIx = createAddExtraComputeUnitsIx(1_000_000);
    const depositTx = await kamino.getTransactionV2Message(
      signer.publicKey,
      [increaseBudgetIx, ...ataInstructions, depositIx],
      [strategyState.strategyLookupTable]
    );
    const depositTransactionV0 = new VersionedTransaction(depositTx);
    depositTransactionV0.sign([signer]);
    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, depositTransactionV0, { skipPreflight: true });
    console.log('deposit tx hash', txHash);
  });

  it('single sided deposit in Meteora strategy', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      STAGING_GLOBAL_CONFIG,
      STAGING_KAMINO_PROGRAM_ID,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID,
      METEORA_PROGRAM_ID
    );

    let strategy = new PublicKey('6cM3MGNaJBfpBQy1P9oiZkDDzcWgSxjMaj6iWtz8ydSk');
    let amountToDeposit = new Decimal(5.0);

    let strategyState = (await kamino.getStrategies([strategy]))[0];
    if (!strategyState) {
      throw new Error('strategy not found');
    }

    let depositIx = await kamino.singleSidedDepositTokenB(
      { strategy: strategyState!, address: strategy },
      amountToDeposit,
      signer.publicKey,
      new Decimal(500)
    );

    const [sharesAta, sharesMintData] = await getAssociatedTokenAddressAndData(
      connection,
      strategyState.sharesMint,
      signer.publicKey
    );
    const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(
      connection,
      strategyState.tokenAMint,
      signer.publicKey
    );
    const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(
      connection,
      strategyState.tokenBMint,
      signer.publicKey
    );

    let strategyWithAddres = { address: strategy, strategy: strategyState };
    const ataInstructions = await kamino.getCreateAssociatedTokenAccountInstructionsIfNotExist(
      signer.publicKey,
      strategyWithAddres,
      tokenAData,
      tokenAAta,
      tokenBData,
      tokenBAta,
      sharesMintData,
      sharesAta
    );

    const increaseBudgetIx = createAddExtraComputeUnitsIx(1_400_000);
    const depositTx = await kamino.getTransactionV2Message(
      signer.publicKey,
      [increaseBudgetIx, ...depositIx.instructions],
      [strategyState.strategyLookupTable, ...depositIx.lookupTablesAddresses]
    );
    const depositTransactionV0 = new VersionedTransaction(depositTx);
    depositTransactionV0.sign([signer]);
    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, depositTransactionV0);
    // let txHash = await sendAndConfirmTransaction(kamino._connection, depositTransactionV0, { skipPreflight: true });
    console.log('deposit tx hash', txHash);
  });

  it('calculate amounts', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      STAGING_GLOBAL_CONFIG,
      STAGING_KAMINO_PROGRAM_ID,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID,
      METEORA_PROGRAM_ID
    );
    let amounts = await kamino.calculateAmountsToBeDepositedWithSwap(
      new PublicKey('Cfuy5T6osdazUeLego5LFycBQebm9PP3H7VNdCndXXEN'),
      new Decimal(0),
      new Decimal(400)
    );

    let holdings = await kamino.getStrategyTokensHoldings(
      new PublicKey('Cfuy5T6osdazUeLego5LFycBQebm9PP3H7VNdCndXXEN')
    );

    console.log('amounts', amounts);
    console.log('holdings', holdings);
  });

  it.skip('readWhirlpool', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    let res = await kamino.getStrategiesShareData([
      new PublicKey('DWkn7bbqAjYeu4U84iQHTbKT9fBEBZwpTSLondcp6dpd'),
      new PublicKey('B8CLmUAErBALZWwD16xUvWWxGDmH6BJBrQRqXUBVEhYN'),
    ]);
    console.log('res', res);
  });

  it.skip('get pools for Raydium SOL-USDC pair', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    let pool = await kamino.getPoolInitializedForDexPairTier(
      'RAYDIUM',
      new PublicKey('So11111111111111111111111111111111111111112'),
      new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
      new Decimal(5)
    );

    console.log('pools', pool.toString());
  });

  it.skip('get pools for Orca SOL-USDC pair', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    let pool = await kamino.getPoolInitializedForDexPairTier(
      'RAYDIUM',
      new PublicKey('So11111111111111111111111111111111111111112'),
      new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
      new Decimal(1)
    );

    console.log('orca pools', pool.toString());
  });

  it.skip('getExistentPoolsForPair Raydium for SOL-USDC', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    let pools = await kamino.getExistentPoolsForPair(
      'RAYDIUM',
      new PublicKey('So11111111111111111111111111111111111111112'),
      new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
    );

    console.log('Raydium pools', pools);
  });

  it.skip('getExistentPoolsForPair ORCA for USDH-USDC', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    let pools = await kamino.getExistentPoolsForPair(
      'ORCA',
      new PublicKey('USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX'),
      new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
    );

    console.log('Orca pools', pools);
  });

  it.skip('build strategy IX for Raydium SOL-USDC', async () => {
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

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      'RAYDIUM',
      new Decimal('5'),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(Manual.discriminator),
      [new Decimal(18.0), new Decimal(21.0)],
      new PublicKey('So11111111111111111111111111111111111111112'),
      new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createRaydiumStrategyAccountIx);
    ixs.push(buildNewStrategyIxs.initStrategyIx);
    console.log('ixs', ixs.length);
    const createStratTx = await kamino.getTransactionV2Message(signer.publicKey, ixs);
    const createStratTransactionV0 = new VersionedTransaction(createStratTx);
    createStratTransactionV0.sign([newStrategy, signer]);
    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, createStratTransactionV0);
    console.log('create strategy tx hash', txHash);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    const setupStratTx = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...buildNewStrategyIxs.updateStrategyParamsIxs, buildNewStrategyIxs.updateRebalanceParamsIx],
      [strategyLookupTable, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const setupStratTransactionV0 = new VersionedTransaction(setupStratTx);
    setupStratTransactionV0.sign([signer]);

    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, setupStratTransactionV0);
    console.log('setup strategy tx hash', txHash);

    // after strategy creation we have to set the reward mappings so it autocompounds
    let updateRewardMappingIxs = await kamino.getUpdateRewardsIxs(signer.publicKey, newStrategy.publicKey);
    console.log('updateRewardMappingIxs', updateRewardMappingIxs.length);

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
  });

  it.skip('build strategy IX for Raydium SOL-USDC', async () => {
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

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      'RAYDIUM',
      new Decimal('0.0005'),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(Manual.discriminator),
      [new Decimal(18.0), new Decimal(21.0)],
      new PublicKey('So11111111111111111111111111111111111111112'),
      new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v')
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createRaydiumStrategyAccountIx);
    ixs.push(buildNewStrategyIxs.initStrategyIx);
    console.log('ixs', ixs.length);
    const createStratTx = await kamino.getTransactionV2Message(signer.publicKey, ixs);
    const createStratTransactionV0 = new VersionedTransaction(createStratTx);
    createStratTransactionV0.sign([newStrategy, signer]);
    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, createStratTransactionV0);
    console.log('create strategy tx hash', txHash);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    const setupStratTx = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...buildNewStrategyIxs.updateStrategyParamsIxs, buildNewStrategyIxs.updateRebalanceParamsIx],
      [strategyLookupTable, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const setupStratTransactionV0 = new VersionedTransaction(setupStratTx);
    setupStratTransactionV0.sign([signer]);

    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, setupStratTransactionV0);
    console.log('setup strategy tx hash', txHash);

    // after strategy creation we have to set the reward mappings so it autocompounds
    let updateRewardMappingIxs = await kamino.getUpdateRewardsIxs(signer.publicKey, newStrategy.publicKey);
    console.log('updateRewardMappingIxs', updateRewardMappingIxs.length);

    for (let ix of updateRewardMappingIxs) {
      const updateRewardMappingTx = await kamino.getTransactionV2Message(signer.publicKey, [ix[0]]);
      const updateRewardMappingsTransactionV0 = new VersionedTransaction(updateRewardMappingTx);
      updateRewardMappingsTransactionV0.sign([signer, ix[1]]);
      //@ts-ignore
      txHash = await sendAndConfirmTransaction(kamino._connection, updateRewardMappingsTransactionV0);
      console.log('setup strategy reward mapping', txHash);
    }
  });

  it.skip('create custom USDC-USDH new manual strategy on existing whirlpool', async () => {
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

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      'ORCA',
      new Decimal(1),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(Manual.discriminator),
      [], // not needed used for manual
      new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
      new PublicKey('USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX')
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createRaydiumStrategyAccountIx);
    ixs.push(buildNewStrategyIxs.initStrategyIx);
    const createStratTx = await kamino.getTransactionV2Message(signer.publicKey, ixs);
    const createStratTransactionV0 = new VersionedTransaction(createStratTx);
    createStratTransactionV0.sign([newStrategy, signer]);

    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, createStratTransactionV0);
    console.log('create strategy tx hash', txHash);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    const setupStratTx = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...buildNewStrategyIxs.updateStrategyParamsIxs, buildNewStrategyIxs.updateRebalanceParamsIx],
      [strategyLookupTable, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const setupStratTransactionV0 = new VersionedTransaction(setupStratTx);
    setupStratTransactionV0.sign([signer]);

    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, setupStratTransactionV0);
    console.log('setup strategy tx hash', txHash);

    // after strategy creation we have to set the reward mappings so it autocompounds
    let updateRewardMappingIxs = await kamino.getUpdateRewardsIxs(signer.publicKey, newStrategy.publicKey);

    for (let ix of updateRewardMappingIxs) {
      const updateRewardMappingTx = await kamino.getTransactionV2Message(signer.publicKey, [ix[0]]);
      const updateRewardMappingsTransactionV0 = new VersionedTransaction(updateRewardMappingTx);
      updateRewardMappingsTransactionV0.sign([signer, ix[1]]);
      //@ts-ignore
      txHash = await sendAndConfirmTransaction(kamino._connection, updateRewardMappingsTransactionV0);
      console.log('update reward mappings tx hash', txHash);
    }
  });

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
    const newPosition = Keypair.generate();
    const createRaydiumStrategyAccountIx = await kamino.createStrategyAccount(signer.publicKey, newStrategy.publicKey);
    console.log('newStrategy.publicKey', newStrategy.publicKey.toString());

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      'ORCA',
      new Decimal(5),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(Manual.discriminator),
      [], // not needed used for manual
      SOLMintMainnet,
      USDCMintMainnet
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createRaydiumStrategyAccountIx);
    ixs.push(buildNewStrategyIxs.initStrategyIx);
    const createStratTx = await kamino.getTransactionV2Message(signer.publicKey, ixs);
    const createStratTransactionV0 = new VersionedTransaction(createStratTx);
    createStratTransactionV0.sign([newStrategy, signer]);
    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, createStratTransactionV0);
    console.log('create strategy tx hash', txHash);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    const setupStratTx = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...buildNewStrategyIxs.updateStrategyParamsIxs, buildNewStrategyIxs.updateRebalanceParamsIx],
      [strategyLookupTable, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const setupStratTransactionV0 = new VersionedTransaction(setupStratTx);
    setupStratTransactionV0.sign([signer]);

    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, setupStratTransactionV0);
    console.log('setup strategy tx hash', txHash);

    // after strategy creation we have to set the reward mappings so it autocompounds
    let updateRewardMappingIxs = await kamino.getUpdateRewardsIxs(signer.publicKey, newStrategy.publicKey);

    for (let ix of updateRewardMappingIxs) {
      const updateRewardMappingTx = await kamino.getTransactionV2Message(signer.publicKey, [ix[0]]);
      const updateRewardMappingsTransactionV0 = new VersionedTransaction(updateRewardMappingTx);
      updateRewardMappingsTransactionV0.sign([signer, ix[1]]);
      //@ts-ignore
      txHash = await sendAndConfirmTransaction(kamino._connection, updateRewardMappingsTransactionV0);
      console.log('update reward mappings tx hash', txHash);
    }
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
    const newPosition = Keypair.generate();
    const createRaydiumStrategyAccountIx = await kamino.createStrategyAccount(signer.publicKey, newStrategy.publicKey);
    console.log('newStrategy.publicKey', newStrategy.publicKey.toString());

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      'ORCA',
      new Decimal(5),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(PricePercentage.discriminator),
      [new Decimal(100.0), new Decimal(100.0)],
      SOLMintMainnet,
      USDCMintMainnet
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createRaydiumStrategyAccountIx);
    ixs.push(buildNewStrategyIxs.initStrategyIx);
    const createStratTx = await kamino.getTransactionV2Message(signer.publicKey, ixs);
    const createStratTransactionV0 = new VersionedTransaction(createStratTx);
    createStratTransactionV0.sign([newStrategy, signer]);
    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, createStratTransactionV0);
    console.log('create strategy tx hash', txHash);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    const setupStratTx = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...buildNewStrategyIxs.updateStrategyParamsIxs, buildNewStrategyIxs.updateRebalanceParamsIx],
      [strategyLookupTable, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const setupStratTransactionV0 = new VersionedTransaction(setupStratTx);
    setupStratTransactionV0.sign([signer]);

    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, setupStratTransactionV0);
    console.log('setup strategy tx hash', txHash);

    // after strategy creation we have to set the reward mappings so it autocompounds
    let updateRewardMappingIxs = await kamino.getUpdateRewardsIxs(signer.publicKey, newStrategy.publicKey);

    for (let ix of updateRewardMappingIxs) {
      const updateRewardMappingTx = await kamino.getTransactionV2Message(signer.publicKey, [ix[0]]);
      const updateRewardMappingsTransactionV0 = new VersionedTransaction(updateRewardMappingTx);
      updateRewardMappingsTransactionV0.sign([signer]);
      //@ts-ignore
      txHash = await sendAndConfirmTransaction(kamino._connection, updateRewardMappingsTransactionV0);
      console.log('update reward mappings tx hash', txHash);
    }
  });

  it.skip('create custom USDC-USDH new percentage strategy on existing whirlpool', async () => {
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

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      'ORCA',
      new Decimal(1),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(Manual.discriminator),
      [], // not needed used for manual
      new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
      new PublicKey('USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX')
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createRaydiumStrategyAccountIx);
    ixs.push(buildNewStrategyIxs.initStrategyIx);
    const createStratTx = await kamino.getTransactionV2Message(signer.publicKey, ixs);
    const createStratTransactionV0 = new VersionedTransaction(createStratTx);
    createStratTransactionV0.sign([newStrategy, signer]);
    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, createStratTransactionV0);
    console.log('create strategy tx hash', txHash);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    const setupStratTx = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...buildNewStrategyIxs.updateStrategyParamsIxs, buildNewStrategyIxs.updateRebalanceParamsIx],
      [strategyLookupTable, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const setupStratTransactionV0 = new VersionedTransaction(setupStratTx);
    setupStratTransactionV0.sign([signer]);

    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, setupStratTransactionV0);
    console.log('setup strategy tx hash', txHash);

    // after strategy creation we have to set the reward mappings so it autocompounds
    let updateRewardMappingIxs = await kamino.getUpdateRewardsIxs(signer.publicKey, newStrategy.publicKey);

    for (let ix of updateRewardMappingIxs) {
      const updateRewardMappingTx = await kamino.getTransactionV2Message(signer.publicKey, [ix[0]]);
      const updateRewardMappingsTransactionV0 = new VersionedTransaction(updateRewardMappingTx);
      updateRewardMappingsTransactionV0.sign([signer, ix[1]]);
      //@ts-ignore
      txHash = await sendAndConfirmTransaction(kamino._connection, updateRewardMappingsTransactionV0);
      console.log('update reward mappings tx hash', txHash);
    }
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
    const newPosition = Keypair.generate();
    const createRaydiumStrategyAccountIx = await kamino.createStrategyAccount(signer.publicKey, newStrategy.publicKey);
    console.log('newStrategy.publicKey', newStrategy.publicKey.toString());

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      'ORCA',
      new Decimal(5),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(PricePercentage.discriminator),
      [new Decimal(100.0), new Decimal(100.0)],
      SOLMintMainnet,
      USDCMintMainnet
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createRaydiumStrategyAccountIx);
    ixs.push(buildNewStrategyIxs.initStrategyIx);
    const createStratTx = await kamino.getTransactionV2Message(signer.publicKey, ixs);
    const createStratTransactionV0 = new VersionedTransaction(createStratTx);
    createStratTransactionV0.sign([newStrategy, signer]);
    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, createStratTransactionV0);
    console.log('create strategy tx hash', txHash);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    const setupStratTx = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...buildNewStrategyIxs.updateStrategyParamsIxs, buildNewStrategyIxs.updateRebalanceParamsIx],
      [strategyLookupTable, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const setupStratTransactionV0 = new VersionedTransaction(setupStratTx);
    setupStratTransactionV0.sign([signer]);

    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, setupStratTransactionV0);
    console.log('setup strategy tx hash', txHash);

    // after strategy creation we have to set the reward mappings so it autocompounds
    let updateRewardMappingIxs = await kamino.getUpdateRewardsIxs(signer.publicKey, newStrategy.publicKey);

    for (let ix of updateRewardMappingIxs) {
      const updateRewardMappingTx = await kamino.getTransactionV2Message(signer.publicKey, [ix[0]]);
      const updateRewardMappingsTransactionV0 = new VersionedTransaction(updateRewardMappingTx);
      updateRewardMappingsTransactionV0.sign([signer, ix[1]]);
      //@ts-ignore
      txHash = await sendAndConfirmTransaction(kamino._connection, updateRewardMappingsTransactionV0);
      console.log('update reward mappings tx hash', txHash);
    }

    // update rebalance params
    let updateRebalanceParamsIx = await kamino.getUpdateRebalancingParmsIxns(signer.publicKey, newStrategy.publicKey, [
      new Decimal(10.0),
      new Decimal(24.0),
    ]);
    let tx = createTransactionWithExtraBudget();
    tx.add(updateRebalanceParamsIx);
    let updateRebalanceParamsTxHash = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer]);
    console.log('update Rebalance Params Tx Hash ', updateRebalanceParamsTxHash);

    let strategyData = await kamino.getStrategies([newStrategy.publicKey]);
    expect(strategyData[0]?.rebalanceRaw.params[0] == 10.0);
    expect(strategyData[0]?.rebalanceRaw.params[2] == 24.0);

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

  it.skip('get raydium pool liquidity distribution', async () => {
    let raydiumService = new RaydiumService(connection, cluster);
    let liquidityDistribution = await raydiumService.getRaydiumPoolLiquidityDistribution(
      new PublicKey('2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv')
    );

    console.log('raydium liquidityDistribution', liquidityDistribution);
  });

  it.skip('get raydium pool liquidity distribution with range', async () => {
    let raydiumService = new RaydiumService(connection, cluster);
    let liquidityDistribution = await raydiumService.getRaydiumPoolLiquidityDistribution(
      new PublicKey('2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv'),
      true,
      -39470,
      -37360
    );

    console.log('raydium liquidityDistribution', liquidityDistribution);
  });

  it.skip('get raydium pool liquidity distribution with range inverse order', async () => {
    let raydiumService = new RaydiumService(connection, cluster);
    let liquidityDistribution = await raydiumService.getRaydiumPoolLiquidityDistribution(
      new PublicKey('2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv'),
      false,
      -39470,
      -37360
    );

    console.log('raydium liquidityDistribution', liquidityDistribution);
  });

  it.skip('get raydium positions for live pool', async () => {
    let raydiumService = new RaydiumService(connection, cluster);
    let liquidityDistribution = await raydiumService.getRaydiumPoolLiquidityDistribution(
      new PublicKey('61R1ndXxvsWXXkWSyNkCxnzwd3zUNB8Q2ibmkiLPC8ht')
    );

    console.log('raydium liquidityDistribution', liquidityDistribution);
  });

  it.skip('get orca pool liquidity distribution', async () => {
    let orcaService = new OrcaService(connection, cluster, GlobalConfigMainnet);
    let liquidityDistribution = await orcaService.getWhirlpoolLiquidityDistribution(
      new PublicKey('7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm')
    );

    console.log('orca liquidityDistribution', liquidityDistribution);
  });

  it.skip('get orca positions for pool', async () => {
    let orcaService = new OrcaService(connection, cluster, GlobalConfigMainnet);
    let positionsCount = await orcaService.getPositionsCountByPool(
      new PublicKey('7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm')
    );

    console.log('orca positions count', positionsCount);
  });

  it.skip('get raydium positions for pool', async () => {
    let raydiumService = new RaydiumService(connection, cluster);
    let positionsCount = await raydiumService.getPositionsCountByPool(
      new PublicKey('2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv')
    );

    console.log('raydium positions count', positionsCount);
  });

  it.skip('create new custom USDC-USDH percentage strategy on existing whirlpool', async () => {
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

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      'ORCA',
      new Decimal(1),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(Manual.discriminator),
      [], // not needed used for manual
      new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
      new PublicKey('USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX')
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createRaydiumStrategyAccountIx);
    ixs.push(buildNewStrategyIxs.initStrategyIx);
    const createStratTx = await kamino.getTransactionV2Message(signer.publicKey, ixs);
    const createStratTransactionV0 = new VersionedTransaction(createStratTx);
    createStratTransactionV0.sign([newStrategy, signer]);
    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, createStratTransactionV0);
    console.log('create strategy tx hash', txHash);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    const setupStratTx = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...buildNewStrategyIxs.updateStrategyParamsIxs, buildNewStrategyIxs.updateRebalanceParamsIx],
      [strategyLookupTable, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const setupStratTransactionV0 = new VersionedTransaction(setupStratTx);
    setupStratTransactionV0.sign([signer]);

    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, setupStratTransactionV0);
    console.log('setup strategy tx hash', txHash);

    // update rebalance params
    let updateRebalanceParamsIx = await kamino.getUpdateRebalancingParmsIxns(signer.publicKey, newStrategy.publicKey, [
      new Decimal(10.0),
      new Decimal(24.0),
    ]);
    let tx = createTransactionWithExtraBudget();
    tx.add(updateRebalanceParamsIx);
    let updateRebalanceParamsTxHash = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer]);
    console.log('update Rebalance Params Tx Hash ', updateRebalanceParamsTxHash);

    let strategyData = await kamino.getStrategies([newStrategy.publicKey]);
    expect(strategyData[0]?.rebalanceRaw.params[0] == 10.0);
    expect(strategyData[0]?.rebalanceRaw.params[2] == 24.0);

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

  //test create as PricePercentageWithreset -> Update to Manual -> move back to PricePercentageWithReset diff range
  it.skip('create new custom USDC-USDH percentage with reset strategy -> change to manual -> change back to reset with range', async () => {
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

    let lowerPriceBpsDifference = new Decimal(10.0);
    let upperPriceBpsDifference = new Decimal(10.0);
    let lowerPriceResetRange = new Decimal(5.0);
    let upperPriceResetRange = new Decimal(30.0);

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      'ORCA',
      new Decimal(1),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(PricePercentageWithReset.discriminator),
      [lowerPriceBpsDifference, upperPriceBpsDifference, lowerPriceResetRange, upperPriceResetRange],
      new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
      new PublicKey('USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX')
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createRaydiumStrategyAccountIx);
    ixs.push(buildNewStrategyIxs.initStrategyIx);
    const createStratTx = await kamino.getTransactionV2Message(signer.publicKey, ixs);
    const createStratTransactionV0 = new VersionedTransaction(createStratTx);
    createStratTransactionV0.sign([newStrategy, signer]);
    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, createStratTransactionV0);
    console.log('create strategy tx hash', txHash);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    const setupStratTx = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...buildNewStrategyIxs.updateStrategyParamsIxs, buildNewStrategyIxs.updateRebalanceParamsIx],
      [strategyLookupTable, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const setupStratTransactionV0 = new VersionedTransaction(setupStratTx);
    setupStratTransactionV0.sign([signer]);

    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, setupStratTransactionV0);
    console.log('setup strategy tx hash', txHash);

    // verify strategy rebalance params
    let strategyRebalanceParams = await kamino.readRebalancingParams(newStrategy.publicKey);
    expect(strategyRebalanceParams.find((x) => x.label == 'lowerRangeBps')!.value == lowerPriceBpsDifference);
    expect(strategyRebalanceParams.find((x) => x.label == 'upperRangeBps')!.value == upperPriceBpsDifference);
    expect(strategyRebalanceParams.find((x) => x.label == 'resetLowerRangeBps')!.value == lowerPriceResetRange);
    expect(strategyRebalanceParams.find((x) => x.label == 'resetUpperRangeBps')!.value == lowerPriceResetRange);

    // open position
    const openPositionIxns = buildNewStrategyIxs.openPositionIxs;
    const openPositionMessage = await kamino.getTransactionV2Message(signer.publicKey, openPositionIxns, [
      strategyLookupTable,
      MAINNET_GLOBAL_LOOKUP_TABLE,
    ]);
    const openPositionTx = new VersionedTransaction(openPositionMessage);
    openPositionTx.sign([signer, newPosition]);

    //@ts-ignore
    const openPositionTxId = await sendAndConfirmTransaction(kamino._connection, openPositionTx);
    console.log('openPositionTxId', openPositionTxId);

    // read prices
    let pricesRebalanceParams = await kamino.readRebalancingParams(newStrategy.publicKey);
    console.log('pricesRebalanceParams', pricesRebalanceParams);
  });

  it.skip('test read rebalance params from existent percentageWithReset strategy', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    let strat = new PublicKey('8RsjvJ9VoLNJb5veXzbyc7DKqvPG296oY2BsPnuxPTQ2');
    let pricesRebalanceParams = await kamino.readRebalancingParams(strat);
    console.log('pricesRebalanceParams', pricesRebalanceParams);
  });

  it.skip('create new custom USDC-USDH percentage strategy on existing whirlpool and open position', async () => {
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

    let lowerPriceBpsDifference = new Decimal(10.0);
    let upperPriceBpsDifference = new Decimal(11.0);

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      'ORCA',
      new Decimal(1),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(PricePercentage.discriminator),
      [lowerPriceBpsDifference, upperPriceBpsDifference],
      new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
      new PublicKey('USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX')
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createRaydiumStrategyAccountIx);
    ixs.push(buildNewStrategyIxs.initStrategyIx);
    const createStratTx = await kamino.getTransactionV2Message(signer.publicKey, ixs);
    const createStratTransactionV0 = new VersionedTransaction(createStratTx);
    createStratTransactionV0.sign([newStrategy, signer]);
    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, createStratTransactionV0);
    console.log('create strategy tx hash', txHash);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    const setupStratTx = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...buildNewStrategyIxs.updateStrategyParamsIxs, buildNewStrategyIxs.updateRebalanceParamsIx],
      [strategyLookupTable, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const setupStratTransactionV0 = new VersionedTransaction(setupStratTx);
    setupStratTransactionV0.sign([signer]);

    // verify strategy rebalance params
    let strategyData = await kamino.getStrategies([newStrategy.publicKey]);
    expect(strategyData[0]?.rebalanceRaw.params[0].toString() == lowerPriceBpsDifference.toString());
    expect(strategyData[0]?.rebalanceRaw.params[2].toString() == upperPriceBpsDifference.toString());

    // open position
    const openPositionMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      buildNewStrategyIxs.openPositionIxs,
      [strategyLookupTable, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const openPositionTx = new VersionedTransaction(openPositionMessage);
    openPositionTx.sign([signer, newPosition]);

    //@ts-ignore
    const openPositionTxId = await sendAndConfirmTransaction(kamino._connection, openPositionTx);
    console.log('openPositionTxId', openPositionTxId);
  });

  it.skip('create new custom SOL-BONK percentage strategy on existing whirlpool and open position', async () => {
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

    let lowerPriceBpsDifference = new Decimal(100.0);
    let upperPriceBpsDifference = new Decimal(110.0);

    let buildNewStrategyIxs = await kamino.getBuildStrategyIxns(
      'ORCA',
      new Decimal(30),
      newStrategy.publicKey,
      newPosition.publicKey,
      signer.publicKey,
      new Decimal(PricePercentage.discriminator),
      [lowerPriceBpsDifference, upperPriceBpsDifference],
      new PublicKey('So11111111111111111111111111111111111111112'),
      new PublicKey('DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263')
    );

    let ixs: TransactionInstruction[] = [];
    ixs.push(createRaydiumStrategyAccountIx);
    ixs.push(buildNewStrategyIxs.initStrategyIx);
    const createStratTx = await kamino.getTransactionV2Message(signer.publicKey, ixs);
    const createStratTransactionV0 = new VersionedTransaction(createStratTx);
    createStratTransactionV0.sign([newStrategy, signer]);
    //@ts-ignore
    let txHash = await sendAndConfirmTransaction(kamino._connection, createStratTransactionV0);
    console.log('create strategy tx hash', txHash);

    // set up lookup table for strategy
    let strategyLookupTable = await kamino.setupStrategyLookupTable(signer, newStrategy.publicKey);

    const setupStratTx = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...buildNewStrategyIxs.updateStrategyParamsIxs, buildNewStrategyIxs.updateRebalanceParamsIx],
      [strategyLookupTable, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const setupStratTransactionV0 = new VersionedTransaction(setupStratTx);
    setupStratTransactionV0.sign([signer]);

    //@ts-ignore
    txHash = await sendAndConfirmTransaction(kamino._connection, setupStratTransactionV0);
    console.log('setup strategy tx hash', txHash);

    // verify strategy rebalance params
    let strategyData = await kamino.getStrategies([newStrategy.publicKey]);
    expect(strategyData[0]?.rebalanceRaw.params[0].toString() == lowerPriceBpsDifference.toString());
    expect(strategyData[0]?.rebalanceRaw.params[2].toString() == upperPriceBpsDifference.toString());

    // open position
    const openPositionMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      buildNewStrategyIxs.openPositionIxs
    );
    const openPositionTx = new VersionedTransaction(openPositionMessage);
    openPositionTx.sign([signer, newPosition]);

    //@ts-ignore
    const openPositionTxId = await sendAndConfirmTransaction(kamino._connection, openPositionTx);
    console.log('openPositionTxId', openPositionTxId);
  });

  it.skip('one click single sided deposit USDC in USDH-USDC', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    // let strategy = new PublicKey('Cfuy5T6osdazUeLego5LFycBQebm9PP3H7VNdCndXXEN');
    let strategy = new PublicKey('CEz5keL9hBCUbtVbmcwenthRMwmZLupxJ6YtYAgzp4ex');

    let strategyState = (await kamino.getStrategies([strategy]))[0];
    if (!strategyState) {
      throw new Error('strategy not found');
    }

    let amountToDeposit = new Decimal(0.1);
    let slippageBps = new Decimal(10);

    let singleSidedDepositIxs: TransactionInstruction[] = [];
    let lookupTables: PublicKey[] = [strategyState.strategyLookupTable];

    const initialTokenBalances = await kamino.getInitialUserTokenBalances(
      signer.publicKey,
      strategyState.tokenAMint,
      strategyState.tokenBMint,
      undefined
    );

    // if USDC is tokenA mint deposit tokenA, else deposit tokenB
    if (strategyState.tokenAMint == USDCMintMainnet) {
      let { instructions, lookupTablesAddresses } = await profiledFunctionExecution(
        kamino.singleSidedDepositTokenA(
          { strategy: strategyState!, address: strategy },
          amountToDeposit,
          signer.publicKey,
          slippageBps,
          profiledFunctionExecution,
          undefined,
          undefined // initialTokenBalances
        ),
        'singleSidedDepositTokenA',
        []
      );
      singleSidedDepositIxs = instructions;
      lookupTables.push(...lookupTablesAddresses);
    } else {
      let { instructions, lookupTablesAddresses } = await profiledFunctionExecution(
        kamino.singleSidedDepositTokenB(
          { strategy: strategyState!, address: strategy },
          amountToDeposit,
          signer.publicKey,
          slippageBps,
          profiledFunctionExecution,
          undefined,
          undefined // initialTokenBalances
        ),
        'singleSidedDepositTokenB',
        []
      );
      singleSidedDepositIxs = instructions;
      lookupTables.push(...lookupTablesAddresses);
    }

    const singleSidedDepositMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...getComputeBudgetAndPriorityFeeIxns(1_400_000), ...singleSidedDepositIxs],
      [...lookupTables, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const singleSidedDepositTx = new VersionedTransaction(singleSidedDepositMessage);
    singleSidedDepositTx.sign([signer]);

    try {
      //@ts-ignore
      // const depositTxId = await sendAndConfirmTransaction(kamino._connection, singleSidedDepositTx);
      const depositTxId = await kamino._connection.simulateTransaction(singleSidedDepositTx);
      console.log('singleSidedDepoxit tx hash', depositTxId);
    } catch (e) {
      console.log(e);
    }

    // const simulateTransaction = async (txn: VersionedTransaction, connection: Connection) => {
    //   const { blockhash } = await connection.getLatestBlockhash();
    //   return connection.simulateTransaction(txn);
    // };
  });

  it.skip('one click single sided deposit USDC in SOL-USDC strat', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    let strategy = new PublicKey('CEz5keL9hBCUbtVbmcwenthRMwmZLupxJ6YtYAgzp4ex');

    let strategyState = (await kamino.getStrategies([strategy]))[0];
    if (!strategyState) {
      throw new Error('strategy not found');
    }

    let amountToDeposit = new Decimal(1.0);
    let slippageBps = new Decimal(100);

    let singleSidedDepositIxs: TransactionInstruction[] = [];
    let lookupTables: PublicKey[] = [];
    // if USDC is tokenA mint deposit tokenA, else deposit tokenB
    if (strategyState.tokenAMint.toString() === USDCMintMainnet.toString()) {
      let { instructions, lookupTablesAddresses } = await kamino.singleSidedDepositTokenA(
        strategy,
        amountToDeposit,
        signer.publicKey,
        slippageBps
      );
      singleSidedDepositIxs = instructions;
      lookupTables = lookupTablesAddresses;
    } else {
      let { instructions, lookupTablesAddresses } = await kamino.singleSidedDepositTokenB(
        strategy,
        amountToDeposit,
        signer.publicKey,
        slippageBps
      );
      singleSidedDepositIxs = instructions;
      lookupTables = lookupTablesAddresses;
    }

    const singleSidedDepositMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...getComputeBudgetAndPriorityFeeIxns(1_400_000), ...singleSidedDepositIxs],
      [...lookupTables, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const singleSidedDepositTx = new VersionedTransaction(singleSidedDepositMessage);
    singleSidedDepositTx.sign([signer]);

    try {
      //@ts-ignore
      const depositTxId = await sendAndConfirmTransaction(kamino._connection, singleSidedDepositTx);
      console.log('singleSidedDepoxit tx hash', depositTxId);
    } catch (e) {
      console.log(e);
    }
  });

  it.skip('one click single sided deposit SOL in SOL-USDC strat', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    let strategy = new PublicKey('CEz5keL9hBCUbtVbmcwenthRMwmZLupxJ6YtYAgzp4ex');

    let strategyState = (await kamino.getStrategies([strategy]))[0];
    if (!strategyState) {
      throw new Error('strategy not found');
    }

    let amountToDeposit = new Decimal(0.01);
    let slippageBps = new Decimal(50);

    let singleSidedDepositIxs: TransactionInstruction[] = [];
    let lookupTables: PublicKey[] = [];
    // if USDC is tokenA mint deposit tokenA, else deposit tokenB
    if (strategyState.tokenAMint.toString() === SOLMintMainnet.toString()) {
      let { instructions, lookupTablesAddresses } = await kamino.singleSidedDepositTokenA(
        strategy,
        amountToDeposit,
        signer.publicKey,
        slippageBps
      );
      singleSidedDepositIxs = instructions;
      lookupTables = lookupTablesAddresses;
    } else {
      let { instructions, lookupTablesAddresses } = await kamino.singleSidedDepositTokenB(
        strategy,
        amountToDeposit,
        signer.publicKey,
        slippageBps
      );
      singleSidedDepositIxs = instructions;
      lookupTables = lookupTablesAddresses;
    }

    const singleSidedDepositMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...getComputeBudgetAndPriorityFeeIxns(1_400_000), ...singleSidedDepositIxs],
      [...lookupTables, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const singleSidedDepositTx = new VersionedTransaction(singleSidedDepositMessage);
    singleSidedDepositTx.sign([signer]);

    //@ts-ignore
    const depositTxId = await sendAndConfirmTransaction(kamino._connection, singleSidedDepositTx);
    console.log('singleSidedDepoxit tx hash', depositTxId);
  });

  it.skip('one click single sided deposit SOL in RLB-SOL strat', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    let strategy = new PublicKey('AepjvYK4QfGhV3UjSRkZviR2AJAkLGtqdyKJFCf9kpz9');

    let strategyState = (await kamino.getStrategies([strategy]))[0];
    if (!strategyState) {
      throw new Error('strategy not found');
    }

    let amountToDeposit = new Decimal(0.02);
    let slippageBps = new Decimal(50);

    let singleSidedDepositIxs: TransactionInstruction[] = [];
    let lookupTables: PublicKey[] = [];
    // if USDC is tokenA mint deposit tokenA, else deposit tokenB
    if (strategyState.tokenAMint.toString() === SOLMintMainnet.toString()) {
      let { instructions, lookupTablesAddresses } = await kamino.singleSidedDepositTokenA(
        strategy,
        amountToDeposit,
        signer.publicKey,
        slippageBps
      );
      singleSidedDepositIxs = instructions;
      lookupTables = lookupTablesAddresses;
    } else {
      let { instructions, lookupTablesAddresses } = await kamino.singleSidedDepositTokenB(
        strategy,
        amountToDeposit,
        signer.publicKey,
        slippageBps
      );
      singleSidedDepositIxs = instructions;
      lookupTables = lookupTablesAddresses;
    }

    const singleSidedDepositMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...getComputeBudgetAndPriorityFeeIxns(1_400_000), ...singleSidedDepositIxs],
      [...lookupTables, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const singleSidedDepositTx = new VersionedTransaction(singleSidedDepositMessage);
    singleSidedDepositTx.sign([signer]);

    try {
      //@ts-ignore
      const depositTxId = await sendAndConfirmTransaction(kamino._connection, singleSidedDepositTx);
      console.log('singleSidedDepoxit tx hash', depositTxId);
    } catch (e) {
      console.log(e);
    }
  });

  it.skip('one click single sided deposit SOL in SOL-USDC strat with existent wSOL ata', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    //@ts-ignore
    let createWSolAtaIxns = await createWsolAtaIfMissing(kamino._connection, new Decimal(0.02), signer.publicKey);

    const createwSolAtaMessage = await kamino.getTransactionV2Message(signer.publicKey, createWSolAtaIxns.createIxns);
    const createwSolAtaTx = new VersionedTransaction(createwSolAtaMessage);
    createwSolAtaTx.sign([signer]);

    //@ts-ignore
    const createwSolAtaTxHash = await sendAndConfirmTransaction(kamino._connection, createwSolAtaTx);
    console.log('createSol tx hash', createwSolAtaTxHash);

    let strategy = new PublicKey('CEz5keL9hBCUbtVbmcwenthRMwmZLupxJ6YtYAgzp4ex');

    let strategyState = (await kamino.getStrategies([strategy]))[0];
    if (!strategyState) {
      throw new Error('strategy not found');
    }

    let amountToDeposit = new Decimal(0.1);
    let slippageBps = new Decimal(50);

    let singleSidedDepositIxs: TransactionInstruction[] = [];
    let lookupTables: PublicKey[] = [];
    // if USDC is tokenA mint deposit tokenA, else deposit tokenB
    if (strategyState.tokenAMint.toString() === SOLMintMainnet.toString()) {
      let { instructions, lookupTablesAddresses } = await kamino.singleSidedDepositTokenA(
        strategy,
        amountToDeposit,
        signer.publicKey,
        slippageBps
      );
      singleSidedDepositIxs = instructions;
      lookupTables = lookupTablesAddresses;
    } else {
      let { instructions, lookupTablesAddresses } = await kamino.singleSidedDepositTokenB(
        strategy,
        amountToDeposit,
        signer.publicKey,
        slippageBps
      );
      singleSidedDepositIxs = instructions;
      lookupTables = lookupTablesAddresses;
    }

    const singleSidedDepositMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...getComputeBudgetAndPriorityFeeIxns(1_400_000), ...singleSidedDepositIxs],
      [...lookupTables, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const singleSidedDepositTx = new VersionedTransaction(singleSidedDepositMessage);
    singleSidedDepositTx.sign([signer]);

    try {
      //@ts-ignore
      const depositTxId = await sendAndConfirmTransaction(kamino._connection, singleSidedDepositTx);
      console.log('singleSidedDepoxit tx hash', depositTxId);
    } catch (e) {
      console.log(e);
    }
  });

  it.skip('one click single sided deposit USDC in SOL-USDC strat with existent wSOL ata', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    //@ts-ignore
    let createWSolAtaIxns = await createWsolAtaIfMissing(kamino._connection, new Decimal(0.02), signer.publicKey);

    const createwSolAtaMessage = await kamino.getTransactionV2Message(signer.publicKey, createWSolAtaIxns.createIxns);
    const createwSolAtaTx = new VersionedTransaction(createwSolAtaMessage);
    createwSolAtaTx.sign([signer]);

    //@ts-ignore
    const createwSolAtaTxHash = await sendAndConfirmTransaction(kamino._connection, createwSolAtaTx);
    console.log('createSol tx hash', createwSolAtaTxHash);

    let strategy = new PublicKey('CEz5keL9hBCUbtVbmcwenthRMwmZLupxJ6YtYAgzp4ex');

    let strategyState = (await kamino.getStrategies([strategy]))[0];
    if (!strategyState) {
      throw new Error('strategy not found');
    }

    let amountToDeposit = new Decimal(0.1);
    let slippageBps = new Decimal(50);

    let singleSidedDepositIxs: TransactionInstruction[] = [];
    let lookupTables: PublicKey[] = [];
    // if USDC is tokenA mint deposit tokenA, else deposit tokenB
    if (strategyState.tokenAMint.toString() === USDCMintMainnet.toString()) {
      let { instructions, lookupTablesAddresses } = await kamino.singleSidedDepositTokenA(
        strategy,
        amountToDeposit,
        signer.publicKey,
        slippageBps
      );
      singleSidedDepositIxs = instructions;
      lookupTables = lookupTablesAddresses;
    } else {
      let { instructions, lookupTablesAddresses } = await kamino.singleSidedDepositTokenB(
        strategy,
        amountToDeposit,
        signer.publicKey,
        slippageBps
      );
      singleSidedDepositIxs = instructions;
      lookupTables = lookupTablesAddresses;
    }

    const singleSidedDepositMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...getComputeBudgetAndPriorityFeeIxns(1_400_000), ...singleSidedDepositIxs],
      [...lookupTables, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const singleSidedDepositTx = new VersionedTransaction(singleSidedDepositMessage);
    singleSidedDepositTx.sign([signer]);

    try {
      //@ts-ignore
      const depositTxId = await sendAndConfirmTransaction(kamino._connection, singleSidedDepositTx);
      console.log('singleSidedDepoxit tx hash', depositTxId);
    } catch (e) {
      console.log(e);
    }
  });

  it.skip('one click single sided deposit SOL in SOL-BONK strat with existent wSOL ata', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    //@ts-ignore
    let createWSolAtaIxns = await createWsolAtaIfMissing(kamino._connection, new Decimal(0.02), signer.publicKey);

    const createwSolAtaMessage = await kamino.getTransactionV2Message(signer.publicKey, createWSolAtaIxns.createIxns);
    const createwSolAtaTx = new VersionedTransaction(createwSolAtaMessage);
    createwSolAtaTx.sign([signer]);

    //@ts-ignore
    const createwSolAtaTxHash = await sendAndConfirmTransaction(kamino._connection, createwSolAtaTx);
    console.log('createSol tx hash', createwSolAtaTxHash);

    let strategy = new PublicKey('HWg7yB3C1BnmTKFMU3KGD7E96xx2rUhv4gxrwbZLXHBt');

    let strategyState = (await kamino.getStrategies([strategy]))[0];
    if (!strategyState) {
      throw new Error('strategy not found');
    }

    let amountToDeposit = new Decimal(0.01);
    let slippageBps = new Decimal(50);

    let singleSidedDepositIxs: TransactionInstruction[] = [];
    let lookupTables: PublicKey[] = [];
    // if SOL is tokenA mint deposit tokenA, else deposit tokenB
    if (strategyState.tokenAMint.toString() === SOLMintMainnet.toString()) {
      let { instructions, lookupTablesAddresses } = await kamino.singleSidedDepositTokenA(
        strategy,
        amountToDeposit,
        signer.publicKey,
        slippageBps
      );
      singleSidedDepositIxs = instructions;
      lookupTables = lookupTablesAddresses;
    } else {
      let { instructions, lookupTablesAddresses } = await kamino.singleSidedDepositTokenB(
        strategy,
        amountToDeposit,
        signer.publicKey,
        slippageBps
      );
      singleSidedDepositIxs = instructions;
      lookupTables = lookupTablesAddresses;
    }

    const singleSidedDepositMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...getComputeBudgetAndPriorityFeeIxns(1_400_000), ...singleSidedDepositIxs],
      [...lookupTables, MAINNET_GLOBAL_LOOKUP_TABLE]
    );
    const singleSidedDepositTx = new VersionedTransaction(singleSidedDepositMessage);
    singleSidedDepositTx.sign([signer]);

    try {
      //@ts-ignore
      const depositTxId = await sendAndConfirmTransaction(kamino._connection, singleSidedDepositTx);
      console.log('singleSidedDepoxit tx hash', depositTxId);
    } catch (e) {
      console.log(e);
    }
  });

  it.skip('one click single sided deposit SOL in SOL-USDH strat', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );
    const jupService = new JupService(kamino.getConnection(), cluster);

    let strategy = new PublicKey('CYLt3Bs51QT3WeFhjtYnPGZNDzdd6SY5vfUMa86gT2D8');

    let strategyState = (await kamino.getStrategies([strategy]))[0];
    if (!strategyState) {
      throw new Error('strategy not found');
    }

    const shareDataBefore = await kamino.getStrategyShareData(strategy);
    let sharesAtaBalanceBefore = await balance(kamino.getConnection(), signer, strategyState.sharesMint);
    const userSharesMvBefore = sharesAtaBalanceBefore! * shareDataBefore.price.toNumber();
    let amountToDeposit = new Decimal(0.01);
    {
      let aAtaBalance = await balance(kamino.getConnection(), signer, strategyState.tokenAMint);
      let bAtaBalance = await balance(kamino.getConnection(), signer, strategyState.tokenBMint);
      console.log('balances ', toJson({ aAtaBalance, bAtaBalance, sharesAtaBalanceBefore }));

      let aPrice = await JupService.getPrice(strategyState.tokenAMint, USDCMintMainnet);

      console.log('shareData', toJson(shareDataBefore));
      console.log('shares minted', strategyState.sharesIssued.toString());

      const userDepositMv = amountToDeposit.mul(aPrice).toNumber();
      console.log("user's deposit mv", userDepositMv);
      console.log('userShareMvBefore', userSharesMvBefore);
    }

    const slippageBps = new Decimal(100);

    let singleSidedDepositIxs: TransactionInstruction[] = [];
    let lookupTables: PublicKey[] = [MAINNET_GLOBAL_LOOKUP_TABLE];
    if (strategyState.strategyLookupTable != PublicKey.default) {
      lookupTables.push(strategyState.strategyLookupTable);
    }
    // if SOL is tokenA mint deposit tokenA, else deposit tokenB
    if (strategyState.tokenAMint.toString() === SOLMintMainnet.toString()) {
      let { instructions, lookupTablesAddresses } = await kamino.singleSidedDepositTokenA(
        strategy,
        amountToDeposit,
        signer.publicKey,
        slippageBps
      );
      singleSidedDepositIxs = instructions;
      lookupTables = lookupTables.concat(lookupTablesAddresses);
    } else {
      let { instructions, lookupTablesAddresses } = await kamino.singleSidedDepositTokenB(
        strategy,
        amountToDeposit,
        signer.publicKey,
        slippageBps
      );
      singleSidedDepositIxs = instructions;
      lookupTables = lookupTables.concat(lookupTablesAddresses);
    }

    console.log('lookupTables', lookupTables.length);
    const singleSidedDepositMessage = await kamino.getTransactionV2Message(
      signer.publicKey,
      [...getComputeBudgetAndPriorityFeeIxns(1_400_000), ...singleSidedDepositIxs],
      lookupTables
    );
    const singleSidedDepositTx = new VersionedTransaction(singleSidedDepositMessage);
    singleSidedDepositTx.sign([signer]);

    try {
      //@ts-ignore
      const depositTxId = await sendAndConfirmTransaction(kamino._connection, singleSidedDepositTx);
      console.log('singleSidedDepoxit tx hash', depositTxId);
    } catch (e) {
      console.log(e);
    }

    await sleep(5000);

    let sharesAtaBalanceAfter = await balance(kamino.getConnection(), signer, strategyState.sharesMint);
    const shareDataAfter = await kamino.getStrategyShareData(strategy);
    const userSharesMvAfter = sharesAtaBalanceAfter! * shareDataAfter.price.toNumber();
    {
      console.log('after deposit');
      let aAtaBalance = await balance(kamino.getConnection(), signer, strategyState.tokenAMint);
      let bAtaBalance = await balance(kamino.getConnection(), signer, strategyState.tokenBMint);
      console.log('balances ', toJson({ aAtaBalance, bAtaBalance, sharesAtaBalanceAfter }));

      let aPrice = await JupService.getPrice(strategyState.tokenAMint, USDCMintMainnet);
      let bPrice = await JupService.getPrice(strategyState.tokenBMint, USDCMintMainnet);

      console.log('shareData', toJson(shareDataAfter));
      console.log('shares minted', strategyState.sharesIssued.toString());

      const userSharesMv = sharesAtaBalanceAfter! * shareDataAfter.price.toNumber();
      console.log("user's shares mv", userSharesMv);

      const diffMv = userSharesMvAfter - userSharesMvBefore;
      console.log('userSharesMvAfter', userSharesMvAfter);
      console.log('diff mv', diffMv);
    }
  });

  it.skip('create wSOL ata', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    //@ts-ignore
    let createWSolAtaIxns = await createWsolAtaIfMissing(kamino._connection, new Decimal(0), signer.publicKey);

    const createwSolAtaMessage = await kamino.getTransactionV2Message(signer.publicKey, createWSolAtaIxns.createIxns);
    const createwSolAtaTx = new VersionedTransaction(createwSolAtaMessage);
    createwSolAtaTx.sign([signer]);

    try {
      //@ts-ignore
      const createwSolAtaTxHash = await sendAndConfirmTransaction(kamino._connection, createwSolAtaTx);
      console.log('singleSidedDepoxit tx hash', createwSolAtaTxHash);
    } catch (e) {
      console.log(e);
    }
  });

  it.skip('read strategies share data on devnet', async () => {
    let devnetConnection = new Connection('https://api.devnet.solana.com', 'processed');
    let kamino = new Kamino('devnet', devnetConnection);

    const shareData = await kamino.getStrategiesShareData({});
    console.log('shareData', shareData.length);
  });

  it.skip('amounts distribution to be deposited with price range Orca', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    let [tokenAAmount, tokenBAmount] = await kamino.calculateAmountsDistributionWithPriceRange(
      'ORCA',
      new PublicKey('7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm'),
      new Decimal(22.464697),
      new Decimal(32.301927)
    );

    console.log('tokenAAmount', tokenAAmount.toString());
    console.log('tokenBAmount', tokenBAmount.toString());
  });

  it.skip('amounts distribution to be deposited with price range Raydium', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    let [tokenAAmount, tokenBAmount] = await kamino.calculateAmountsDistributionWithPriceRange(
      'RAYDIUM',
      new PublicKey('2QdhepnKRTLjjSqPL1PtKNwqrUkoLee5Gqs8bvZhRdMv'),
      new Decimal(21.540764564),
      new Decimal(32.295468218)
    );

    console.log('tokenAAmount', tokenAAmount.toString());
    console.log('tokenBAmount', tokenBAmount.toString());
  });

  // example of successed tx: 5q5u6buXUVbN2N8heGwecrdWDXJpKRMiuSe9RmXhmS73P3Ex41zYu5XXDBiAP8YWpHErFegpcyijvRDYFjsMUhhb
  it.skip('initialize tick for Orca pool', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    let initPoolTickIfNeeded = await kamino.initializeTickForOrcaPool(
      signer.publicKey,
      new PublicKey('7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm'),
      new Decimal(0.1)
    );

    if (initPoolTickIfNeeded.initTickIx) {
      const initTickIx = await kamino.getTransactionV2Message(signer.publicKey, [initPoolTickIfNeeded.initTickIx]);
      const txV0 = new VersionedTransaction(initTickIx);
      txV0.sign([signer]);
      //@ts-ignore
      const txHash = await sendAndConfirmTransaction(kamino._connection, txV0);
      console.log('init tick tx hash', txHash);
    }
  });
});

export async function profiledFunctionExecution(
  promise: Promise<any>,
  transactionName: string,
  tags: [string, string][] = []
): Promise<any> {
  const startTime = Date.now(); // Start time

  const prefix = '[PROFILING]';
  console.log(prefix, `function=${transactionName} event=start ts=${new Date(startTime).toISOString()}`);

  let result;
  try {
    result = await promise; // Execute the passed function
  } catch (error) {
    throw error; // rethrow the error after setting the status
  }

  const endTime = Date.now(); // End time
  const duration = (endTime - startTime) / 1000; // Duration in seconds

  console.log(prefix, `function=${transactionName} event=finish ts=${new Date(endTime).toISOString()}`);
  console.log(prefix, `function=${transactionName} event=measure duration=${duration.toFixed(2)} seconds`);

  return result;
}
