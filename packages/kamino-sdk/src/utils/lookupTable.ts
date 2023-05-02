import {
  AddressLookupTableAccount,
  Connection,
  MessageV0,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
} from '@solana/web3.js';
import { DEVNET_GLOBAL_LOOKUP_TABLE, MAINNET_GLOBAL_LOOKUP_TABLE } from '../constants/pubkeys';
import { SolanaCluster } from '@hubbleprotocol/hubble-config';

export async function getLookupTable(
  cluster: SolanaCluster,
  connection: Connection
): Promise<AddressLookupTableAccount> {
  if (cluster == 'mainnet-beta') {
    const lookupTableAccount = await connection
      .getAddressLookupTable(MAINNET_GLOBAL_LOOKUP_TABLE)
      .then((res) => res.value);
    if (!lookupTableAccount) {
      throw new Error(`Could not get lookup table ${MAINNET_GLOBAL_LOOKUP_TABLE}`);
    }
    return lookupTableAccount;
  } else if (cluster == 'devnet') {
    const lookupTableAccount = await connection
      .getAddressLookupTable(DEVNET_GLOBAL_LOOKUP_TABLE)
      .then((res) => res.value);
    if (!lookupTableAccount) {
      throw new Error(`Could not get lookup table ${DEVNET_GLOBAL_LOOKUP_TABLE}`);
    }
    return lookupTableAccount;
  } else {
    throw Error('There is no lookup table for localnet yet');
  }
}

export async function getTransactionV2Message(
  cluster: SolanaCluster,
  connection: Connection,
  payer: PublicKey,
  blockhash: string,
  instructions: Array<TransactionInstruction>
): Promise<MessageV0> {
  if (cluster == 'mainnet-beta' || cluster == 'devnet') {
    let lookupTable = await getLookupTable(cluster, connection);
    const v2Tx = new TransactionMessage({
      payerKey: payer,
      recentBlockhash: blockhash,
      instructions: instructions,
    }).compileToV0Message([lookupTable]);
    return v2Tx;
  } else {
    throw Error('No TransactionV2 on localnet as no lookup table was created');
  }
}
