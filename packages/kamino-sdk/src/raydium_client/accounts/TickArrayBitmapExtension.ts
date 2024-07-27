import { PublicKey, Connection } from '@solana/web3.js';
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface TickArrayBitmapExtensionFields {
  poolId: PublicKey;
  positiveTickArrayBitmap: Array<Array<BN>>;
  negativeTickArrayBitmap: Array<Array<BN>>;
}

export interface TickArrayBitmapExtensionJSON {
  poolId: string;
  positiveTickArrayBitmap: Array<Array<string>>;
  negativeTickArrayBitmap: Array<Array<string>>;
}

export class TickArrayBitmapExtension {
  readonly poolId: PublicKey;
  readonly positiveTickArrayBitmap: Array<Array<BN>>;
  readonly negativeTickArrayBitmap: Array<Array<BN>>;

  static readonly discriminator = Buffer.from([60, 150, 36, 219, 97, 128, 139, 153]);

  static readonly layout = borsh.struct([
    borsh.publicKey('poolId'),
    borsh.array(borsh.array(borsh.u64(), 8), 14, 'positiveTickArrayBitmap'),
    borsh.array(borsh.array(borsh.u64(), 8), 14, 'negativeTickArrayBitmap'),
  ]);

  constructor(fields: TickArrayBitmapExtensionFields) {
    this.poolId = fields.poolId;
    this.positiveTickArrayBitmap = fields.positiveTickArrayBitmap;
    this.negativeTickArrayBitmap = fields.negativeTickArrayBitmap;
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<TickArrayBitmapExtension | null> {
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
    programId: PublicKey = PROGRAM_ID
  ): Promise<Array<TickArrayBitmapExtension | null>> {
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

  static decode(data: Buffer): TickArrayBitmapExtension {
    if (!data.slice(0, 8).equals(TickArrayBitmapExtension.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = TickArrayBitmapExtension.layout.decode(data.slice(8));

    return new TickArrayBitmapExtension({
      poolId: dec.poolId,
      positiveTickArrayBitmap: dec.positiveTickArrayBitmap,
      negativeTickArrayBitmap: dec.negativeTickArrayBitmap,
    });
  }

  toJSON(): TickArrayBitmapExtensionJSON {
    return {
      poolId: this.poolId.toString(),
      positiveTickArrayBitmap: this.positiveTickArrayBitmap.map((item) => item.map((item) => item.toString())),
      negativeTickArrayBitmap: this.negativeTickArrayBitmap.map((item) => item.map((item) => item.toString())),
    };
  }

  static fromJSON(obj: TickArrayBitmapExtensionJSON): TickArrayBitmapExtension {
    return new TickArrayBitmapExtension({
      poolId: new PublicKey(obj.poolId),
      positiveTickArrayBitmap: obj.positiveTickArrayBitmap.map((item) => item.map((item) => new BN(item))),
      negativeTickArrayBitmap: obj.negativeTickArrayBitmap.map((item) => item.map((item) => new BN(item))),
    });
  }
}
