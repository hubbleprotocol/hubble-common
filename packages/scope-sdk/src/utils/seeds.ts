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

export function getMintsToScopeChainPda(prices: PublicKey, seed: PublicKey, seedId: number): PublicKey {
  const [mintsToScopeChain] = PublicKey.findProgramAddressSync(
    [Buffer.from('mints_to_scope_chains'), prices.toBuffer(), seed.toBuffer(), Buffer.from(seedId.toString())],
    PROGRAM_ID
  );
  return mintsToScopeChain;
}
