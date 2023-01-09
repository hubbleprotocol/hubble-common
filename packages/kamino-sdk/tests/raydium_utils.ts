import { PROGRAM_ID_CLI as RAYDIUM_PROGRAM_ID } from '../src/raydium_client/programId';
import { Idl, Program, Provider } from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
import {
  PublicKey,
  AccountInfo,
  Connection,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

export const OBSERVATION_STATE_LEN = 52121;
export const AMM_CONFIG_SEED = Buffer.from(anchor.utils.bytes.utf8.encode('amm_config'));
export const POOL_SEED = Buffer.from(anchor.utils.bytes.utf8.encode('pool'));
export const POOL_VAULT_SEED = Buffer.from(anchor.utils.bytes.utf8.encode('pool_vault'));

export async function deployRaydiumPool(
  connection: Connection,
  wallet: PublicKey,
  tokenAMint: PublicKey,
  tokenBMint: PublicKey
) {
  let config = PublicKey.default;

  let [configPk, index] = await getAmmConfigAddress(0, RAYDIUM_PROGRAM_ID);
  if (!(await accountExist(env.provider.connection, configPk))) {
    await createAmmConfig(env, configPk, 0, tickSize, 100, 200, 400);
  }

  config = configPk;
}

export async function getAmmConfigAddress(index: number, programId: PublicKey): Promise<[PublicKey, number]> {
  const [address, bump] = await PublicKey.findProgramAddress([AMM_CONFIG_SEED, u16ToBytes(index)], programId);
  return [address, bump];
}
