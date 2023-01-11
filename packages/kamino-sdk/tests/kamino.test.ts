import {
  Cluster,
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { createAssociatedTokenAccountInstruction, Dex, Kamino, sendTransactionWithLogs } from '../src';
import Decimal from 'decimal.js';
import bs58 from 'bs58';
import {
  assignBlockInfoToTransaction,
  createTransactionWithExtraBudget,
  getAssociatedTokenAddressAndData,
} from '../src';
import { GlobalConfig } from '../src/kamino-client/accounts';
import * as Instructions from '../src/kamino-client/instructions';
import { GlobalConfigOption, GlobalConfigOptionKind } from '../src/kamino-client/types';
import { SupportedToken } from '@hubbleprotocol/scope-sdk';
import BN from 'bn.js';
import { Uninitialized } from '../src/kamino-client/types/StrategyStatus';
import { initializeRaydiumPool } from './raydium_utils';

describe('Kamino SDK Tests', () => {
  let connection: Connection;
  // const cluster: Cluster = 'localnet';
  const cluster = 'localnet';
  const clusterUrl: string = 'http://127.0.0.1:8899';
  connection = new Connection(clusterUrl);

  let fixtures = {
    globalConfig: new PublicKey('981uJhuXAtmrnJiJ3Z4wthnHSDnQTgaHzakABg1CKczW'),
    existingWhirlpool: new PublicKey('Fvtf8VCjnkqbETA6KtyHYqHm26ut6w184Jqm4MQjPvv7'),
    existingRaydiumPool: new PublicKey('DJ78peEetZfMu4fttt9Eg7hsfza5JM7rZig1mgh8kAQz'),
    existingOrcaStrategy: new PublicKey('Cfuy5T6osdazUeLego5LFycBQebm9PP3H7VNdCndXXEN'),
    existingRaydiumStrategy: new PublicKey('E5sW8oNa6iMHRbjpSPb8h3MWaPzeazPyY3ZcSFaejASZ'), // todo: see what has to go here
    scopePrices: new PublicKey('3NJYftD5sjVfxSnUdZ1wVML8f3aC6mp1CXCL6L7TnU8C'),
    scopeProgram: new PublicKey('HFn8GnPADiny6XqUoWE8uRPPxb29ikn4yTuPa9MF2fWJ'),
    tokenMintA: new PublicKey('USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX'),
    tokenMintB: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    signerPrivateKey: [
      243, 40, 114, 191, 142, 196, 87, 228, 207, 36, 182, 90, 227, 157, 113, 142, 144, 182, 242, 100, 81, 173, 42, 201,
      95, 86, 24, 160, 85, 13, 75, 165, 19, 134, 236, 53, 139, 222, 86, 12, 231, 163, 29, 94, 127, 22, 32, 59, 201, 57,
      176, 47, 122, 158, 162, 215, 43, 194, 124, 8, 216, 20, 46, 253,
    ],
  };

  const signer = Keypair.fromSecretKey(Uint8Array.from(fixtures.signerPrivateKey));

  beforeAll(async () => {
    connection = new Connection(clusterUrl);
    let raydiumPool = await initializeRaydiumPool(connection, signer, 1, fixtures.tokenMintA, fixtures.tokenMintB);
    // const signer = Keypair.fromSecretKey(Uint8Array.from(fixtures.signerPrivateKey));
    // connection = new Connection(clusterApiUrl(cluster));
  }, 500000);

  test('should throw on invalid cluster', () => {
    // @ts-ignore
    const init = () => new Kamino('invalid-clusters', undefined);
    expect(init).toThrow(Error);
  });

  test('should get all strategies', async () => {
    const kamino = new Kamino(cluster, connection);
    const allStrategies = await kamino.getStrategies([fixtures.existingOrcaStrategy]);
    expect(allStrategies.length).toBeGreaterThan(0);
    for (const strat of allStrategies) {
      expect(strat).not.toBeNull();
      console.log(strat?.pool.toString());
    }
  });
  test('should get strategy by address', async () => {
    const kamino = new Kamino(cluster, connection);
    const strategy = await kamino.getStrategyByAddress(fixtures.existingOrcaStrategy);
    expect(strategy).not.toBeNull();
    console.log(strategy?.toJSON());
  });

  test('should get RAYDIUM strategy share price', async () => {
    const kamino = new Kamino(cluster, connection);
    const strategy = await kamino.getStrategyByAddress(new PublicKey('RAYDIUM'));
    expect(strategy).not.toBeNull();
    const price = await kamino.getStrategyShareData(new PublicKey('RAYDIUM'));
    expect(price.price.toNumber()).toBeGreaterThanOrEqual(0);
    console.log(price);
  }, 500000);

  test('should get Orca strategy share price', async () => {
    const kamino = new Kamino(cluster, connection);
    const strategy = await kamino.getStrategyByAddress(fixtures.existingOrcaStrategy);
    expect(strategy).not.toBeNull();
    const price = await kamino.getStrategyShareData(fixtures.existingOrcaStrategy);
    expect(price.price.toNumber()).toBeGreaterThanOrEqual(0);
    console.log(price);
  });

  test.skip('should get all strategy holders', async () => {
    const kamino = new Kamino(cluster, connection);
    const strategy = await kamino.getStrategyByAddress(new PublicKey('ByXB4xCxVhmUEmQj3Ut7byZ1Hbva1zhKjaVcv3jBMN7E'));
    expect(strategy).not.toBeNull();
    const accounts = await kamino.getStrategyHolders(new PublicKey('ByXB4xCxVhmUEmQj3Ut7byZ1Hbva1zhKjaVcv3jBMN7E'));
    expect(accounts.length).toBeGreaterThan(0);
    const expectedShares = new Decimal(strategy!.sharesIssued.toString())
      .div(new Decimal(10).pow(strategy!.sharesMintDecimals.toString()))
      .toNumber();
    const actualShares = accounts.map((x) => x.amount.toNumber()).reduce((partialSum, a) => partialSum + a, 0);
    expect(expectedShares).toBe(actualShares);
  });

  test.skip('should get all whirlpools', async () => {
    const kamino = new Kamino(cluster, connection);
    console.log(await kamino.getWhirlpools([]));
  });

  test.skip('should get all Raydium pools', async () => {
    const kamino = new Kamino(cluster, connection);
    console.log(await kamino.getRaydiumPools([]));
  });

  test.skip('should withdraw shares from a Orca strategy', async () => {
    const kamino = new Kamino(cluster, connection);
    const strategyPubkey = new PublicKey('2H4xebnp2M9JYgPPfUw58uUQahWF8f1YTNxwwtmdqVYV');
    const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu');
    const strategy = (await kamino.getStrategyByAddress(strategyPubkey))!;
    const strategyWithAddress = { strategy, address: strategyPubkey };
    const [sharesAta, sharesMintData] = await getAssociatedTokenAddressAndData(connection, strategy.sharesMint, owner);
    const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenAMint, owner);
    const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenBMint, owner);
    let tx = createTransactionWithExtraBudget(owner);
    const ataInstructions = await kamino.getCreateAssociatedTokenAccountInstructionsIfNotExist(
      owner,
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

    const withdrawIx = await kamino.withdrawShares(strategyWithAddress, new Decimal(2), owner);
    tx.add(withdrawIx);

    tx = await assignBlockInfoToTransaction(connection, tx, owner);

    const signer = Keypair.fromSecretKey(bs58.decode('phantom wallet secret key'));
    const txHash = await sendAndConfirmTransaction(connection, tx, [signer], {
      commitment: 'confirmed',
    });
    console.log(txHash);
  });

  test.skip('should withdraw shares from a Raydium strategy', async () => {
    const kamino = new Kamino(cluster, connection);
    const strategyPubkey = new PublicKey('RAYDIUM');
    const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu');
    const strategy = (await kamino.getStrategyByAddress(strategyPubkey))!;
    const strategyWithAddress = { strategy, address: strategyPubkey };
    const [sharesAta, sharesMintData] = await getAssociatedTokenAddressAndData(connection, strategy.sharesMint, owner);
    const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenAMint, owner);
    const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenBMint, owner);
    let tx = createTransactionWithExtraBudget(owner);
    const ataInstructions = await kamino.getCreateAssociatedTokenAccountInstructionsIfNotExist(
      owner,
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

    const withdrawIx = await kamino.withdrawShares(strategyWithAddress, new Decimal(2), owner);
    tx.add(withdrawIx);

    tx = await assignBlockInfoToTransaction(connection, tx, owner);

    const signer = Keypair.fromSecretKey(bs58.decode('phantom wallet secret key'));
    const txHash = await sendAndConfirmTransaction(connection, tx, [signer], {
      commitment: 'confirmed',
    });
    console.log(txHash);
  });

  test.skip('should withdraw all shares from an Orca strategy', async () => {
    const kamino = new Kamino(cluster, connection);
    const strategyPubkey = new PublicKey('2H4xebnp2M9JYgPPfUw58uUQahWF8f1YTNxwwtmdqVYV');
    const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu');
    const strategy = (await kamino.getStrategyByAddress(strategyPubkey))!;
    const strategyWithAddress = { strategy, address: strategyPubkey };
    const [sharesAta, sharesMintData] = await getAssociatedTokenAddressAndData(connection, strategy.sharesMint, owner);
    const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenAMint, owner);
    const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenBMint, owner);
    let tx = createTransactionWithExtraBudget(owner);
    const ataInstructions = await kamino.getCreateAssociatedTokenAccountInstructionsIfNotExist(
      owner,
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

    const withdrawIx = await kamino.withdrawAllShares(strategyWithAddress, owner);
    if (withdrawIx) {
      tx.add(withdrawIx);
    } else {
      console.log('balance is 0, cant withdraw');
      return;
    }

    tx = await assignBlockInfoToTransaction(connection, tx, owner);

    const signer = Keypair.fromSecretKey(bs58.decode('phantom wallet secret key'));
    const txHash = await sendAndConfirmTransaction(connection, tx, [signer], {
      commitment: 'confirmed',
    });
    console.log(txHash);
  });

  test.skip('should withdraw all shares from a Raydium strategy', async () => {
    const kamino = new Kamino(cluster, connection);
    const strategyPubkey = new PublicKey('RAYDIUM');
    const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu');
    const strategy = (await kamino.getStrategyByAddress(strategyPubkey))!;
    const strategyWithAddress = { strategy, address: strategyPubkey };
    const [sharesAta, sharesMintData] = await getAssociatedTokenAddressAndData(connection, strategy.sharesMint, owner);
    const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenAMint, owner);
    const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenBMint, owner);
    let tx = createTransactionWithExtraBudget(owner);
    const ataInstructions = await kamino.getCreateAssociatedTokenAccountInstructionsIfNotExist(
      owner,
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

    const withdrawIx = await kamino.withdrawAllShares(strategyWithAddress, owner);
    if (withdrawIx) {
      tx.add(withdrawIx);
    } else {
      console.log('balance is 0, cant withdraw');
      return;
    }

    tx = await assignBlockInfoToTransaction(connection, tx, owner);

    const signer = Keypair.fromSecretKey(bs58.decode('phantom wallet secret key'));
    const txHash = await sendAndConfirmTransaction(connection, tx, [signer], {
      commitment: 'confirmed',
    });
    console.log(txHash);
  });

  test.skip('should deposit tokens into an Orca strategy', async () => {
    const kamino = new Kamino(cluster, connection);
    const strategyPubkey = new PublicKey('2H4xebnp2M9JYgPPfUw58uUQahWF8f1YTNxwwtmdqVYV');
    const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu');
    const strategy = (await kamino.getStrategyByAddress(strategyPubkey))!;
    const strategyWithAddress = { strategy, address: strategyPubkey };
    const [sharesAta, sharesMintData] = await getAssociatedTokenAddressAndData(connection, strategy.sharesMint, owner);
    const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenAMint, owner);
    const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenBMint, owner);
    let tx = createTransactionWithExtraBudget(owner);
    const ataInstructions = await kamino.getCreateAssociatedTokenAccountInstructionsIfNotExist(
      owner,
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

    const depositIx = await kamino.deposit(strategyWithAddress, new Decimal(1), new Decimal(2), owner);
    tx.add(depositIx);

    tx = await assignBlockInfoToTransaction(connection, tx, owner);

    const signer = Keypair.fromSecretKey(bs58.decode('phantom wallet secret key'));
    const txHash = await sendAndConfirmTransaction(connection, tx, [signer], {
      commitment: 'confirmed',
    });
    console.log(txHash);
  });

  test.skip('should deposit tokens into a Raydium strategy', async () => {
    const kamino = new Kamino(cluster, connection);
    const strategyPubkey = new PublicKey('RAYDIUM');
    const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu');
    const strategy = (await kamino.getStrategyByAddress(strategyPubkey))!;
    const strategyWithAddress = { strategy, address: strategyPubkey };
    const [sharesAta, sharesMintData] = await getAssociatedTokenAddressAndData(connection, strategy.sharesMint, owner);
    const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenAMint, owner);
    const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenBMint, owner);
    let tx = createTransactionWithExtraBudget(owner);
    const ataInstructions = await kamino.getCreateAssociatedTokenAccountInstructionsIfNotExist(
      owner,
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

    const depositIx = await kamino.deposit(strategyWithAddress, new Decimal(1), new Decimal(2), owner);
    tx.add(depositIx);

    tx = await assignBlockInfoToTransaction(connection, tx, owner);

    const signer = Keypair.fromSecretKey(bs58.decode('phantom wallet secret key'));
    const txHash = await sendAndConfirmTransaction(connection, tx, [signer], {
      commitment: 'confirmed',
    });
    console.log(txHash);
  });

  test.skip('should create a new Orca strategy', async () => {
    const signer = Keypair.fromSecretKey(Uint8Array.from(fixtures.signerPrivateKey));
    const newStrategy = Keypair.generate();
    const owner = signer.publicKey;
    const whirlpool = fixtures.existingWhirlpool;

    const kamino = new Kamino(cluster, connection, fixtures.globalConfig);
    const whirlpoolState = await kamino.getWhirlpoolByAddress(whirlpool);
    expect(whirlpoolState).not.toBeNull();

    let tx = createTransactionWithExtraBudget(owner);

    const createStrategyAccountIx = await kamino.createStrategyAccount(owner, newStrategy.publicKey);
    tx.add(createStrategyAccountIx);

    const createStrategyIx = await kamino.createStrategy(
      newStrategy.publicKey,
      whirlpool,
      owner,
      'USDH',
      'USDC',
      'ORCA'
    );
    tx.add(createStrategyIx);

    const txHash = await sendTransactionWithLogs(connection, tx, owner, [signer, newStrategy], {
      commitment: 'finalized',
    });
    console.log('transaction hash', txHash);
    console.log('new strategy has been created', newStrategy.publicKey.toString());
    const strategy = await kamino.getStrategyByAddress(newStrategy.publicKey);
    expect(strategy).not.toBeNull();
    console.log(strategy?.toJSON());
  }, 30_000);

  test.skip('should create a new Raydium strategy', async () => {
    const signer = Keypair.fromSecretKey(Uint8Array.from(fixtures.signerPrivateKey));
    const newStrategy = Keypair.generate();
    const owner = signer.publicKey;
    const whirlpool = fixtures.existingWhirlpool;

    const kamino = new Kamino(cluster, connection, fixtures.globalConfig);
    const whirlpoolState = await kamino.getWhirlpoolByAddress(whirlpool);
    expect(whirlpoolState).not.toBeNull();

    let tx = createTransactionWithExtraBudget(owner);

    const createStrategyAccountIx = await kamino.createStrategyAccount(owner, newStrategy.publicKey);
    tx.add(createStrategyAccountIx);

    const createStrategyIx = await kamino.createStrategy(
      newStrategy.publicKey,
      whirlpool,
      owner,
      'USDH',
      'USDC',
      'ORCA'
    );
    tx.add(createStrategyIx);

    const txHash = await sendTransactionWithLogs(connection, tx, owner, [signer, newStrategy], {
      commitment: 'finalized',
    });
    console.log('transaction hash', txHash);
    console.log('new strategy has been created', newStrategy.publicKey.toString());
    const strategy = await kamino.getStrategyByAddress(newStrategy.publicKey);
    expect(strategy).not.toBeNull();
    console.log(strategy?.toJSON());
  }, 30_000);

  test.skip('should open liquidity position for a Orca strategy', async () => {
    const signer = Keypair.fromSecretKey(Uint8Array.from(fixtures.signerPrivateKey));
    const owner = signer.publicKey;
    const positionMint = Keypair.generate();
    const strategy = new PublicKey('3irb7xwsnmFefTphym3J7tn4mBizWWvCRZgxWff2ucTh');
    const globalConfig = new PublicKey('982FRNjCosuj7bqUAH94QSBn5LeZkiveGs1Lziysf8rm');

    const kamino = new Kamino(cluster, connection, globalConfig);

    let tx = new Transaction();

    const openPositionIx = await kamino.openPosition(
      strategy,
      positionMint.publicKey,
      new Decimal(0.98),
      new Decimal(1.02)
    );
    tx.add(openPositionIx);

    const txHash = await sendTransactionWithLogs(connection, tx, owner, [signer, positionMint], {
      commitment: 'finalized',
    });

    console.log('transaction hash', txHash);
  }, 30_000);

  test.skip('should open liquidity position for a Raydium strategy', async () => {
    const signer = Keypair.fromSecretKey(Uint8Array.from(fixtures.signerPrivateKey));
    const owner = signer.publicKey;
    const positionMint = Keypair.generate();
    const strategy = new PublicKey('3irb7xwsnmFefTphym3J7tn4mBizWWvCRZgxWff2ucTh');
    const globalConfig = new PublicKey('982FRNjCosuj7bqUAH94QSBn5LeZkiveGs1Lziysf8rm');

    const kamino = new Kamino(cluster, connection, globalConfig);

    let tx = new Transaction();

    const openPositionIx = await kamino.openPosition(
      strategy,
      positionMint.publicKey,
      new Decimal(0.98),
      new Decimal(1.02)
    );
    tx.add(openPositionIx);

    const txHash = await sendTransactionWithLogs(connection, tx, owner, [signer, positionMint]);

    console.log('transaction hash', txHash);
  }, 30_000);

  test.skip('create a new Orca strategy and open a position', async () => {
    const owner = Keypair.fromSecretKey(Uint8Array.from(fixtures.signerPrivateKey));
    const kamino = new Kamino(cluster, connection);

    // Setup (this is not required on devnet/mainnet)
    // Note: this modifies Kamino
    const whirlpool = fixtures.existingWhirlpool;
    await setUpEnvironmentForWhirlpool(kamino, owner, whirlpool, fixtures.scopeProgram, fixtures.scopePrices);

    // Create strategy
    const newStrategy = Keypair.generate();
    {
      const createStrategyAccountIx = await kamino.createStrategyAccount(owner.publicKey, newStrategy.publicKey);
      const createStrategyIx = await kamino.createStrategy(
        newStrategy.publicKey,
        whirlpool,
        owner.publicKey,
        'USDH',
        'USDC',
        'ORCA'
      );

      let tx = createTransactionWithExtraBudget(owner.publicKey).add(createStrategyAccountIx).add(createStrategyIx);

      await sendTransactionWithLogs(connection, tx, owner.publicKey, [owner, newStrategy]);
      const strategy = await kamino.getStrategyByAddress(newStrategy.publicKey);
      expect(strategy).not.toBeNull();
    }

    // Open position
    const positionMint = Keypair.generate();
    {
      const openPositionIx = await kamino.openPosition(
        newStrategy.publicKey,
        positionMint.publicKey,
        new Decimal(0.98),
        new Decimal(1.02)
      );

      let tx = new Transaction().add(openPositionIx);
      await sendTransactionWithLogs(connection, tx, owner.publicKey, [owner, positionMint]);
      console.log('new position has been opened', positionMint.publicKey.toString());
    }
  }, 200_000);

  test.skip('create a new Raydium strategy and open a position', async () => {
    const owner = Keypair.fromSecretKey(Uint8Array.from(fixtures.signerPrivateKey));
    const kamino = new Kamino(cluster, connection);

    // Setup (this is not required on devnet/mainnet)
    // Note: this modifies Kamino
    const whirlpool = fixtures.existingWhirlpool;
    await setUpEnvironmentForWhirlpool(kamino, owner, whirlpool, fixtures.scopeProgram, fixtures.scopePrices);

    // Create strategy
    const newStrategy = Keypair.generate();
    {
      const createStrategyAccountIx = await kamino.createStrategyAccount(owner.publicKey, newStrategy.publicKey);
      const createStrategyIx = await kamino.createStrategy(
        newStrategy.publicKey,
        whirlpool,
        owner.publicKey,
        'USDH',
        'USDC',
        'ORCA'
      );

      let tx = createTransactionWithExtraBudget(owner.publicKey).add(createStrategyAccountIx).add(createStrategyIx);

      await sendTransactionWithLogs(connection, tx, owner.publicKey, [owner, newStrategy]);
      const strategy = await kamino.getStrategyByAddress(newStrategy.publicKey);
      expect(strategy).not.toBeNull();
    }

    // Open position
    const positionMint = Keypair.generate();
    {
      const openPositionIx = await kamino.openPosition(
        newStrategy.publicKey,
        positionMint.publicKey,
        new Decimal(0.98),
        new Decimal(1.02)
      );

      let tx = new Transaction().add(openPositionIx);
      await sendTransactionWithLogs(connection, tx, owner.publicKey, [owner, positionMint]);
      console.log('new position has been opened', positionMint.publicKey.toString());
    }
  }, 200_000);

  test.skip('should rebalance an Orca strategy', async () => {
    const owner = Keypair.fromSecretKey(Uint8Array.from(fixtures.signerPrivateKey));
    const kamino = new Kamino(cluster, connection);

    // Setup (this is not required on devnet/mainnet)
    // Note: this modifies Kamino
    const whirlpool = fixtures.existingWhirlpool;
    await setUpEnvironmentForWhirlpool(kamino, owner, whirlpool, fixtures.scopeProgram, fixtures.scopePrices);

    const strategy = await createStrategy(kamino, owner, whirlpool, 'ORCA');
    const _ = await openPosition(kamino, owner, strategy, new Decimal(0.9), new Decimal(1.1));

    // New position to rebalance into
    const newPosition = Keypair.generate();

    const [executiveWithdrawIx, collectFeesIx, openPositionIx] = await kamino.rebalance(
      strategy,
      newPosition.publicKey,
      new Decimal(0.9),
      new Decimal(1.1),
      owner.publicKey
    );

    {
      let tx = new Transaction().add(executiveWithdrawIx, collectFeesIx);
      let sig = await sendTransactionWithLogs(connection, tx, owner.publicKey, [owner]);
      expect(sig).not.toBeNull();
      console.log('executive withdraw and collect fees have been executed');
    }
    {
      let tx = new Transaction().add(openPositionIx);
      let sig = await sendTransactionWithLogs(connection, tx, owner.publicKey, [owner, newPosition]);
      expect(sig).not.toBeNull();
      console.log('new position has been opened');
    }
    {
      let invextIx = await kamino.invest(strategy, owner.publicKey);
      let tx = new Transaction().add(invextIx);
      let sig = await sendTransactionWithLogs(connection, tx, owner.publicKey, [owner]);
      // Cannot invest zero amount, this is expected to fail
      // expect(sig).not.toBeNull();
      // console.log('invested');
    }
  }, 300_000);

  test.skip('should rebalance a Raydium strategy', async () => {
    const owner = Keypair.fromSecretKey(Uint8Array.from(fixtures.signerPrivateKey));
    const kamino = new Kamino(cluster, connection);

    // Setup (this is not required on devnet/mainnet)
    // Note: this modifies Kamino
    const pool = fixtures.existingRaydiumPool;
    await setUpEnvironmentForWhirlpool(kamino, owner, pool, fixtures.scopeProgram, fixtures.scopePrices);

    const strategy = await createStrategy(kamino, owner, pool, 'RAYDIUM');
    const _ = await openPosition(kamino, owner, strategy, new Decimal(0.9), new Decimal(1.1));

    // New position to rebalance into
    const newPosition = Keypair.generate();

    const [executiveWithdrawIx, collectFeesIx, openPositionIx] = await kamino.rebalance(
      strategy,
      newPosition.publicKey,
      new Decimal(0.9),
      new Decimal(1.1),
      owner.publicKey
    );

    {
      let tx = new Transaction().add(executiveWithdrawIx, collectFeesIx);
      let sig = await sendTransactionWithLogs(connection, tx, owner.publicKey, [owner]);
      expect(sig).not.toBeNull();
      console.log('executive withdraw and collect fees have been executed');
    }
    {
      let tx = new Transaction().add(openPositionIx);
      let sig = await sendTransactionWithLogs(connection, tx, owner.publicKey, [owner, newPosition]);
      expect(sig).not.toBeNull();
      console.log('new position has been opened');
    }
    {
      let invextIx = await kamino.invest(strategy, owner.publicKey);
      let tx = new Transaction().add(invextIx);
      let sig = await sendTransactionWithLogs(connection, tx, owner.publicKey, [owner]);
      // Cannot invest zero amount, this is expected to fail
      // expect(sig).not.toBeNull();
      // console.log('invested');
    }
  }, 300_000);
});

