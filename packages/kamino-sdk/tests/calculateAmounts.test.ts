import { Connection } from '@solana/web3.js';
import { Kamino, ZERO } from '../src';
import {
  GlobalConfigMainnet,
  KaminoProgramIdMainnet,
  SolUsdcShadowStrategyMainnet,
  UsdcUsdhShadowStrategyMainnet,
} from './utils';
import { WHIRLPOOL_PROGRAM_ID } from '../src/whirpools-client/programId';
import { PROGRAM_ID as RAYDIUM_PROGRAM_ID } from '../src/raydium_client/programId';
import { expect } from 'chai';
import Decimal from 'decimal.js';

describe('Kamino strategy creation SDK Tests', () => {
  let connection: Connection;
  const cluster = 'mainnet-beta';
  const clusterUrl: string = 'https://api.mainnet-beta.solana.com';
  connection = new Connection(clusterUrl, 'processed');

  it('calculateAmountsToBeDepositedWithSwap for USDC-USDH pair, USDC provided only', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    // tokenA is 0 because the strat is USDH-USDC
    let calculatedAmountsWithSwap = await kamino.calculateAmountsToBeDepositedWithSwap(
      UsdcUsdhShadowStrategyMainnet,
      ZERO,
      new Decimal(100.0)
    );

    console.log('calculatedAmountsWithSwap', calculatedAmountsWithSwap);
    // verify that the total amount to be deposited matches the initial amount (as USDC is slightly bigger than USDH, we should get a total of tokens slightly bigger than what we input)
    expect(calculatedAmountsWithSwap[0].add(calculatedAmountsWithSwap[1]).gt(new Decimal(100.0))).to.be.true;
    expect(calculatedAmountsWithSwap[0].add(calculatedAmountsWithSwap[1]).lt(new Decimal(101.0))).to.be.true;

    // verify that given they have ±the same price, what amount to be swapped of USDC is very close to the amount of USDH to be bought
    expect(calculatedAmountsWithSwap[2].add(calculatedAmountsWithSwap[3]).abs().lt(new Decimal(0.5))).to.be.true;
  });

  it('calculateAmountsToBeDepositedWithSwap for USDC-USDH pair, too much USDH provided', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    let calculatedAmountsWithSwap = await kamino.calculateAmountsToBeDepositedWithSwap(
      UsdcUsdhShadowStrategyMainnet,
      new Decimal(300.0),
      new Decimal(200.0)
    );

    console.log('calculatedAmountsWithSwap', calculatedAmountsWithSwap);
    // verify that the total amount to be deposited almost equals the initial amount (USDH is cheaper so we get less USDC)
    expect(calculatedAmountsWithSwap[0].add(calculatedAmountsWithSwap[1]).gt(new Decimal(499.5))).to.be.true;
    expect(calculatedAmountsWithSwap[0].add(calculatedAmountsWithSwap[1]).lt(new Decimal(500.0))).to.be.true;
    // verify that given they have ±the same price, what amount to be swapped of USDC is equal to the amount of USDH to be bought (we have to sell some USDH more because it is the cheaper token)
    expect(calculatedAmountsWithSwap[2].add(calculatedAmountsWithSwap[3]).abs().lt(new Decimal(0.5))).to.be.true;
  });

  it('calculateAmountsToBeDepositedWithSwap for SOL-USDC pair, SOL provided only', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    // tokenA is 0 because the strat is USDH-USDC
    let calculatedAmountsWithSwap = await kamino.calculateAmountsToBeDepositedWithSwap(
      SolUsdcShadowStrategyMainnet,
      new Decimal(4.0),
      ZERO
    );

    console.log('calculatedAmountsWithSwap', calculatedAmountsWithSwap);
  });

  it('calculateAmountsToBeDepositedWithSwap for SOL-USDC pair, USDC provided only', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    // tokenA is 0 because the strat is USDH-USDC
    let calculatedAmountsWithSwap = await kamino.calculateAmountsToBeDepositedWithSwap(
      SolUsdcShadowStrategyMainnet,
      ZERO,
      new Decimal(8.0)
    );

    console.log('calculatedAmountsWithSwap', calculatedAmountsWithSwap);
  });
});
