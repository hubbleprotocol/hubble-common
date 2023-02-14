import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import { Dex, Kamino, sendTransactionWithLogs, sleep } from '../src';
import Decimal from 'decimal.js';
import {
  assignBlockInfoToTransaction,
  createTransactionWithExtraBudget,
  getAssociatedTokenAddressAndData,
} from '../src';
import * as Instructions from '../src/kamino-client/instructions';
import { GlobalConfigOption, GlobalConfigOptionKind, UpdateCollateralInfoMode } from '../src/kamino-client/types';
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
} from './utils';
import {
  AllowDepositWithoutInvest,
  UpdateDepositCap,
  UpdateDepositCapIxn,
  UpdateMaxDeviationBps,
} from '../src/kamino-client/types/StrategyConfigOption';
import { expect } from 'chai';
import { WHIRLPOOL_PROGRAM_ID } from '../src/whirpools-client/programId';

export const LOCAL_RAYDIUM_PROGRAM_ID = new PublicKey('devi51mZmdwUJGU9hjN27vEz64Gps7uUefqxg27EAtH');
export const USDH_SCOPE_CHAIN_ID = BigInt(12);
export const USDC_SCOPE_CHAIN_ID = BigInt(20);

describe('Kamino SDK Tests', () => {
  let connection: Connection;
  // const cluster: Cluster = 'localnet';
  const cluster = 'localnet';
  const clusterUrl: string = 'http://127.0.0.1:8899';
  connection = new Connection(clusterUrl, 'processed');

  let fixtures = {
    kaminoProgramId: new PublicKey('E6qbhrt4pFmCotNUSSEh6E5cRQCEJpMcd79Z56EG9KY'),
    globalConfig: new PublicKey('GKnHiWh3RRrE1zsNzWxRkomymHc374TvJPSTv2wPeYdB'),
    newWhirlpool: new PublicKey('Fvtf8VCjnkqbETA6KtyHYqHm26ut6w184Jqm4MQjPvv7'),
    newOrcaStrategy: new PublicKey('Cfuy5T6osdazUeLego5LFycBQebm9PP3H7VNdCndXXEN'),
    newRaydiumPool: new PublicKey('3tD34VtprDSkYCnATtQLCiVgTkECU3d12KtjupeR6N2X'),
    newRaydiumStrategy: new PublicKey('AL6Yd51aSY3S9wpuypJYKtEf65xBSXKpfUCxN54CaWeE'),
    scopePrices: new PublicKey('3NJYftD5sjVfxSnUdZ1wVML8f3aC6mp1CXCL6L7TnU8C'),
    scopeProgram: new PublicKey('HFn8GnPADiny6XqUoWE8uRPPxb29ikn4yTuPa9MF2fWJ'),
    newTokenMintA: new PublicKey('USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX'),
    newTokenMintB: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    tokenInfos: new PublicKey('3v6ootgJJZbSWEDfZMA1scfh7wcsVVfeocExRxPqCyWH'),

    signerPrivateKey: [
      243, 40, 114, 191, 142, 196, 87, 228, 207, 36, 182, 90, 227, 157, 113, 142, 144, 182, 242, 100, 81, 173, 42, 201,
      95, 86, 24, 160, 85, 13, 75, 165, 19, 134, 236, 53, 139, 222, 86, 12, 231, 163, 29, 94, 127, 22, 32, 59, 201, 57,
      176, 47, 122, 158, 162, 215, 43, 194, 124, 8, 216, 20, 46, 253,
    ],
  };

  const signer = Keypair.fromSecretKey(Uint8Array.from(fixtures.signerPrivateKey));

  before(async () => {
    connection = new Connection(clusterUrl, 'processed');
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );
    // @ts-ignore
    kamino._scope._config.scope.oraclePrices = fixtures.scopePrices;
    // @ts-ignore
    kamino._scope._config.scope.programId = fixtures.scopeProgram;

    let tokenAMint = await createMint(connection, signer, 6);
    let tokenBMint = await createMint(connection, signer, 6);
    console.log('Mints initialized');
    let tokens = orderMints(tokenAMint, tokenBMint);
    tokenAMint = tokens[0];
    tokenBMint = tokens[1];
    fixtures.newTokenMintA = tokenAMint;
    fixtures.newTokenMintB = tokenBMint;
    kamino._config.kamino.mints.push({ address: tokenAMint, scopeToken: 'USDH' });
    kamino._config.kamino.mints.push({ address: tokenBMint, scopeToken: 'USDC' });

    let globalConfig = await setUpGlobalConfig(kamino, signer, fixtures.scopeProgram, fixtures.scopePrices);
    console.log('globalConfig initialized ', globalConfig.toString());
    kamino.setGlobalConfig(globalConfig);

    let collateralInfo = await setUpCollateralInfo(kamino, signer);
    await sleep(1000);

    await updateCollateralInfoForToken(
      // @ts-ignore
      kamino._connection,
      signer,
      1,
      USDH_SCOPE_CHAIN_ID,
      globalConfig,
      'USDH',
      BigInt(0),
      tokenAMint
    );

    await updateCollateralInfoForToken(
      // @ts-ignore
      kamino._connection,
      signer,
      0,
      USDC_SCOPE_CHAIN_ID,
      globalConfig,
      'USDC',
      BigInt(0),
      tokenBMint
    );

    await sleep(100);
    fixtures.tokenInfos = collateralInfo;

    // @ts-ignore
    let treasuryFeeVaults = await kamino.getTreasuryFeeVaultPDAs(tokenAMint, tokenBMint);
    let updateTreasuryFeeA = await updateTreasuryFeeVault(
      connection,
      signer,
      globalConfig,
      'USDH',
      tokenAMint,
      treasuryFeeVaults.treasuryFeeTokenAVault,
      treasuryFeeVaults.treasuryFeeVaultAuthority
    );
    console.log('updateTreasuryFeeA tx', updateTreasuryFeeA);

    let updateTreasuryFeeB = await updateTreasuryFeeVault(
      connection,
      signer,
      globalConfig,
      'USDC',
      tokenBMint,
      treasuryFeeVaults.treasuryFeeTokenBVault,
      treasuryFeeVaults.treasuryFeeVaultAuthority
    );
    console.log('updateTreasuryFeeB tx', updateTreasuryFeeB);

    let raydiumPool = await initializeRaydiumPool(
      connection,
      signer,
      1,
      fixtures.newTokenMintA,
      fixtures.newTokenMintB
    );
    fixtures.newRaydiumPool = raydiumPool.pool;
    let createRaydiumTx = createTransactionWithExtraBudget(signer.publicKey);
    const newRaydiumStrategy = Keypair.generate();
    const createRaydiumStrategyAccountIx = await kamino.createStrategyAccount(
      signer.publicKey,
      newRaydiumStrategy.publicKey
    );

    createRaydiumTx.add(createRaydiumStrategyAccountIx);
    let raydiumStrategyIx = await kamino.createStrategy(
      newRaydiumStrategy.publicKey,
      raydiumPool.pool,
      signer.publicKey,
      'USDH',
      'USDC',
      'RAYDIUM'
    );

    createRaydiumTx.add(raydiumStrategyIx);
    let raydiumTxHash = await sendTransactionWithLogs(connection, createRaydiumTx, signer.publicKey, [
      signer,
      newRaydiumStrategy,
    ]);
    console.log('transaction hash', raydiumTxHash);
    console.log('new Raydium strategy has been created', newRaydiumStrategy.publicKey.toString());
    fixtures.newRaydiumStrategy = newRaydiumStrategy.publicKey;

    let whirlpool = await initializeWhirlpool(connection, signer, 1, tokenAMint, tokenBMint);
    fixtures.newWhirlpool = whirlpool.pool;
    console.log('whilrpool is ', whirlpool.pool.toString());

    let tx = createTransactionWithExtraBudget(signer.publicKey);
    const newOrcaStrategy = Keypair.generate();
    const createStrategyAccountIx = await kamino.createStrategyAccount(signer.publicKey, newOrcaStrategy.publicKey);
    tx.add(createStrategyAccountIx);
    let orcaStrategyIx = await kamino.createStrategy(
      newOrcaStrategy.publicKey,
      whirlpool.pool,
      signer.publicKey,
      'USDH',
      'USDC',
      'ORCA'
    );
    tx.add(orcaStrategyIx);

    const txHash = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer, newOrcaStrategy]);
    console.log('transaction hash', txHash);
    console.log('new Orca strategy has been created', newOrcaStrategy.publicKey.toString());

    fixtures.newOrcaStrategy = newOrcaStrategy.publicKey;

    await updateStrategyConfig(
      connection,
      signer,
      fixtures.newOrcaStrategy,
      new UpdateDepositCapIxn(),
      new Decimal(1000000000000000)
    );
    await updateStrategyConfig(
      connection,
      signer,
      fixtures.newOrcaStrategy,
      new UpdateDepositCap(),
      new Decimal(10000000000000000)
    );
    await updateStrategyConfig(
      connection,
      signer,
      fixtures.newOrcaStrategy,
      new UpdateMaxDeviationBps(),
      new Decimal(100)
    );
    await updateStrategyConfig(
      connection,
      signer,
      fixtures.newOrcaStrategy,
      new AllowDepositWithoutInvest(),
      new Decimal(1)
    );

    await updateStrategyConfig(
      connection,
      signer,
      fixtures.newRaydiumStrategy,
      new UpdateDepositCapIxn(),
      new Decimal(100000000000000)
    );
    await updateStrategyConfig(
      connection,
      signer,
      fixtures.newRaydiumStrategy,
      new UpdateDepositCap(),
      new Decimal(100000000000000)
    );
    await updateStrategyConfig(
      connection,
      signer,
      fixtures.newRaydiumStrategy,
      new UpdateMaxDeviationBps(),
      new Decimal(100)
    );
    await updateStrategyConfig(
      connection,
      signer,
      fixtures.newRaydiumStrategy,
      new AllowDepositWithoutInvest(),
      new Decimal(1)
    );

    await openPosition(kamino, signer, newOrcaStrategy.publicKey, new Decimal(0.97), new Decimal(1.03));
    await openPosition(kamino, signer, newRaydiumStrategy.publicKey, new Decimal(0.97), new Decimal(1.03));
  });

  it('should throw on invalid cluster', () => {
    // @ts-ignore
    const init = () => new Kamino('invalid-clusters', undefined);
    expect(init).to.throw(Error);
  });

  it('should get all strategies', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );
    const allStrategies = await kamino.getStrategies([fixtures.newOrcaStrategy]);
    expect(allStrategies.length).to.be.greaterThan(0);
    for (const strat of allStrategies) {
      expect(strat).not.to.be.null;
      console.log(strat?.pool.toString());
    }
  });
  it('should get strategy by address', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );
    const strategy = await kamino.getStrategyByAddress(fixtures.newOrcaStrategy);
    expect(strategy).not.to.be.null;
    console.log(strategy?.toJSON());
  });

  it('should get RAYDIUM strategy share price', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );

    const strategy = await kamino.getStrategyByAddress(fixtures.newRaydiumStrategy);
    expect(strategy).not.to.be.null;
    const price = await kamino.getStrategyShareData(fixtures.newRaydiumStrategy);
    expect(price.price.toNumber()).to.be.greaterThanOrEqual(0);
    console.log(price);
  });

  it('should get Orca strategy share price', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );

    const strategyState = await kamino.getStrategyByAddress(fixtures.newOrcaStrategy);
    expect(strategyState).not.to.be.null;
    if (strategyState == null) {
      throw new Error(`Could not fetch strategy for pubkey ${fixtures.newOrcaStrategy.toString()}`);
    }

    const price = await kamino.getStrategyShareData(fixtures.newOrcaStrategy);
    expect(price.price.toNumber()).to.be.greaterThanOrEqual(0);
    console.log(price);
  });

  it('should get all strategy holders', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );

    const solAirdropAmount = new Decimal(1);
    const usdcAirdropAmount = new Decimal(100);
    const usdhAirdropAmount = new Decimal(100);

    let user = await createUser(
      connection,
      signer,
      fixtures.newOrcaStrategy,
      solAirdropAmount,
      usdcAirdropAmount,
      usdhAirdropAmount
    );

    const [usdcDeposit, usdhDeposit] = [new Decimal(5), new Decimal(5)];
    await kamino.deposit(fixtures.newOrcaStrategy, usdcDeposit, usdhDeposit, user.owner.publicKey);
    await sleep(2000);

    const strategy = await kamino.getStrategyByAddress(fixtures.newOrcaStrategy);
    expect(strategy).to.not.be.null;
    const accounts = await kamino.getStrategyHolders(fixtures.newOrcaStrategy);
    expect(accounts.length).to.be.greaterThan(0);
    const expectedShares = new Decimal(strategy!.sharesIssued.toString())
      .div(new Decimal(10).pow(strategy!.sharesMintDecimals.toString()))
      .toNumber();
    const actualShares = accounts.map((x) => x.amount.toNumber()).reduce((partialSum, a) => partialSum + a, 0);
    expect(expectedShares).to.eq(actualShares);
  });

  it('should get all whirlpools', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );
    console.log(await kamino.getWhirlpools([fixtures.newWhirlpool]));
  });

  it('should get all Raydium pools', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );
    console.log(await kamino.getRaydiumPools([fixtures.newRaydiumPool]));
  });

  it('should withdraw shares from a Orca strategy', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );
    const strategyState = await kamino.getStrategyByAddress(fixtures.newOrcaStrategy);
    expect(strategyState).not.to.be.null;
    if (strategyState == null) {
      throw new Error(`Could not fetch strategy for pubkey ${fixtures.newOrcaStrategy.toString()}`);
    }

    let tx = createTransactionWithExtraBudget(signer.publicKey, 12000000);
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

    let strategyWithAddres = { address: fixtures.newOrcaStrategy, strategy: strategyState };
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
    if (ataInstructions.length > 0) {
      tx.add(...ataInstructions);
    }

    let res = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer]);
    console.log('res createAtas ', res);

    const [usdcDeposit, usdhDeposit] = [new Decimal(5), new Decimal(5)];
    await mintTo(connection, signer, strategyState.tokenAMint, tokenAAta, 9000000);
    await mintTo(connection, signer, strategyState.tokenBMint, tokenBAta, 9000000);
    await sleep(5000);

    let depositIx = await kamino.deposit(fixtures.newOrcaStrategy, usdcDeposit, usdhDeposit, signer.publicKey);
    let depositTx = createTransactionWithExtraBudget(signer.publicKey, 1200000);
    depositTx.add(depositIx);
    sendTransactionWithLogs(connection, depositTx, signer.publicKey, [signer]);

    const strategy = (await kamino.getStrategyByAddress(fixtures.newOrcaStrategy))!;
    const strategyWithAddress = { strategy, address: fixtures.newOrcaStrategy };

    let withdrawTx = createTransactionWithExtraBudget(signer.publicKey);

    const withdrawIx = await kamino.withdrawShares(strategyWithAddress, new Decimal(0.2), signer.publicKey);
    withdrawTx.add(withdrawIx);

    withdrawTx = await assignBlockInfoToTransaction(connection, withdrawTx, signer.publicKey);

    const txHash = await sendAndConfirmTransaction(connection, withdrawTx, [signer], {
      commitment: 'processed',
      skipPreflight: true,
    });
    console.log(txHash);
  });

  it('should withdraw shares from a Raydium strategy', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );

    const strategyState = await kamino.getStrategyByAddress(fixtures.newRaydiumStrategy);
    expect(strategyState).not.to.be.null;
    if (strategyState == null) {
      throw new Error(`Could not fetch strategy for pubkey ${fixtures.newRaydiumStrategy.toString()}`);
    }

    let strategyWithAddress = { address: fixtures.newRaydiumStrategy, strategy: strategyState };
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
    let tx = createTransactionWithExtraBudget(signer.publicKey);
    const ataInstructions = await kamino.getCreateAssociatedTokenAccountInstructionsIfNotExist(
      signer.publicKey,
      strategyWithAddress,
      tokenAData,
      tokenAAta,
      tokenBData,
      tokenBAta,
      sharesMintData,
      sharesAta
    );
    if (ataInstructions.length > 0) {
      tx.add(...ataInstructions);
    }

    let res = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer]);
    console.log('res createAtas ', res);
    await mintTo(connection, signer, strategyState.tokenAMint, tokenAAta, 9000000);
    await mintTo(connection, signer, strategyState.tokenBMint, tokenBAta, 9000000);
    await sleep(5000);

    let withdrawTx = createTransactionWithExtraBudget(signer.publicKey);
    const withdrawIx = await kamino.withdrawShares(strategyWithAddress, new Decimal(0.02), signer.publicKey);
    tx.add(withdrawIx);

    withdrawTx = await assignBlockInfoToTransaction(connection, withdrawTx, signer.publicKey);

    const txHash = await sendAndConfirmTransaction(connection, withdrawTx, [signer], {
      commitment: 'processed',
      skipPreflight: true,
    });
    console.log(txHash);
  });

  it('should withdraw all shares from an Orca strategy', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );

    const strategy = (await kamino.getStrategyByAddress(fixtures.newOrcaStrategy))!;
    const strategyWithAddress = { strategy, address: fixtures.newOrcaStrategy };

    const solAirdropAmount = new Decimal(1);
    const usdcAirdropAmount = new Decimal(100);
    const usdhAirdropAmount = new Decimal(100);

    let user = await createUser(
      connection,
      signer,
      fixtures.newOrcaStrategy,
      solAirdropAmount,
      usdcAirdropAmount,
      usdhAirdropAmount
    );

    let tx = createTransactionWithExtraBudget(user.owner.publicKey, 1200000);

    const depositIx = await kamino.deposit(strategyWithAddress, new Decimal(1), new Decimal(2), user.owner.publicKey);
    tx.add(depositIx);

    tx = await assignBlockInfoToTransaction(connection, tx, user.owner.publicKey);

    let txHash = await sendAndConfirmTransaction(connection, tx, [user.owner], {
      commitment: 'processed',
      skipPreflight: true,
    });

    let withdrawTx = createTransactionWithExtraBudget(user.owner.publicKey);

    const withdrawIx = await kamino.withdrawAllShares(strategyWithAddress, user.owner.publicKey);
    if (withdrawIx) {
      tx.add(withdrawIx);
    } else {
      console.log('balance is 0, cant withdraw');
      return;
    }

    withdrawTx = await assignBlockInfoToTransaction(connection, withdrawTx, user.owner.publicKey);

    txHash = await sendAndConfirmTransaction(connection, withdrawTx, [user.owner], {
      commitment: 'processed',
    });
    console.log(txHash);
  });

  it('should withdraw all shares from a Raydium strategy', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );

    const strategy = (await kamino.getStrategyByAddress(fixtures.newRaydiumStrategy))!;
    const strategyWithAddress = { strategy, address: fixtures.newRaydiumStrategy };

    const solAirdropAmount = new Decimal(1);
    const usdcAirdropAmount = new Decimal(100);
    const usdhAirdropAmount = new Decimal(100);

    let user = await createUser(
      connection,
      signer,
      fixtures.newRaydiumStrategy,
      solAirdropAmount,
      usdcAirdropAmount,
      usdhAirdropAmount
    );

    let tx = createTransactionWithExtraBudget(user.owner.publicKey, 1000000);

    const depositIx = await kamino.deposit(strategyWithAddress, new Decimal(1), new Decimal(2), user.owner.publicKey);
    tx.add(depositIx);

    tx = await assignBlockInfoToTransaction(connection, tx, user.owner.publicKey);

    let txHash = await sendAndConfirmTransaction(connection, tx, [user.owner], {
      commitment: 'processed',
      skipPreflight: true,
    });

    let withdrawTx = createTransactionWithExtraBudget(user.owner.publicKey, 1000000);

    const withdrawIx = await kamino.withdrawAllShares(strategyWithAddress, user.owner.publicKey);
    if (withdrawIx) {
      tx.add(withdrawIx);
    } else {
      console.log('balance is 0, cant withdraw');
      return;
    }

    withdrawTx = await assignBlockInfoToTransaction(connection, withdrawTx, user.owner.publicKey);

    txHash = await sendAndConfirmTransaction(connection, withdrawTx, [user.owner], {
      commitment: 'processed',
    });
    console.log(txHash);
  });

  it('should deposit tokens into an Orca strategy', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );

    const strategy = (await kamino.getStrategyByAddress(fixtures.newOrcaStrategy))!;
    const strategyWithAddress = { strategy, address: fixtures.newOrcaStrategy };

    const solAirdropAmount = new Decimal(1);
    const usdcAirdropAmount = new Decimal(100);
    const usdhAirdropAmount = new Decimal(100);

    let user = await createUser(
      connection,
      signer,
      fixtures.newOrcaStrategy,
      solAirdropAmount,
      usdcAirdropAmount,
      usdhAirdropAmount
    );

    let tx = createTransactionWithExtraBudget(user.owner.publicKey, 1200000);

    const depositIx = await kamino.deposit(strategyWithAddress, new Decimal(1), new Decimal(2), user.owner.publicKey);
    tx.add(depositIx);

    tx = await assignBlockInfoToTransaction(connection, tx, user.owner.publicKey);

    const txHash = await sendAndConfirmTransaction(connection, tx, [user.owner], {
      commitment: 'processed',
      skipPreflight: true,
    });
    console.log(txHash);
  });

  it('should deposit tokens into a Raydium strategy', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );

    const strategy = (await kamino.getStrategyByAddress(fixtures.newRaydiumStrategy))!;
    const strategyWithAddress = { strategy, address: fixtures.newRaydiumStrategy };

    const solAirdropAmount = new Decimal(1);
    const usdcAirdropAmount = new Decimal(100);
    const usdhAirdropAmount = new Decimal(100);

    let user = await createUser(
      connection,
      signer,
      fixtures.newRaydiumStrategy,
      solAirdropAmount,
      usdcAirdropAmount,
      usdhAirdropAmount
    );

    let tx = createTransactionWithExtraBudget(user.owner.publicKey, 1000000);

    const depositIx = await kamino.deposit(strategyWithAddress, new Decimal(1), new Decimal(2), user.owner.publicKey);
    tx.add(depositIx);

    tx = await assignBlockInfoToTransaction(connection, tx, user.owner.publicKey);

    const txHash = await sendAndConfirmTransaction(connection, tx, [user.owner], {
      commitment: 'processed',
      skipPreflight: true,
    });
    console.log(txHash);
  });

  it('should deposit tokens into an Orca strategy with calculated amount', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );

    const strategy = (await kamino.getStrategyByAddress(fixtures.newOrcaStrategy))!;
    const strategyWithAddress = { strategy, address: fixtures.newOrcaStrategy };

    const solAirdropAmount = new Decimal(1);
    const usdcAirdropAmount = new Decimal(1000000000);
    const usdhAirdropAmount = new Decimal(1000000000);

    let user = await createUser(
      connection,
      signer,
      fixtures.newOrcaStrategy,
      solAirdropAmount,
      usdcAirdropAmount,
      usdhAirdropAmount
    );

    let tx = createTransactionWithExtraBudget(user.owner.publicKey, 1000000);

    let amounts = kamino.getDepositRatioFromTokenA(fixtures.newRaydiumStrategy, new BN(5493));

    const depositIx = await kamino.deposit(
      strategyWithAddress,
      new Decimal((await amounts).amountSlippageA.toString()),
      new Decimal((await amounts).amountSlippageB.toString()),
      user.owner.publicKey
    );
    tx.add(depositIx);

    tx = await assignBlockInfoToTransaction(connection, tx, user.owner.publicKey);

    const txHash = await sendAndConfirmTransaction(connection, tx, [user.owner], {
      commitment: 'processed',
      skipPreflight: true,
    });
    console.log(txHash);
  });

  it('should deposit tokens into a Raydium strategy with calculated amount', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );

    const strategy = (await kamino.getStrategyByAddress(fixtures.newRaydiumStrategy))!;
    const strategyWithAddress = { strategy, address: fixtures.newRaydiumStrategy };

    const solAirdropAmount = new Decimal(1);
    const usdcAirdropAmount = new Decimal(1000000000);
    const usdhAirdropAmount = new Decimal(1000000000);

    let user = await createUser(
      connection,
      signer,
      fixtures.newRaydiumStrategy,
      solAirdropAmount,
      usdcAirdropAmount,
      usdhAirdropAmount
    );

    let tx = createTransactionWithExtraBudget(user.owner.publicKey, 1000000);

    let amounts = kamino.getDepositRatioFromTokenA(fixtures.newRaydiumStrategy, new BN(13));

    const depositIx = await kamino.deposit(
      strategyWithAddress,
      new Decimal((await amounts).amountSlippageA.toString()),
      new Decimal((await amounts).amountSlippageB.toString()),
      user.owner.publicKey
    );
    tx.add(depositIx);

    tx = await assignBlockInfoToTransaction(connection, tx, user.owner.publicKey);

    const txHash = await sendAndConfirmTransaction(connection, tx, [user.owner], {
      commitment: 'processed',
      skipPreflight: true,
    });
    console.log(txHash);
  });

  it('should rebalance an Orca strategy', async () => {
    let kamino = new Kamino(cluster, connection, fixtures.globalConfig, fixtures.kaminoProgramId);
    // Note: this modifies Kamino

    // New position to rebalance into
    const newPosition = Keypair.generate();

    const [executiveWithdrawIx, collectFeesIx, openPositionIx] = await kamino.rebalance(
      fixtures.newOrcaStrategy,
      newPosition.publicKey,
      new Decimal(0.99),
      new Decimal(1.01),
      signer.publicKey
    );

    {
      let tx = new Transaction().add(executiveWithdrawIx, collectFeesIx);
      let sig = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer]);
      expect(sig).to.not.be.null;
      console.log('executive withdraw and collect fees have been executed');
    }
    {
      let tx = new Transaction().add(openPositionIx);
      let sig = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer, newPosition]);
      expect(sig).to.not.be.null;
      console.log('new position has been opened');
    }
  });

  it('should rebalance a Raydium strategy', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      fixtures.globalConfig,
      fixtures.kaminoProgramId,
      WHIRLPOOL_PROGRAM_ID,
      LOCAL_RAYDIUM_PROGRAM_ID
    );

    const strategy = (await kamino.getStrategyByAddress(fixtures.newRaydiumStrategy))!;
    const strategyWithAddress = { strategy, address: fixtures.newRaydiumStrategy };
    const solAirdropAmount = new Decimal(1);
    const usdcAirdropAmount = new Decimal(100);
    const usdhAirdropAmount = new Decimal(100);

    let user = await createUser(
      connection,
      signer,
      fixtures.newRaydiumStrategy,
      solAirdropAmount,
      usdcAirdropAmount,
      usdhAirdropAmount
    );

    let tx = createTransactionWithExtraBudget(user.owner.publicKey, 1000000);

    const depositIx = await kamino.deposit(strategyWithAddress, new Decimal(10), new Decimal(10), user.owner.publicKey);
    tx.add(depositIx);

    tx = await assignBlockInfoToTransaction(connection, tx, user.owner.publicKey);

    const txHash = await sendAndConfirmTransaction(connection, tx, [user.owner], {
      commitment: 'processed',
      skipPreflight: true,
    });
    console.log(txHash);

    // New position to rebalance into
    const newPosition = Keypair.generate();

    const [executiveWithdrawIx, collectFeesIx, openPositionIx] = await kamino.rebalance(
      fixtures.newRaydiumStrategy,
      newPosition.publicKey,
      new Decimal(0.98),
      new Decimal(1.01),
      signer.publicKey
    );

    {
      let tx = createTransactionWithExtraBudget(signer.publicKey, 1000000).add(collectFeesIx).add(executiveWithdrawIx);
      let sig = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer]);
      expect(sig).to.not.be.null;
      console.log('executive withdraw and collect fees have been executed');
    }
    {
      let tx = createTransactionWithExtraBudget(signer.publicKey, 1000000).add(openPositionIx);
      let sig = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer, newPosition]);
      expect(sig).to.not.be.null;
      console.log('new position has been opened');
    }
    {
      let invextIx = await kamino.invest(fixtures.newRaydiumStrategy, signer.publicKey);
      let tx = createTransactionWithExtraBudget(signer.publicKey, 1000000).add(invextIx);
      let sig = await sendTransactionWithLogs(connection, tx, signer.publicKey, [signer]);
      expect(sig).not.to.be.null;
    }
  });
});

