import {
  AccountInfo,
  Commitment,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  sendAndConfirmTransaction,
  Signer,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
} from '@solana/web3.js';
import { struct, u32, u8 } from '@project-serum/borsh';
import { sleep } from './utils';
import { WhirlpoolStrategy } from '../kamino-client/accounts';
import { tickIndexToPrice } from '@orca-so/whirlpool-sdk';
import Decimal from 'decimal.js';
import { CollateralInfo } from '../kamino-client/types';

export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export const SOL_MINTS = [
  new PublicKey('So11111111111111111111111111111111111111111'),
  new PublicKey('So11111111111111111111111111111111111111112'),
];
export const DECIMALS_SOL = 9;

export async function getAssociatedTokenAddressAndData(
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey
): Promise<[PublicKey, AccountInfo<Buffer> | null]> {
  const ata = await getAssociatedTokenAddress(mint, owner);
  const data = await connection.getAccountInfo(ata);
  return [ata, data];
}

export function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = true,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): PublicKey {
  if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer())) throw new Error('Token owner off curve');

  const [address] = PublicKey.findProgramAddressSync(
    [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
    associatedTokenProgramId
  );

  return address;
}

export function createAssociatedTokenAccountInstruction(
  payer: PublicKey,
  associatedToken: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): TransactionInstruction {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedToken, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: false, isWritable: false },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: programId, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: associatedTokenProgramId,
    data: Buffer.alloc(0),
  });
}

export function createAddExtraComputeUnitsTransaction(owner: PublicKey, units: number): TransactionInstruction {
  const p = new PublicKey('ComputeBudget111111111111111111111111111111');
  const params = { instruction: 0, units, fee: 0 };
  const layout = struct([u8('instruction'), u32('units'), u32('fee')]);
  const data = Buffer.alloc(layout.span);
  layout.encode(params, data);
  const keys = [{ pubkey: owner, isSigner: false, isWritable: false }];
  return new TransactionInstruction({
    keys,
    programId: p,
    data,
  });
}

export function createTransactionWithExtraBudget(payer: PublicKey, extraUnits: number = 400000) {
  const tx = new Transaction();
  const increaseBudgetIx = createAddExtraComputeUnitsTransaction(payer, extraUnits);
  tx.add(increaseBudgetIx);
  return tx;
}

export async function assignBlockInfoToTransaction(connection: Connection, transaction: Transaction, payer: PublicKey) {
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = payer;
  transaction.lastValidBlockHeight = lastValidBlockHeight;
  return transaction;
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

export function getStrategyPriceRangeOrca(
  tickLowerIndex: number,
  tickUpperIndex: number,
  strategy: WhirlpoolStrategy,
  poolPrice: Decimal
) {
  const { priceLower, priceUpper } = getPriceLowerUpper(
    tickLowerIndex,
    tickUpperIndex,
    Number(strategy.tokenAMintDecimals.toString()),
    Number(strategy.tokenBMintDecimals.toString())
  );
  const strategyOutOfRange = poolPrice.lt(priceLower) || poolPrice.gt(priceUpper);
  return { priceLower, poolPrice, priceUpper, strategyOutOfRange };
}

export function getStrategyPriceRangeRaydium(
  tickLowerIndex: number,
  tickUpperIndex: number,
  tickCurrent: number,
  tokenADecimals: number,
  tokenBDecimals: number
) {
  const { priceLower, priceUpper } = getPriceLowerUpper(tickLowerIndex, tickUpperIndex, tokenADecimals, tokenBDecimals);
  const poolPrice = tickIndexToPrice(tickCurrent, tokenADecimals, tokenBDecimals);
  const strategyOutOfRange = poolPrice.lt(priceLower) || poolPrice.gt(priceUpper);
  return { priceLower, poolPrice, priceUpper, strategyOutOfRange };
}

export function getPriceLowerUpper(
  tickLowerIndex: number,
  tickUpperIndex: number,
  tokenAMintDecimals: number,
  tokenBMintDecimals: number
) {
  const priceLower = tickIndexToPrice(
    tickLowerIndex,
    Number(tokenAMintDecimals.toString()),
    Number(tokenBMintDecimals.toString())
  );
  const priceUpper = tickIndexToPrice(
    tickUpperIndex,
    Number(tokenAMintDecimals.toString()),
    Number(tokenBMintDecimals.toString())
  );
  return { priceLower, priceUpper };
}

export function getTokenNameFromCollateralInfo(collateralInfo: CollateralInfo) {
  return String.fromCharCode(...collateralInfo.name.filter((x) => x > 0));
}

export const isSOLMint = (mint: PublicKey): boolean => {
  return SOL_MINTS.filter((m) => m.equals(mint)).length > 0;
};

export function removeBudgetAndAtaIxns(ixns: TransactionInstruction[], mints: string[]): TransactionInstruction[] {
  return ixns.filter((ixn) => {
    const { programId, keys } = ixn;

    if (programId.toString() === ComputeBudgetProgram.programId.toString()) {
      return false;
    }

    if (programId.toString() === ASSOCIATED_TOKEN_PROGRAM_ID.toString()) {
      const mint = keys[3];

      return !mints.includes(mint.pubkey.toString());
    }

    return true;
  });
}
