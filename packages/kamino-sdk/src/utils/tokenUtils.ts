import {
  AccountInfo,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';
import { struct, u32, u8 } from '@project-serum/borsh';

export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export async function getAssociatedTokenAddressAndData(
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey
): Promise<[PublicKey, AccountInfo<Buffer> | null]> {
  const ata = await getAssociatedTokenAddress(mint, owner);
  const data = await connection.getAccountInfo(ata);
  return [ata, data];
}

export async function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = false,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): Promise<PublicKey> {
  if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer())) throw new Error('Token owner off curve');

  const [address] = await PublicKey.findProgramAddress(
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