export async function createStrategy(kamino: Kamino, owner: Keypair, pool: PublicKey, dex: Dex): Promise<PublicKey> {
  // Create strategy
  const newStrategy = Keypair.generate();
  const createStrategyAccountIx = await kamino.createStrategyAccount(owner.publicKey, newStrategy.publicKey);
  const createStrategyIx = await kamino.createStrategy(
    newStrategy.publicKey,
    pool,
    owner.publicKey,
    'USDH',
    'USDC',
    dex
  );

  let tx = createTransactionWithExtraBudget(owner.publicKey).add(createStrategyAccountIx).add(createStrategyIx);

  await sendTransactionWithLogs(kamino.getConnection(), tx, owner.publicKey, [owner, newStrategy]);
  const strategy = await kamino.getStrategyByAddress(newStrategy.publicKey);
  expect(strategy).to.not.be.null;

  return newStrategy.publicKey;
}

export async function openPosition(
  kamino: Kamino,
  owner: Keypair,
  strategy: PublicKey,
  priceLower: Decimal,
  priceUpper: Decimal
) {
  // Open position
  const positionMint = Keypair.generate();
  {
    const openPositionIx = await kamino.openPosition(strategy, positionMint.publicKey, priceLower, priceUpper);

    let tx = createTransactionWithExtraBudget(owner.publicKey, 1000000);
    tx.add(openPositionIx);
    await sendTransactionWithLogs(kamino.getConnection(), tx, owner.publicKey, [owner, positionMint]);
    console.log('new position has been opened', positionMint.publicKey.toString());
  }
}

