import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh';

export interface ObservationFields {
  blockTimestamp: number;
  sqrtPriceX64: BN;
  cumulativeTimePriceX64: BN;
  padding: BN;
}

export interface ObservationJSON {
  blockTimestamp: number;
  sqrtPriceX64: string;
  cumulativeTimePriceX64: string;
  padding: string;
}

export class Observation {
  readonly blockTimestamp: number;
  readonly sqrtPriceX64: BN;
  readonly cumulativeTimePriceX64: BN;
  readonly padding: BN;

  constructor(fields: ObservationFields) {
    this.blockTimestamp = fields.blockTimestamp;
    this.sqrtPriceX64 = fields.sqrtPriceX64;
    this.cumulativeTimePriceX64 = fields.cumulativeTimePriceX64;
    this.padding = fields.padding;
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u32('blockTimestamp'),
        borsh.u128('sqrtPriceX64'),
        borsh.u128('cumulativeTimePriceX64'),
        borsh.u128('padding'),
      ],
      property
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Observation({
      blockTimestamp: obj.blockTimestamp,
      sqrtPriceX64: obj.sqrtPriceX64,
      cumulativeTimePriceX64: obj.cumulativeTimePriceX64,
      padding: obj.padding,
    });
  }

  static toEncodable(fields: ObservationFields) {
    return {
      blockTimestamp: fields.blockTimestamp,
      sqrtPriceX64: fields.sqrtPriceX64,
      cumulativeTimePriceX64: fields.cumulativeTimePriceX64,
      padding: fields.padding,
    };
  }

  toJSON(): ObservationJSON {
    return {
      blockTimestamp: this.blockTimestamp,
      sqrtPriceX64: this.sqrtPriceX64.toString(),
      cumulativeTimePriceX64: this.cumulativeTimePriceX64.toString(),
      padding: this.padding.toString(),
    };
  }

  static fromJSON(obj: ObservationJSON): Observation {
    return new Observation({
      blockTimestamp: obj.blockTimestamp,
      sqrtPriceX64: new BN(obj.sqrtPriceX64),
      cumulativeTimePriceX64: new BN(obj.cumulativeTimePriceX64),
      padding: new BN(obj.padding),
    });
  }

  toEncodable() {
    return Observation.toEncodable(this);
  }
}
