import { PublicKey, Connection } from '@solana/web3.js';
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface OraclePricesFields {
  oracleMappings: PublicKey;
  prices: Array<types.DatedPriceFields>;
}

export interface OraclePricesJSON {
  oracleMappings: string;
  prices: Array<types.DatedPriceJSON>;
}

export class OraclePrices {
  readonly oracleMappings: PublicKey;
  readonly prices: Array<types.DatedPrice>;

  static readonly discriminator = Buffer.from([89, 128, 118, 221, 6, 72, 180, 146]);

  static readonly layout = borsh.struct([
    borsh.publicKey('oracleMappings'),
    borsh.array(types.DatedPrice.layout(), 512, 'prices'),
  ]);

  constructor(fields: OraclePricesFields) {
    this.oracleMappings = fields.oracleMappings;
    this.prices = fields.prices.map((item) => new types.DatedPrice({ ...item }));
  }

  static async fetch(c: Connection, address: PublicKey): Promise<OraclePrices | null> {
    const info = await c.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(c: Connection, addresses: PublicKey[]): Promise<Array<OraclePrices | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses);

    return infos.map((info) => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): OraclePrices {
    if (!data.slice(0, 8).equals(OraclePrices.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = OraclePrices.layout.decode(data.slice(8));

    return new OraclePrices({
      oracleMappings: dec.oracleMappings,
      prices: dec.prices.map((item: any) => types.DatedPrice.fromDecoded(item)),
    });
  }

  toJSON(): OraclePricesJSON {
    return {
      oracleMappings: this.oracleMappings.toString(),
      prices: this.prices.map((item) => item.toJSON()),
    };
  }

  static fromJSON(obj: OraclePricesJSON): OraclePrices {
    return new OraclePrices({
      oracleMappings: new PublicKey(obj.oracleMappings),
      prices: obj.prices.map((item) => types.DatedPrice.fromJSON(item)),
    });
  }
}
