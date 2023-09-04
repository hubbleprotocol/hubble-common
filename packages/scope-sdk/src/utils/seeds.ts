import { PublicKey } from '@solana/web3.js';
import { PROGRAM_ID } from '../programId';

export const CONFIGURATION_SEED = 'conf';

export function getConfigurationPda(feedName: String): PublicKey {
  const [config] = PublicKey.findProgramAddressSync(
    [Buffer.from(CONFIGURATION_SEED), Buffer.from(feedName)],
    PROGRAM_ID
  );
  return config;
}
