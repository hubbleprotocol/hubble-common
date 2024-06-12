import { PublicKey } from '@solana/web3.js';

export const MINT_SEED = 'lp_token_mint';

export function getJlpMintPda(pool: PublicKey): PublicKey {
  const [config] = PublicKey.findProgramAddressSync([Buffer.from(MINT_SEED), pool.toBuffer()], JLP_PROGRAM_ID);
  return config;
}

export const JLP_PROGRAM_ID = new PublicKey('PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu');
