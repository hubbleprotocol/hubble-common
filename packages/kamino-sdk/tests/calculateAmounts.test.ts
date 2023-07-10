import { Connection } from '@solana/web3.js';
import { Kamino, StrategiesFilters, ZERO } from '../src';
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

  it('FilterStrats strategies based on status', async () => {
    console.log('test');

    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    let filters: StrategiesFilters = {
      strategyCreationStatus: 'IGNORED',
      isCommunity: true,
    };

    let res = await kamino.getAllStrategiesWithFilters(filters);
    for (let strat of res) {
      console.log('Strat', strat.address.toString(), strat.strategy.isCommunity, strat.strategy.creationStatus);
      expect(strat.strategy.isCommunity).to.be.equal(1);
      expect(strat.strategy.creationStatus).to.be.equal(0);
    }
  });

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
    expect(
      calculatedAmountsWithSwap.requiredAAmountToDeposit
        .add(calculatedAmountsWithSwap.requiredBAmountToDeposit)
        .gt(new Decimal(100.0))
    ).to.be.true;
    expect(
      calculatedAmountsWithSwap.requiredAAmountToDeposit
        .add(calculatedAmountsWithSwap.requiredBAmountToDeposit)
        .lt(new Decimal(101.0))
    ).to.be.true;

    // verify that given they have ±the same price, what amount to be swapped of USDC is very close to the amount of USDH to be bought
    expect(
      calculatedAmountsWithSwap.tokenAToSwapAmount
        .add(calculatedAmountsWithSwap.tokenBToSwapAmount)
        .abs()
        .lt(new Decimal(0.5))
    ).to.be.true;
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
    expect(
      calculatedAmountsWithSwap.requiredAAmountToDeposit
        .add(calculatedAmountsWithSwap.requiredBAmountToDeposit)
        .gt(new Decimal(499.5))
    ).to.be.true;
    expect(
      calculatedAmountsWithSwap.requiredAAmountToDeposit
        .add(calculatedAmountsWithSwap.requiredBAmountToDeposit)
        .lt(new Decimal(500.0))
    ).to.be.true;
    // verify that given they have ±the same price, what amount to be swapped of USDC is equal to the amount of USDH to be bought (we have to sell some USDH more because it is the cheaper token)
    expect(
      calculatedAmountsWithSwap.tokenAToSwapAmount
        .add(calculatedAmountsWithSwap.tokenBToSwapAmount)
        .abs()
        .lt(new Decimal(0.5))
    ).to.be.true;
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

  it('calculateAmountsToBeDepositedWithSwap for SOL-USDC pair, Price SOL/USDC 19', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    let price = new Decimal(19.0);
    // tokenA is 0 because the strat is USDH-USDC
    let { requiredAAmountToDeposit, requiredBAmountToDeposit, tokenAToSwapAmount, tokenBToSwapAmount } =
      await kamino.calculateAmountsToBeDepositedWithSwap(SolUsdcShadowStrategyMainnet, ZERO, new Decimal(8.0), price);

    expect(requiredAAmountToDeposit.eq(tokenAToSwapAmount)).to.be.true;
    expect(requiredBAmountToDeposit.add(tokenBToSwapAmount.mul(new Decimal(-1))).eq(new Decimal(8.0))).to.be.true;

    let totalDepositValue = requiredAAmountToDeposit.mul(price).add(requiredBAmountToDeposit);
    expect(totalDepositValue.lt(new Decimal(8))).to.be.true;
    expect(totalDepositValue.gt(new Decimal(7.99))).to.be.true;
  });

  it('calculateAmountsToBeDepositedWithSwap for SOL-USDC pair, Price SOL/USDC 185.34, deposit both tokens in low amounts', async () => {
    let kamino = new Kamino(
      cluster,
      connection,
      GlobalConfigMainnet,
      KaminoProgramIdMainnet,
      WHIRLPOOL_PROGRAM_ID,
      RAYDIUM_PROGRAM_ID
    );

    let price = new Decimal(185.34);
    let solToDeposit = new Decimal(0.02);
    let usdcToDeposit = new Decimal(1.5);
    let { requiredAAmountToDeposit, requiredBAmountToDeposit, tokenAToSwapAmount, tokenBToSwapAmount } =
      await kamino.calculateAmountsToBeDepositedWithSwap(
        SolUsdcShadowStrategyMainnet,
        solToDeposit,
        usdcToDeposit,
        price
      );

    console.log('requiredAAmountToDeposit', requiredAAmountToDeposit.toString());
    console.log('requiredBAmountToDeposit', requiredBAmountToDeposit.toString());
    console.log('tokenAToSwapAmount', tokenAToSwapAmount.toString());
    console.log('tokenBToSwapAmount', tokenBToSwapAmount.toString());

    let totalBUsed = requiredBAmountToDeposit.add(tokenBToSwapAmount.mul(new Decimal(-1)));
    console.log('totalBUsed', totalBUsed.toString());
    expect(requiredAAmountToDeposit.eq(tokenAToSwapAmount.add(solToDeposit))).to.be.true;
    expect(totalBUsed.lt(usdcToDeposit)).to.be.true;
    expect(totalBUsed.gt(usdcToDeposit.sub(new Decimal(0.00001)))).to.be.true;

    let initialTotalValue = solToDeposit.mul(price).add(usdcToDeposit);
    let totalDepositValue = requiredAAmountToDeposit.mul(price).add(requiredBAmountToDeposit);
    expect(totalDepositValue.lt(initialTotalValue)).to.be.true;
    expect(totalDepositValue.gt(initialTotalValue.sub(new Decimal(0.001)))).to.be.true;
  });
});
