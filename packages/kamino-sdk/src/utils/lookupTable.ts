import {
  AddressLookupTableAccount,
  Connection,
  MessageV0,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
} from '@solana/web3.js';
import { ADDRESS_LUT_PROGRAM_ID, LUT_OWNER_KEY } from '../constants/pubkeys';
import { SolanaCluster } from '@hubbleprotocol/hubble-config';

export async function getLookupTable(
  cluster: SolanaCluster,
  connection: Connection
): Promise<AddressLookupTableAccount[]> {
  if (cluster == 'mainnet-beta' || cluster == 'devnet') {
    return await connection
      .getProgramAccounts(ADDRESS_LUT_PROGRAM_ID, {
        filters: [{ memcmp: { offset: 22, bytes: new PublicKey(LUT_OWNER_KEY).toString() } }],
      })
      .then((res) =>
        res.map((raw) => {
          return new AddressLookupTableAccount({
            key: raw.pubkey,
            state: AddressLookupTableAccount.deserialize(raw.account.data),
          });
        })
      );
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
    }).compileToV0Message(lookupTable);
    return v2Tx;
  } else {
    throw Error('No TransactionV2 on localnet as no lookup table was created');
  }
}
