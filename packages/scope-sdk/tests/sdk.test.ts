import { OracleType, Scope, scopeTokenToMint, SupportedTokens } from '../src';
import * as chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiDecimalJs from 'chai-decimaljs';
import { Decimal } from 'decimal.js';
import { Env, initEnv } from './runner/env';
import { PublicKey } from '@solana/web3.js';
import { beforeEach } from 'mocha';

chai.use(chaiAsPromised);
chai.use(chaiDecimalJs(Decimal));

describe('Scope SDK Tests', async () => {
  let env: Env;
  let scope: Scope;
  beforeEach(async () => {
    env = await initEnv();
    scope = new Scope('localnet', env.provider.connection);
  });

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

  it('should initialise a new scope feed', async () => {
    try {
      await scope.initialise(env.admin, env.priceFeed);
    } catch (e) {
      console.log(`Error: ${JSON.stringify(e)}`);
      throw e;
    }
    const [, config] = await scope.getFeedConfiguration(env.priceFeed);
    expect(config).to.not.be.null;
  });

  it('should update a feed mapping', async () => {
    await scope.initialise(env.admin, env.priceFeed);
    try {
      await scope.updateFeedMapping(
        env.admin,
        env.priceFeed,
        SupportedTokens.indexOf('ETH'),
        new OracleType.Pyth(),
        new PublicKey('Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD')
      );
    } catch (e) {
      console.log(`Error: ${JSON.stringify(e)}`);
      throw e;
    }

    const newMappings = await scope.getOracleMappings(env.priceFeed);
    const newPriceTypeMapping = newMappings.priceTypes[SupportedTokens.indexOf('ETH')];
    const newPriceAccountMapping = newMappings.priceInfoAccounts[SupportedTokens.indexOf('ETH')];
    expect(newPriceTypeMapping).to.equal(new OracleType.Pyth().discriminator);
    expect(newPriceAccountMapping.toBase58()).to.equal('Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD');
  });

  it('should refresh a price list', async () => {
    await scope.initialise(env.admin, env.priceFeed);
    await scope.updateFeedMapping(
      env.admin,
      env.priceFeed,
      SupportedTokens.indexOf('ETH'),
      new OracleType.Pyth(),
      new PublicKey('Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD')
    );
    const originalOraclePrices = await scope.getOraclePrices(env.priceFeed);
    const originalPrice = originalOraclePrices.prices[SupportedTokens.indexOf('ETH')];
    try {
      await scope.refreshPriceList(env.admin, env.priceFeed, [SupportedTokens.indexOf('ETH')]);
    } catch (e) {
      console.log(`Error: ${JSON.stringify(e)}`);
      throw e;
    }
    const newOraclePrices = await scope.getOraclePrices(env.priceFeed);
    const newPrice = newOraclePrices.prices[SupportedTokens.indexOf('ETH')];
    expect(newPrice.lastUpdatedSlot.toNumber()).gt(originalPrice.lastUpdatedSlot.toNumber());
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
