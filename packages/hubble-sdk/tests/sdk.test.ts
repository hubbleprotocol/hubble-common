import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { HBB_DECIMALS } from '../src/constants';
import { BN } from '@project-serum/anchor';
import Decimal from 'decimal.js';
import Hubble from '../src/Hubble';
import { SolanaCluster } from '@hubbleprotocol/hubble-config';
import { STABLECOIN_DECIMALS, StakingPoolState } from '../dist';
import { PsmReserve } from '../src';

describe('Hubble SDK Tests', () => {
  const cluster: SolanaCluster = 'mainnet-beta';
  let connection: Connection;

  beforeAll(() => {
    connection = new Connection(clusterApiUrl(cluster));
    jest.spyOn(Hubble.prototype, 'getPsmReserve').mockImplementation(() => {
      const zero = new Decimal(0);
      const pk = new PublicKey('72tsMfXLasd8GFya63UZY7w8xDgDLdxJtCJ16trT14gm');
      return Promise.resolve({
        maxCapacity: new Decimal(3000 * STABLECOIN_DECIMALS),
        depositedStablecoin: new Decimal(1000 * STABLECOIN_DECIMALS),
        borrowingMarketState: pk,
        bump: 0,
        psmVault: pk,
        psmVaultAuthority: pk,
        psmVaultAuthoritySeed: pk,
        stablecoinMint: pk,
        stablecoinMintDecimals: 0,
        version: zero,
        mintedUsdh: zero,
      });
    });
  });

  test('should throw on invalid cluster', () => {
    const cluster = 'invalid-clusters';
    // @ts-ignore
    const init = () => new Hubble(cluster, undefined);
    expect(init).toThrow(Error);
  });

  test('should throw on invalid connection', () => {
    // @ts-ignore
    const init = () => new Hubble(cluster, undefined);
    expect(init).toThrow(Error);
  });

  //TODO: replace with localnet below and setup integration tests...

  // test('should get usdh circulating supply', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const sth = await sdk.getUsdhCirculatingSupply();
  //   expect(sth).not.toBeNull();
  //   console.log(sth);
  // });

  test('should get 10 usdc-usdh swap info', async () => {
    const sdk = new Hubble(cluster, connection);
    const swap = await sdk.getUsdcToUsdhSwap(new Decimal(10));
    expect(swap).not.toBeNull();
    expect(swap.outAmount.toNumber()).toEqual(10);
    expect(swap.inAmount.toNumber()).toEqual(10);
  });

  test('should get 2000 usdc-usdh swap info', async () => {
    const sdk = new Hubble(cluster, connection);
    const swap = await sdk.getUsdcToUsdhSwap(new Decimal(2000));
    expect(swap).not.toBeNull();
    expect(swap.outAmount.toNumber()).toEqual(2000);
    expect(swap.inAmount.toNumber()).toEqual(2000);
  });

  test('should get 0 usdc-usdh swap info', async () => {
    const sdk = new Hubble(cluster, connection);
    const swap = await sdk.getUsdcToUsdhSwap(new Decimal(2001));
    expect(swap).not.toBeNull();
    expect(swap.outAmount.toNumber()).toEqual(0);
    expect(swap.inAmount.toNumber()).toEqual(2001);
  });

  test('should get 10 usdh-usdc swap info', async () => {
    const sdk = new Hubble(cluster, connection);
    const swap = await sdk.getUsdhToUsdcSwap(new Decimal(10));
    expect(swap).not.toBeNull();
    expect(swap.outAmount.toNumber()).toEqual(10);
    expect(swap.inAmount.toNumber()).toEqual(10);
  });

  test('should get 1000 usdh-usdc swap info', async () => {
    const sdk = new Hubble(cluster, connection);
    const swap = await sdk.getUsdhToUsdcSwap(new Decimal(1000));
    expect(swap).not.toBeNull();
    expect(swap.outAmount.toNumber()).toEqual(1000);
    expect(swap.inAmount.toNumber()).toEqual(1000);
  });

  test('should get 0 usdh-usdc swap info', async () => {
    const sdk = new Hubble(cluster, connection);
    const swap = await sdk.getUsdhToUsdcSwap(new Decimal(1001));
    expect(swap).not.toBeNull();
    expect(swap.outAmount.toNumber()).toEqual(0);
    expect(swap.inAmount.toNumber()).toEqual(1001);
  });

  // test('should get borrowing market state', async () => {
  //   const sdk = new Hubble(cluster, connection);
  //   const sth = await sdk.getBorrowingMarketState();
  //   expect(sth).not.toBeNull();
  //   console.log(sth.marketMcr.toNumber());
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
  //   const loans = await sdk.getUserLoans('9y7uLMUMW6EiRwH1aJFSp9Zka7dVx2JdZKA3858u6YHT');
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
  //   console.log(userVaults[0]);
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
});
