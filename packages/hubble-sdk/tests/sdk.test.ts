import { clusterApiUrl, Connection } from '@solana/web3.js';
import { HBB_DECIMALS } from '../src/constants';
import { BN } from '@project-serum/anchor';
import Decimal from 'decimal.js';
import Hubble from '../src/Hubble';

describe('Hubble SDK Tests', () => {
  // let connection: Connection;

  // beforeAll(() => {
  //   connection = new Connection(clusterApiUrl('devnet'));
  // });

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

  //TODO: replace with localnet below and setup integration tests...

  // test('should get staking pool', async () => {
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

  // test('should get user staking pool', async () => {
  //   const sdk = new Hubble('devnet', connection);
  //   const sth = await sdk.getUserStakingState('9y7uLMUMW6EiRwH1aJFSp9Zka7dVx2JdZKA3858u6YHT');
  //   expect(sth).not.toBeNull();
  // });

  // test('should get user stability pool state', async () => {
  //   const sdk = new Hubble('mainnet-beta', connection);
  //   const userStabilityState = await sdk.getUserStabilityProviderState('9y7uLMUMW6EiRwH1aJFSp9Zka7dVx2JdZKA3858u6YHT');
  //   console.log(userStabilityState);
  //   expect(userStabilityState).not.toBeNull();
  // });

  // test('should get user borrowing stats', async () => {
  //   const sdk = new Hubble('mainnet-beta', connection);
  //   const userMetadata = await sdk.getUserBorrowingState('9y7uLMUMW6EiRwH1aJFSp9Zka7dVx2JdZKA3858u6YHT');
  //   for (const userMetadatum of userMetadata) {
  //     console.log('number:', userMetadatum.userStake.toNumber() / HBB_DECIMALS);
  //   }
  //   expect(userMetadata).not.toBeNull();
  // });

  // test('should get user staked HBB', async () => {
  //   const sdk = new Hubble('mainnet-beta', connection);
  //   const stakedHbb = await sdk.getUserStakedHbb('9y7uLMUMW6EiRwH1aJFSp9Zka7dVx2JdZKA3858u6YHT');
  //   expect(stakedHbb).not.toBeNull();
  //   console.log('staked hbb: ', stakedHbb);
  // });

  // test('should get user deposited usdh in stability pool', async () => {
  //   const sdk = new Hubble('mainnet-beta', connection);
  //   const depositedUsdh = await sdk.getUserUsdhInStabilityPool('9y7uLMUMW6EiRwH1aJFSp9Zka7dVx2JdZKA3858u6YHT');
  //   expect(depositedUsdh).not.toBeNull();
  // });
  //
  // test('should get user loans', async () => {
  //   const sdk = new Hubble('devnet', connection);
  //   const loans = await sdk.getUserLoans('9y7uLMUMW6EiRwH1aJFSp9Zka7dVx2JdZKA3858u6YHT');
  //   console.log('loans : ', loans);
  // });
});
