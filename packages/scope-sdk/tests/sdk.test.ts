import { Scope, scopeTokenToMint, SupportedTokens, U16_MAX } from '../src';
import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiDecimalJs from 'chai-decimaljs';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { Decimal } from 'decimal.js';

chai.use(chaiAsPromised);
chai.use(chaiDecimalJs(Decimal));

describe('Scope SDK Tests', () => {
  const connection = new Connection('http://127.0.0.1:8899');
  const scope = new Scope('localnet', connection);

  it('should throw on invalid cluster', async () => {
    const cluster = 'invalid-clusters';
    // @ts-ignore
    const init = () => new Scope(cluster, undefined);
    expect(init).to.throw(Error);
  });

  it('should have all mints specified in the mint token map', async () => {
    for (const supportedToken of SupportedTokens.filter((x) => !x.endsWith('Ema') && !x.endsWith('Twap'))) {
      const mint = scopeTokenToMint(supportedToken);
      console.log(supportedToken, mint);
      expect(mint).not.to.be.undefined;
    }
  });

  it('should get prices by chain', async () => {
    // 88 = HNT/USD
    const price = await scope.getPriceFromChain([88, 65_535, 65_535, 65_535]);
    expect(price.toNumber()).greaterThan(0);
  });

  it('should get prices by chain when multiple steps', async () => {
    // 88 = HNT/USD
    // 84 = IOT/HNT
    // gives us the price of IOT/USD
    const price = await scope.getPriceFromChain([88, 84, 65_535, 65_535]);
    expect(price.toNumber()).gt(0);
  });

  it('should throw on default 0 chain', async () => {
    await expect(scope.getPriceFromChain([0, 0, 0, 0])).to.be.rejected;
  });

  it('should throw on default u16 chain', async () => {
    await expect(scope.getPriceFromChain([65_535, 65_535, 65_535, 65_535])).to.be.rejected;
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