export async function setUpEnvironmentForWhirlpool(
  kamino: Kamino,
  owner: Keypair,
  whirlpool: PublicKey,
  scopeProgramId: PublicKey,
  scopePrices: PublicKey
) {
  // Setup (this is not required on devnet/mainnet)
  let globalConfig = await setUpGlobalConfig(kamino, owner, scopeProgramId, scopePrices);

  let whirlpoolState = await kamino.getWhirlpoolByAddress(whirlpool);
  expect(whirlpoolState).not.toBeNull();

  await setUpCollateralInfo(kamino, owner);
  await updateCollateralInfo(kamino, owner, globalConfig, 'USDH', whirlpoolState!!.tokenMintA);
  await updateCollateralInfo(kamino, owner, globalConfig, 'USDC', whirlpoolState!!.tokenMintB);
}

export async function setUpEnvironmentForRaydium(
  kamino: Kamino,
  owner: Keypair,
  pool: PublicKey,
  scopeProgramId: PublicKey,
  scopePrices: PublicKey
) {
  // Setup (this is not required on devnet/mainnet)
  let globalConfig = await setUpGlobalConfig(kamino, owner, scopeProgramId, scopePrices);

  let poolState = await kamino.getRaydiumPoollByAddress(pool);
  expect(poolState).not.toBeNull();

  await setUpCollateralInfo(kamino, owner);
  await updateCollateralInfo(kamino, owner, globalConfig, 'USDH', poolState!!.tokenMint0);
  await updateCollateralInfo(kamino, owner, globalConfig, 'USDC', poolState!!.tokenMint1);
}

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
  expect(strategy).not.toBeNull();

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

    let tx = new Transaction().add(openPositionIx);
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
  const sig = await sendTransactionWithLogs(kamino.getConnection(), tx, owner.publicKey, [owner, globalConfig]);

  console.log('Initialize Global Config: ' + globalConfig.toString());
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
  const sig = await sendTransactionWithLogs(kamino.getConnection(), tx, owner.publicKey, [owner, collInfo]);

  console.log('Initialize Coll Infp: ' + collInfo.toString());
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

export async function updateCollateralInfo(
  kamino: Kamino,
  owner: Keypair,
  globalConfig: PublicKey,
  collateralToken: SupportedToken,
  collateralMint: PublicKey
) {
  let config: GlobalConfig | null = await GlobalConfig.fetch(kamino.getConnection(), globalConfig);
  if (config == null) {
    throw new Error('Global config not found');
  }

  let args: Instructions.UpdateCollateralInfoArgs = {
    index: new BN(kamino.getCollateralId(collateralToken)),
    mode: new BN(0),
    value: new BN(kamino.getCollateralId(collateralToken)),
  };

  let accounts: Instructions.UpdateCollateralInfoAccounts = {
    adminAuthority: owner.publicKey,
    globalConfig,
    systemProgram: SystemProgram.programId,
    tokenInfos: config.tokenInfos,
    mint: collateralMint,
  };

  let ix = Instructions.updateCollateralInfo(args, accounts);
  const tx = new Transaction().add(ix);

  const sig = await sendTransactionWithLogs(kamino.getConnection(), tx, owner.publicKey, [owner]);
}
