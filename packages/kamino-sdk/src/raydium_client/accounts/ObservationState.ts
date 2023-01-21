import { PublicKey, Connection } from '@solana/web3.js';
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId';

export interface ObservationStateFields {
  /** Whether the ObservationState is initialized */
  initialized: boolean;
  poolId: PublicKey;
  /** observation array */
  observations: Array<types.ObservationFields>;
  /** padding for feature update */
  padding: Array<BN>;
}

export interface ObservationStateJSON {
  /** Whether the ObservationState is initialized */
  initialized: boolean;
  poolId: string;
  /** observation array */
  observations: Array<types.ObservationJSON>;
  /** padding for feature update */
  padding: Array<string>;
}

export class ObservationState {
  /** Whether the ObservationState is initialized */
  readonly initialized: boolean;
  readonly poolId: PublicKey;
  /** observation array */
  readonly observations: Array<types.Observation>;
  /** padding for feature update */
  readonly padding: Array<BN>;

  static readonly discriminator = Buffer.from([122, 174, 197, 53, 129, 9, 165, 132]);

  static readonly layout = borsh.struct([
    borsh.bool('initialized'),
    borsh.publicKey('poolId'),
    borsh.array(types.Observation.layout(), 1000, 'observations'),
    borsh.array(borsh.u128(), 5, 'padding'),
  ]);

  constructor(fields: ObservationStateFields) {
    this.initialized = fields.initialized;
    this.poolId = fields.poolId;
    this.observations = fields.observations.map((item) => new types.Observation({ ...item }));
    this.padding = fields.padding;
  }

  static async fetch(c: Connection, address: PublicKey): Promise<ObservationState | null> {
    const info = await c.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(c: Connection, addresses: PublicKey[]): Promise<Array<ObservationState | null>> {
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

  static decode(data: Buffer): ObservationState {
    if (!data.slice(0, 8).equals(ObservationState.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = ObservationState.layout.decode(data.slice(8));

    return new ObservationState({
      initialized: dec.initialized,
      poolId: dec.poolId,
      observations: dec.observations.map((item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) =>
        types.Observation.fromDecoded(item)
      ),
      padding: dec.padding,
    });
  }

  toJSON(): ObservationStateJSON {
    return {
      initialized: this.initialized,
      poolId: this.poolId.toString(),
      observations: this.observations.map((item) => item.toJSON()),
      padding: this.padding.map((item) => item.toString()),
    };
  }

  static fromJSON(obj: ObservationStateJSON): ObservationState {
    return new ObservationState({
      initialized: obj.initialized,
      poolId: new PublicKey(obj.poolId),
      observations: obj.observations.map((item) => types.Observation.fromJSON(item)),
      padding: obj.padding.map((item) => new BN(item)),
    });
  }
}
