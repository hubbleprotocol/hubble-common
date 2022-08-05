import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { Kamino } from '../src';

describe('Scope SDK Tests', () => {
  let connection: Connection;
  const cluster = 'mainnet-beta';

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
  //   }
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
  //   const price = await kamino.getStrategySharePrice(strategy!);
  //   expect(price.toNumber()).toBeGreaterThanOrEqual(0);
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
  //   const strategy = await kamino.getStrategyByName('USDH', 'USDC');
  //   expect(strategy).not.toBeNull();
  //   const accounts = await kamino.getStrategyHolders(strategy!);
  //   expect(accounts.length).toBeGreaterThan(0);
  // });

  // test('should get all whirlpools', async () => {
  //   const kamino = new Kamino(cluster, connection);
  //   console.log(await kamino.getWhirlpools([]));
  // });
});
