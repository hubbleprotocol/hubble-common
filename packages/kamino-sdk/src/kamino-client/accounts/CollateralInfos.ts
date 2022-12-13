import { PublicKey, Connection } from '@solana/web3.js';
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface CollateralInfosFields {
  infos: Array<types.CollateralInfoFields>;
}

export interface CollateralInfosJSON {
  infos: Array<types.CollateralInfoJSON>;
}

export class CollateralInfos {
  readonly infos: Array<types.CollateralInfo>;

  static readonly discriminator = Buffer.from([127, 210, 52, 226, 74, 169, 111, 9]);

  static readonly layout = borsh.struct([borsh.array(types.CollateralInfo.layout(), 256, 'infos')]);

  constructor(fields: CollateralInfosFields) {
    this.infos = fields.infos.map((item) => new types.CollateralInfo({ ...item }));
  }

  static async fetch(c: Connection, address: PublicKey): Promise<CollateralInfos | null> {
    const info = await c.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(c: Connection, addresses: PublicKey[]): Promise<Array<CollateralInfos | null>> {
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

  static decode(data: Buffer): CollateralInfos {
    if (!data.slice(0, 8).equals(CollateralInfos.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = CollateralInfos.layout.decode(data.slice(8));

    return new CollateralInfos({
      infos: dec.infos.map((item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) =>
        types.CollateralInfo.fromDecoded(item)
      ),
    });
  }

  toJSON(): CollateralInfosJSON {
    return {
      infos: this.infos.map((item) => item.toJSON()),
    };
  }

  static fromJSON(obj: CollateralInfosJSON): CollateralInfos {
    return new CollateralInfos({
      infos: obj.infos.map((item) => types.CollateralInfo.fromJSON(item)),
    });
  }
}
