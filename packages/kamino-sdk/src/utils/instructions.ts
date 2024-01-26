import { AccountMeta, Instruction } from '@jup-ag/api';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';

export function instructionToTransactionInstruction(ix: Instruction): TransactionInstruction {
  return new TransactionInstruction({
    keys: ix.accounts.map((acc: AccountMeta) => {
      return {
        pubkey: new PublicKey(acc.pubkey),
        isSigner: acc.isSigner,
        isWritable: acc.isWritable,
      };
    }),
    programId: new PublicKey(ix.programId),
    data: Buffer.from(ix.data),
  });
}

export function instructionsToTransactionInstructions(ixs: Instruction[]): TransactionInstruction[] {
  return ixs.map((ix) => instructionToTransactionInstruction(ix));
}

export function transactionInstructionToInstruction(ix: TransactionInstruction): Instruction {
  return {
    accounts: ix.keys.map((acc) => {
      return {
        pubkey: acc.pubkey.toBase58(),
        isSigner: acc.isSigner,
        isWritable: acc.isWritable,
      };
    }),
    programId: ix.programId.toBase58(),
    data: ix.data.toString(),
  };
}

export function transactionInstructionsToInstructions(ixs: TransactionInstruction[]): Instruction[] {
  return ixs.map((ix) => transactionInstructionToInstruction(ix));
}
