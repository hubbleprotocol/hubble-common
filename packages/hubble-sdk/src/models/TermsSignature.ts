import { PublicKey, Connection, TransactionInstruction, AccountMeta } from '@solana/web3.js';
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface TermsSignatureFields {
  signature: Array<number>;
}

export interface TermsSignatureJSON {
  signature: Array<number>;
}

export class TermsSignature {
  readonly signature: Array<number>;

  static readonly discriminator = Buffer.from([197, 173, 136, 91, 182, 49, 113, 19]);

  static readonly layout = borsh.struct([borsh.array(borsh.u8(), 64, 'signature')]);

  constructor(fields: TermsSignatureFields) {
    this.signature = fields.signature;
  }

  static async fetch(c: Connection, address: PublicKey, programId: PublicKey): Promise<TermsSignature | null> {
    const info = await c.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(programId)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[],
    programId: PublicKey
  ): Promise<Array<TermsSignature | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses);

    return infos.map((info) => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(programId)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): TermsSignature {
    if (!data.slice(0, 8).equals(TermsSignature.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = TermsSignature.layout.decode(data.slice(8));

    return new TermsSignature({
      signature: dec.signature,
    });
  }

  toJSON(): TermsSignatureJSON {
    return {
      signature: this.signature,
    };
  }

  static fromJSON(obj: TermsSignatureJSON): TermsSignature {
    return new TermsSignature({
      signature: obj.signature,
    });
  }
}

export interface SignTermsArgs {
  signature: Array<number>;
}

export interface SignTermsAccounts {
  owner: PublicKey;
  ownerSignatureState: PublicKey;
  systemProgram: PublicKey;
  rent: PublicKey;
}

export const layout = borsh.struct([borsh.array(borsh.u8(), 64, 'signature')]);

export function signTerms(args: SignTermsArgs, accounts: SignTermsAccounts, programId: PublicKey) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.ownerSignatureState, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.rent, isSigner: false, isWritable: false },
  ];
  const identifier = Buffer.from([226, 42, 174, 143, 144, 159, 139, 1]);
  const buffer = Buffer.alloc(1000);
  const len = layout.encode(
    {
      signature: args.signature,
    },
    buffer
  );
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len);
  const ix = new TransactionInstruction({ keys, programId: programId, data });
  return ix;
}
