import { OracleType, Scope } from '../src';
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
  const ethTokenIndex = 1;
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

  it('should initialise a new scope feed', async () => {
    try {
      await scope.initialise(env.admin, env.priceFeed);
    } catch (e) {
      console.log(`Error: ${JSON.stringify(e)}`);
      throw e;
    }
    const [, config] = await scope.getFeedConfiguration({ feed: env.priceFeed });
    expect(config).to.not.be.null;
  });

  it('should update a feed mapping', async () => {
    await scope.initialise(env.admin, env.priceFeed);
    try {
      await scope.updateFeedMapping(
        env.admin,
        env.priceFeed,
        ethTokenIndex,
        new OracleType.Pyth(),
        new PublicKey('Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD')
      );
    } catch (e) {
      console.log(`Error: ${JSON.stringify(e)}`);
      throw e;
    }

    const newMappings = await scope.getOracleMappings({ feed: env.priceFeed });
    const newPriceTypeMapping = newMappings.priceTypes[ethTokenIndex];
    const newPriceAccountMapping = newMappings.priceInfoAccounts[ethTokenIndex];
    expect(newPriceTypeMapping).to.equal(new OracleType.Pyth().discriminator);
    expect(newPriceAccountMapping.toBase58()).to.equal('Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD');
  });

  it('should refresh a price list', async () => {
    await scope.initialise(env.admin, env.priceFeed);
    await scope.updateFeedMapping(
      env.admin,
      env.priceFeed,
      ethTokenIndex,
      new OracleType.Pyth(),
      new PublicKey('Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD')
    );
    const originalOraclePrices = await scope.getOraclePrices({ feed: env.priceFeed });
    const originalPrice = originalOraclePrices.prices[ethTokenIndex];
    try {
      await scope.refreshPriceList(env.admin, { feed: env.priceFeed }, [ethTokenIndex]);
    } catch (e) {
      console.log(`Error: ${JSON.stringify(e)}`);
      throw e;
    }
    const newOraclePrices = await scope.getOraclePrices({ feed: env.priceFeed });
    const newPrice = newOraclePrices.prices[ethTokenIndex];
    expect(newPrice.lastUpdatedSlot.toNumber()).gt(originalPrice.lastUpdatedSlot.toNumber());
  });

  it('should get prices by chain', async () => {
    // 88 = HNT/USD
    const price = await scope.getPriceFromChain([88, 65_535, 65_535, 65_535]);
    expect(price.price.toNumber()).greaterThan(0);
    expect(price.timestamp.toNumber()).greaterThan(0);
  });

  it('should get prices by chain when multiple steps', async () => {
    // 88 = HNT/USD
    // 84 = IOT/HNT
    // gives us the price of IOT/USD
    const price = await scope.getPriceFromChain([88, 84, 65_535, 65_535]);
    expect(price.price.toNumber()).gt(0);
    expect(price.timestamp.toNumber()).gt(0);
  });

  it('should throw on default 0 chain', async () => {
    await expect(scope.getPriceFromChain([0, 0, 0, 0])).to.be.rejected;
  });

  it('should throw on default u16 chain', async () => {
    await expect(scope.getPriceFromChain([65_535, 65_535, 65_535, 65_535])).to.be.rejected;
  });

  it('should verify if scope chain is valid', () => {
    expect(Scope.isScopeChainValid([0, 0, 0, 0])).to.be.false;
    expect(Scope.isScopeChainValid([65_535, 65_535, 65_535, 65_535])).to.be.false;
    expect(Scope.isScopeChainValid([0, 65_535, 65_535, 65_535])).to.be.true;
    expect(Scope.isScopeChainValid([0, 0, 65_535, 65_535])).to.be.true;
    expect(Scope.isScopeChainValid([0, 0, 0, 65_535])).to.be.true;
    expect(Scope.isScopeChainValid([0, 15, 0, 20])).to.be.true;
    expect(Scope.isScopeChainValid([0, 15])).to.be.true;
    expect(Scope.isScopeChainValid([0])).to.be.false;
    expect(Scope.isScopeChainValid([])).to.be.false;
  });
});
