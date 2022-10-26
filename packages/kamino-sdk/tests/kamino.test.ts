import {
  Cluster,
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from '@solana/web3.js';
import { createAssociatedTokenAccountInstruction, Kamino } from '../src';
import Decimal from 'decimal.js';
import bs58 from 'bs58';
import {
  assignBlockInfoToTransaction,
  createTransactionWithExtraBudget,
  getAssociatedTokenAddressAndData,
} from '../src';

describe('Kamino SDK Tests', () => {
  let connection: Connection;
  const cluster: Cluster = 'devnet';

  beforeAll(() => {
    connection = new Connection(clusterApiUrl(cluster));
  });

  test.skip('should throw on invalid cluster', () => {
    // @ts-ignore
    const init = () => new Kamino('invalid-clusters', undefined);
    expect(init).toThrow(Error);
  });

  test.skip('should get all strategies', async () => {
    const kamino = new Kamino(cluster, connection);
    const allStrategies = await kamino.getStrategies();
    expect(allStrategies.length).toBeGreaterThan(0);
    for (const strat of allStrategies) {
      expect(strat).not.toBeNull();
      console.log(strat?.pool.toString());
    }
  });
  test.skip('should get strategy by address', async () => {
    const kamino = new Kamino(cluster, connection);
    const strategy = await kamino.getStrategyByAddress(new PublicKey('LXUYy5TN2Bq9BoQXx2LKYqmnq4kzZzDT15NuiZ3VAMy'));
    expect(strategy).not.toBeNull();
    console.log(strategy?.toJSON());
  });

  test.skip('should get strategy share price', async () => {
    const kamino = new Kamino(cluster, connection);
    const strategy = await kamino.getStrategyByAddress(new PublicKey('LXUYy5TN2Bq9BoQXx2LKYqmnq4kzZzDT15NuiZ3VAMy'));
    expect(strategy).not.toBeNull();
    const price = await kamino.getStrategyShareData(new PublicKey('LXUYy5TN2Bq9BoQXx2LKYqmnq4kzZzDT15NuiZ3VAMy'));
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

  test.skip('should withdraw shares from a strategy', async () => {
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

  test.skip('should withdraw all shares from a strategy', async () => {
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

  test.skip('should deposit tokens into a strategy', async () => {
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

  test.skip('should create a new strategy', async () => {
    const signer = Keypair.fromSecretKey(bs58.decode('enter phantom key'));
    const newStrategy = Keypair.generate();
    const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu');
    const whirlpool = new PublicKey('5vHht2PCHKsApekfPZXyn7XthAYQbsCNiwA1VEcQmL12');

    const kamino = new Kamino(cluster, connection);
    const whirlpoolState = await kamino.getWhirlpoolByAddress(whirlpool);
    expect(whirlpoolState).not.toBeNull();

    let tx = createTransactionWithExtraBudget(owner);

    const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(
      connection,
      whirlpoolState!.tokenMintA,
      owner
    );
    if (!tokenAData) {
      tx.add(createAssociatedTokenAccountInstruction(owner, tokenAAta, owner, whirlpoolState!.tokenMintA));
    }
    const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(
      connection,
      whirlpoolState!.tokenMintB,
      owner
    );
    if (!tokenBData) {
      tx.add(createAssociatedTokenAccountInstruction(owner, tokenBAta, owner, whirlpoolState!.tokenMintB));
    }

    const createStrategyAccountIx = await kamino.createStrategyAccount(owner, newStrategy.publicKey);
    tx.add(createStrategyAccountIx);

    const createStrategyIx = await kamino.createStrategy(newStrategy.publicKey, whirlpool, owner, 'USDH', 'USDC');
    tx.add(createStrategyIx);

    tx = await assignBlockInfoToTransaction(connection, tx, owner);

    const txHash = await sendAndConfirmTransaction(connection, tx, [signer, newStrategy], {
      commitment: 'finalized',
    });
    console.log('transaction hash', txHash);
    console.log('new strategy has been created', newStrategy.publicKey.toString());
    const strategy = await kamino.getStrategyByAddress(newStrategy.publicKey);
    expect(strategy).not.toBeNull();
    console.log(strategy?.toJSON());
  }, 30_000);

  test.skip('should open liquidity position for a strategy', async () => {
    const signer = Keypair.fromSecretKey(bs58.decode('enter phantom key'));
    const newPosition = Keypair.generate();
    const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu');
    const strategy = new PublicKey('7rEfrXFWvNBeWPSCwtTSvAtuU1uptBKpkvEN3YAgxX49');

    const kamino = new Kamino(cluster, connection);

    let tx = new Transaction();

    const openPositionIx = await kamino.openPosition(
      strategy,
      newPosition.publicKey,
      new Decimal(0.9),
      new Decimal(1.1)
    );
    tx.add(openPositionIx);

    tx = await assignBlockInfoToTransaction(connection, tx, owner);

    const txHash = await sendAndConfirmTransaction(connection, tx, [signer, newPosition], {
      commitment: 'confirmed',
    });
    console.log('transaction hash', txHash);
  }, 30_000);

  test.skip('should rebalance a strategy', async () => {
    const signer = Keypair.fromSecretKey(bs58.decode('enter phantom key'));
    const newPosition = Keypair.generate();
    const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu');
    const strategy = new PublicKey('7rEfrXFWvNBeWPSCwtTSvAtuU1uptBKpkvEN3YAgxX49');

    const kamino = new Kamino(cluster, connection);

    const rebalanceInstructions = await kamino.rebalance(
      strategy,
      newPosition.publicKey,
      new Decimal(0.9),
      new Decimal(1.1),
      signer.publicKey
    );

    for (const rebalanceInstruction of rebalanceInstructions) {
      let tx = new Transaction();
      tx = await assignBlockInfoToTransaction(connection, tx, owner);
      const txHash = await sendAndConfirmTransaction(connection, tx, [signer, newPosition], {
        commitment: 'finalized',
      });
      console.log('transaction hash', txHash);
    }
  }, 60_000);
});
