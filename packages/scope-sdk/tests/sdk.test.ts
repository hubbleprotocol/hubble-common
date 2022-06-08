import { clusterApiUrl, Connection } from '@solana/web3.js';
import { Scope } from '../src';

describe('Scope SDK Tests', () => {
  let connection: Connection;

  beforeAll(() => {
    connection = new Connection(clusterApiUrl('devnet'));
  });

  // test('should throw on invalid cluster', () => {
  //   const cluster = 'invalid-clusters';
  //   // @ts-ignore
  //   const init = () => new Scope(cluster, undefined);
  //   expect(init).toThrow(Error);
  // });
  //
  // test('should throw on invalid connection', () => {
  //   // @ts-ignore
  //   const init = () => new Scope('mainnet-beta', undefined);
  //   expect(init).toThrow(Error);
  // });

  test('should get all prices', async () => {
    const scope = new Scope('devnet', connection);
    const prices = await scope.getAllPrices();
    expect(prices.length).toBeGreaterThan(0);
  });

  test('should get specific price', async () => {
    const scope = new Scope('devnet', connection);
    const price = await scope.getPrice('ETH');
    expect(price.name).toEqual('ETH');
    expect(price.id).not.toBeNaN();
    expect(price.price).not.toBeUndefined();
  });

  test('should get specific prices', async () => {
    const scope = new Scope('devnet', connection);
    const prices = await scope.getPrices(['ETH', 'BTC']);
    expect(prices).toHaveLength(2);
  });
});
