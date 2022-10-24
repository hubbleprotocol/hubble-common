import { getAllConfigs, getConfigByCluster } from '../dist';

describe('Config Tests', () => {
  test('should return mainnet-beta config', () => {
    const cluster = 'mainnet-beta';
    const config = getConfigByCluster(cluster);
    expect(config).not.toBeNull();
    expect(config.cluster).toBe(cluster);
  });

  test('should return all 3 configs', () => {
    const configs = getAllConfigs();
    expect(configs.length).toBe(3);
  });

  test('should throw on invalid cluster name', () => {
    const cluster = 'invalid-clusters';
    // @ts-ignore
    const getConfig = () => getConfigByCluster(cluster);
    expect(getConfig).toThrow(Error);
  });
});
