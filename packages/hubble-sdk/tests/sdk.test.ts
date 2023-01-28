import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { findInExtraCollateralByName, HBB_DECIMALS, STABLECOIN_DECIMALS } from '../src/constants';
import Decimal from 'decimal.js';
import Hubble from '../src/Hubble';
import { SolanaCluster } from '@hubbleprotocol/hubble-config';
import { PsmReserve } from '../src';
import sinon from 'sinon';
import { expect } from 'chai';

describe('Hubble SDK Tests', () => {
  const cluster: SolanaCluster = 'devnet';
  let connection: Connection;

  before(() => {
    connection = new Connection(clusterApiUrl(cluster));
    let stub = sinon.stub(Hubble.prototype, 'getPsmReserve');
    const zero = new Decimal(0);
    const pk = new PublicKey('72tsMfXLasd8GFya63UZY7w8xDgDLdxJtCJ16trT14gm');
    stub.returns(
      Promise.resolve({
        maxCapacity: new Decimal(3000 * STABLECOIN_DECIMALS),
        depositedStablecoin: new Decimal(1000 * STABLECOIN_DECIMALS),
        mintedUsdh: new Decimal(1000 * STABLECOIN_DECIMALS),
        borrowingMarketState: pk,
        bump: 255,
        psmVault: pk,
        psmVaultAuthority: pk,
        psmVaultAuthoritySeed: 0,
        stablecoinMint: pk,
        stablecoinMintDecimals: 6,
        version: 0,
        withdrawalCapUsdh: {
          configCapacity: new Decimal(0),
          currentTotal: new Decimal(0),
          lastIntervalStartTimestamp: 0,
          configIntervalLengthSeconds: 0,
        },
        withdrawalCapStable: {
          configCapacity: new Decimal(0),
          currentTotal: new Decimal(0),
          lastIntervalStartTimestamp: 0,
          configIntervalLengthSeconds: 0,
        },
        mintFeeBps: 0,
        burnFeeBps: 0,
        treasuryVaultOtherStable: pk,
        treasuryVaultOtherStableAuthority: pk,
      })
    );
  });

  it('should throw on invalid cluster', () => {
    const cluster = 'invalid-clusters';
    // @ts-ignore
    const init = () => new Hubble(cluster, undefined);
    expect(init).to.throw(Error);
  });

  it('should throw on invalid connection', () => {
    // @ts-ignore
    const init = () => new Hubble(cluster, undefined);
    expect(init).to.throw(Error);
  });

  //TODO: replace with localnet below and setup integration tests...

  // test('should get usdh circulating supply', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const sth = await sdk.getUsdhCirculatingSupply();
  //   expect(sth).not.toBeNull();
  //   console.log(sth);
  // });

  // test('should get psm reserve', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const sth = await sdk.getPsmReserve();
  //   expect(sth).not.toBeNull();
  //   console.log(sth);
  // });

  it('should get 10 usdc-usdh swap info', async () => {
    const sdk = new Hubble(cluster, connection);
    const swap = await sdk.getUsdcToUsdhSwap(new Decimal(10));
    expect(swap).not.to.be.null;
    expect(swap.outAmount.toNumber()).to.equal(10);
    expect(swap.inAmount.toNumber()).to.equal(10);
  });

  it('should get 2000 usdc-usdh swap info', async () => {
    const sdk = new Hubble(cluster, connection);
    const swap = await sdk.getUsdcToUsdhSwap(new Decimal(2000));
    expect(swap).not.to.be.null;
    expect(swap.outAmount.toNumber()).to.equal(2000);
    expect(swap.inAmount.toNumber()).to.equal(2000);
  });

  it('should get 0 usdc-usdh swap info', async () => {
    const sdk = new Hubble(cluster, connection);
    const swap = await sdk.getUsdcToUsdhSwap(new Decimal(2001));
    expect(swap).not.to.be.null;
    expect(swap.outAmount.toNumber()).to.equal(0);
    expect(swap.inAmount.toNumber()).to.equal(2001);
  });

  it('should get 10 usdh-usdc swap info', async () => {
    const sdk = new Hubble(cluster, connection);
    const swap = await sdk.getUsdhToUsdcSwap(new Decimal(10));
    expect(swap).not.to.be.null;
    expect(swap.outAmount.toNumber()).to.equal(10);
    expect(swap.inAmount.toNumber()).to.equal(10);
  });

  it('should get 1000 usdh-usdc swap info', async () => {
    const sdk = new Hubble(cluster, connection);
    const swap = await sdk.getUsdhToUsdcSwap(new Decimal(1000));
    expect(swap).not.to.be.null;
    expect(swap.outAmount.toNumber()).to.equal(1000);
    expect(swap.inAmount.toNumber()).to.equal(1000);
  });

  it('should get 0 usdh-usdc swap info', async () => {
    const sdk = new Hubble(cluster, connection);
    const swap = await sdk.getUsdhToUsdcSwap(new Decimal(1001));
    expect(swap).not.to.be.null;
    expect(swap.outAmount.toNumber()).to.equal(0);
    expect(swap.inAmount.toNumber()).to.equal(1001);
  });

  // test('should get borrowing market state', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const sth = await sdk.getBorrowingMarketStates();
  //   console.log(sth);
  //   expect(sth.length).toBeGreaterThanOrEqual(0);
  // });

  // test('should get staking pool', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const pool: StakingPoolState = await sdk.getStakingPoolState();
  //   expect(pool).not.toBeNull();
  //   expect(pool.borrowingMarketState).not.toBeNull();
  //   expect(pool.totalDistributedRewards).not.toBeNull();
  //   expect(pool.rewardsNotYetClaimed).not.toBeNull();
  //   expect(pool.version).not.toBeNull();
  //   expect(pool.numUsers).not.toBeNull();
  //   expect(pool.totalUsersProvidingStability).not.toBeNull();
  //   expect(pool.totalStake).not.toBeNull();
  //   expect(pool.rewardPerToken).not.toBeNull();
  //   expect(pool.prevRewardLoss).not.toBeNull();
  //   expect(pool.stakingVault).not.toBeNull();
  // });
  // //
  // test('should get user staking pool', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const sth = await sdk.getUserStakingState('9y7uLMUMW6EiRwH1aJFSp9Zka7dVx2JdZKA3858u6YHT');
  //   expect(sth).not.toBeNull();
  // });
  // //
  // test('should get user stability pool state', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const userStabilityState = await sdk.getUserStabilityProviderState('9y7uLMUMW6EiRwH1aJFSp9Zka7dVx2JdZKA3858u6YHT');
  //   console.log(userStabilityState);
  //   expect(userStabilityState).not.toBeNull();
  // });
  // //
  // test('should get user borrowing stats', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const userMetadata = await sdk.getUserMetadata('9y7uLMUMW6EiRwH1aJFSp9Zka7dVx2JdZKA3858u6YHT');
  //   expect(userMetadata).not.toBeNull();
  // });
  // //
  // test('should get user staked HBB', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const stakedHbb = await sdk.getUserUsdhVault('Eoq6pcS5aQPM8SqtaP4LvRHUChXnwbgY62gD5n4ypwMS');
  //   expect(stakedHbb).not.toBeNull();
  //   console.log('staked hbb: ', stakedHbb);
  // }, 30000);
  // //
  // test('should handle user without anything gracefully', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const stakedHbb = await sdk.getUserStakedHbb('AVkV2ntoMaCZB6mWcHpk3HoyLiPpXu2pQJeKekGiadNm');
  //   expect(stakedHbb).toBeUndefined();
  //
  //   const stability = await sdk.getUserUsdhInStabilityPool('AVkV2ntoMaCZB6mWcHpk3HoyLiPpXu2pQJeKekGiadNm');
  //   expect(stability).toBeUndefined();
  // });
  // //
  // test('should get user deposited usdh in stability pool', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const depositedUsdh = await sdk.getUserUsdhInStabilityPool('9y7uLMUMW6EiRwH1aJFSp9Zka7dVx2JdZKA3858u6YHT');
  //   expect(depositedUsdh).not.toBeNull();
  // });
  //
  // test('should get user loans', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const loans = await sdk.getUserLoans('F7rjavUpEevdUpgPm6WozNJynmwrzXuo2LgqgWRpJG5t');
  //   console.log('loans : ', loans);
  // });
  // //
  // test('should get all stability providers', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const stabilityProviderStates = await sdk.getStabilityProviders();
  //   expect(stabilityProviderStates.length).toBeGreaterThan(0);
  //   console.log(stabilityProviderStates.length);
  // });
  // //
  // test('should get all stability pool state', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const sth = await sdk.getStabilityPoolState();
  //   console.log(sth);
  // });
  // //
  // test('should get global config', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const sth = await sdk.getGlobalConfig();
  //   console.log(sth);
  // });
  // //
  // test('should get all user metadatas', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const userVaults = await sdk.getAllUserMetadatas();
  //   expect(userVaults.length).toBeGreaterThan(0);
  //   console.log(
  //     userVaults.filter((x) => x.borrowingMarketState.toBase58() === '2pjsM2weitsEP3w1Q4N7bLvFYmdNBWCw1H3E9k6rVQTy')
  //       .length
  //   );
  //   console.log(
  //     userVaults.filter((x) => x.borrowingMarketState.toBase58() === 'FqkHHpETrpfgcA5SeH7PKKFDLGWM4tM7ZV31HfutTXNV')
  //       .length
  //   );
  // });
  //
  // test('should get specific user metadatas', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const userVault = await sdk.getUserMetadata('CBbukgUThH2ezoLpdcSkTwio1BVPtjqwcvvhkVxVu2fe');
  //   console.log(userVault);
  // });
  // //
  // test('should get all user metadatas with json', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const userVaults = await sdk.getAllUserMetadatasIncludeJsonResponse();
  //   expect(userVaults.length).toBeGreaterThan(0);
  //   console.log(userVaults);
  // });
  // //
  // test('should get all HBB token accounts', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const userVaults = await sdk.getHbbTokenAccounts();
  //   expect(userVaults.length).toBeGreaterThan(0);
  //   console.log(userVaults.length);
  // });
  // //
  // test('should get treasury vault', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const treasuryVault = await sdk.getTreasuryVault();
  //   console.log(treasuryVault);
  //   expect(treasuryVault.isZero()).toBeFalsy();
  // });
  // //
  // test('should get HBB circulating supply', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const circulatingSupply = await sdk.getHbbCirculatingSupply();
  //   console.log(circulatingSupply);
  //   expect(circulatingSupply.isZero()).toBeFalsy();
  // });

  //   test('should get user loans', async () => {
  //     const sdk = new Hubble(cluster, connection);
  //     const userLoans = await sdk.getUserLoans('9S426eJi7Ydzc3bawR7DpxbMcGUuNvvj8ru2UePWr4x4');
  //     // expect(userLoans).toHaveLength(4);
  //     for (const userLoan of userLoans) {
  //       // use helper functions:
  //       const stsol = findInExtraCollateralByName('STSOL', userLoan.collateral.extraCollaterals);
  //       const ldo = findInExtraCollateralByName('LDO', userLoan.collateral.extraCollaterals);
  //       // or use the map:
  //       // const stsolId = ExtraCollateralMap.find((x) => x.name === 'STSOL')!.id;
  //       // const ldoId = ExtraCollateralMap.find((x) => x.name === 'LDO')!.id;
  //       // const stsol = userLoan.collateral.extraCollaterals.find((x) => x.tokenId.eq(stsolId));
  //       // const ldo = userLoan.collateral.extraCollaterals.find((x) => x.tokenId.eq(ldoId));
  //       expect(stsol?.amount.toNumber()).toBeGreaterThanOrEqual(0);
  //       expect(ldo?.amount.toNumber()).toBeGreaterThanOrEqual(0);
  //     }
  //     console.log(userLoans.map((x) => x.collateral));
  //     console.log(userLoans.map((x) => x.collateral.extraCollaterals));
  //   });
});
