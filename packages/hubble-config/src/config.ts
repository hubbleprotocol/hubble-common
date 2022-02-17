import { HubbleConfig, SolanaCluster } from './index';
import { HUBBLE_CONFIGS } from './constants/configs';

/**
 * Get Hubble configuration for specific Solana cluster.
 * @param cluster - Solana cluster name
 */
export const getConfigByCluster = (cluster: SolanaCluster): HubbleConfig => {
  const config = HUBBLE_CONFIGS.find((x) => x.cluster == cluster);
  if (config) {
    return config;
  }
  throw Error(`Could not find Hubble config for Solana cluster: ${cluster}`);
};

/**
 * Get all Hubble configurations.
 */
export const getAllConfigs = (): HubbleConfig[] => {
  return HUBBLE_CONFIGS;
};
