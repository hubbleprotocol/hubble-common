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
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, Kamino } from '../src';
import Decimal from 'decimal.js';
import { TextEncoder } from 'util';
import bs58 from 'bs58';
import {
  assignBlockInfoToTransaction,
  createAddExtraComputeUnitsTransaction,
  createTransactionWithExtraBudget,
  getAssociatedTokenAddressAndData,
} from '../src/utils/tokenUtils';
import { Whirlpool } from '../src/whirpools-client/accounts';

describe('Kamino SDK Tests', () => {
  let connection: Connection;
  const cluster: Cluster = 'devnet';

  beforeAll(() => {
    connection = new Connection(clusterApiUrl(cluster));
  });

  test('should throw on invalid cluster', () => {
    // @ts-ignore
    const init = () => new Kamino('invalid-clusters', undefined);
    expect(init).toThrow(Error);
  });

  // test('should get all strategies', async () => {
  //   const kamino = new Kamino(cluster, connection);
  //   const allStrategies = await kamino.getStrategies();
  //   expect(allStrategies.length).toBeGreaterThan(0);
  //   for (const strat of allStrategies) {
  //     expect(strat).not.toBeNull();
  //     console.log(strat?.whirlpool.toString());
  //   }
  // });
  // test('should get strategy by address', async () => {
  //   const kamino = new Kamino(cluster, connection);
  //   const strategy = await kamino.getStrategyByAddress(new PublicKey('LXUYy5TN2Bq9BoQXx2LKYqmnq4kzZzDT15NuiZ3VAMy'));
  //   expect(strategy).not.toBeNull();
  //   console.log(strategy?.toJSON());
  // });
  //
  // test('should get strategy by name', async () => {
  //   const kamino = new Kamino(cluster, connection);
  //   const strategy = await kamino.getStrategyByName('SOL', 'MSOL');
  //   expect(strategy).not.toBeNull();
  // });
  //
  // test('should get strategy share price', async () => {
  //   const kamino = new Kamino(cluster, connection);
  //   const strategy = await kamino.getStrategyByName('USDH', 'USDC');
  //   expect(strategy).not.toBeNull();
  //   const price = await kamino.getStrategyShareData(strategy!);
  //   expect(price.price.toNumber()).toBeGreaterThanOrEqual(0);
  //   console.log(price);
  // });

  // test('should get all strategies share price', async () => {
  //   const kamino = new Kamino(cluster, connection);
  //   const strats = await kamino.getStrategies();
  //   expect(strats.length).toBeGreaterThan(0);
  //   for (const strat of strats) {
  //     expect(strat).not.toBeNull();
  //     const price = await kamino.getStrategySharePrice(strat!);
  //     expect(price.toNumber()).toBeGreaterThanOrEqual(0);
  //     console.log(price);
  //   }
  // });

  // test('should get all strategy holders', async () => {
  //   const kamino = new Kamino(cluster, connection);
  //   const strategy = await kamino.getStrategyByAddress(new PublicKey('ByXB4xCxVhmUEmQj3Ut7byZ1Hbva1zhKjaVcv3jBMN7E'));
  //   expect(strategy).not.toBeNull();
  //   const accounts = await kamino.getStrategyHolders(strategy!);
  //   expect(accounts.length).toBeGreaterThan(0);
  //   const expectedShares = new Decimal(strategy!.sharesIssued.toString())
  //     .div(new Decimal(10).pow(strategy!.sharesMintDecimals.toString()))
  //     .toNumber();
  //   const actualShares = accounts.map((x) => x.amount.toNumber()).reduce((partialSum, a) => partialSum + a, 0);
  //   expect(expectedShares).toBe(actualShares);
  // });

  // test('should get all whirlpools', async () => {
  //   const kamino = new Kamino(cluster, connection);
  //   console.log(await kamino.getWhirlpools([]));
  // });

  // test('should withdraw shares from a strategy', async () => {
  //   const kamino = new Kamino(cluster, connection);
  //   const strategyPubkey = new PublicKey('2H4xebnp2M9JYgPPfUw58uUQahWF8f1YTNxwwtmdqVYV');
  //   const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu');
  //   const strategy = (await kamino.getStrategyByAddress(strategyPubkey))!;
  //   const strategyWithAddress = { strategy, address: strategyPubkey };
  //   const [sharesAta, sharesMintData] = await getAssociatedTokenAddressAndData(connection, strategy.sharesMint, owner);
  //   const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenAMint, owner);
  //   const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenBMint, owner);
  //   let tx = createTransactionWithExtraBudget(owner);
  //   const ataInstructions = await kamino.getCreateAssociatedTokenAccountInstructionsIfNotExist(
  //     owner,
  //     strategyWithAddress,
  //     tokenAData,
  //     tokenAAta,
  //     tokenBData,
  //     tokenBAta,
  //     sharesMintData,
  //     sharesAta
  //   );
  //   if (ataInstructions.length > 0) {
  //     tx.add(...ataInstructions);
  //   }
  //
  //   const withdrawIx = await kamino.withdrawShares(strategyWithAddress, new Decimal(2), owner);
  //   tx.add(withdrawIx);
  //
  //   tx = await assignBlockInfoToTransaction(connection, tx, owner);
  //
  //   const signer = Keypair.fromSecretKey(
  //     bs58.decode('phantom wallet secret key')
  //   );
  //   const txHash = await sendAndConfirmTransaction(connection, tx, [signer], {
  //     commitment: 'confirmed',
  //   });
  //   console.log(txHash);
  // });

  // test('should withdraw all shares from a strategy', async () => {
  //   const kamino = new Kamino(cluster, connection);
  //   const strategyPubkey = new PublicKey('2H4xebnp2M9JYgPPfUw58uUQahWF8f1YTNxwwtmdqVYV');
  //   const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu');
  //   const strategy = (await kamino.getStrategyByAddress(strategyPubkey))!;
  //   const strategyWithAddress = { strategy, address: strategyPubkey };
  //   const [sharesAta, sharesMintData] = await getAssociatedTokenAddressAndData(connection, strategy.sharesMint, owner);
  //   const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenAMint, owner);
  //   const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenBMint, owner);
  //   let tx = createTransactionWithExtraBudget(owner);
  //   const ataInstructions = await kamino.getCreateAssociatedTokenAccountInstructionsIfNotExist(
  //     owner,
  //     strategyWithAddress,
  //     tokenAData,
  //     tokenAAta,
  //     tokenBData,
  //     tokenBAta,
  //     sharesMintData,
  //     sharesAta
  //   );
  //   if (ataInstructions.length > 0) {
  //     tx.add(...ataInstructions);
  //   }
  //
  //   const withdrawIx = await kamino.withdrawAllShares(strategyWithAddress, owner);
  //   if (withdrawIx) {
  //     tx.add(withdrawIx);
  //   } else {
  //     console.log('balance is 0, cant withdraw');
  //     return;
  //   }
  //
  //   tx = await assignBlockInfoToTransaction(connection, tx, owner);
  //
  //   const signer = Keypair.fromSecretKey(
  //     bs58.decode('phantom wallet secret key')
  //   );
  //   const txHash = await sendAndConfirmTransaction(connection, tx, [signer], {
  //     commitment: 'confirmed',
  //   });
  //   console.log(txHash);
  // });

  // test('should deposit tokens into a strategy', async () => {
  //   const kamino = new Kamino(cluster, connection);
  //   const strategyPubkey = new PublicKey('2H4xebnp2M9JYgPPfUw58uUQahWF8f1YTNxwwtmdqVYV');
  //   const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu');
  //   const strategy = (await kamino.getStrategyByAddress(strategyPubkey))!;
  //   const strategyWithAddress = { strategy, address: strategyPubkey };
  //   const [sharesAta, sharesMintData] = await getAssociatedTokenAddressAndData(connection, strategy.sharesMint, owner);
  //   const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenAMint, owner);
  //   const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(connection, strategy.tokenBMint, owner);
  //   let tx = createTransactionWithExtraBudget(owner);
  //   const ataInstructions = await kamino.getCreateAssociatedTokenAccountInstructionsIfNotExist(
  //     owner,
  //     strategyWithAddress,
  //     tokenAData,
  //     tokenAAta,
  //     tokenBData,
  //     tokenBAta,
  //     sharesMintData,
  //     sharesAta
  //   );
  //   if (ataInstructions.length > 0) {
  //     tx.add(...ataInstructions);
  //   }
  //
  //   const depositIx = await kamino.deposit(strategyWithAddress, new Decimal(1), new Decimal(2), owner);
  //   tx.add(depositIx);
  //
  //   tx = await assignBlockInfoToTransaction(connection, tx, owner);
  //
  //   const signer = Keypair.fromSecretKey(bs58.decode('phantom wallet secret key'));
  //   const txHash = await sendAndConfirmTransaction(connection, tx, [signer], {
  //     commitment: 'confirmed',
  //   });
  //   console.log(txHash);
  // });

  // test('should create a new strategy', async () => {
  //   const signer = Keypair.fromSecretKey(bs58.decode('phantom secret key'));
  //   const newStrategy = Keypair.generate();
  //   const owner = new PublicKey('HrwbdQYwSnAyVpVHuGQ661HiNbWmGjDp5DdDR9YMw7Bu');
  //   const whirlpool = new PublicKey('5vHht2PCHKsApekfPZXyn7XthAYQbsCNiwA1VEcQmL12');
  //
  //   const kamino = new Kamino(cluster, connection);
  //   const whirlpoolState = await kamino.getWhirlpoolByAddress(whirlpool);
  //   expect(whirlpoolState).not.toBeNull();
  //
  //   let tx = createTransactionWithExtraBudget(owner);
  //
  //   const [tokenAAta, tokenAData] = await getAssociatedTokenAddressAndData(
  //     connection,
  //     whirlpoolState!.tokenMintA,
  //     owner
  //   );
  //   if (!tokenAData) {
  //     tx.add(createAssociatedTokenAccountInstruction(owner, tokenAAta, owner, whirlpoolState!.tokenMintA));
  //   }
  //   const [tokenBAta, tokenBData] = await getAssociatedTokenAddressAndData(
  //     connection,
  //     whirlpoolState!.tokenMintB,
  //     owner
  //   );
  //   if (!tokenBData) {
  //     tx.add(createAssociatedTokenAccountInstruction(owner, tokenBAta, owner, whirlpoolState!.tokenMintB));
  //   }
  //
  //   const createStrategyAccountIx = await kamino.createStrategyAccount(owner, newStrategy.publicKey);
  //   tx.add(createStrategyAccountIx);
  //
  //   const createStrategyIx = await kamino.createStrategy(newStrategy.publicKey, whirlpool, owner, 'USDH', 'USDC');
  //   tx.add(createStrategyIx);
  //
  //   tx = await assignBlockInfoToTransaction(connection, tx, owner);
  //
  //   const txHash = await sendAndConfirmTransaction(connection, tx, [signer, newStrategy], {
  //     commitment: 'finalized',
  //   });
  //   console.log('transaction hash', txHash);
  //   console.log('new strategy has been created', newStrategy.publicKey.toString());
  //   const strategy = await kamino.getStrategyByAddress(newStrategy.publicKey);
  //   expect(strategy).not.toBeNull();
  //   console.log(strategy?.toJSON());
  // }, 30_000);
});
