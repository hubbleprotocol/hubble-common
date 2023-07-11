import { ComputeBudgetProgram, Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import Decimal from 'decimal.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from './tokenUtils';

export const decodeSerializedTransaction = (tx: string | undefined) => {
  if (!tx) {
    return undefined;
  }
  return Transaction.from(Buffer.from(tx, 'base64'));
};

export const getComputeBudgetAndPriorityFeeIxns = (
  units: number,
  priorityFeeLamports?: Decimal
): TransactionInstruction[] => {
  const ixns: TransactionInstruction[] = [];
  ixns.push(ComputeBudgetProgram.setComputeUnitLimit({ units }));

  if (priorityFeeLamports && priorityFeeLamports.gt(0)) {
    const unitPrice = priorityFeeLamports.mul(10 ** 6).div(units);
    ixns.push(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: BigInt(unitPrice.floor().toString()) }));
  }

  return ixns;
};

export const createAtaIfMissingIx = async (
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey
): Promise<TransactionInstruction | undefined> => {
  const ata = await getAssociatedTokenAddress(mint, owner);
  const doesAtaExist = Boolean(await checkIfAccountExists(connection, ata));
  const createIxn = !doesAtaExist ? createAssociatedTokenAccountInstruction(owner, ata, owner, mint) : undefined;
  return createIxn;
};

export const getAtasWithCreateIxnsIfMissing = async (
  connection: Connection,
  mints: PublicKey[],
  owner: PublicKey
): Promise<TransactionInstruction[]> => {
  const requests = mints.map(async (mint) => {
    let createAtaIx = await createAtaIfMissingIx(connection, mint, owner);
    if (createAtaIx) {
      return createAtaIx;
    }
  });
  const result = (await Promise.all(requests.filter((x) => x !== undefined))).filter(
    (ix) => ix !== undefined
  ) as TransactionInstruction[];

  return result;
};

export async function checkIfAccountExists(connection: Connection, account: PublicKey): Promise<boolean> {
  return (await connection.getAccountInfo(account)) != null;
}

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