export async function setUpGlobalConfig(
  kamino: Kamino,
  owner: Keypair,
  scopeProgram: PublicKey,
  scopePrices: PublicKey
): Promise<PublicKey> {
  let globalConfig = Keypair.generate();

  const createGlobalConfigIx = await kamino.createAccountRentExempt(
    owner.publicKey,
    globalConfig.publicKey,
    kamino.getProgram().account.globalConfig.size
  );

  let accounts: Instructions.InitializeGlobalConfigAccounts = {
    adminAuthority: owner.publicKey,
    globalConfig: globalConfig.publicKey,
    systemProgram: SystemProgram.programId,
  };

  let initializeGlobalConfigIx = Instructions.initializeGlobalConfig(accounts);

  const tx = new Transaction().add(createGlobalConfigIx).add(initializeGlobalConfigIx);
  const sig = await sendTransactionWithLogs(
    kamino.getConnection(),
    tx,
    owner.publicKey,
    [owner, globalConfig]
    // 'finalized'
  );

  console.log('Initialize Global Config: ' + globalConfig.publicKey.toString());
  console.log('Initialize Global Config txn: ' + sig);

  kamino.setGlobalConfig(globalConfig.publicKey);

  // Now set the Scope accounts
  await updateGlobalConfig(
    kamino,
    owner,
    kamino.getGlobalConfig(),
    '0',
    new GlobalConfigOption.ScopeProgramId(),
    scopeProgram.toString(),
    'key'
  );

  await updateGlobalConfig(
    kamino,
    owner,
    kamino.getGlobalConfig(),
    '0',
    new GlobalConfigOption.ScopePriceId(),
    scopePrices.toString(),
    'key'
  );

  return globalConfig.publicKey;
}

