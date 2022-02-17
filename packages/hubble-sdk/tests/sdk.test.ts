import Hubble from '../dist/Hubble';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import StakingPoolState from '../src/models/StakingPoolState';

describe('Hubble SDK Tests', () => {
  let connection: Connection;

  beforeAll(() => {
    connection = new Connection(clusterApiUrl('mainnet-beta'));
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
  test('should get mainnet staking pool', async () => {
    const sdk = new Hubble('mainnet-beta', connection);
    const pool: StakingPoolState = await sdk.getStakingPoolState();
    expect(pool).not.toBeNull();
  });
});
