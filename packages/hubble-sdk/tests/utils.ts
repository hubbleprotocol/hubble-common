import Decimal from 'decimal.js';
import * as anchor from '@project-serum/anchor';
import {
  Connection,
  PublicKey,
  Transaction,
  Signer,
  Commitment,
  TransactionSignature,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

export async function solAirdrop(
  connection: Connection,
  provider: anchor.Provider,
  account: PublicKey,
  solAirdrop: Decimal
): Promise<Decimal> {
  const airdropTxnId = await connection.requestAirdrop(account, collToLamportsDecimal(solAirdrop, 9).toNumber());
  await connection.confirmTransaction(airdropTxnId);
  return await getSolBalance(provider, account);
}

function collToLamportsDecimal(amount: Decimal, decimals: number): Decimal {
  let factor = Math.pow(10, decimals);
  return amount.mul(factor);
}

async function getSolBalance(provider: anchor.Provider, account: PublicKey): Promise<Decimal> {
  const balance = new Decimal(await getSolBalanceInLamports(provider, account));
  return lamportsToCollDecimal(balance, 9);
}

async function getSolBalanceInLamports(provider: anchor.Provider, account: PublicKey): Promise<number> {
  let balance: number | undefined = undefined;
  while (balance === undefined) {
    balance = (await provider.connection.getAccountInfo(account))?.lamports;
  }

  return balance;
}

function lamportsToCollDecimal(amount: Decimal, decimals: number): Decimal {
  let factor = Math.pow(10, decimals);
  return amount.div(factor);
}

export async function sendTransactionWithLogs(
  connection: Connection,
  tx: Transaction,
  payer: PublicKey,
  signers: Signer[],
  commitment: Commitment = 'processed',
  skipPreflight: boolean = false
): Promise<TransactionSignature | null> {
  let txn = await assignBlockInfoToTransaction(connection, tx, payer);
  try {
    let res = await sendAndConfirmTransaction(connection, txn, signers, {
      commitment: commitment,
      skipPreflight: skipPreflight,
    });

    return res;
  } catch (e) {
    console.log('ERROR:', e);
    await sleep(5000);
    // @ts-ignore
    const sig = e.toString().split(' failed ')[0].split('Transaction ')[1];
    let res = await connection.getTransaction(sig, { commitment: 'confirmed' });
    if (res && res.meta) {
      console.log('Txn', res.meta.logMessages);
    }
    return null;
  }
}

async function assignBlockInfoToTransaction(connection: Connection, transaction: Transaction, payer: PublicKey) {
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = payer;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  return transaction;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