export async function setUpCollateralInfo(kamino: Kamino, owner: Keypair): Promise<PublicKey> {
  let collInfo = Keypair.generate();

  const createCollateralInfoIx = await kamino.createAccountRentExempt(
    owner.publicKey,
    collInfo.publicKey,
    kamino.getProgram().account.collateralInfos.size
  );

  let accounts: Instructions.InitializeCollateralInfoAccounts = {
    adminAuthority: owner.publicKey,
    globalConfig: kamino.getGlobalConfig(),
    systemProgram: SystemProgram.programId,
    collInfo: collInfo.publicKey,
  };

  let initializeCollateralInfosIx = Instructions.initializeCollateralInfo(accounts);

  const tx = new Transaction().add(createCollateralInfoIx).add(initializeCollateralInfosIx);
  const sig = await sendTransactionWithLogs(
    kamino.getConnection(),
    tx,
    owner.publicKey,
    [owner, collInfo]
    // 'finalized'
  );

  console.log('Initialize Coll Info: ' + collInfo.publicKey.toString());
  console.log('Initialize Coll Info txn: ' + sig);

  // Now set the collateral infos into the global config
  await updateGlobalConfig(
    kamino,
    owner,
    kamino.getGlobalConfig(),
    '0',
    new GlobalConfigOption.UpdateTokenInfos(),
    collInfo.publicKey.toString(),
    'key'
  );

  return collInfo.publicKey;
}

