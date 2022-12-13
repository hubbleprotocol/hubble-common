import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh';

export interface OpenPositionWithMetadataBumpsFields {
  positionBump: number;
  metadataBump: number;
}

export interface OpenPositionWithMetadataBumpsJSON {
  positionBump: number;
  metadataBump: number;
}

export class OpenPositionWithMetadataBumps {
  readonly positionBump: number;
  readonly metadataBump: number;

  constructor(fields: OpenPositionWithMetadataBumpsFields) {
    this.positionBump = fields.positionBump;
    this.metadataBump = fields.metadataBump;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u8('positionBump'), borsh.u8('metadataBump')], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new OpenPositionWithMetadataBumps({
      positionBump: obj.positionBump,
      metadataBump: obj.metadataBump,
    });
  }

  static toEncodable(fields: OpenPositionWithMetadataBumpsFields) {
    return {
      positionBump: fields.positionBump,
      metadataBump: fields.metadataBump,
    };
  }

  toJSON(): OpenPositionWithMetadataBumpsJSON {
    return {
      positionBump: this.positionBump,
      metadataBump: this.metadataBump,
    };
  }

  static fromJSON(obj: OpenPositionWithMetadataBumpsJSON): OpenPositionWithMetadataBumps {
    return new OpenPositionWithMetadataBumps({
      positionBump: obj.positionBump,
      metadataBump: obj.metadataBump,
    });
  }

  toEncodable() {
    return OpenPositionWithMetadataBumps.toEncodable(this);
  }
}
