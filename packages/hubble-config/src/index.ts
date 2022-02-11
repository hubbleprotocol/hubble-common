import { SolanaEnvironment } from './models/SolanaEnvironment';
import { HubbleConfig } from './models/HubbleConfig';
import { HUBBLE_CONFIGS } from './constants/configs';

export const getConfigByEnv = (env: SolanaEnvironment): HubbleConfig => {
  const config = HUBBLE_CONFIGS.find((x) => x.env == env);
  if (config) {
    return config;
  }
  throw Error(`Could not find Hubble config for environment: ${env}`);
};

export const getAllConfigs = (): HubbleConfig[] => {
  return HUBBLE_CONFIGS;
};
