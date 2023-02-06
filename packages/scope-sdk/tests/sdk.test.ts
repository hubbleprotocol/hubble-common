import { Scope, scopeTokenToMint, SupportedTokens } from '../src';
import { expect } from 'chai';

describe('Scope SDK Tests', () => {
  it('should throw on invalid cluster', () => {
    const cluster = 'invalid-clusters';
    // @ts-ignore
    const init = () => new Scope(cluster, undefined);
    expect(init).to.throw(Error);
  });

  it('should have all mints specified in the mint token map', () => {
    for (const supportedToken of SupportedTokens.filter((x) => !x.endsWith('Ema') && !x.endsWith('Twap'))) {
      const mint = scopeTokenToMint(supportedToken);
      expect(mint).not.to.be.undefined;
    }
  });

  // test('should get all prices', async () => {
  //   const scope = new Scope(cluster, connection);
  //   const prices = await scope.getAllPrices();
  //   expect(prices.length).toBeGreaterThan(0);
  // });
  //
  // test('should get specific price', async () => {
  //   const scope = new Scope(cluster, connection);
  //   let price = await scope.getPrice('ETH');
  //   expect(price.name).toEqual('ETH');
  //   expect(price.id).not.toBeNaN();
  //   expect(price.price).not.toBeUndefined();
  //
  //   price = await scope.getPrice('MSOL');
  //   expect(price.name).toEqual('MSOL');
  //   expect(price.id).not.toBeNaN();
  //   expect(price.price).not.toBeUndefined();
  //
  //   price = await scope.getPrice('scnSOL');
  //   expect(price.name).toEqual('scnSOL');
  //   expect(price.id).not.toBeNaN();
  //   expect(price.price).not.toBeUndefined();
  //   console.log(price);
  // });
  //
  // test('should get specific prices', async () => {
  //   const scope = new Scope(cluster, connection);
  //   const prices = await scope.getPrices(['ETH', 'BTC']);
  //   expect(prices).toHaveLength(2);
  // });
});
