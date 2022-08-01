import { HubbleConfig, SolanaCluster } from './index';
import { HUBBLE_CONFIGS } from './constants/configs';
import { PublicKey } from '@solana/web3.js';
import { SupportedToken } from '@hubbleprotocol/scope-sdk';

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

/**
 * Get collateral mint from Kamino config
 * @param address
 * @param config
 */
export const getCollateralMintByAddress = (address: PublicKey, config: HubbleConfig) => {
  return config.kamino.mints.find((x) => x.address.toBase58() === address.toBase58());
};

/**
 * Get collateral mint from Kamino config by Scope name
 * @param tokenName
 * @param config
 */
export const getCollateralMintByName = (tokenName: SupportedToken, config: HubbleConfig) => {
  return config.kamino.mints.find((x) => x.scopeToken === tokenName);
};