export async function updateGlobalConfig(
  kamino: Kamino,
  owner: Keypair,
  globalConfig: PublicKey,
  keyIndex: string,
  globalConfigOption: GlobalConfigOptionKind,
  flagValue: string,
  flagValueType: string
) {
  let value: bigint | PublicKey | boolean;
  if (flagValueType == 'number') {
    console.log('flagvalue is number');
    value = BigInt(flagValue);
  } else if (flagValueType == 'bool') {
    if (flagValue == 'false') {
      value = false;
    } else if (flagValue == 'true') {
      value = true;
    } else {
      throw new Error('the provided flag value is not valid bool');
    }
  } else if (flagValueType == 'key') {
    value = new PublicKey(flagValue);
  } else {
    throw new Error("flagValueType must be 'number', 'bool', or 'key'");
  }

  let index = Number.parseInt(keyIndex);
  let formatted_value = getGlobalConfigValue(value);
  let args: Instructions.UpdateGlobalConfigArgs = {
    key: globalConfigOption.discriminator,
    index: index,
    value: formatted_value,
  };
  let accounts: Instructions.UpdateGlobalConfigAccounts = {
    adminAuthority: owner.publicKey,
    globalConfig: globalConfig,
    systemProgram: SystemProgram.programId,
  };

  let updateConfigIx = Instructions.updateGlobalConfig(args, accounts);
  const tx = new Transaction().add(updateConfigIx);
  const sig = await sendTransactionWithLogs(kamino.getConnection(), tx, owner.publicKey, [owner]);

  console.log('Update Global Config ', globalConfigOption.toJSON(), sig);
}

