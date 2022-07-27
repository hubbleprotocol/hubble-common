import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { Kamino } from '../src';

describe('Scope SDK Tests', () => {
  let connection: Connection;
  const cluster = 'devnet';

  beforeAll(() => {
    connection = new Connection(clusterApiUrl(cluster));
  });

  test('should throw on invalid cluster', () => {
    // @ts-ignore
    const init = () => new Kamino('invalid-clusters', undefined);
    expect(init).toThrow(Error);
  });

  test('should get all strategies', async () => {
    const kamino = new Kamino(cluster, connection);
    const allStrategies = await kamino.getStrategies();
    expect(allStrategies.length).toBeGreaterThan(0);
    for (const strat of allStrategies) {
      expect(strat).not.toBeNull();
    }
  });

  test('should get strategy by name', async () => {
    const kamino = new Kamino(cluster, connection);
    const strategy = await kamino.getStrategyByName('SOL - MSOL');
    expect(strategy).not.toBeNull();
  });

  test('should get strategy share price', async () => {
    const kamino = new Kamino(cluster, connection);
    const strategy = await kamino.getStrategyByAddress(new PublicKey('AvRMXt1MM9bdyE4yrnbVYjzYWWx8sdhkXPFbmxeb3rq6'));
    expect(strategy).not.toBeNull();
    const price = await kamino.getStrategySharePrice(strategy!);
    expect(price.toNumber()).toBeGreaterThan(0);
    console.log(price);
  });
});
