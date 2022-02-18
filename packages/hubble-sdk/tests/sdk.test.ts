import Hubble from '../dist/Hubble';
import { clusterApiUrl, Connection } from '@solana/web3.js';

describe('Hubble SDK Tests', () => {
  let connection: Connection;

  beforeAll(() => {
    connection = new Connection(clusterApiUrl('devnet'));
  });

  test('should throw on invalid cluster', () => {
    const cluster = 'invalid-clusters';
    // @ts-ignore
    const init = () => new Hubble(cluster, undefined);
    expect(init).toThrow(Error);
  });

  test('should throw on invalid connection', () => {
    // @ts-ignore
    const init = () => new Hubble('mainnet-beta', undefined);
    expect(init).toThrow(Error);
  });

  //TODO: replace with localnet and setup integration tests...
  // test('should get devnet staking pool', async () => {
  //   const sdk = new Hubble('devnet', connection);
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

  // test('should get devnet user staking pool', async () => {
  //   const sdk = new Hubble('devnet', connection);
  //   const sth = await sdk.getUserStakingState('9y7uLMUMW6EiRwH1aJFSp9Zka7dVx2JdZKA3858u6YHT');
  //   expect(sth).not.toBeNull();
  // });
});