export function getGlobalConfigValue(value: PublicKey | bigint | boolean): number[] {
  let buffer: Buffer;
  if (value instanceof PublicKey) {
    buffer = value.toBuffer();
  } else if (typeof value == 'boolean') {
    buffer = Buffer.alloc(32);
    value ? buffer.writeUInt8(1, 0) : buffer.writeUInt8(0, 0);
  } else if (typeof value == 'bigint') {
    buffer = Buffer.alloc(32);
    buffer.writeBigUInt64LE(value); // Because we send 32 bytes and a u64 has 8 bytes, we write it in LE
  } else {
    throw Error('wrong type for value');
  }
  return [...buffer];
}

export async function updateCollateralInfoForToken(
  connection: Connection,
  signer: Keypair,
  collTokenIndex: number,
  scopeChainId: bigint,
  globalConfig: PublicKey,
  collateralToken: string,
  collInfoTwapId: bigint,
  tokenMint: PublicKey
) {
  // Set Mint
  await updateCollateralInfo(
    connection,
    signer,
    globalConfig,
    collTokenIndex,
    new UpdateCollateralInfoMode.CollateralId(),
    tokenMint
  );

  // Set Label
  await updateCollateralInfo(
    connection,
    signer,
    globalConfig,
    collTokenIndex,
    new UpdateCollateralInfoMode.UpdateName(),
    getCollInfoEncodedName(collateralToken)
  );

  // Set Twap
  await updateCollateralInfo(
    connection,
    signer,
    globalConfig,
    collTokenIndex,
    new UpdateCollateralInfoMode.UpdateScopeTwap(),
    collInfoTwapId
  );

  // Set Scope Chain
  await updateCollateralInfo(
    connection,
    signer,
    globalConfig,
    collTokenIndex,
    new UpdateCollateralInfoMode.UpdateScopeChain(),
    scopeChainId
  );

  // Set Twap Max Age
  await updateCollateralInfo(
    connection,
    signer,
    globalConfig,
    collTokenIndex,
    new UpdateCollateralInfoMode.UpdateTwapMaxAge(),
    BigInt(DEFAULT_MAX_PRICE_AGE)
  );

  // Set Price Max Age
  await updateCollateralInfo(
    connection,
    signer,
    globalConfig,
    collTokenIndex,
    new UpdateCollateralInfoMode.UpdatePriceMaxAge(),
    BigInt(DEFAULT_MAX_PRICE_AGE)
  );
}
