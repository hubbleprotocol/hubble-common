import { SolanaCluster } from '@hubbleprotocol/hubble-config';
import { Connection, Keypair, Transaction } from '@solana/web3.js';
import * as ed25519 from 'tweetnacl-ts';
import Hubble from '../src/Hubble';
import { sendTransactionWithLogs, solAirdrop } from './utils';
import { getReadOnlyWallet } from '../src';
import { AnchorProvider } from '@coral-xyz/anchor';
import Decimal from 'decimal.js';

describe('Hubble SDK Tests', () => {
  const cluster: SolanaCluster = 'localnet';
  const clusterUrl: string = 'http://127.0.0.1:8899';
  let connection: Connection;

  before(() => {
    connection = new Connection(clusterUrl, 'processed');
  });

  // create a termsSignature for a new ownere and get state (localnet only)
  it('create_terms_signature_and_read_state', async () => {
    const hubble = new Hubble(cluster, connection, 'GrdZUhDBGvNDNwope4KmHGNc1bY8dQU78TZCZVBLQqGu');
    const owner = Keypair.generate();

    await solAirdrop(
      connection,
      new AnchorProvider(connection, getReadOnlyWallet(), {
        commitment: connection.commitment,
      }),
      owner.publicKey,
      new Decimal(100)
    );

    // generate signature for a basic message
    const message = Uint8Array.from([0xab, 0xbc, 0xcd, 0xde]);
    const signature = ed25519.sign(message, owner.secretKey);

    // initialize signature
    const signTermsIx = await hubble.getUserTermsSignatureIx(owner.publicKey, signature);
    const tx = new Transaction();
    tx.add(signTermsIx);
    const sig = await sendTransactionWithLogs(connection, tx, owner.publicKey, [owner]);

    const termsSignatureState = await hubble.getUserTermsSignatureState(owner.publicKey);
    console.log(termsSignatureState);

    if (termsSignatureState === null) {
      throw 'termsSignatureState is null';
    }
  });
});
